    /**
     * Created by Mukarram on 9/2/2014.
     */


    $(document).ready(function()
    {

        var hc = new HomeController();

        $('#account-form').ajaxForm({url: '/api/profileDriverAdmin', type:'post',
            beforeSubmit : function(formData, jqForm, options)
            {
                formData.push({name:'date_of_birth', value:$("#dob_month-tf").val()+"-"+$("#dob_day-tf").val()+"-"+$("#dob_year-tf").val()});
                //alert($("#dob_month-tf").val()+"-"+$("#dob_day-tf").val()+"-"+$("#dob_year-tf").val());
                return validateForm();
            },
            success	: function(responseText, status, xhr, $form){
                if (status == 'success')
                    showProfileUpdate("Driver profile of " + responseText.first_name + " " + responseText.last_name + " has been updated successfully.");

                $('#modal-driver').modal('hide');

                _totalRecords = data[0].record_count;
                _pageIndex = 0;
                load_data(_users);
            },
            error : function(e)
            {
                var err = [];
                err.push(e.responseText);
            }
        });

        $('#btnFilter').click(function(){
            hideAlert();
            hideProfileUpdate();

            var  form_data = $('#driver_admin-form').serializeArray();
            form_data.push({ name:"pageSize", value: _pageSize });
            form_data.push({ name:"pageIndex", value: 0 });
            $.ajax({
                url: '/api/GetDriversAdmin',
                type: 'Get',
                data: form_data,
                success: function(data) {
                    _totalRecords = data[0].record_count;
                    _users = data;
                    load_data(_users);
                },
                error : function(){
                    //ShowAlert('Error while trying to get drivers information. Try again later');
                }
            });
        });

        $('#account-form-btnApprove').click(function(){
            hideAlert();
            hideProfileUpdate();

            var  form_data = $('#account-form').serializeArray();
            $.ajax({
                url: '/api/approveProfile',
                type: 'PUT',
                data: form_data,
                beforeSend: function(){

                },
                success: function(data) {
                    showProfileUpdate("Driver profile registration has been completed successfully.");
                    $('#modal-driver').modal('hide');
                    load_data(_users);
                },
                error : function(){
                    ShowAlert('Error while trying to approve driver. Try again later');
                }
            });
        });

        $("#PagingDropDown").on("change", function(e) {
            hideAlert();
            hideProfileUpdate();

            _pageIndex=0;
            _pageSize = parseInt(this.value);
            var  form_data = $('#driver_admin-form').serializeArray();
            $.ajax({
                url: '/api/GetDriversAdmin/',
                type: 'Get',
                data: form_data,
                success: function(data) {
                    _users = data;
                    load_data(_users);
                },
                error : function(){
                    //ShowAlert('Error while trying to get drivers information. Try again later');
                }
            });
        });

        load_page();

    });


    var _users = null;
    var _pageIndex = 0;
    var _pageSize = 20;
    var _totalRecords=0;

    function load_page(){
        $.ajax({
            url: '/api/GetDriversAdmin/',
            type: 'get',
            dataType: 'json',
            success: function(data) {
                _totalRecords = data[0].record_count;
                _users = data;
                load_data(data);
            },
            error: function(jqXHR){
                //alert(jqXHR.statusText);
                console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
            }
        });

    }

    function load_data(data)
    {
        var i = 0;
        var counter = 1;
        var content = '';
        var pagingcontent = '';
        var _numberofPages = _totalRecords / _pageSize;
        if(_numberofPages>1 && (_totalRecords % _pageSize)!= 0) _numberofPages++;

        if (_numberofPages > 1) {
            pagingcontent += '<span style="float:right;width:900px;text-align: right;padding-right:20px;padding-top:20px;">';
            for (i = 1; i <= _numberofPages; i++) {
                pagingcontent += '<a href="#" title="paging" id="'+(i-1)+'" class="paging">' + i + '</a>&nbsp;&nbsp;&nbsp;';
            }
            pagingcontent += '</span>';

            $('#paging').removeClass('hide');
            $('#paging').html(pagingcontent);
        }else
            $('#paging').addClass('hide');

        for (i=0;i<_pageSize;i++)
        {
            if(i<data.length) {
                content += '<tr id="' + data[i]._id + '">';
                content += '<td style="width:250px;"><a href="#" title="view" id="' + i + '" class="view">' + data[i].first_name + '</a></td>';
                content += '<td style="width:250px;"><a href="#" title="view" id="' + i + '" class="view">' + data[i].last_name + '</a></td>';
                content += '<td style="width:250px;">' + data[i].driverdetails.chauffeur_license_no + '</td>';
                content += '<td style="width:250px;">' + data[i].driverdetails.chauffeur_license_state + '</td>';
                content += '<td style="width:250px;">' + data[i].registration_status + '</td>';
                content += '<td class="action-row"><a href="#" title="view" id="' + i + '" class="view"><i class="glyphicon glyphicon-eye-open glyphicon-large glyphicon-white"></i></a><a href="#" title="edit" id="' + i + '" class="edit">  <i class="glyphicon glyphicon-edit glyphicon-large glyphicon-white"></i></a><a href="#" title="suspend" id="' + i + '" class="suspend">  <i class="glyphicon glyphicon-ban-circle glyphicon-large glyphicon-white"></i></a></td>';
                content += '</tr>';
                counter++;
            }
        }

        $('#drivers_admin_container tbody').html(content);

        $('.edit').click(function() {
            $('#account-form #social_security_number-tf').mask('000-00-0000');
            $('#account-form #zipcode-tf').mask('00000-000');

            $("#account-form #_i").val( this.id);
            $("#account-form #_id").val(data[this.id]._id);
            $("#account-form #first_name-tf").val(data[this.id].first_name);
            $("#account-form #last_name-tf").val(data[this.id].last_name);
            $("#account-form #social_security_number-tf").val(data[this.id].driverdetails.social_security_number);
            $("#account-form #driver_address1-tf").val(data[this.id].driverdetails.address1);
            $("#account-form #driver_address2-tf").val(data[this.id].driverdetails.address2);
            $("#account-form #city-tf").val(data[this.id].driverdetails.city);
            $("#account-form #state-tf").val(data[this.id].driverdetails.state);
            $("#account-form #zipcode-tf").val(data[this.id].driverdetails.zipcode);
            $("#account-form #phone_number-tf").val(data[this.id].phone_number);
            $("#account-form #email-tf").val(data[this.id].email);
            $("#account-form #hdn_image").val(data[this.id].driverdetails.user_image);
            if (data[this.id].driverdetails.date_of_birth != '')
            {
                populatedropdown("dob_day-tf", "dob_month-tf", "dob_year-tf", data[this.id].driverdetails.date_of_birth);
                $("#account-form #dob").val(data[this.id].driverdetails.date_of_birth);
            }

            if(data[this.id].driverdetails.user_image != 'undefined' && data[this.id].driverdetails.user_image != '')
                $("#imagePreviewProfile").css("background-image", "url('"+data[this.id].driverdetails.user_image+"')");
            else
                $("#imagePreviewProfile").css("background-image", "");

            enableFields();
            hideAlert();
            hideProfileUpdate();

            $("#account-form-btnUpdate").removeClass('hide');
            $("#account-form-btnApprove").addClass('hide');

            $('#modal-driver .modal-header h4').text('Driver Details.');
            $('#modal-driver').modal('show');
        });

        $('.view').click(function() {
            $("#account-form #_i").val( this.id);
            $("#account-form #_id").val(data[this.id]._id);
            $("#account-form #first_name-tf").val(data[this.id].first_name);
            $("#account-form #last_name-tf").val(data[this.id].last_name);
            $("#account-form #social_security_number-tf").val(data[this.id].driverdetails.social_security_number);
            $("#account-form #driver_address1-tf").val(data[this.id].driverdetails.address1);
            $("#account-form #driver_address2-tf").val(data[this.id].driverdetails.address2);
            $("#account-form #city-tf").val(data[this.id].driverdetails.city);
            $("#account-form #state-tf").val(data[this.id].driverdetails.state);
            $("#account-form #zipcode-tf").val(data[this.id].driverdetails.zipcode);
            $("#account-form #phone_number-tf").val(data[this.id].phone_number);
            $("#account-form #email-tf").val(data[this.id].email);
            $("#account-form #hdn_image").val(data[this.id].driverdetails.user_image);
            if (data[this.id].date_of_birth != '')
            {
                populatedropdown("dob_day-tf", "dob_month-tf", "dob_year-tf", data[this.id].driverdetails.date_of_birth);
                $("#account-form #dob").val(data[this.id].driverdetails.date_of_birth);
            }

            //alert(data[this.id].user_image);
            if(data[this.id].user_image != 'undefined' && data[this.id].driverdetails.user_image != '')
                $("#imagePreviewProfile").css("background-image", "url('"+data[this.id].driverdetails.user_image+"')");
            else
                $("#imagePreviewProfile").css("background-image", "");

            disableFields();
            hideAlert();
            hideProfileUpdate();

            $("#account-form-btnUpdate").addClass('hide');
            if(data[this.id].registration_status != 'complete')
                $("#account-form-btnApprove").removeClass('hide');
            else
                $("#account-form-btnApprove").addClass('hide');


            $('#modal-driver .modal-header h4').text('Driver Details.');
            $('#modal-driver').modal('show');
        });

        $('.suspend').click(function() {
            $('.modal-confirm3 .modal-header h3').text('Suspend Driver!');
            $('.modal-confirm3 .modal-body p').html('Function coming soon.');
            $('.modal-confirm3').modal('show')
        });

        $('.paging').click(function() {
            hideAlert();
            hideProfileUpdate();

            _pageIndex = parseInt(this.id);
            var  form_data = $('#driver_admin-form').serializeArray();
            form_data.push({ name:"pageIndex", value: this.id });
            $.ajax({
                url: '/api/GetDriversAdmin',
                type: 'Get',
                data: form_data,
                success: function(data) {
                    _users = data;
                    load_data(_users);
                },
                error : function(){
                    //ShowAlert('Error while trying to get drivers information. Try again later');
                }
            });
        });

    }


    function populatedropdown(dayfield, monthfield, yearfield,date){
        try{
            var d = new Date(date);
            $("#"+yearfield).val(d.getFullYear());
            $("#"+monthfield).val(d.getMonth()+1);
            $("#"+dayfield).val(d.getDate());
        }
        catch (e)
        {

        }
    }

    /*
     * Functions temporarily written for later on include in validator and controller
     */

    function enableFields()
    {
        if ( $('#first_name-tf').attr( "disabled" ) === 'disabled' ) {
            $('#first_name-tf').removeAttr( "disabled" )
        }
        if ( $('#last_name-tf').attr( "disabled" ) === 'disabled' ) {
            $('#last_name-tf').removeAttr( "disabled" )
        }
        if ( $('#driver_address1-tf').attr( "disabled" ) === 'disabled' ) {
            $('#driver_address1-tf').removeAttr( "disabled" )
        }
        if ( $('#driver_address2-tf').attr( "disabled" ) === 'disabled' ) {
            $('#driver_address2-tf').removeAttr( "disabled" )
        }
        if ( $('#city-tf').attr( "disabled" ) === 'disabled' ) {
            $('#city-tf').removeAttr( "disabled" )
        }
        if ( $('#state-tf').attr( "disabled" ) === 'disabled' ) {
            $('#state-tf').removeAttr( "disabled" )
        }
        if ( $('#zipcode-tf').attr( "disabled" ) === 'disabled' ) {
            $('#zipcode-tf').removeAttr( "disabled" )
        }
        if ( $('#social_security_number-tf').attr( "disabled" ) === 'disabled' ) {
            $('#social_security_number-tf').removeAttr( "disabled" )
        }
        if ( $('#dob_month-tf').attr( "disabled" ) === 'disabled' ) {
            $('#dob_month-tf').removeAttr( "disabled" )
        }
        if ( $('#dob_day-tf').attr( "disabled" ) === 'disabled' ) {
            $('#dob_day-tf').removeAttr( "disabled" )
        }
        if ( $('#dob_year-tf').attr( "disabled" ) === 'disabled' ) {
            $('#dob_year-tf').removeAttr( "disabled" )
        }
    }

    function disableFields()
    {
        $("#first_name-tf").attr("disabled", 'disabled');
        $("#last_name-tf").attr("disabled", 'disabled');
        $('#driver_address1-tf').attr("disabled", 'disabled');
        $('#driver_address2-tf').attr("disabled", 'disabled');
        $('#city-tf').attr("disabled", 'disabled');
        $('#state-tf').attr("disabled", 'disabled');
        $('#zipcode-tf').attr("disabled", 'disabled');
        $('#social_security_number-tf').attr("disabled", 'disabled');
        $('#dob_month-tf').attr("disabled", 'disabled');
        $('#dob_day-tf').attr("disabled", 'disabled');
        $('#dob_year-tf').attr("disabled", 'disabled');
    }

    function validateForm()
    {
        var e = [];

        if (validateName($('#first_name-tf').val()) == false) {
            e.push('Please Enter Your First Name');
        }
        if (validateName($('#last_name-tf').val()) == false) {
            e.push('Please Enter Your Last Name');
        }
        if (validateName($('#last_name-tf').val()) == false) {
            e.push('Please Enter Your Last Name');
        }

        if (validateName($('#social_security_number-tf').val()) == false) {
            e.push('Please Enter Your Social Security Number');
        }

        var dob_date_part_validated = true;

        if (validateName($('#dob_month-tf').val()) == false) {
            var dob_date_part_validated = false;
            e.push('Please Select Valid Date of Birth Month');
        }
        if (validateName($('#dob_day-tf').val()) == false) {
            var dob_date_part_validated = false;
            e.push('Please Select Valid Date of Birth Day');
        }
        if (validateName($('#dob_year-tf').val()) == false) {
            var dob_date_part_validated = false;
            e.push('Please Select Valid Date of Birth Year');
        }

        if (dob_date_part_validated) {
            if (validateDate($('#dob_month-tf').val(), $('#dob_day-tf').val(), $('#dob_year-tf').val()) == false) {
                e.push('Please Select Valid Date of Birth');
            }
        }

        if (validateName($('#phone_number-tf').val()) == false) {
            e.push('Please Enter Phone Number');
        }
        if (validateEmail($('#email-tf').val()) == false) {
            e.push('Please Enter A Valid Email');
        }

        if (e.length > 0) showErrors(e);
        return e.length === 0;

    }

    function validateName(s)
    {
        return s.length >= 1;
    }

    function validateEmail(e)
    {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(e);
    }

    function validateDate(monthfield,dayfield,yearfield)
    {
        var dayobj = new Date(yearfield, monthfield-1, dayfield)
        if ((dayobj.getMonth()+1!=monthfield)||(dayobj.getDate()!=dayfield)||(dayobj.getFullYear()!=yearfield))
            return false
        else
            return true;
    }

    function showErrors(a)
    {
        var output = '<ul>';
        for (var i=0; i < a.length; i++) output += '<li>'+a[i]+'</li>';
        output += '</ul>';
        this.ShowAlert(output);
    }

    function ShowAlert(m){
        $('#update-profile-Alert-MSG .alert').attr('class', 'alert alert-danger');
        $('#update-profile-Alert-MSG .alert').html(m);
        $('#update-profile-Alert-MSG .alert').fadeIn(15);
    }

    function hideAlert(m)
    {
        $('#update-profile-Alert-MSG .alert').html('');
        $('#update-profile-Alert-MSG .alert').hide();
    }


    function showProfileUpdate(m){
        $('#update-profile-MSG .alert').attr('class', 'alert alert-success');
        $('#update-profile-MSG .alert').html(m);
        $('#update-profile-MSG .alert').fadeIn(15);
    }

    function hideProfileUpdate(m)
    {
        $('#update-profile-MSG .alert').html('');
        $('#update-profile-MSG .alert').hide();
    }
