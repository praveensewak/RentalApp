/**
 * Created by Asif on 9/11/2014.
 */


function appDownloadLinkController(code)
{

// redirect to homepage when cancel button is clicked //
    $('#account-form-btn1').click(function(){ window.location.href = '/';});

// redirect to homepage on new account creation, add short delay so user can read alert window //
    $('.modal-alert #ok').click(

        function(){

            setTimeout(function(){window.location.href = '/'}, 150)});

}