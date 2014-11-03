/**
 * Created by Asif on 9/3/2014.
 */

function AccountValidator(){

    // build array maps of the form inputs & control groups //
    this.formFields = [$('#bank_name-tf'),$('#bank_routing_number-tf'), $('#bank_account_number-tf'),$('#verify_bank_account_number-tf'), $('#bank_phone_number-tf'), $('#bank_contact_person-tf'), $('#notes-tf')];
    this.controlGroups = [$('#bank_name-cg'),$('#bank_routing_number-cg'), $('#bank_account_number-cg'),$('#verify_bank_account_number-cg'), $('#bank_phone_number-cg'), $('#bank_contact_person-cg'), $('#notes-cg')];

    // bind the form-error modal window to this controller to display any errors //
    this.alert = $('.modal-form-errors');
    this.alert.modal({ show : false, keyboard : true, backdrop : true});

    var _local = this;
    _local.retrieveMSG = $('#update-payment-MSG');
    _local.retrieveMSGAlert = $('#update-payment-MSG .alert');
    _local.retrieveMSG.on('show', function(){ _local.retrieveMSGAlert.hide(); });

    this.validateName = function(s)
    {
        return s.length >= 1;
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
        var output = '<ul>';
        for (var i=0; i < a.length; i++) output += '<li>'+a[i]+'</li>';
        output += '</ul>';
        this.ShowAlert(output);
    }
}

AccountValidator.prototype.ShowAlert = function(m){
    this.retrieveMSGAlert.attr('class', 'alert alert-danger');
    this.retrieveMSGAlert.html(m);
    this.retrieveMSGAlert.fadeIn(15);
}

AccountValidator.prototype.showProfileUpdateSuccess = function(m){
    this.retrieveMSGAlert.attr('class', 'alert alert-success');
    this.retrieveMSGAlert.html(m);
    this.retrieveMSGAlert.fadeIn(15);
}

AccountValidator.prototype.hideProfileUpdateMSG = function(m){
    this.retrieveMSGAlert.html('');
    this.retrieveMSGAlert.hide();
}

AccountValidator.prototype.showInvalidUserName = function(reg_token,status){

    this.controlGroups[2].addClass('error');
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

AccountValidator.prototype.showInvalidEmail = function(){
    this.controlGroups[3].addClass('error');
    this.showErrors(['This email address is already registered with taxi. Please <a href="/">login</a> or <a  data-dismiss="modal" href="#" id="forgot-password">recover</a> password']);
    $('#forgot-password').click(function(){$('#get-credentials').modal('show');});
}

AccountValidator.prototype.validateForm = function() {
    var e = [];
    //for (var i=0; i < this.controlGroups.length; i++) this.controlGroups[i].removeClass('has-error');
    if (this.validateName($('#bank_name-tf').val()) == false) {
        e.push('Please Enter Bank Name');
    }
    if (this.validateName($('#bank_routing_number-tf').val()) == false) {
        e.push('Please Enter Bank Routing Number');
    }
    if (this.validateName($('#bank_account_number-tf').val()) == false) {
        e.push('Please Enter Bank Account Number');
    }
    if (this.validateName($('#verify_bank_account_number-tf').val()) == false) {
        e.push('Please Verify Account Number');
    }
    if ($('#bank_account_number-tf').val() === $('#verify_bank_account_number-tf').val()) {

    }
    else
    {
        e.push('Account number and verify account number does not match');
    }
    if (this.validateName($('#bank_phone_number-tf').val()) == false) {
        e.push('Please Enter Bank Phone Number');
    }
    if (this.validateName($('#bank_contact_person-tf').val()) == false) {
        e.push('Please Enter Bank Contact Person');
    }

    if (e.length > 0) this.showErrors(e);
    return e.length === 0;
}