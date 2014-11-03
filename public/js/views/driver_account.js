/**
 * Created by Asif on 7/26/2014.
 */
/**
 * Created by Asif on 7/19/2014.
 */

$(document).ready(function(){

    var hc = new HomeController();
    var dv = new DriverAccountValidator();

    $('#account-form').ajaxForm({url: '/api/profile', type:'post',
        beforeSubmit : function(formData, jqForm, options)
        {
            formData.push({name:'date_of_birth', value:$("#dob_month-tf").val()+"-"+$("#dob_day-tf").val()+"-"+$("#dob_year-tf").val()});
            //formData.push({name:'driver_license_expiration_date', value:$("#led_month-tf").val()+"-"+$("#led_day-tf").val()+"-"+$("#led_year-tf").val()});
            return dv.validateForm();
        },
        success	: function(responseText, status, xhr, $form){
            if (status == 'success')
                dv.showProfileUpdateSuccess("Profile has been updated successfully.");
            page_viewonly_state();
        },
        error : function(e)
        {
            var err = [];
            err.push(e.responseText);
        }
    });

    $('#profile_image-form').submit(function() {
        $(this).ajaxSubmit({
            success: function (responseText, status, xhr) {
                if (status == 'success')
                    dv.showProfileUpdateSuccess("Profile image has been uploaded successfully.");
            },
            error: function (xhr) {
                dv.showAlert('Error: ' + xhr.status);
            }

        });
    });

    $('#first_name-tf').focus();
    $('#github-banner').css('top', '41px');


    if($("#dob").val() != '')
    populatedropdown("dob_day-tf", "dob_month-tf", "dob_year-tf",$("#dob").val());
    if($("#sed").val() != '')
    populatedropdown("sed_day-tf", "sed_month-tf", "sed_year-tf",$("#sed").val());
    if($("#led").val() != '')
    populatedropdown("led_day-tf", "led_month-tf", "led_year-tf",$("#led").val());

    try {
        var user_img = $("#hdn_image").val();
        if (user_img != '')
            $('#imagePreview').css('background-image', 'url(' + user_img.substring(9) + ')');

        if ($("#driver_license_attached").attr('href') != '' && typeof $("#driver_license_attached").attr('href') != 'undefined') {
            var user_licence = $("#driver_license_attached").attr('href');
            if (user_licence != '')
                $("#driver_license_attached").attr("href", user_licence.substring(9));
        }

        if ($("#chauffeur_license_attached").attr('href') != '' && typeof $("#chauffeur_license_attached").attr('href') != 'undefined') {
            var user_licence = $("#chauffeur_license_attached").attr('href');
            if (user_licence != '')
                $("#chauffeur_license_attached").attr("href", user_licence.substring(9));
        }
    }
    catch (e)
    {

    }

    $("#uploadFile").on("change", function(e){
        var files = !!this.files ? this.files : [];
        if (!files.length || !window.FileReader) return;

        if (/^image/.test( files[0].type)){ // only image file
            var reader = new FileReader(); // instance of the FileReader
            reader.readAsDataURL(files[0]); // read the local file

            reader.onloadend = function(){ // set image data as background of div
                $("#imagePreview").css("background-image", "url("+this.result+")");
                //$("#imagePreviewMain").css("background-image", "url("+this.result+")");
            }
        }
        dv.showProfileUpdateSuccess("Please wait your profile image is uploading....");
        $('#profile_image-form').submit();
        return false;
    });

    $("#zipcode-tf").keyup(function() {
        var el = $(this);

        if ((el.val().length >= 5) && (is_int(el.val()))) {
            $.ajax({
                url: "http://zip.elevenbasetwo.com",
                cache: false,
                dataType: "json",
                type: "GET",
                data: "zip=" + el.val(),
                success: function(result, success) {
                    $("#city-tf").val(result.city); /* Fill the data */
                    $("#state-tf").val(result.state);
                    $("#zipcode-cg").removeClass('has-error');
                    $("#address-line-1").focus(); /* Put cursor where they need it */
                },
                error: function(result, success) {
                    $("#zipcode-cg").addClass('has-error'); /* Ruh row */
                }

            });
        }
    });

    $('#user-tf').attr('disabled', 'disabled');
    $('#account-form-btn1').html('Delete');
    $('#account-form-btn1').addClass('btn-danger');

    // setup the confirm window that displays when the user chooses to delete their account //
    $('.modal-confirm').modal({ show : false, keyboard : true, backdrop : true });
    $('.modal-confirm .modal-header h3').text('Delete Account');
    $('.modal-confirm .modal-body p').html('Are you sure you want to delete your account?');
    $('.modal-confirm .cancel').html('Cancel');
    $('.modal-confirm .submit').html('Delete');
    $('.modal-confirm .submit').addClass('btn-danger');

    try {
        $('#social_security_number-tf').mask('000-00-0000');
        $('#zipcode-tf').mask('00000-000');
    }
    catch (e)
    {

    }


});

function is_int(value){
    if ((parseFloat(value) == parseInt(value)) && !isNaN(value)) {
        return true;
    } else {
        return false;
    }
}

function page_viewonly_state()
{
    $("#first_name-tf").attr("disabled", 'disabled');
    $("#last_name-tf").attr("disabled", 'disabled');
    $('#driver_address1-tf').attr("disabled", 'disabled');
    $('#driver_address2-tf').attr("disabled", 'disabled');
    $('#city-tf').attr("disabled", 'disabled');
    $('#state-tf').attr("disabled", 'disabled');
    $('#zipcode-tf').attr("disabled", 'disabled');
    $('#social_security_number-tf').attr("disabled", 'disabled');
    $('#dob_month-tf').attr("disabled", 'disabled');
    $('#dob_day-tf').attr("disabled", 'disabled');
    $('#dob_year-tf').attr("disabled", 'disabled');
    $('#led_month-tf').attr("disabled", 'disabled');
    $('#led_day-tf').attr("disabled", 'disabled');
    $('#led_year-tf').attr("disabled", 'disabled');
    $('#driver_license_no-tf').attr("disabled", 'disabled');
    $('#driver_license_state-tf').attr("disabled", 'disabled');
    $('#driver_license_city-tf').attr("disabled", 'disabled');
    $('#driver_license_attachment-tf').attr("disabled", 'disabled');
    $('#account-form-btn2').addClass('hide');
    $('#account-form-cancel').addClass('hide');
    $('#account-form-edit').removeClass('hide');
}

function populatedropdown(dayfield, monthfield, yearfield,date){
    try{
        var d = new Date(date);
        $("#"+yearfield).val(d.getFullYear());
        $("#"+monthfield).val(d.getMonth()+1);
        $("#"+dayfield).val(d.getDate());
    }
    catch (e)
    {

    }
}

/*
function populatedropdown(dayfield, monthfield, yearfield,date){
    try{
        var date_parts = date.split("-");
        var today=new Date(date_parts[2],date_parts[0],date_parts[1]);

        $("#"+yearfield).val(date_parts[2]);
        $("#"+monthfield).val(date_parts[0]);
        $("#"+dayfield).val(date_parts[1]);
    }
    catch (e)
    {

    }
}
*/
