/**
 * Created by Muhammad Mukarram on 8/31/2014.
 */

$(document).ready(function(){

    var user_id = $('#user_id').val();

    $.ajax({
        url: '/api/GetDriverDetails/' + user_id,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            if (data.chauffeur_license_attachment != '') {
                $('#chauffeur_license_attached').text('View');
                $('#chauffeur_license_attached').attr("href", data.chauffeur_license_attachment);
                $('#chauffeur_license_file_name').text(data.chauffeur_license_attachment.substr(18));
            }
            if (data.driver_license_attachment != '') {
                $('#driver_license_attached').text('View');
                $('#driver_license_attached').attr("href", data.driver_license_attachment);
                $('#driver_license_file_name').text(data.driver_license_attachment.substr(18));
            }
        },
        error: function(jqXHR){
            console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
        }
    });
    document.body.style.cursor='default';

    var hc = new HomeController();
    var dv = new DriverDocumentValidator();

    $('#document-form-Chauffeur').ajaxForm({url: '/api/updatedriverchauffeur', type:'post',
        beforeSubmit : function(formData, jqForm, options)
        {
            formData.push({name:'chauffeur_expiration_date', value:$("#sed_month-tf").val()+"-"+$("#sed_day-tf").val()+"-"+$("#sed_year-tf").val()});
            return dv.validateChauffeurForm();
        },
        success	: function(responseText, status, xhr, $form){
            if (status == 'success')
                dv.showProfileUpdateSuccess("Chauffeur License has been updated successfully.");

            if (responseText.chauffeur_license != null && responseText.chauffeur_license)
            {
                $('#chauffeur_license_attached').text('View');
                $('#chauffeur_license_attached').removeClass('hide');
                $('#chauffeur_link_no_attachment').addClass('hide');
                $('#chauffeur_license_attached').attr("href", responseText.chauffeur_license);
                $('#chauffeur_license_link').html("<a href='" + responseText.chauffeur_license + "' target='_blank'>View<a>");
                $('#chauffeur_license_file_name').removeClass('hide');
                $('#chauffeur_license_file_name').text(responseText.chauffeur_license.substr(18));
                $('#Remove_Chauffeur_License').removeClass('hide');
            }
            page_viewonly_state();
        },
        error : function(e)
        {
            dv.ShowAlert(e.responseText);
            //var err = [];
            //err.push(e.responseText);
        }
    });

    $('#document-form-driver').ajaxForm({url: '/api/updatedriverlicense', type:'post',
        beforeSubmit : function(formData, jqForm, options)
        {
            formData.push({name:'driver_license_expiration_date', value:$("#led_month-tf").val()+"-"+$("#led_day-tf").val()+"-"+$("#led_year-tf").val()});
            return dv.validateLicenseForm();
        },
        success	: function(responseText, status, xhr, $form){
            if (status == 'success')
                dv.showDriverUpdateSuccess("Driver License has been updated successfully.");

            if (responseText.driver_license != null && responseText.driver_license != '')
            {
                $('#driver_license_attached').text('View');
                $('#driver_license_attached').removeClass('hide');
                $('#driver_link_no_attachment').addClass('hide');
                $('#driver_license_attached').attr("href", responseText.driver_license);
                $('#driver_license_link').html("<a href='" + responseText.driver_license + "' target='_blank'>View<a>");
                $('#driver_license_file_name').removeClass('hide');
                $('#driver_license_file_name').text(responseText.driver_license.substr(18));
                $('#Remove_Driver_License').removeClass('hide');
            }
            page_driver_viewonly_state();
        },
        error : function(e)
        {
            dv.ShowDriverAlert(e.responseText);
        }
    });

    // confirm account deletion //
    $('#Remove_Chauffeur_License').click(function(){
        $('#confirmed_object').val($('#_id').val());
        $('#license_type').val('Chauffeur');
        $('.modal-confirm3 .modal-header h3').text('Delete confirmation!');
        $('.modal-confirm3 .modal-body p').html('Are you really want to delete this chauffeur license.');
        $('.modal-confirm3').modal('show')
    });

    $('#Remove_Driver_License').click(function(){
        $('#confirmed_object').val($('#_id').val());
        $('#license_type').val('Driver');
        $('.modal-confirm3 .modal-header h3').text('Delete confirmation!');
        $('.modal-confirm3 .modal-body p').html('Are you really want to delete this driver license.');
        $('.modal-confirm3').modal('show')
    });

    // handle account deletion //
    $('.modal-confirm3 .submit').click(
        function(){
            if($('#license_type').val()=='Driver'){
                delete_driver_license($('#confirmed_object').val());
            }else{
                delete_chauffeur_license($('#confirmed_object').val());
            }
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

    $("#chauffeur_license_attachment-tf").on("change", function()
    {
        var files = !!this.files ? this.files : [];
        if (!files.length || !window.FileReader) return; // no file selected, or no FileReader support

        $('#chauffeur_license_file_name').removeClass('hide');
        $('#chauffeur_license_file_name').text(files[0].name);
        $('#chauffeur_license').val(files[0].name);
    });


    $("#driver_license_attachment-tf").on("change", function()
    {
        var files = !!this.files ? this.files : [];
        if (!files.length || !window.FileReader) return; // no file selected, or no FileReader support

        $('#driver_license_file_name').removeClass('hide');
        $('#driver_license_file_name').text(files[0].name);
        $('#driver_license').val(files[0].name);
    });

    $("#zipcode-tf").keyup(function()
    {
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

    try {
        $('#social_security_number-tf').mask('000-00-0000');
        $('#zipcode-tf').mask('00000-000');
    }
    catch (e)
    {

    }

});

function is_int(value)
{
    if ((parseFloat(value) == parseInt(value)) && !isNaN(value)) {
        return true;
    } else {
        return false;
    }
}

function page_viewonly_state()
{
    $("#taxi_company-tf").attr("disabled", 'disabled');
    $("#chauffeur_license_no-tf").attr("disabled", 'disabled');
    $("#sed_month-tf").attr("disabled", 'disabled');
    $("#sed_day-tf").attr("disabled", 'disabled');
    $("#sed_year-tf").attr("disabled", 'disabled');
    $("#chauffeur_license_attachment-tf").attr("disabled", 'disabled');

    $('#Remove_Chauffeur_License').addClass('hide');
    $('#Chauffeur_License_File').addClass('hide');
    $('#document-form-chauffeur-btn2').addClass('hide');
    $('#document-form-chauffeur-cancel').addClass('hide');
    $('#document-form-chauffeur-edit').removeClass('hide');
}

function page_driver_viewonly_state()
{
    $("#driver_license_no-tf").attr("disabled", 'disabled');
    $("#led_month-tf").attr("disabled", 'disabled');
    $("#led_day-tf").attr("disabled", 'disabled');
    $("#led_year-tf").attr("disabled", 'disabled');
    $("#driver_license_attachment-tf").attr("disabled", 'disabled');

    $('#Remove_Driver_License').addClass('hide');
    $('#Driver_License_File').addClass('hide');
    $('#document-form-driver-btn2').addClass('hide');
    $('#document-form-driver-cancel').addClass('hide');
    $('#document-form-driver-edit').removeClass('hide');
}


function populatedropdown(dayfield, monthfield, yearfield,date)
{
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

function delete_chauffeur_license(conf_obj_id)
{
    $.ajax({
        url: '/api/Remove_Chauffeur_License',
        type: 'post',
        data: { _id: conf_obj_id },
        success: function(data) {
            $('#Remove_Chauffeur_License').addClass('hide');
            $('#chauffeur_license_file_name').addClass('hide');
            $('#chauffeur_license_attached').text('No Attachment');
            $('#chauffeur_license_attached').addClass('hide');
            $('#chauffeur_link_no_attachment').removeClass('hide');
            $('#chauffeur_license_file_name').text('');
            $('#chauffeur_license_link').html('No Attachment');
            $('#chauffeur_license').val('');
            $("#chauffeur_license_attachment-tf").clearInputs(true);
            var dv = new DriverDocumentValidator();
            dv.showProfileUpdateSuccess("Chauffeur license removed successfully.");
        }
    });
}

function delete_driver_license(conf_obj_id)
{
    $.ajax({
        url: '/api/Remove_Driver_License',
        type: 'post',
        data: { _id: conf_obj_id },
        success: function(data) {
            $('#Remove_Driver_License').addClass('hide');
            $('#driver_license_file_name').addClass('hide');
            $('#driver_license_attached').text('No Attachment');
            $('#driver_license_attached').addClass('hide');
            $('#driver_link_no_attachment').removeClass('hide');
            $('#driver_license_file_name').text('');
            $('#driver_license_link').html('No Attachment');
            $('#driver_license').val('');

            var dv = new DriverDocumentValidator();
            dv.showDriverUpdateSuccess("Driver license removed successfully.");
        }
    });
}