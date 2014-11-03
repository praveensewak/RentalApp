/**
 * Created by Asif on 7/12/2014.
 */
function DriverSignupController(code) {
    if ($('#registration_token').val() != '' && $('#_id').val() != '') {
        post_url = '/api/updatesignup';
        $('#email-tf').attr("disabled", "disabled");
        $('#password-tf').attr("disabled", "disabled");
    }

// redirect to homepage when cancel button is clicked //
    $('#account-form-btn1').click(function () {
        window.location.href = '/';
    });

// redirect to homepage on new account creation, add short delay so user can read alert window //
    $('.modal-alert #ok').click(
        function () {
            var navigate_to = "verify";
            //if($("#fra").val() == 'true')
            //var navigate_to = "verify_existing";
            setTimeout(function () {
                window.location.href = '/' + navigate_to + '/' + code;
            }, 150)
        });

    $('#get-credentials').on('shown', function () {
        $('#email-tf').focus();
    });
}