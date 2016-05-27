<?php
require_once "auth.php";
require_once "database.php";

$action = preg_replace("/[^a-z]*/", "", $_GET["action"]);

if ($action == "receive") {
    $latest_id = preg_replace("/[^0-9-]*/", "", $_GET["latest_id"]);
    echo json_encode(query("SELECT id, user_id, message, time FROM messages WHERE id > ".$latest_id.";", $DB_PASSWORD, false));
} else {
    $user_id = preg_replace("/[^A-Za-z0-9]*/", "", $_GET["user_id"]);
    $message = htmlspecialchars($_GET["message"]);
    $message = trim($message);

    if (strlen($message) < 1) return;

    query("INSERT INTO messages (user_id, message, time) VALUES (\"".$user_id."\", \"".$message."\", NOW());", $DB_PASSWORD, true);
}