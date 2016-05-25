<?php

require_once "../../lib/twilio/Twilio.php";
require_once "./auth.php";
require_once "database.php";

$xml = new SimpleXMLElement('<Response/>');
set_error_handler("warning_handler", E_WARNING);
try {
    $reply = get_response();
} catch (Exception $ex) {
    $reply = "I've encountered an error:\n\n".$ex->getMessage();
}
restore_error_handler();
$sms = $xml->addChild("Sms", $reply);

print($xml->asXML());

function sanitize_input($data, $exceptions) {
    $data =  preg_replace("/[^A-Za-z0-9+ .".$exceptions."]*/", "", $data);
    $data = trim($data);
    $data = htmlspecialchars($data);
    return substr($data, 0, 5000);
}

function get_response() {
    if (sanitize_input($_POST["From"], "") == "+16789361764") {
        if (sanitize_input($_POST["NumMedia"], "") > 0) {
            return upload_sphere_photo();
        } else {
            return "Good day, Daniel.";
        }
    } else if (sanitize_input( $_POST["From"], "") == "+17703774047") {
        if (strtolower(substr(sanitize_input($_POST["Body"], ""), 0, 4)) == "post") {
            return post_jason_eating_photo();
        } else if (strtolower(substr(sanitize_input($_POST["Body"], ""), 0, 4)) == "tell") {
            return make_call();
        } else if (count(explode(" ", sanitize_input($_POST["Body"], ""))) > 3
            && strtolower(explode(" ", sanitize_input($_POST["Body"], ""))[1]) == "number") {
            return save_number();
        } else {
            return "Good day, Joshua.".fopen("hey", "r");
        }

    } else {
        return get_other_response();
    }
}

function make_call() {
    $messageArray = explode(" ", sanitize_input($_POST["Body"], ""));
    $name = strtolower($messageArray[1]);
    $message = implode(" ", array_slice($messageArray, 2));

    file_put_contents("message.txt", $message);

    global $DB_PASSWORD;
    $destination = query("SELECT number FROM jenson_contacts WHERE name='".$name."';", $DB_PASSWORD, false);

    if (count($destination) == 0) {
        return "I do not have ".$name."'s number.";
    } else {
        $destination = $destination[0]["number"];;
    }

    global $TWILIO_ACCOUNT_SID, $TWILIO_AUTH_TOKEN;
    $client = new Services_Twilio($TWILIO_ACCOUNT_SID, $TWILIO_AUTH_TOKEN);
    $client->account->calls->create(
        "+17703774047",
        $destination,
        "https://joshua.diaddigo.com/resources/misc/twilio/outgoing_call_transcript.php",
        array(
            "IfMachine" => "Continue",
            "Record" => "true",
            "StatusCallback" => "https://joshua.diaddigo.com/resources/misc/twilio/call_complete.php",
            "StatusCallbackMethod" => "POST",
            "StatusCallbackEvent" => array("no-answer", "completed"),
        )
    );

    return "I'll let ".$name." know.";
}

function upload_sphere_photo() {
    switch (sanitize_input($_POST["MediaContentType0"], "\/")) {
        case "image/png":
            $extension = ".png";
            break;
        case "image/jpeg":
            $extension = ".jpg";
            break;
        case "image/gif":
            $extension = ".gif";
            break;
        case "image/tiff":
            $extension = ".tiff";
            break;
        default:
            return sanitize_input($_POST["MediaContentType0"], "")."? That's not a media type that I can accept.";
    }

    $filename = base_convert(strval(time()), 10, 36);
    file_put_contents( "../../../../sphere.is/a/" . $filename . $extension,
        fopen(sanitize_input($_POST["MediaUrl0"], ":\/\-"), "r"));

    return "Nice photo! Here's the image name:\n\n" . $filename . $extension;
}

function post_jason_eating_photo() {
    $messageArray = explode(" ", sanitize_input($_POST["Body"], ""));
    $filename = $messageArray[1];

    try {
        rename("../../../../jasoneating.com/uploaded_images/".$filename, "../../../../jasoneating.com/images/".$filename);
        return "I've published the photo for you.";
    } catch (Exception $ex) {
        return "That's not an image that I have access to.";
    }
}

function save_number() {
    $name = explode(" ", sanitize_input($_POST["Body"], "'’"))[0];

    if (strpos($name, "’") !== false) {
        $name = substr($name, 0, strpos($name, "’"));
    } else if (strpos($name, "'") !== false) {
        $name = substr($name, 0, strpos($name, "'"));
    } else {
        return "I'm sorry, sir, I didn't get the name.";
    }

    $number = explode(" ", sanitize_input($_POST["Body"], ""))[3];

    global $DB_PASSWORD;
    query("INSERT INTO jenson_contacts VALUES ('".$name."', '".$number."');", $DB_PASSWORD, true);

    return "I will make a note of that.";
}

function get_other_response() {
    return "Hello, I am Jenson – Joshua Diaddigo's automated assistant.";
}

function warning_handler($errno, $errstr) {
    global $xml;
    $xml->addChild("Sms","I just encountered the following warning:\n\n".$errstr);
}