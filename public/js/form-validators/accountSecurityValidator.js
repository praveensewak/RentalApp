/**
 * Created by Asif on 8/27/2014.
 */

function AccountSecurityValidator(){

    // build array maps of the form inputs & control groups //
    this.formFields = [$('#current_password-tf'),$('#new_password-tf'), $('#confirm_password-tf')];
    this.controlGroups = [$('#current_password-cg'),$('#new_password-cg'), $('#confirm_password-cg')];

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
            return s.length >= 8;

    }

    this.showErrors = function(a)
    {
        var output = '<ul>';
        for (var i=0; i < a.length; i++) output += '<li>'+a[i]+'</li>';
        output += '</ul>';
        this.ShowAlert(output);
    }
}

AccountSecurityValidator.prototype.ShowAlert = function(m){
    this.retrieveMSGAlert.attr('class', 'alert alert-danger');
    this.retrieveMSGAlert.html(m);
    this.retrieveMSGAlert.fadeIn(15);
}

AccountSecurityValidator.prototype.showProfileUpdateSuccess = function(m){
    this.retrieveMSGAlert.attr('class', 'alert alert-success');
    this.retrieveMSGAlert.html(m);
    this.retrieveMSGAlert.fadeIn(15);
}

AccountSecurityValidator.prototype.hideProfileUpdateMSG = function(m){
    this.retrieveMSGAlert.html('');
    this.retrieveMSGAlert.hide();
}

AccountSecurityValidator.prototype.validateForm = function() {
    var e = [];
    //for (var i=0; i < this.controlGroups.length; i++) this.controlGroups[i].removeClass('has-error');
    if (this.validatePassword($('#current_password-tf').val()) == false) {
        e.push('Please Enter Your Valid Current Password');
    }
    if (this.validatePassword($('#new_password-tf').val()) == false) {
        e.push('Please Enter Your Valid New Password');
    }
    if (this.validatePassword($('#confirm_password-tf').val()) == false) {
        e.push('Please Confirm New Current Password');
    }

    if ($('#new_password-tf').val() === $('#confirm_password-tf').val()) {

    }
    else
    {
        e.push('New Password and Confirm Password does not match');
    }

    if (e.length > 0) this.showErrors(e);
    return e.length === 0;
}