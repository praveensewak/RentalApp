/**
 * Created by Asif on 7/19/2014.
 */

$(document).ready(function(){

    var hc = new HomeController();
    var av = new AccountValidator();

    $('#account-form').ajaxForm({url: '/api/profile',type:'post',
        beforeSubmit : function(formData, jqForm, options)
        {
            formData.push({name:'_id', value:$('#userId').val()})
            return av.validateForm();
        },
        success	: function(responseText, status, xhr, $form){
            if (status == 'success')
                av.showProfileUpdateSuccess("Profile has been updated successfully.");

            $("#first_name-tf").attr("disabled", 'disabled');
            $("#last_name-tf").attr("disabled", 'disabled');
            $('#account-form-cancel').addClass('hide');
            $('#account-form-btn2').addClass('hide');
            $('#account-form-edit').removeClass('hide');
        },
        error : function(e)
        {
            //var err = [];
            //err.push(e.responseText);
        }
    });

    $('#profile_image-form').submit(function() {
        $(this).ajaxSubmit({
            success: function (responseText, status, xhr) {
                if (status == 'success')
                    av.showProfileUpdateSuccess("Profile image has been uploaded successfully.");
            },
            error: function (xhr) {
                av.showAlert('Error: ' + xhr.status);
            }

        });
    });

    $('#name-tf').focus();
    $('#github-banner').css('top', '41px');


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
        av.showProfileUpdateSuccess("Please wait your profile image is uploading....");
        $('#profile_image-form').submit();
        return false;
    });

    // customize the account settings form //
    $('#account-form h1').text('Account Settings');
    $('#account-form #sub1').text('Here are the current settings for your account.');
    $('#user-tf').attr('disabled', 'disabled');
    $('#account-form-btn1').html('Delete');
    $('#account-form-btn1').addClass('btn-danger');
    $('#account-form-cancel').html('Cancel');
    $('#account-form-edit').html('Edit');
    $('#account-form-btn2').html('Update');

    // setup the confirm window that displays when the user chooses to delete their account //
    $('.modal-confirm').modal({ show : false, keyboard : true, backdrop : true });
    $('.modal-confirm .modal-header h3').text('Delete Account');
    $('.modal-confirm .modal-body p').html('Are you sure you want to delete your account?');
    $('.modal-confirm .cancel').html('Cancel');
    $('.modal-confirm .submit').html('Delete');
    $('.modal-confirm .submit').addClass('btn-danger');

})