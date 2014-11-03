/**
 * Created by Muhammad Mukarram on 8/31/2014.
 */

function DriverDocumentValidator(){

// build array maps of the form inputs & control groups //
//    this.formFields = [$('#first_name-tf'),$('#last_name-tf'), $('#phone_number-tf'),$('#email-tf'), $('#password-tf'), $('#chauffeur_license_no-tf'), $('#social_security_number-tf'), $('#taxi_company-tf'), $('#dob_month-tf'), $('#dob_day-tf'), $('#dob_year-tf'), $('#sed_month-tf'), $('#sed_day-tf'), $('#sed_year-tf')];
//    this.controlGroups = [$('#first_name-cg'),$('#last_name-cg'), $('#phone_number-cg'),$('#email-cg'), $('#password-cg'), $('#chauffeur_license_no-cg'), $('#social_security_number-cg'), $('#taxi_company-cg'), $('#dob_month-cg'), $('#dob_day-cg'), $('#dob_year-cg'), $('#sed_month-cg'), $('#sed_day-cg'), $('#sed_year-cg')];
// bind the form-error modal window to this controller to display any errors //

    this.alert = $('.modal-form-errors');
    this.alert.modal({ show : false, keyboard : true, backdrop : true});

    var _localChauffeur = this;
    _localChauffeur.retrieveMSG = $('#update-payment-MSG');
    _localChauffeur.retrieveMSGAlert = $('#update-payment-MSG .alert');
    _localChauffeur.retrieveMSG.on('show', function(){ _local.retrieveMSGAlert.hide(); });

    var _localDriver = this;
    _localDriver.retrieveDriverMSG = $('#update-driver-MSG');
    _localDriver.retrieveDriverMSGAlert = $('#update-driver-MSG .alert');
    _localDriver.retrieveDriverMSG.on('show', function(){ _local.retrieveDriverMSGAlert.hide(); });

    try {

        this.validateName = function(s)
        {
            return s.length >= 1;
        }

        this.validateDate = function(monthfield,dayfield,yearfield)
        {
            var dayobj = new Date(yearfield, monthfield-1, dayfield)
            if ((dayobj.getMonth()+1!=monthfield)||(dayobj.getDate()!=dayfield)||(dayobj.getFullYear()!=yearfield))
                return false
            else
                return true;
        }


        this.validatePassword = function(s)
        {
            // if user is logged in and hasn't changed their password, return ok
            if ($('#userId').val() && s===''){
                return true;
            }	else{
                return s.length >= 8;
            }
        }

        this.validateEmail = function(e)
        {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(e);
        }
    }
    catch (e)
    {

    }

    this.showErrors = function(i, a)
    {
        if(i===1){
            var output = '<ul>';
            for (var i=0; i < a.length; i++) output += '<li>'+a[i]+'</li>';
            output += '</ul>';
            this.ShowAlert(output);
        }else{
            var output = '<ul>';
            for (var i=0; i < a.length; i++) output += '<li>'+a[i]+'</li>';
            output += '</ul>';
            this.ShowDriverAlert(output);
        }
    }
    /*
     this.showErrors = function(a)
     {
     $('.modal-form-errors .modal-body p').text('Please correct the following problems :');
     var ul = $('.modal-form-errors .modal-body ul');
     ul.empty();
     for (var i=0; i < a.length; i++) ul.append('<li>'+a[i]+'</li>');
     this.alert.modal('show');
     }
     */
}

DriverDocumentValidator.prototype.ShowAlert = function(m){
    this.retrieveMSGAlert.attr('class', 'alert alert-danger');
    this.retrieveMSGAlert.html(m);
    this.retrieveMSGAlert.fadeIn(15);
}

DriverDocumentValidator.prototype.showProfileUpdateSuccess = function(m){
    this.retrieveMSGAlert.attr('class', 'alert alert-success');
    this.retrieveMSGAlert.html(m);
    this.retrieveMSGAlert.fadeIn(15);
}

DriverDocumentValidator.prototype.hideProfileUpdateMSG = function(m){
    this.retrieveMSGAlert.html('');
    this.retrieveMSGAlert.hide();
}

