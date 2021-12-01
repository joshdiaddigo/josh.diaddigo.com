<?php
    $message = file_get_contents("message.txt");
?>

<Response>
    <Say language="en-GB">
        Hello,
    </Say>
    <Say language="en-GB">
        I am Jenson -- Josh Diaddigo's automated assistant. He would like me to give you the following message:
    </Say>
    <Say language="en-GB">
        <?php echo $message ?>
    </Say>
    <Pause length = "1"/>
    <Say language="en-GB">
        Good day.
    </Say>
</Response>