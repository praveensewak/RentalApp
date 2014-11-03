/**
 * Created by Asif on 9/3/2014.
 */
/**
 * Created by Asif on 7/19/2014.
 */

$(document).ready(function(){

    $("#bank_routing_number-tf").mask('000000000');
    $("#bank_account_number-tf").mask('0000000000000000000000000');
    $("#verify_bank_account_number-tf").mask('0000000000000000000000000');
    $("#bank_phone_number-tf").mask('(000) 000-0000');


    var hc = new HomeController();
    var av = new AccountValidator();

    $('#account-form').ajaxForm({url: '/api/driver/bankdetail',type:'put',
        beforeSubmit : function(formData, jqForm, options)
        {
            formData.push({name:'user_id', value:$('#userId').val()})
            return av.validateForm();
        },
        success	: function(responseText, status, xhr, $form){
            if (status == 'success')
                av.showProfileUpdateSuccess("Profile has been updated successfully.");

            $("#bank_name-tf").attr("disabled", 'disabled');
            $("#bank_routing_number-tf").attr("disabled", 'disabled');
            $("#bank_account_number-tf").attr("disabled", 'disabled');
            $("#verify_bank_account_number-tf").attr("disabled", 'disabled');
            $("#bank_phone_number-tf").attr("disabled", 'disabled');
            $("#bank_contact_person-tf").attr("disabled", 'disabled');
            $("#notes-tf").attr("disabled", 'disabled');
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
    $('#name-tf').focus();
    $('#github-banner').css('top', '41px');

    // customize the account settings form //
    $('#account-form h1').text('Bank Account Details');
    $('#account-form #sub1').text('Here are the current bank account details.');
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