<?php

$parsedJSON = json_decode(file_get_contents("php://input"));
$con = mysql_connect("localhost");
if (!$con) {
    die("Could not connect: " . mysql_error());
}

mysql_select_db("test", $con);
$query = "";
if ($parsedJSON->action == 'get') {
    getTodos();
} else if ($parsedJSON->action == 'add') {
    $todo = $parsedJSON->todo;
    $query =
            "INSERT INTO t094011_todos (
        category,
        created,
        name,
        deadline,
        description,
        isUrgent,
        isImportant,
        isActive,
        state,
        tags
        ) VALUES (
        '" . $todo->category . "',
        '" . $todo->created . "',
        '" . $todo->name . "',
        '" . $todo->deadline . "',
        '" . $todo->description . "',
        '" . $todo->isUrgent . "',
        '" . $todo->isImportant . "',
        '" . $todo->isActive . "',
        '" . $todo->state . "',
        '" . $todo->tags . "'
        )";
    mysql_query($query);

    //getTodos();
} else if ($parsedJSON->action == 'delete') {
    //$query = "DELETE FROM t094011_todos WHERE";
} else if ($parsedJSON->action == 'update') {
    $todo = $parsedJSON->todo;
    $query =
            "UPDATE t094011_todos
                SET
                category='" . $todo->category . "',
                name='" . $todo->name . "',
                deadline='" . $todo->deadline . "',
                description='" . $todo->description . "',
                isUrgent='" . $todo->isUrgent . "',
                isImportant='" . $todo->isImportant . "',
                isActive='" . $todo->isActive . "',
                state='" . $todo->state . "',
                tags='" . $todo->tags . "'
            WHERE created='" . $todo->created . "'";
    mysql_query($query);
}

function getTodos() {
    $query = "SELECT * FROM t094011_todos";

    $todos = array();

    $result = mysql_query($query);
    while ($row = mysql_fetch_array($result)) {
        $todos[] = (object) $row;
    }
    //$answer = json_encode($todos);
    echo json_encode($todos);
}

mysql_close($con);
?>