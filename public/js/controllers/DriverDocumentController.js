/**
 * Created by Muhammad Mukarram on 8/31/2014.
 */

$('#document-form-chauffeur-edit').click(function()
{
    if ($('#taxi_company-tf').attr("disabled") === 'disabled') {
        $('#taxi_company-tf').removeAttr("disabled")
    }
    if ($('#chauffeur_license_no-tf').attr("disabled") === 'disabled') {
        $('#chauffeur_license_no-tf').removeAttr("disabled")
    }
    if ($('#sed_month-tf').attr("disabled") === 'disabled') {
        $('#sed_month-tf').removeAttr("disabled")
    }
    if ($('#sed_day-tf').attr("disabled") === 'disabled') {
        $('#sed_day-tf').removeAttr("disabled")
    }
    if ($('#sed_year-tf').attr("disabled") === 'disabled') {
        $('#sed_year-tf').removeAttr("disabled")
    }
    if ($('#chauffeur_license_attachment-tf').attr("disabled") === 'disabled') {
        $('#chauffeur_license_attachment-tf').removeAttr("disabled")
    }

    $('#Chauffeur_License_File').removeClass('hide');
    $('#document-form-chauffeur-btn2').removeClass('hide');
    $('#document-form-chauffeur-cancel').removeClass('hide');
    $('#document-form-chauffeur-edit').addClass('hide');

    var dv = new DriverDocumentValidator();
    dv.hideProfileUpdateMSG();

    if($('#chauffeur_license_attached').text() == 'View' || contains($('#chauffeur_license_link').html(),'View')){
        $('#chauffeur_license_file_name').removeClass('hide');
        $('#Remove_Chauffeur_License').removeClass('hide');
    }
});

function contains(r,s){
    if(r != 'undefined')
        return r.indexOf(s) !== -1;
}

$('#document-form-chauffeur-cancel').click(function()
{
    /* View File Upload with file name */
    $('#Chauffeur_License_File').attr('display','none');

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

    var dv = new DriverDocumentValidator();
    dv.hideProfileUpdateMSG();
});


$('#document-form-driver-edit').click(function()
{
    if ( $('#driver_license_no-tf').attr( "disabled" ) === 'disabled' ) {
        $('#driver_license_no-tf').removeAttr( "disabled" )
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
    if ( $('#driver_license_attachment-tf').attr( "disabled" ) === 'disabled' ) {
        $('#driver_license_attachment-tf').removeAttr( "disabled" )
    }

    $('#Driver_License_File').removeClass('hide');
    $('#document-form-driver-btn2').removeClass('hide');
    $('#document-form-driver-cancel').removeClass('hide');
    $('#document-form-driver-edit').addClass('hide');

    var dv = new DriverDocumentValidator();
    dv.hideDriverUpdateMSG();

    if($('#driver_license_attached').text() == 'View' || contains($('#driver_license_link').html(),'View')){
        $('#driver_license_file_name').removeClass('hide');
        $('#Remove_Driver_License').removeClass('hide');
    }

});

$('#document-form-driver-cancel').click(function()
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

    var dv = new DriverDocumentValidator();
    dv.hideDriverUpdateMSG();

    /* View File Upload with file name */
    $('#Driver_License_File').show();
});