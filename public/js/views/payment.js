var account_creation_message = '';


$(document).ready(function(){

    try{
        $("#card_number-tf").validateCreditCard(function(e) {
                var reg = new RegExp("^[0-9]");
                if(reg.test($("#card_number-tf").val())) {
                    if (e.card_type) {
                        $("#card_number-tf").addClass(e.card_type.name);
                        $("#type").val(e.card_type.name);
                    }
                    else {
                        $("#card_number-tf").removeClass();
                        $("#card_number-tf").addClass('card_number-tf form-control');
                    }
                }
                else
                {
                    var newval = $("#card_number-tf").val().replace(/[^0-9.]/g, "");
                    $("#card_number-tf").val(newval);
                }
            }                       // addClass(e.card_type.name)
            ,
            {accept:["visa","visa_electron","mastercard","maestro","discover"]});

    }
    catch (e)
    {

    }

    //$('#card_number-tf').mask('0000 0000 0000 0000');
    $('#zip_code-tf').mask('00000-000');
    $('#cvv_number-tf').mask('0000');
    $('#expiry_date-tf').mask('00/0000');

    var pv = new PaymentValidator();
    var pc = new PaymentController();

    var token = getQueryParams(document.location);

    var options = {
        url: '/api/payment', type: 'post'
    };

    $('#payment-form').ajaxForm({url: '/api/payment',dataType: 'json',
        beforeSubmit : function(formData, jqForm, options){
            var is_default = true;
            formData.push({name:'is_default', value:is_default});
            formData.push({name:'registration_token', value:token})
            return pv.validateForm();
        },
        success	: function(responseText, status, xhr, $form){
            if (status == 'success') {
            var json = $.parseJSON(xhr.responseText);
            if(json.registration_status == 'registered')
                account_creation_message = 'Your registration is pending for taxi approval'
            else
                account_creation_message =   "Your payment information has been saved sucessfully.</br>Click OK to login to your account.";


                $('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static'});
                $('.modal-alert .modal-header h3').text('Success');
                $('.modal-alert .modal-body p').html(account_creation_message);
                $('.modal-alert').modal('show');

            }
        },
        error : function(e){
            var json = $.parseJSON(e.responseText);
            if (json.message == 'invalid-request'){
                pv.showInvalidToken();
            }	else{
                pv.generalError();
            }
        }
    });
    $('#card_hoder_name-tf').focus();

// customize the payment form //

    $('#payment-form h1').text('Payment Details');
    $('#payment-form #sub1').text('Please specify how you would like to pay for your rides');
    $('#payment-form #sub2').text('Enter payment details');
    $('#payment-form-btn1').html('Cancel');
    $('#payment-form-btn2').html('Submit');
    $('#payment-form-btn2').addClass('btn-primary');

// setup the alert that displays when an payment is successfully created //

    $('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static'});
    $('.modal-alert .modal-header h3').text('');
    $('.modal-alert .modal-body p').html('');

})


function getQueryParams(qs) {
    qsp = qs.pathname.split("/");
    return qsp[2];
}