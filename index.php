<?php
	include_once('auth/const.php');
	include_once('auth/auth.php');
	$username = auth_check();
	if (!$username) {
		//then we should show user a login/signup form
		echo <<<ELG
		<link rel="stylesheet" media="(min-device-aspect-ratio:7/10)" href="login-style.css">
		<link rel="stylesheet" media="(max-device-aspect-ratio:7/10)" href="login-style.css">
		<div class='login-wrapper'>
			<div id='login-header' class='login-header-active' onclick='openLogin()'>Log in</div><div id='register-header' class='register-header' onclick='openRegister()'>Sign Up</div>
			<form id='login' action='signmeplease.php'>
				<input type='text' placeholder='username' name='login' required></input>
				<br>
				<input type='password' placeholder='password' name='password' required></input>
				<br>
				<button type='submit'>Let me in</button>
			</form>
			<form name='register' id='register' action='registermeplease.php' onsubmit='return validateRegisterForm()'>
				<input type='text' placeholder='your invitation' name='invitation' required></input>
				<br>
				<input type='text' placeholder='username' name='login' required></input>
				<br>
				<input type='password' placeholder='set password' name='password1' required></input>
				<br>
				<input type='password' placeholder='repeat password' name='password2' required></input>
				<br>
				<button type='submit'>Register</button>
				<div id='message'></div>
			</form>
		</div>
		<script>
			var loginHeader = document.getElementById('login-header');
			var login = document.getElementById('login');
			var registerHeader = document.getElementById('register-header');
			var register = document.getElementById('register');
			function openLogin(){
				loginHeader.className = 'login-header-active';
				registerHeader.className = 'register-header';
				login.style.display = 'block';
				register.style.display = 'none';
			};
			function openRegister(){
				loginHeader.className = 'login-header';
				registerHeader.className = 'register-header-active';
				login.style.display = 'none';
				register.style.display = 'block';
			};
			function message(text){
				document.getElementById("message").innerHTML = text;
			};
			function validateRegisterForm() {
				try {
					var login = document.forms["register"]["login"].value;
					var pass1 = document.forms["register"]["password1"].value;
					var pass2 = document.forms["register"]["password2"].value;
					if (login.length < 5 || login.length > 25 ) {
						message("Your login should be 5-25 characters long");
						return false;
					} else if (pass1.length < 8) {
						message("Your password should contain at least 8 characters");
						return false;
					} else if (pass1 != pass2) {
						message("Passwords do not match!");
						return false;
					} else {
						message("");
					}
				} catch (err) {
					console.log(err);
					return false;
				}
			};
		</script>
ELG;
	} else {
		echo <<<OUR
		<head>
		<title>It's our map, dude!</title>
		<link rel="stylesheet" href="https://unpkg.com/leaflet@1.0.3/dist/leaflet.css" />				<link rel="shortcut icon" type="image/x-icon" href="favicon.ico"/>
		<link rel="stylesheet" href="style.css" />
		<script src="https://unpkg.com/leaflet@1.0.3/dist/leaflet.js"></script>
		<script src="https://code.jquery.com/jquery-3.2.0.min.js" integrity="sha256-JAW99MJVpJBGcbzEuXk4Az05s/XyDdBomFqNlM3ic+I=" crossorigin="anonymous"></script>
	</head>
	<body>
		<div class="page">
			<div id="header">Logged as $username <a href='letmeout.php'>Log out</a></div>
			<div class="wrapper">
				<div id="panel"><ul id='userList'></ul></div><div id="map"></div>
			</div>
		</div>
		<script>var username = '$username'</script>
		<script src="main.js"></script>
	</body>
OUR;
	}