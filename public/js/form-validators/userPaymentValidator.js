/**
 * Created by Asif on 7/26/2014.
 */

function UserPaymentValidator(){

    // build array maps of the form inputs & control groups //
    this.formFields = [$('#card_hoder_name-tf'),$('#card_number-tf'), $('#expiry_date-tf'),$('#cvv_number-tf'), $('#zip_code-tf')];
    this.controlGroups = [$('#card_hoder_name-cg'),$('#card_number-cg'), $('#expiry_date-cg'),$('#cvv_number-cg'), $('#zip_code-cg')];

    // bind the form-error modal window to this controller to display any errors //
    this.alert = $('.modal-form-errors');
    this.alert.modal({ show : false, keyboard : true, backdrop : true});

    this.validateCardHolderName = function(s)
    {
        return s.length >= 1;
    }

    this.validateCardNumber = function(s)
    {
        return s.length >= 15;
    }

    this.validateExpiryDate = function(s)
    {
        return s.length >= 1;
    }

    this.validateCVVNumber = function(s)
    {
        return s.length >= 1;
    }

    this.validateZipCode = function(s)
    {
        return s.length >= 1;
    }

    this.showErrors = function(a)
    {

        var output = '<ul>';
        for (var i=0; i < a.length; i++) output += '<li>'+a[i]+'</li>';
        output += '</ul>';
        this.showUserPaymentAlertOnPopup(output);
/*        $('.modal-form-errors .modal-body p').text('Please correct the following problems :');
        var ul = $('.modal-form-errors .modal-body ul');
        ul.empty();
        for (var i=0; i < a.length; i++) ul.append('<li>'+a[i]+'</li>');
        this.alert.modal('show');*/
    }

    // bind this to _local for anonymous functions //
    var _local = this;

    // modal window to allow users to request credentials by email //
    _local.retrievePassword = $('#update-payment');
    _local.retrievePassword.modal({ show : false, keyboard : true, backdrop : true });
    _local.retrievePasswordAlert = $('#update-payment .alert');
    _local.retrievePassword.on('show', function(){
        $('#update-payment-form').resetForm(); _local.retrievePasswordAlert.hide();
    });

    _local.retrieveMSG = $('#update-payment-MSG');
    _local.retrieveMSGAlert = $('#update-payment-MSG .alert');
    _local.retrieveMSG.on('show', function(){ _local.retrieveMSGAlert.hide(); });

}

UserPaymentValidator.prototype.validateUserPayment = function(e)
{
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(e);
}

UserPaymentValidator.prototype.showUserPaymentAlert = function(m)
{
    this.retrievePasswordAlert.attr('class', 'alert alert-danger');
    this.retrievePasswordAlert.html(m);
    this.retrievePasswordAlert.fadeIn(15);
}

UserPaymentValidator.prototype.hideUserPaymentAlert = function()
{
    //this.retrievePasswordAlert.hide();
    this.retrievePasswordAlert.hide();
}

UserPaymentValidator.prototype.showUserPaymentAlertOnPopup = function(m)
{
    this.retrievePasswordAlert.attr('class', 'alert alert-danger');
    this.retrievePasswordAlert.html(m);
    this.retrievePasswordAlert.show();
}

UserPaymentValidator.prototype.hideUserPaymentAlertOnPopup = function(m)
{
    this.retrievePasswordAlert.hide();
}

UserPaymentValidator.prototype.showUserPaymentSuccess = function(m)
{
    this.retrieveMSGAlert.attr('class', 'alert alert-success');
    this.retrieveMSGAlert.html(m);
    this.retrieveMSGAlert.fadeIn(15);
}

UserPaymentValidator.prototype.validateForm = function()
{
    var e = [];
    for (var i=0; i < this.controlGroups.length; i++) this.controlGroups[i].removeClass('error');
    if (this.validateCardHolderName(this.formFields[0].val()) == false) {
        this.controlGroups[0].addClass('error'); e.push('Please enter card holder name');
    }
    if (this.validateCardNumber(this.formFields[1].val()) == false) {
        this.controlGroups[1].addClass('error'); e.push('Please enter card number');
    }
    if (this.validateExpiryDate(this.formFields[2].val()) == false) {
        this.controlGroups[2].addClass('error'); e.push('Please enter expiry date');
    }
    if (this.validateCVVNumber(this.formFields[3].val()) == false) {
        this.controlGroups[3].addClass('error'); e.push('Please enter cvv code');
    }
    if (this.validateZipCode(this.formFields[4].val()) == false) {
        this.controlGroups[4].addClass('error'); e.push('Please enter zip code');
    }
    if (e.length) this.showErrors(e);
    return e.length === 0;
}