<?php
	include "auth/const.php";
	include "auth/auth.php";
	$con = new mysqli(DB_HOST, DB_LOGIN, DB_PASSWORD, DB_NAME);
	$username = auth_check();
	if ($username) {//if user is logged in
		if (!empty($_GET['who']) && $_GET['who'] == $username) {
			$query = "SELECT * FROM world WHERE who = '$username'";
		} else {
			$who = $_GET['who'];
			$query = "SELECT * FROM world WHERE who = '$who'";
		}		
	} else {
		$query = "SELECT * FROM world WHERE who = 'Tepextepex'";
	};
	$result = $con->query($query);
	$rows = array();
	while ($row = mysqli_fetch_assoc($result)) {
		$rows = $row;
	}
	$con->close();
	echo json_encode($rows);