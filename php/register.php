<?php
	
	$parsedJSON = json_decode(file_get_contents("php://input"));
	$con = mysql_connect("localhost");
	if (!$con) {
		die("Could not connect: " . mysql_error());
	}
	
	mysql_select_db("test", $con);
	$query = "INSERT INTO t094011_users (username, passwd, email) VALUES ('" . $parsedJSON -> username
		. "', '" . md5($parsedJSON -> username . $parsedJSON -> passwd) . "', '" . $parsedJSON -> email . "');";
	mysql_query($query);
	echo $query;
	mysql_close($con);
?>