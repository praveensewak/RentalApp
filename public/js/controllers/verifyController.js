/**
 * Created by Asif on 7/2/2014.
 */

function VerifyController(code,user_type)
{
    var navigate_to = '/';
    if(user_type == 'passenger')
        navigate_to = '/payment/'+code;
// redirect to homepage when cancel button is clicked //
    $('#account-form-btn1').click(function(){ window.location.href = '/';});



// redirect to homepage on new account creation, add short delay so user can read alert window //
    $('.modal-alert #ok').click(function(){ setTimeout(function(){window.location.href = navigate_to;}, 150)});
}
