/**
 * Created by Asif on 7/2/2014.
 */

function VerifyValidator(){

// bind a simple alert window to this controller to display any errors //

    this.verifyErrors = $('.modal-alert');
    this.verifyErrors.modal({ show : false, keyboard : true, backdrop : true });

    this.showVerifyError = function(t, m)
    {
        $('.modal-alert .modal-header h3').text(t);
        $('.modal-alert .modal-body p').text(m);
        this.verifyErrors.modal('show');
    }

// build array maps of the form inputs & control groups //

    this.formFields = [$('#registration_code-tf')];
    this.controlGroups = [$('#registration_code-cg')];

// bind the form-error modal window to this controller to display any errors //

    this.alert = $('.modal-form-errors');
    this.alert.modal({ show : false, keyboard : true, backdrop : true});

    this.validateRegistrationCode = function(s)
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

VerifyValidator.prototype.showInvalidRegistrationCode = function()
{
    this.controlGroups[0].addClass('error');
    this.showErrors(['Invalid registration code or token.']);
}

VerifyValidator.prototype.generalError = function()
{
    this.showErrors(['Processing error, Please retry later.']);
}

VerifyValidator.prototype.validateForm = function()
{
    var e = [];
    for (var i=0; i < this.controlGroups.length; i++) this.controlGroups[i].removeClass('error');
    if (this.validateRegistrationCode(this.formFields[0].val()) == false) {
        this.controlGroups[0].addClass('error'); e.push('Please enter validation code');
    }
    if (e.length) this.showErrors(e);
    return e.length === 0;
}