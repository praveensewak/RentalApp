/**
 * Created by Asif on 7/2/2014.
 */

$(document).ready(function(){

    var vv = new VerifyValidator();
    var vc = new VerifyController();

    var token = getQueryParams(document.location);

// main login form //

    $('#verify-form').ajaxForm({url: '/api/verify/'+token,dataType: 'json',
        beforeSubmit : function(formData, jqForm, options){
            //formData.push({name:'registration_token', value:token})
            return vv.validateForm();
        },
        success	: function(responseText, status, xhr, $form){
            if (status == 'success') {
                var json = $.parseJSON(xhr.responseText);
                var sc_success = new VerifyController(json.registration_token,json.user_type);
                if(json.user_type == 'passenger')
                $('.modal-alert .modal-body p').html('Your account has been verified sucessfully.</br>Click OK to enter payment information.');
                else
                if(json.user_type == 'driver')
                $('.modal-alert .modal-body p').html('Your account has been verified sucessfully and your account approval is pending with taxi.</br>Click OK to Login.');

                $('.modal-alert').modal('show');
            }
        },
        error : function(e){
            var json = $.parseJSON(e.responseText);
            if (json.message == 'invalid-request'){
                vv.showInvalidRegistrationCode();
            }
            else
            {
                vv.generalError();
            }
        }
    });
    $('#registration_code-tf').focus();
// customize the payment form //

    $('#verify-form h1').text('Verify your account');
    $('#verify-form #sub1').text('Please specify how you would like to pay for your rides');
    $('#verify-form #sub2').text('Enter payment details');
    $('#verify-form-btn1').html('Cancel');
    $('#verify-form-btn2').html('Submit');
    $('#verify-form-btn2').addClass('btn-primary');

// setup the alert that displays when an payment is successfully created //

    $('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static'});
    $('.modal-alert .modal-header h3').text('Success!');
    $('.modal-alert .modal-body p').html('Your account has been verified sucessfully.</br>Click OK to enter payment information.');
})

function getQueryParams(qs) {
   qsp = qs.pathname.split("/");
   return qsp[2];
}