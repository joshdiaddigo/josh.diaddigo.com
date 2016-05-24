<?php

require_once("../../lib/twilio/Twilio.php");
require_once("./auth.php");

$client = new Services_Twilio($TWILIO_ACCOUNT_SID, $TWILIO_AUTH_TOKEN);

$reply = "";

if ($_POST["RecordingUrl"] != NULL) {
    if ($_POST["AnsweredBy"] == "machine") {
        $reply = "I left a message: ";
    } else {
        $reply = "Here is the conversation: ";
    }

    $reply .= preg_replace("/[^a-zA-Z:\/\-.0-9]+/", "", $_POST["RecordingUrl"]);
} else {
    $reply .= preg_replace("/[^0-9+]+/", "", $_POST["From"]) . " called.";
}

$sms = $client->account->sms_messages->create("+17706912047", "+17703774047", $reply, array());