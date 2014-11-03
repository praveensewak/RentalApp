/**
 * Created by Asif on 9/11/2014.
 */

var post_url = '/api/signup';

$(document).ready(function(){



    var av = new appDownloadLinkValidator();
    var sc = new appDownloadLinkController();
    var ev = new EmailValidator();



    $('#account-form').ajaxForm({url: '/api/app_download_link' ,dataType: 'json',
        beforeSubmit : function(formData, jqForm, options){
            return av.validateForm();
        },
        success	: function(responseText, status, xhr, $form){

            if (status == 'success') {
                var json = $.parseJSON(xhr.responseText);
                //var sc_success = new appDownloadLinkController(json.message);
                $('.modal-alert .modal-header h3').text('Success!');
                $('.modal-alert .modal-body p').html('App download link request has been forwarded.');
                $('.modal-alert').modal('show');
            }
        },
        error : function(e){
            var json = $.parseJSON(e.responseText);
            var e = [];
             e.push(json.message);
            sc.showError(e);
        }
    });
    $('#first_name-tf').focus();

// customize the account signup form //

    $('#account-form h1').text('Signup');
    $('#account-form #sub1').text('Please tell us a little about yourself');
    $('#account-form #sub2').text('Choose your username & password');
    $('#account-form-btn1').html('Cancel');
    $('#account-form-btn2').html('Submit');
    $('#account-form-btn2').addClass('btn-primary');

// setup the alert that displays when an account is successfully created //

    $('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static'});
    $('.modal-alert .modal-header h3').text('Success!');
    $('.modal-alert .modal-body p').html('App download link has been sent on your provided email address.');

    $('#phone_number-tf').mask('(000) 000-0000');
})