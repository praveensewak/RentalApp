/**
 * Created by Asif on 9/11/2014.
 */


function appDownloadLinkValidator(){

    // build array maps of the form inputs & control groups //
    this.formFields = [$('#first_name-tf'),$('#last_name-tf'), $('#phone_number-tf'),$('#email-tf'), $('#password-tf')];
    this.controlGroups = [$('#first_name-cg'),$('#last_name-cg'), $('#phone_number-cg'),$('#email-cg'), $('#password-cg')];

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

appDownloadLinkValidator.prototype.ShowAlert = function(m){
    this.retrieveMSGAlert.attr('class', 'alert alert-danger');
    this.retrieveMSGAlert.html(m);
    this.retrieveMSGAlert.fadeIn(15);
}

appDownloadLinkValidator.prototype.showProfileUpdateSuccess = function(m){
    this.retrieveMSGAlert.attr('class', 'alert alert-success');
    this.retrieveMSGAlert.html(m);
    this.retrieveMSGAlert.fadeIn(15);
}

appDownloadLinkValidator.prototype.hideProfileUpdateMSG = function(m){
    this.retrieveMSGAlert.html('');
    this.retrieveMSGAlert.hide();
}

appDownloadLinkValidator.prototype.showInvalidUserName = function(reg_token,status){

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

appDownloadLinkValidator.prototype.showInvalidEmail = function(){
    this.controlGroups[3].addClass('error');
    this.showErrors(['This email address is already registered with taxi. Please <a href="/">login</a> or <a  data-dismiss="modal" href="#" id="forgot-password">recover</a> password']);
    $('#forgot-password').click(function(){$('#get-credentials').modal('show');});
}

appDownloadLinkValidator.prototype.validateForm = function() {
    var e = [];
    //for (var i=0; i < this.controlGroups.length; i++) this.controlGroups[i].removeClass('has-error');
    if (this.validateName($('#first_name-tf').val()) == false) {
        e.push('Please Enter Your First Name');
    }
    if (this.validateEmail($('#email_address-tf').val()) == false) {
        e.push('Please Enter A Valid Email');
    }
    if (this.validateName($('#state-tf').val()) == false) {
        e.push('Please Your State Name');
    }

    if (e.length > 0) this.showErrors(e);
    return e.length === 0;
}