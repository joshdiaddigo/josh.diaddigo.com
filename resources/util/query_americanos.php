<?php
require_once "auth.php";
require_once "database.php";

$rest_json = file_get_contents("php://input");
$_POST = json_decode($rest_json, true);

$action = preg_replace("/[^a-z]*/", "", $_POST["action"]);

if ($action == "submit"
    && openssl_digest($_POST["password"], "sha512") == $ADMIN_PASSWORD_HASH) {
    $rating = preg_replace("/[^0-9]*/", "", $_POST["rating"]);
    $name = htmlspecialchars(preg_replace("/[^A-Za-z0-9-'& ]*/", "", $_POST["name"]));
    $comments = htmlspecialchars(preg_replace("/[^A-Za-z0-9–.!,;' ]*/", "", $_POST["comments"]));
    $longitude = preg_replace("/[^0-9.]*/", "", $_POST["longitude"]);
    $latitude = preg_replace("/[^0-9.]*/", "", $_POST["latitude"]);

    query("INSERT INTO coffee_spots (rating, name, comments, latitude, longitude, date) VALUES (".$rating.", \"".$name."\", \"".$comments."\", ".$longitude.", ".$latitude.", NOW());", $DB_PASSWORD, false);
} else {
    echo json_encode(query("SELECT * FROM coffee_spots;", $DB_PASSWORD, false));
}