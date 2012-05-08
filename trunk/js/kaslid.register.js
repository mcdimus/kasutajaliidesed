$(function() {
	var usernameErrorDiv = $('#regform_username_errorloc'),
    		emailErrorDiv = $('#regform_email_errorloc'),
    		passErrorDiv = $('#regform_password_errorloc'),
    		passConfErrorDiv = $('#regform_password_confirm_errorloc');

	function validateUsername() {
    	var username = $('#username').val();
    	if (username != '') {
    		if (username.length <= 20) {
    			usernameErrorDiv.text("");
    			return username;
    		} else {
    			usernameErrorDiv.text("Max length for username is 20");
    			return null;
    		}
    	} else {
    		usernameErrorDiv.text('Please enter your username');
    		return null;
    	}
    }

    function validateEmail() {
    	var email = $('#email').val(),
    		pattern = /^[a-zA-Z0-9]+[a-zA-Z0-9_]*@[a-z]+\.[a-z]+/;
    	if (email.length <= 50) {
    		if (pattern.test(email)) {
    			emailErrorDiv.text("");
    			return email;
    		} else {
    			emailErrorDiv.text("Please enter your email correctly");
    			return null;
    		}
    	} else {
    		emailErrorDiv.text("Max length for email is 50");
    		return null;
    	}
    }

    function validatePassword() {
    	var password = $('#password').val(),
    		password_conf = $('#password_confirm').val();
    	if (password != '') {
    		if (password == password_conf) {
    			passErrorDiv.text("");
    			passConfErrorDiv.text("");
    			return password;
    		} else {
    			passErrorDiv.text("");
    			passConfErrorDiv.text("The passwords do not match");
    			return null;
    		}
    	} else {
    		passErrorDiv.text("Please enter your password");
    		passConfErrorDiv.text("");
    		return null;
    	}
    }

    // registration via AJAX
    var $regForm = $('#regform');
    $regForm.submit( function(obj) {
    	var username = validateUsername(),
    		email = validateEmail(),
    		password = validatePassword();
    	if (username != null && email != null && password != null) {
	    	$.post('php/register.php', '{ "username" : "' + username + '", "passwd" : "'
	    		+ password + '", "email" : "' + email + '" }', function(answer) {
                    if (answer.answer) {
                        window.location = "main.html";
                    } else {
                        usernameErrorDiv.text("This username is already in use");
                    }
            }, 'json');
    	}
        return false;
    });

});