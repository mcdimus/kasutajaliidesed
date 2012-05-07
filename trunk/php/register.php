<?php

$parsedJSON = json_decode(file_get_contents("php://input"));
$con = mysql_connect("localhost");
if (!$con) {
    die("Could not connect: " . mysql_error());
}

mysql_select_db("test", $con);

if ($parsedJSON->action == "check") {
    $query = "SELECT username FROM t094011 WHERE username=\"" . $parsedJSON->username . "\"";
    $result = mysql_query($query);

    if (mysql_num_rows($result) > 0) {
        echo "false"; // the name is taken already
    } else {
        echo "true"; // the name is free to use
    }
} elseif ($parsedJSON->action == "add") {
    $query = "INSERT INTO t094011_users (username, passwd, email) VALUES ('" . $parsedJSON->username
            . "', '" . md5($parsedJSON->username . $parsedJSON->passwd) . "', '" . $parsedJSON->email . "');";
    mysql_query($query);
    echo "true";
}

mysql_close($con);

?>