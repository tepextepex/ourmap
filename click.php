<?php
	include "auth/const.php";
	include "auth/auth.php";
	$con = new mysqli(DB_HOST, DB_LOGIN, DB_PASSWORD, DB_NAME);
	$username = auth_check();
	if ($username) {
		if (ctype_digit($_GET["countryId"])) {
			$countryId = $_GET["countryId"];
		}
		if ($_GET["visited"] == 1) {
			$query = "UPDATE world SET state$countryId = 1 WHERE who = '$username'";
		} else if ($_GET["visited"] == 0) {
			$query = "UPDATE world SET state$countryId = NULL WHERE who = '$username'";
		}
		$con->query($query);
	};
	$con->close();
	echo $query;