var registration_status = '';
var registration_token = '';
var user_type = '';
$(document).ready(function(){
	var lv = new LoginValidator();
	var lc = new LoginController();


// main login form //

	$('#login-form').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			if (lv.validateForm() == false){
				return false;
			} 	else{
			// append 'remember-me' option to formData to write local cookie //
				formData.push({name:'remember-me', value:$("input:checkbox:checked").length == 1})
				return true;
			}
		},
		success	: function(responseText, status, xhr, $form){
            if (status == 'success') {
                var json = $.parseJSON(xhr.responseText);
                if (json.registration_status == 'complete' || json.registration_status == 'registered') {
                    window.location.href = '/home';
                }
                else if (json.registration_status == 'verified') {
                    $('#myModalConfirm2').modal({ show : false, keyboard : false, backdrop : 'static'});
                    $('#myModalConfirm2 .modal-header h3').text('Success!');
                    $('#myModalConfirm2 .modal-body p').html('Your payment information is missing.Please click OK to proceed.');
                    registration_status = 'verified';
                    registration_token = json.registration_token;
                    $('#myModalConfirm2').modal('show');
                }
                else if (json.registration_status == 'pending') {
                    $('#myModalConfirm2').modal({ show : false, keyboard : false, backdrop : 'static'});
                    $('#myModalConfirm2 .modal-header h3').text('Success!');
                    $('#myModalConfirm2 .modal-body p').html('Your registration was not complete.Click OK to proceed with registration.');
                    registration_status = 'pending';
                    registration_token = json.registration_token;
                    user_type = json.user_type;
                    $('#myModalConfirm2').modal('show');
                }
            }
		},
		error : function(e){
            lv.showLoginError('Login Failure', 'Please check your username and/or password');
		}
	}); 
	$('#email-tf').focus();
	
// login retrieval form via email //
	
	var ev = new EmailValidator();
	
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
			ev.showEmailSuccess("Check your email for how to reset your password.");
		},
		error : function(responseText){
            var json = $.parseJSON(responseText.responseText);
            if(json.message)
                ev.showEmailAlert(json.message);
            else
			ev.showEmailAlert("Sorry. There was a problem, please try again later.");
		}
	});
})