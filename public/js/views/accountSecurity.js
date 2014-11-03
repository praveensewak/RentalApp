/**
 * Created by Asif on 8/27/2014.
 */

$(document).ready(function(){

    var hc = new HomeController();
    var av = new AccountSecurityValidator();

    $('#account-form').ajaxForm({url: '/api/accountsecurity',dataType: 'json',type:'post',
        beforeSubmit : function(formData, jqForm, options)
        {
            formData.push({name:'_id', value:$('#userId').val()})
           return av.validateForm();
        },
        success	: function(responseText, status, xhr, $form){
            if (status == 'success')
            {
                av.showProfileUpdateSuccess("Password has been changed successfully.");
            $("#current_password-tf").val('');
            $("#new_password-tf").val('');
            $("#confirm_password-tf").val('');
            }
        },
        error : function(e)
        {
            var err = [];
            err.push(e.responseText);
            av.ShowAlert(err);
        }
    });
    $('#name-tf').focus();
    $('#github-banner').css('top', '41px');

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