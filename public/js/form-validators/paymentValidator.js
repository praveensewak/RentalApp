
function PaymentValidator(){

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
        return s.length >= 1;
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
        $('.modal-form-errors .modal-body p').text('Please correct the following problems :');
        var ul = $('.modal-form-errors .modal-body ul');
        ul.empty();
        for (var i=0; i < a.length; i++) ul.append('<li>'+a[i]+'</li>');
        this.alert.modal('show');
    }

}

PaymentValidator.prototype.showInvalidUserName = function()
{
    this.controlGroups[2].addClass('error');
    this.showErrors(['This phone number is already in use.']);
}

PaymentValidator.prototype.showInvalidToken = function()
{
    //this.controlGroups[3].addClass('error');
    this.showErrors(['Invalid token.']);
}

PaymentValidator.prototype.generalError = function()
{
    this.showErrors(['Processing error, Please retry later.']);
}

PaymentValidator.prototype.validateForm = function()
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

	