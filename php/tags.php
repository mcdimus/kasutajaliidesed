<?php

	$parsedJSON = json_decode(file_get_contents("php://input"));
	$con = mysql_connect("localhost");
	if (!$con) {
		die("Could not connect: " . mysql_error());
	}

	mysql_select_db("test", $con);
	$query = "";
	if ($parsedJSON -> action == 'get') {
		$query = "SELECT * FROM t094011_tags";
		$answer = '[';
		$result = mysql_query($query);
		while($row = mysql_fetch_array($result)) {
			$answer .= '"' . $row['tag_name'] . '", ';
		}
		$answer = substr($answer, 0, strlen($answer) - 2);
		echo $answer . ']';
	} else if ($parsedJSON -> action == 'add') {
		$newTags = explode(" ", $parsedJSON -> tags);
		foreach($newTags as $tag) {
			$query = "INSERT INTO t094011_tags (tag_name) VALUES ('" . $tag . "');";
			mysql_query($query);
		}
	} else if ($parsedJSON -> action == 'delete') {

	}
	mysql_close($con);
?>