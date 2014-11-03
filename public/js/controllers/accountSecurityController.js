/**
 * Created by Asif on 8/27/2014.
 */
/**
 * Created by Asif on 7/26/2014.
 */

$('#account-form-edit').click(function()
{
    if ( $('#first_name-tf').attr( "disabled" ) === 'disabled' ) {
        $('#first_name-tf').removeAttr( "disabled" )
    }
    if ( $('#last_name-tf').attr( "disabled" ) === 'disabled' ) {
        $('#last_name-tf').removeAttr( "disabled" )
    }

    var av = new AccountSecurityValidator();
    av.hideProfileUpdateMSG();
    $('#account-form-edit').addClass('hide');
    $('#account-form-btn2').removeClass('hide');
    $('#account-form-cancel').removeClass('hide');
});

$('#account-form-cancel').click(function()
{
    window.location.href = '/home';
});