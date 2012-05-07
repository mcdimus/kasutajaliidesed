//=======================================//
//-------- index.html validation --------//
//=======================================//
$(function() {
    var frmvalidator  = new Validator("loginForm");
    frmvalidator.EnableOnPageErrorDisplay();
    frmvalidator.addValidation("login","req","Please enter your username");
    frmvalidator.addValidation("passwd","req","Please enter your password");

    var $loginForm = $('#loginForm');
    $loginForm.submit( function(obj) {
        var $passwdErrPlace = $('div#loginForm_passwd_errorloc'),
        username = $('input#login').val(),
        password = $('input#passwd').val();
        if (username != '' && password != '') {
            $passwdErrPlace.text('');
            $.post('php/signin.php', '{ "username" : "' + $('input#login').val() + '" , "passwd" : "' + $('input#passwd').val() + '" }',
                function(answer) {
                    if (answer.answer) {
                        window.location = "main.html";
                    } else {
                        $passwdErrPlace.text('wrong login and/or password');
                    }
            }, 'json');
        }
        return false;
    });
});