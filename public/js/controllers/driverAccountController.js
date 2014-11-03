/**
 * Created by Asif on 7/26/2014.
 */

$('#account-form-edit').click(function(){

    if ( $('#first_name-tf').attr( "disabled" ) === 'disabled' ) {
        $('#first_name-tf').removeAttr( "disabled" )
    }
    if ( $('#last_name-tf').attr( "disabled" ) === 'disabled' ) {
        $('#last_name-tf').removeAttr( "disabled" )
    }
    if ( $('#driver_address1-tf').attr( "disabled" ) === 'disabled' ) {
        $('#driver_address1-tf').removeAttr( "disabled" )
    }
    if ( $('#driver_address2-tf').attr( "disabled" ) === 'disabled' ) {
        $('#driver_address2-tf').removeAttr( "disabled" )
    }
    if ( $('#city-tf').attr( "disabled" ) === 'disabled' ) {
        $('#city-tf').removeAttr( "disabled" )
    }
    if ( $('#state-tf').attr( "disabled" ) === 'disabled' ) {
        $('#state-tf').removeAttr( "disabled" )
    }
    if ( $('#zipcode-tf').attr( "disabled" ) === 'disabled' ) {
        $('#zipcode-tf').removeAttr( "disabled" )
    }
    if ( $('#social_security_number-tf').attr( "disabled" ) === 'disabled' ) {
        $('#social_security_number-tf').removeAttr( "disabled" )
    }
    if ( $('#dob_month-tf').attr( "disabled" ) === 'disabled' ) {
        $('#dob_month-tf').removeAttr( "disabled" )
    }
    if ( $('#dob_day-tf').attr( "disabled" ) === 'disabled' ) {
        $('#dob_day-tf').removeAttr( "disabled" )
    }
    if ( $('#dob_year-tf').attr( "disabled" ) === 'disabled' ) {
        $('#dob_year-tf').removeAttr( "disabled" )
    }
    if ( $('#led_month-tf').attr( "disabled" ) === 'disabled' ) {
        $('#led_month-tf').removeAttr( "disabled" )
    }
    if ( $('#led_day-tf').attr( "disabled" ) === 'disabled' ) {
        $('#led_day-tf').removeAttr( "disabled" )
    }
    if ( $('#led_year-tf').attr( "disabled" ) === 'disabled' ) {
        $('#led_year-tf').removeAttr( "disabled" )
    }
    if ( $('#driver_license_no-tf').attr( "disabled" ) === 'disabled' ) {
        $('#driver_license_no-tf').removeAttr( "disabled" )
    }
    if ( $('#driver_license_state-tf').attr( "disabled" ) === 'disabled' ) {
        $('#driver_license_state-tf').removeAttr( "disabled" )
    }
    if ( $('#driver_license_city-tf').attr( "disabled" ) === 'disabled' ) {
        $('#driver_license_city-tf').removeAttr( "disabled" )
    }
    if ( $('#driver_license_attachment-tf').attr( "disabled" ) === 'disabled' ) {
        $('#driver_license_attachment-tf').removeAttr( "disabled" )
    }
    $('#first_name-tf').focus();
    $('#account-form-btn2').removeClass('hide');
    $('#account-form-cancel').removeClass('hide');
    $('#account-form-edit').addClass('hide');

    var dv = new DriverAccountValidator();
    dv.hideProfileUpdateMSG();

});/**
 * Created by Asif on 7/26/2014.
 */
/*
    Modified by Mukarram on 8/26/2014
 */
$('#account-form-cancel').click(function(){
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

    var dv = new DriverAccountValidator();
    dv.hideProfileUpdateMSG();
});