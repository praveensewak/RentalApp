var post_url = '/api/signup';

$(document).ready(function(){


	
	var av = new AccountValidator();
	var sc = new SignupController();
    var ev = new EmailValidator();


	
	$('#account-form').ajaxForm({url: post_url ,dataType: 'json',
		beforeSubmit : function(formData, jqForm, options){
			return av.validateForm();
		},
		success	: function(responseText, status, xhr, $form){

			if (status == 'success') {
                var json = $.parseJSON(xhr.responseText);
                var sc_success = new SignupController(json.registration_token);
                $('.modal-alert').modal('show');
            }
		},
		error : function(e){
            var json = $.parseJSON(e.responseText);
			if (json.message == 'email-taken'){
			    av.showInvalidEmail();
			}
            else  if (json.message == 'phone-registered-completed') {
                    av.showInvalidUserName(json.message,'complete');
            }
            else if (json.message == 'account-registered-pending') {
                    av.showInvalidUserName(json.message,'pending');
            }

		}
	});
	$('#first_name-tf').focus();
	
// customize the account signup form //
	
	$('#account-form h1').text('Signup');
	$('#account-form #sub1').text('Please tell us a little about yourself');
	$('#account-form #sub2').text('Choose your username & password');
	$('#account-form-btn1').html('Cancel');
	$('#account-form-btn2').html('Submit');
	$('#account-form-btn2').addClass('btn-primary');
	
// setup the alert that displays when an account is successfully created //

	$('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static'});
	$('.modal-alert .modal-header h3').text('Success!');
	$('.modal-alert .modal-body p').html('Verification code has been sent on your phone number.</br>Click OK to verify your phone number.');

    // login retrieval form via email //

    $('#get-credentials-form').ajaxForm({
        url: '/lost-password',
        beforeSubmit : function(formData, jqForm, options){

            if (ev.validateEmail($('#email-fg-tf').val())){
                ev.hideEmailAlert();
                return true;
            }	else{
                ev.showEmailAlert("<b> Error!</b> Please enter a valid email address");
                return false;
            }
        },
        success	: function(responseText, status, xhr, $form){
            ev.showEmailSuccess("Check your email on how to reset your password.");
        },
        error : function(){
            ev.showEmailAlert("Sorry. There was a problem, please try again later.");
        }
    });
    $('#phone_number-tf').mask('(000) 000-0000');
})