
function LoginController()
{

// bind event listeners to button clicks //
	
	$('#forgot-password').click(function(){ $('#get-credentials').modal('show');});
	
// automatically toggle focus between the email modal window and the login form //

    $('#get-credentials').on('shown', function(){ $('#email-tf').focus(); });
	$('#get-credentials').on('hidden', function(){ $('#user-tf').focus(); });

    $('#myModalConfirm2 #ok').click(

        function(){

            var navigate_to = '';
            if(registration_status == "verified")
                navigate_to =  'payment/'+registration_token;
            else if(registration_status == "pending")
            {
                if(user_type == 'passenger')
                navigate_to =  'signup/'+registration_token;
                else
                if(user_type == 'driver')
                    navigate_to =  'driver_signup/'+registration_token;
                /*
                navigate_to =  'verify/'+registration_token;
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: "/api/resendregcode",
                    data : {
                        registration_token: registration_token
                    },
                    success: function(data){
                        navigate_to =  'verify/'+registration_token;
                    },
                    error : function(msg) {
                        var lv2 = new LoginValidator();
                        //lv2.showLoginError('Login Failure', 'Registration token is invalid.')
                    }
                });*/
            }
            setTimeout(function(){window.location.href = '/'+navigate_to}, 150)});
}