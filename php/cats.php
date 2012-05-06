<?php

$parsedJSON = json_decode(file_get_contents("php://input"));
$con = mysql_connect("localhost");
if (!$con) {
    die("Could not connect: " . mysql_error());
}

mysql_select_db("test", $con);
$query = "";
if ($parsedJSON->action == 'get') {
    getCats();
} else if ($parsedJSON->action == 'add') {
    $query = "INSERT INTO t094011_cats (cat_name) VALUES ('" . $parsedJSON->new_cat . "')";
    mysql_query($query);
    getCats();
} else if ($parsedJSON->action == 'delete') {
    $query = "DELETE FROM t094011_cats WHERE";

    if (is_array($parsedJSON->toBeDeleted)) {
        foreach ($parsedJSON->toBeDeleted as $value) {
            $query .= " cat_name='$value' OR";
        }

        $query = substr($query, 0, strlen($query) - 3);


        mysql_query($query);
    }
    getCats();
}

function getCats() {
    $query = "SELECT * FROM t094011_cats";
    $answer = '[';
    $result = mysql_query($query);
    while ($row = mysql_fetch_array($result)) {
        $answer .= '"' . $row['cat_name'] . '", ';
    }
    $answer = substr($answer, 0, strlen($answer) - 2);
    echo $answer . ']';
}

mysql_close($con);
?>