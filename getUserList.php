<?php
	include "auth/const.php";
	$con = new mysqli(DB_HOST, DB_LOGIN, DB_PASSWORD, DB_NAME);
	$result = $con->query("SELECT user_login FROM users WHERE user_login <> ''");
	$user_list = array();
	while ($row = mysqli_fetch_assoc($result)) {
		$user_list[] = $row;
	}
	$con->close();
	echo json_encode($user_list);