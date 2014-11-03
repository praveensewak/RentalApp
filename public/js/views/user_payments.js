    /**
     * Created by Asif on 7/25/2014.
     */

    $(document).ready(function(){

        $("#card_number-tf").numeric();

        $("#card_number-tf").validateCreditCard(function(e)
        {
            var reg = new RegExp("^[0-9]");
            if(reg.test($("#card_number-tf").val()))
            {
               if (e.card_type)
               {
                   $("#card_number-tf").addClass(e.card_type.name);
                   $("#update-payment #type").val(e.card_type.name);
               }else{
                   $("#card_number-tf").removeClass();
                   $("#card_number-tf").addClass('card_number-tf form-control');
               }
            }
            else
            {
               var newval = $("#card_number-tf").val().replace(/[^0-9.]/g, "");
               $("#card_number-tf").val(newval);
            }
           // addClass(e.card_type.name)
        },{accept:["visa","visa_electron","mastercard","maestro","discover","amex"]});

        //$('#card_number-tf').mask('0000 0000 0000 0000');
        var hc = new HomeController();
        var upv = new UserPaymentValidator();

        load_page();

        $('#link_add_new').click(function()
        {
            document.body.style.cursor='wait';
            $.ajax({
                url: '/api/GetUserProfile',
                type: 'GET',
                dataType: 'json',
                success: function(data) {
                    $("#update-payment #card_hoder_name-tf").val(data.user.first_name);
                    $("#update-payment #card_hoder_last_name-tf").val(data.user.last_name);
                },
                error: function(jqXHR){
                    $("#update-payment #card_hoder_name-tf").val('');
                    $("#update-payment #card_hoder_last_name-tf").val('');
                }
            });

            $("#update-payment #card_number-tf").val('');
            $("#update-payment #expiry_date-tf").val('');
            $("#update-payment #cvv_number-tf").val('');
            $("#update-payment #zip_code-tf").val('');
            $("#update-payment #userpaymentId").val('');
            $("#update-payment #_id").val('');
            $("#update-payment #card_use_type-tf").val('');
            $("#update-payment #type").val('');
            $("#update-payment #isdefault-tf").prop("checked", false);

            if ( $('#card_hoder_name-tf').attr( "disabled" ) === 'disabled' ) {
                $('#card_hoder_name-tf').removeAttr( "disabled" )
            }
            if ( $('#card_hoder_last_name-tf').attr( "disabled" ) === 'disabled' ) {
                $('#card_hoder_last_name-tf').removeAttr( "disabled" )
            }
            if ( $('#card_number-tf').attr( "disabled" ) === 'disabled' ) {
                $('#card_number-tf').removeAttr( "disabled" )
            }

            $("#card_number-tf").removeClass();
            $("#card_number-tf").addClass('card_number-tf form-control');

            $('#addnew').removeClass( "hide" );
            $('#submit').addClass( "hide" );
            upv.hideUserPaymentAlert();
            $('#update-payment .modal-header h4').text('Add new payment method');
            $('#update-payment').modal('show');
            document.body.style.cursor='default';
        });

        $('#set_cash_default').click(function(){
            var  form_data = $('#update-payment-form').serializeArray();
                form_data.push({name:'is_cash_default', value:true});
            $.ajax({
                url: '/api/passenger_detail/cash_payment',
                type: 'PUT',
                data: form_data,
                beforeSend: function(){

                },
                success: function(data) {
                    $('#remove_cash_default').removeClass( "hide" );
                    $('#set_cash_default').addClass( "hide" );
                    load_page();
                },
                error : function()
                {
                    upv.showUserPaymentAlert("Sorry. There was a problem, please try again later.");
                }
            });
        });

        $('#remove_cash_default').click(function(){
            var  form_data = $('#update-payment-form').serializeArray();
            form_data.push({name:'is_cash_default', value:false});
            $.ajax({
                url: '/api/passenger_detail/cash_payment',
                type: 'PUT',
                data: form_data,
                beforeSend: function(){

                },
                success: function(data) {
                    $('#set_cash_default').removeClass( "hide" );
                    $('#remove_cash_default').addClass( "hide" );
                },
                error : function(){
                    upv.showUserPaymentAlert("Sorry. There was a problem, please try again later.");
                }
            });
        });


        $('#submit').click(function(){
            document.body.style.cursor='wait';
            var is_default = false;
            if($("#isdefault-tf").is(':checked'))
                is_default = true; // checked
            var  form_data = $('#update-payment-form').serializeArray();
            form_data.push({name:'is_default', value:is_default});
                $.ajax({
                    url: '/api/userpayment',
                    type: 'PUT',
                    data: form_data,
                    beforeSend: function(){
                        return upv.validateForm();
                    },
                    success: function(data) {
                        $('#update-payment').modal('hide');
                        load_page();
                        upv.showUserPaymentSuccess("Payment Option ending in " + data.card_number + " updated Successfully.");
                        //$('#lblMSG').html("Payment information updated successfully.");
                    },
                    error : function(){
                        upv.showUserPaymentAlert("Sorry. There was a problem, please try again later.");
                        //$('#lblMSG').html("Sorry. There was a problem, please try again later.");
                    }
                });
            document.body.style.cursor='default';
        });

        $('#addnew').click(function(evt) {
            var is_default = false;
            if($("#isdefault-tf").is(':checked'))
                is_default = true; // checked
            var  form_data = $('#update-payment-form').serializeArray();
            form_data.push({name:'is_default', value:is_default});
            document.body.style.cursor='wait';
            $.ajax({
                url: '/api/userpayment',
                type: 'POST',
                data: form_data,
                beforeSend: function(){
                    return upv.validateForm();
                },
                success: function (data) {
                    $('#update-payment').modal('hide');
                    load_page();
                    upv.showUserPaymentSuccess("Payment Option ending in " + data.card_number + " added Successfully.");
                },
                error : function(){
                    upv.showUserPaymentAlert("Sorry. There was a problem, please try again later.");
                }
            });
            document.body.style.cursor='default';
        });

        /*
         $('#update-payment-form').ajaxForm({
         url: '/api/userpayment',type:'POST',
         beforeSubmit : function(formData, jqForm, options){
         upv.hideUserPaymentAlert();
         formData.push({name:'user_id', value:$("#userId").val()})

         return upv.validateForm();
         },
         success	: function(responseText, status, xhr, $form){
         upv.showUserPaymentSuccess("Payment information updated successfully.");
         load_page();
         },
         error : function(){
         upv.showUserPaymentAlert("Sorry. There was a problem, please try again later.");
         }
         });
         */
    });

    var userpayments_all = null;

    function load_page(){

        $('#card_number-tf').mask('0000 0000 0000 0000');
        $('#zip_code-tf').mask('00000-000');
        $('#cvv_number-tf').mask('0000');
        $('#expiry_date-tf').mask('00/0000');

        var upv = new UserPaymentValidator();
        upv.hideUserPaymentAlert();
        upv.hideUserPaymentAlertOnPopup();

        var user_id = $('#user_id').val();
        document.body.style.cursor='wait';

        $.ajax({
            url: '/api/userpayment/'+user_id,
            type: 'GET',
            dataType: 'json',
            success: function(data){
                userpayments_all = data;
                var i=0;
                var counter=1;
                var content = '';
                for (i=0;i<data.length;i++)
                {
                    //console.log (data[i].card_number + " (" + data[i].expiry_date + "): " + data[i].cvv_number);
                    content += '<tr id="' + data[i]._id + '">';
                    content += '<td style="width:10px;">' + counter + '</td>';
                    content += '<td style="width:250px;">' + data[i].cardholder_first_name + '</td>';
                    content += '<td style="width:250px;">' + data[i].cardholder_last_name + '</td>';
                    content += '<td style="padding-left:50px;" class="card_number-row '+data[i].type+'"> **** **** **** ' + data[i].card_number + '</td>';
                    content += '<td class="action-row"><a href="#" title="edit" id="'+data[i]._id+'" class="edit">  <i class="glyphicon glyphicon-edit glyphicon-large glyphicon-white"></i></a> <a href="#" title="delete" id="'+data[i]._id+'" class="delete"><i class="glyphicon glyphicon-remove-sign glyphicon-large glyphicon-white"></i></a></td>';
                    content += '</tr>';
                    counter++;
                    if(data[i].is_default.toLowerCase() == "true" )
                    {
                        $('#set_cash_default').removeClass( "hide" );
                        $('#remove_cash_default').addClass( "hide" );
                    }
                }

                $('#user_payments_container tbody').html(content);

                $('.edit').click(function(){
                    userpayment = getObjects(userpayments_all, '_id', this.id);
                    $("#update-payment #card_hoder_name-tf").val( userpayment[0].cardholder_first_name );
                    $("#update-payment #card_hoder_last_name-tf").val( userpayment[0].cardholder_last_name );
                    $("#update-payment #card_number-tf").val( '**** **** **** '+userpayment[0].card_number );
                    $("#update-payment #expiry_date-tf").val( userpayment[0].expiry_date );
                    $("#update-payment #cvv_number-tf").val( userpayment[0].cvv_number );
                    $("#update-payment #zip_code-tf").val( userpayment[0].zip_code );
                    $("#update-payment #userpaymentId").val( userpayment[0]._id );
                    $("#update-payment #_id").val( userpayment[0]._id );
                    $("#update-payment #card_use_type-tf").val(userpayment[0].card_use_type);
                    $("#update-payment #type").val(userpayment[0].type);
                    if(userpayment[0].is_default == 'true')
                    $("#isdefault-tf").prop("checked", true);
                    else
                    $("#isdefault-tf").prop("checked", false);

                    $('#card_hoder_name-tf').attr( "disabled", "disabled" );
                    $('#card_hoder_last_name-tf').attr( "disabled", "disabled" );
                    $('#card_number-tf').attr( "disabled", "disabled" );

                    $("#card_number-tf").removeClass();
                    $("#card_number-tf").addClass('card_number-tf form-control');
                    $("#card_number-tf").addClass(userpayment[0].type);

                    $('#submit').removeClass( "hide" );
                    $('#addnew').addClass( "hide" );
                    $('#update-payment .modal-header h4').text('Update payment details');
                    $('#update-payment').modal('show');

                    var upv = new UserPaymentValidator();
                    upv.hideUserPaymentAlert();
                    upv.hideUserPaymentAlertOnPopup();
                });

                // confirm account deletion //
                $('.delete').click(function(){
                    $('#confirmed_object').val(this.id);
                    $('.modal-confirm3 .modal-header h3').text('Delete confirmation!');
                    $('.modal-confirm3 .modal-body p').html('Are you really want to delete this payment method.');
                    $('.modal-confirm3').modal('show')
                    var upv = new UserPaymentValidator();
                    upv.hideUserPaymentAlert();
                    upv.hideUserPaymentAlertOnPopup();
                });

                // handle account deletion //
                $('.modal-confirm3 .submit').click(
                    function(){
                        delete_user_payment_method($('#confirmed_object').val())
                    });
            },
            error: function(jqXHR){
                console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
            }
        });
        document.body.style.cursor='default';
    }

    function delete_user_payment_method(conf_obj_id)
    {
        $.ajax({
            url: '/api/payment',
            type: 'DELETE',
            data: { _id: conf_obj_id },
            success: function(data) {
                load_page();
                var upv = new UserPaymentValidator();
                upv.showUserPaymentSuccess("Payment Option ending in " + data.card_number + " deleted Successfully.");
            }
        });
    }