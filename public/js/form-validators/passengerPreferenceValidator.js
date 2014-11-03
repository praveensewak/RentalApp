/**
 * Created by Asif on 8/23/2014.
 */

function PassengerPreference(){

// build array maps of the form inputs & control groups //

    this.formFields = [$('#tip-tf'),$('#favourite_affiliate-tf')];
    this.controlGroups = [$('#tip-cg'),$('#favourite_affiliate-cg')];

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

PassengerPreference.prototype.showInvalidUserName = function(reg_token,status)
{

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

PassengerPreference.prototype.showInvalidEmail = function()
{
    this.controlGroups[3].addClass('error');
    this.showErrors(['This email address is already registered with taxi. Please <a href="/">login</a> or <a  data-dismiss="modal" href="#" id="forgot-password">recover</a> password']);
    $('#forgot-password').click(function(){$('#get-credentials').modal('show');});
}

PassengerPreference.prototype.ShowAlert = function(m){
    this.retrieveMSGAlert.attr('class', 'alert alert-danger');
    this.retrieveMSGAlert.html(m);
    this.retrieveMSGAlert.fadeIn(15);
}

PassengerPreference.prototype.showProfileUpdateSuccess = function(m){
    this.retrieveMSGAlert.attr('class', 'alert alert-success');
    this.retrieveMSGAlert.html(m);
    this.retrieveMSGAlert.fadeIn(15);
}

PassengerPreference.prototype.hideProfileUpdateMSG = function(m){
    this.retrieveMSGAlert.html('');
    this.retrieveMSGAlert.hide();
}

PassengerPreference.prototype.validateForm = function()
{
    var e = [];
    for (var i=0; i < this.controlGroups.length; i++) this.controlGroups[i].removeClass('error');
    if (this.validateName($("#tip-tf").val()) == false) {
        e.push('Please Select Tip Percentage');
    }
    if (this.validateName($("#tip-tf").val()) == false) {
        e.push('Please Select Favourite Affiliate');
    }
    if (e.length) this.showErrors(e);
    return e.length === 0;
}

