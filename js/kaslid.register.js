$(function() {
	// var frmvalidator  = new Validator("regform");
	// frmvalidator.EnableOnPageErrorDisplay();
 //    frmvalidator.addValidation("username","req","Please enter your username");
 //    frmvalidator.addValidation("username","maxlen=20",	"Max length for username is 20");

 //    frmvalidator.addValidation("email","maxlen=50","Max length for email is 50");
 //    frmvalidator.addValidation("email","req","Please enter your email");
 //    frmvalidator.addValidation("email","email","Please enter your email correctly");

 //    frmvalidator.addValidation("password_confirm","eqelmnt=password","The confirmed password is not same as password");

    function validateUsername() {
    	var username = $('#username').val();
    	if (username != '') {
    		return true;
    	} else {
    		return false;
    	}
    }

    function validateEmail() {
    	var email = $('#email').val(),
    		pattern = /^[a-zA-Z0-9]+[a-zA-Z0-9_]*@[a-z]+\.[a-z]+/;
    	if (pattern.test(email)) {
    		return true;
    	} else {
    		return false;
    	}
    }

    // registration via AJAX
    var $regForm = $('#regform');
    $regForm.submit( function(obj) {
    	// username = $('#username').val(),
    	// 	password = $('#password').val(),
    	// 	email = $('#email').val();

	    // 	console.log('php/register.php', '{ "username" : "' + username + '", "passwd" : "'
	    // 		+ password + '", "email" : "' + email + '" }');
    	// if (username != '' && password != '' && email != '') {
	    // 	$.post('php/register.php', '{ "username" : "' + username + '", "passwd" : "'
	    // 		+ password + '", "email" : "' + email + '" }', function(answer) {
	    // 			alert(answer);
	    // 		});
    	// }
    	alert(validateEmail());
    	return false;
    });
});