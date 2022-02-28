<?php

require_once "../../lib/twilio/Twilio.php";
require_once "./auth.php";

$xml = new SimpleXMLElement('<Response/>');
$reply = get_response();
$sms = $xml->addChild("Sms", $reply);

print($xml->asXML());

function sanitize_input($data, $exceptions) {
    $data =  preg_replace("/[^A-Za-z0-9+ .".$exceptions."]*/", "", $data);
    $data = trim($data);
    $data = htmlspecialchars($data);
    return substr($data, 0, 5000);
}

function get_response() {
    if (sanitize_input( $_POST["From"], "") == "+17703774047") {
        if (strtolower(substr(sanitize_input($_POST["Body"], ""), 0, 4)) == "post") {
            return post_jason_eating_photo();
        } else {
            return "Good day, Josh.";
        }

    }
}

function post_jason_eating_photo() {
    $messageArray = explode(" ", sanitize_input($_POST["Body"], ""));
    $filename = $messageArray[1];

    try {
        rename("/var/www/html/sites/jasoneating.com/uploaded_images/".$filename, "/var/www/html/sites/jasoneating.com/images/".$filename);
        return "I've published the photo for you.";
    } catch (Exception $ex) {
        return "That's not an image that I have access to.";
    }
}

