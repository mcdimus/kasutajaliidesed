<?php
	
	$parsedJSON = json_decode(file_get_contents("php://input"));
	$con = mysql_connect("localhost");
	if (!$con) {
		die("Could not connect: " . mysql_error());
	}
	
	mysql_select_db("test", $con);
	$query = "SELECT * FROM t094011_users WHERE username='" . $parsedJSON -> username . "'";
	$row = mysql_fetch_array(mysql_query($query));
	$answer = "";
	if ($row != null) {
		if ($row['passwd'] == md5($parsedJSON -> username . $parsedJSON -> passwd)) {
			$answer = '{"answer" : true}';
		} else {
			$answer = '{"answer" : false}';
		}
	} else {
		$answer = '{"answer" : false}';
	}
	echo $answer;
	mysql_close($con);
?>