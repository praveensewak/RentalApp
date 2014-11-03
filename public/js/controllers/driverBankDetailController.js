/**
 * Created by Asif on 9/3/2014.
 */

$('#account-form-edit').click(function()
{
    if ( $('#bank_name-tf').attr( "disabled" ) === 'disabled' ) {
        $('#bank_name-tf').removeAttr( "disabled" )
    }
    if ( $('#bank_routing_number-tf').attr( "disabled" ) === 'disabled' ) {
        $('#bank_routing_number-tf').removeAttr( "disabled" )
    }
    if ( $('#bank_account_number-tf').attr( "disabled" ) === 'disabled' ) {
        $('#bank_account_number-tf').removeAttr( "disabled" )
    }
    if ( $('#verify_bank_account_number-tf').attr( "disabled" ) === 'disabled' ) {
        $('#verify_bank_account_number-tf').removeAttr( "disabled" )
    }
    if ( $('#bank_phone_number-tf').attr( "disabled" ) === 'disabled' ) {
        $('#bank_phone_number-tf').removeAttr( "disabled" )
    }
    if ( $('#bank_contact_person-tf').attr( "disabled" ) === 'disabled' ) {
        $('#bank_contact_person-tf').removeAttr( "disabled" )
    }
    if ( $('#notes-tf').attr( "disabled" ) === 'disabled' ) {
        $('#notes-tf').removeAttr( "disabled" )
    }

    var av = new AccountValidator();
    av.hideProfileUpdateMSG();
    $('#account-form-edit').addClass('hide');
    $('#account-form-btn2').removeClass('hide');
    $('#account-form-cancel').removeClass('hide');
});

$('#account-form-cancel').click(function()
{
    $("#bank_name-tf").attr("disabled", 'disabled');
    $("#bank_routing_number-tf").attr("disabled", 'disabled');
    $("#bank_account_number-tf").attr("disabled", 'disabled');
    $("#verify_bank_account_number-tf").attr("disabled", 'disabled');
    $("#bank_phone_number-tf").attr("disabled", 'disabled');
    $("#bank_contact_person-tf").attr("disabled", 'disabled');
    $("#notes-tf").attr("disabled", 'disabled');

    var av = new AccountValidator();
    av.hideProfileUpdateMSG();

    $("#first_name-tf").attr("disabled", 'disabled');
    $("#last_name-tf").attr("disabled", 'disabled');
    $('#account-form-btn2').addClass('hide');
    $('#account-form-cancel').addClass('hide');
    $('#account-form-edit').removeClass('hide');
});