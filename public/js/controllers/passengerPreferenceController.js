/**
 * Created by Asif on 8/23/2014.
 */

$('#account-form-edit').click(function(){

    if ( $('#tip-tf').attr( "disabled" ) === 'disabled' ) {
        $('#tip-tf').removeAttr( "disabled" )
    }
    if ( $('#favourite_affiliate-tf').attr( "disabled" ) === 'disabled' ) {
        $('#favourite_affiliate-tf').removeAttr( "disabled" )
    }
    $('#account-form-edit').addClass('hide');
    $('#account-form-btn2').removeClass('hide');
    $('#account-form-cancel').removeClass('hide');

    var av = new PassengerPreference();
    av.hideProfileUpdateMSG();

});

$('#account-form-cancel').click(function(){
    $("#tip-tf").attr("disabled", 'disabled');
    $("#favourite_affiliate-tf").attr("disabled", 'disabled');
    $('#account-form-btn2').addClass('hide');
    $('#account-form-cancel').addClass('hide');
    $('#account-form-edit').removeClass('hide');

    var av = new PassengerPreference();
    av.hideProfileUpdateMSG();

});