DriverDocumentValidator.prototype.showInvalidUserName = function(reg_token,status)
{

    this.controlGroups[2].addClass('has-error');
    if(status == 'complete'){
        this.showErrors(['This phone number is already registered with taxi.Please Note that if you proceed, Mobile Number will be removed from other acocunt <a class="force_register"  data-dismiss="modal" href="#"> Click here </a> to proceed with this number']);
    }
    else {
        this.showErrors(['This phone number is already registered with taxi.<a class="force_register" data-dismiss="modal" href="#"> Click here </a> to proceed with this number']);
    }
    $(".force_register").click(function() {
        $("#fra").val("true");
        $('#document-form-btn2').trigger('click');
    });
}

DriverDocumentValidator.prototype.showInvalidEmail = function()
{
    this.controlGroups[3].addClass('has-error');
    this.showErrors(['This email address is already registered with taxi. Please <a href="/">login</a> or <a  data-dismiss="modal" href="#" id="forgot-password">recover</a> password']);
    $('#forgot-password').click(function(){$('#get-credentials').modal('show');});
}

DriverDocumentValidator.prototype.ShowDriverAlert = function(m){
    this.retrieveDriverMSG.attr('class', 'alert alert-danger');
    this.retrieveDriverMSG.html(m);
    this.retrieveDriverMSG.fadeIn(15);
}

DriverDocumentValidator.prototype.showDriverUpdateSuccess = function(m){
    this.retrieveDriverMSG.attr('class', 'alert alert-success');
    this.retrieveDriverMSG.html(m);
    this.retrieveDriverMSG.fadeIn(15);
}

DriverDocumentValidator.prototype.hideDriverUpdateMSG = function(m){
    this.retrieveDriverMSG.html('');
    this.retrieveDriverMSG.hide();
}


DriverDocumentValidator.prototype.validateChauffeurForm = function()
{
    var e = [];
    //for (var i=0; i < this.controlGroups.length; i++) this.controlGroups[i].removeClass('has-error');

    if($('#taxi_company-tf').val() == ''){
        e.push('Please Select Affiliate');
    }
    if (this.validateName($('#chauffeur_license_no-tf').val()) == false) {
        e.push('Please Enter Chauffeur License Number');
    }
    if (this.validateName($('#chauffeur_license_state-tf').val()) == false) {
        e.push('Please Enter Chauffeur License State');
    }
    if (this.validateName($('#chauffeur_license_city-tf').val()) == false) {
        e.push('Please Enter Chauffeur License City');
    }

    var sed_date_part_validated = true;

    if ($('#sed_month-tf').val() == '') {
        sed_date_part_validated = false;
        e.push('Please Select Valid Chauffeur Licence Expiry Month');
    }
    if ($('#sed_day-tf').val() == '') {
        sed_date_part_validated = false;
        e.push('Please Select Valid Chauffeur Licence Expiry Day');
    }
    if ($('#sed_year-tf').val() == '') {
        sed_date_part_validated = false;
        e.push('Please Select Valid Chauffeur Licence Expiry Year');
    }
    if(sed_date_part_validated) {
        if (this.validateDate($('#sed_month-tf').val(), $('#sed_day-tf').val(), $('#sed_year-tf').val()) == false) {
            e.push('Please Select Valid Chauffeur Licence Expiry Date');
        }
     }

    if (e.length) this.showErrors(1,e);
    return e.length === 0;
}

DriverDocumentValidator.prototype.validateLicenseForm = function()
{
    var e = [];
    //for (var i=0; i < this.controlGroups.length; i++) this.controlGroups[i].removeClass('has-error');

    if (this.validateName($('#driver_license_no-tf').val()) == false) {
        e.push('Please Enter Driver License Number');
    }

    var led_date_part_validated = true;
    if ($('#led_month-tf').val() == '') {
        led_date_part_validated = false;
        e.push('Please Select Valid Driver Licence Expiry Month');
    }
    if ($('#led_day-tf').val() == '') {
        led_date_part_validated = false;
        e.push('Please Select Valid Driver Licence Expiry Day');
    }
    if ($('#led_year-tf').val() == '') {
        led_date_part_validated = false;
        e.push('Please Select Valid Driver Licence Expiry Year');
    }
    if(led_date_part_validated) {
        if (this.validateDate($('#led_month-tf').val(), $('#led_day-tf').val(), $('#led_year-tf').val()) == false) {
            e.push('Please Select Valid Driver Licence Expiry Date');
        }
    }
    if (e.length) this.showErrors(2,e);
    return e.length === 0;
}