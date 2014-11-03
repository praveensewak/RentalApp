/**
 * Created by Asif on 7/12/2014.
 */
var post_url = '/api/driver_signup';

$(document).ready(function(){

    var av = new DriverAccountValidator();
    var sc = new DriverSignupController();
    var ev = new EmailValidator();

    if($("#chauffeur_license_attached").attr('href')!= '' && typeof $("#chauffeur_license_attached").attr('href') != 'undefined') {
        var user_licence = $("#chauffeur_license_attached").attr('href');
        if (user_licence != '')
            $("#chauffeur_license_attached").attr("href", user_licence.substring(9));
    }

    if($("#dob").val() != '')
        populatedropdown("dob_day-tf", "dob_month-tf", "dob_year-tf",$("#dob").val());
    if($("#sed").val() != '')
        populatedropdown("sed_day-tf", "sed_month-tf", "sed_year-tf",$("#sed").val());
    if($("#led").val() != '')
        populatedropdown("led_day-tf", "led_month-tf", "led_year-tf",$("#led").val());

    //populatedropdown("dob_day", "dob_month", "dob_year",'7-15-1980');

    $('#account-form').ajaxForm({url: post_url , dataType: 'json',
        beforeSubmit : function(formData, jqForm, options){
            formData.push({name:'date_of_birth', value:$("#dob_month-tf").val()+"-"+$("#dob_day-tf").val()+"-"+$("#dob_year-tf").val()});
            formData.push({name:'chauffeur_expiration_date', value:$("#sed_month-tf").val()+"-"+$("#sed_day-tf").val()+"-"+$("#sed_year-tf").val()});
                return av.validateForm();

        },
        success	: function(responseText, status, xhr, $form){

            if (status == 'success') {
                var json = $.parseJSON(xhr.responseText);
                var sc_success = new DriverSignupController(json.registration_token);
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
    $('#name-tf').focus();

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
    $('#social_security_number-tf').mask('000-00-0000');
    $('#chauffeur_license_no-tf').mask('0000000000000000');

    $('#chauffeur_license_remove').click(function(){
        $('#chauffeur_license_attached').addClass('hide');
        $('#chauffeur_license_remove').addClass('hide');
        $('#chauffeur_license_not_attached').removeClass('hide');
        $('#chauffeur_license_attachment-tf').val("");
    });

    //chauffeur_license_attachment-tf
    $("#chauffeur_license_attachment-tf").on("change", function(e){
        var files = !!this.files ? this.files : [];
        if (!files.length || !window.FileReader){
            return;
        }else{
            $('#chauffeur_license_attached').removeClass('hide');
            $('#chauffeur_license_remove').removeClass('hide');
            $('#chauffeur_license_not_attached').addClass('hide');

            $('#chauffeur_license_attached').html(this.files[0].name+"&nbsp;&nbsp;");
            return false;
        }
    });


});


function populatedropdown(dayfield, monthfield, yearfield,date)
{
    var date_parts = date.split("-");
    var today=new Date(date_parts[2],date_parts[0],date_parts[1]);

    $("#"+yearfield).val(date_parts[2]);
    $("#"+monthfield).val(date_parts[0]);
    $("#"+dayfield).val(date_parts[1]);
}