/**
 * Created by Asif on 7/12/2014.
 */

function DriverAccountValidator(){

// build array maps of the form inputs & control groups //

    this.formFields = [$('#first_name-tf'),$('#last_name-tf'), $('#phone_number-tf'),$('#email-tf'), $('#password-tf'), $('#chauffeur_license_no-tf'), $('#social_security_number-tf'), $('#taxi_company-tf'), $('#dob_month-tf'), $('#dob_day-tf'), $('#dob_year-tf'), $('#sed_month-tf'), $('#sed_day-tf'), $('#sed_year-tf')];
    this.controlGroups = [$('#first_name-cg'),$('#last_name-cg'), $('#phone_number-cg'),$('#email-cg'), $('#password-cg'), $('#chauffeur_license_no-cg'), $('#social_security_number-cg'), $('#taxi_company-cg'), $('#dob_month-cg'), $('#dob_day-cg'), $('#dob_year-cg'), $('#sed_month-cg'), $('#sed_day-cg'), $('#sed_year-cg')];

// bind the form-error modal window to this controller to display any errors //

    this.alert = $('.modal-form-errors');
    this.alert.modal({ show : false, keyboard : true, backdrop : true});

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

    this.showErrors = function(a)
    {
        $('.modal-form-errors .modal-body p').text('Please correct the following problems :');
        var ul = $('.modal-form-errors .modal-body ul');
        ul.empty();
        for (var i=0; i < a.length; i++) ul.append('<li>'+a[i]+'</li>');
        this.alert.modal('show');
    }

}

DriverAccountValidator.prototype.showInvalidUserName = function(reg_token,status)
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
        $('#account-form-btn2').trigger('click');
    });
}

DriverAccountValidator.prototype.showInvalidEmail = function()
{
    this.controlGroups[3].addClass('has-error');
    this.showErrors(['This email address is already registered with taxi. Please <a href="/">login</a> or <a  data-dismiss="modal" href="#" id="forgot-password">recover</a> password']);
    $('#forgot-password').click(function(){$('#get-credentials').modal('show');});
}

DriverAccountValidator.prototype.validateForm = function()
{
    var e = [];
    for (var i=0; i < this.controlGroups.length; i++) this.controlGroups[i].removeClass('has-error');
    if (this.validateName(this.formFields[0].val()) == false) {
        this.controlGroups[0].addClass('has-error'); e.push('Please Enter Your First Name');
    }
    if (this.validateName(this.formFields[1].val()) == false) {
        this.controlGroups[1].addClass('has-error'); e.push('Please Enter Your Last Name');
    }
    if (this.validateName(this.formFields[2].val()) == false) {
        this.controlGroups[2].addClass('has-error'); e.push('Please Enter Phone Number');
    }
    if (this.validateEmail(this.formFields[3].val()) == false) {
        this.controlGroups[3].addClass('has-error'); e.push('Please Enter A Valid Email');
    }
    if (this.validatePassword(this.formFields[4].val()) == false) {
        this.controlGroups[4].addClass('has-error'); e.push('Password Should Be At Least 8 Characters');
    }
    if (this.validateName(this.formFields[5].val()) == false) {
        this.controlGroups[5].addClass('has-error'); e.push('Please Enter Valid Chauffeur License Number');
    }
    if (this.validateName(this.formFields[6].val()) == false) {
        this.controlGroups[6].addClass('has-error'); e.push('Please Enter Social Security Number');
    }
    if (this.validateName(this.formFields[7].val()) == false) {
        this.controlGroups[7].addClass('has-error'); e.push('Please Select Taxi Company');
    }

    var dob_date_part_validated = true;


    if (this.validateName(this.formFields[8].val()) == false) {
        var dob_date_part_validated = false;
        this.controlGroups[8].addClass('has-error'); e.push('Please Select Valid Date of Birth Month');
    }
    if (this.validateName(this.formFields[9].val()) == false) {
        var dob_date_part_validated = false;
        this.controlGroups[9].addClass('has-error'); e.push('Please Select Valid Date of Birth Day');
    }
    if (this.validateName(this.formFields[10].val()) == false) {
        var dob_date_part_validated = false;
        this.controlGroups[10].addClass('has-error'); e.push('Please Select Valid Date of Birth Year');
    }

    if(dob_date_part_validated)
    if (this.validateDate(this.formFields[8].val(),this.formFields[9].val(),this.formFields[10].val()) == false) {
        this.controlGroups[8].addClass('has-error');
        this.controlGroups[9].addClass('has-error');
        this.controlGroups[10].addClass('has-error');
        e.push('Please Select Valid Date of Birth');
    }

    var led_date_part_validated = true;

    if (this.validateName(this.formFields[11].val()) == false) {
        led_date_part_validated = false;
        this.controlGroups[11].addClass('has-error'); e.push('Please Select Valid Licence Expiry Month');
    }
    if (this.validateName(this.formFields[12].val()) == false) {
        led_date_part_validated = false;
        this.controlGroups[12].addClass('has-error'); e.push('Please Select Valid Licence Expiry Day');
    }
    if (this.validateName(this.formFields[13].val()) == false) {
        led_date_part_validated = false;
        this.controlGroups[13].addClass('has-error'); e.push('Please Select Valid Licence Expiry Year');
    }

    if(led_date_part_validated)
    if (this.validateDate(this.formFields[11].val(),this.formFields[12].val(),this.formFields[13].val()) == false) {
        this.controlGroups[11].addClass('has-error');
        this.controlGroups[12].addClass('has-error');
        this.controlGroups[13].addClass('has-error');
        e.push('Please Select Valid Licence Expiry Date');
    }



    if (e.length) this.showErrors(e);
    return e.length === 0;
}

