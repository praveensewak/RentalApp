/**
 * Created by Mukarram on 9/6/2014.
 */


    $(document).ready(function()
    {
        var hc = new HomeController();

        $('#account-form #account-form-btnResetPassword').click(function(){
            hideAlert();
            showProfileUpdate("Password reset email has been sent to passenger.");
            var  form_data = $('#account-form').serializeArray();
            $.ajax({
                url: '/lost-password',
                type: 'put',
                data: form_data,
                success: function(status) {
                    $('#modal-passenger').modal('hide');
                },
                error : function(){
                    $('#modal-passenger').modal('hide');
                    //ShowAlert('Error while trying to send email. Please try again later');
                }
            });
        });

        $('#btnFilter').click(function(){
            hideAlert();
            hideProfileUpdate();

            var  form_data = $('#passenger_admin-form').serializeArray();
            form_data.push({ name:"pageSize", value: _pageSize });
            form_data.push({ name:"pageIndex", value: 0 });
            $.ajax({
                url: '/api/GetPassengersAdmin',
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

        $("#PagingDropDown").on("change", function(e) {
            hideAlert();
            hideProfileUpdate();

            _pageIndex=0;
            _pageSize = parseInt(this.value);
            var  form_data = $('#passenger_admin-form').serializeArray();
            $.ajax({
                url: '/api/GetPassengersAdmin',
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
            url: '/api/GetPassengersAdmin/',
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

        for (i=0;i<data.length;i++)
        {
            if(i<data.length) {
                content += '<tr id="' + data[i]._id + '">';
                content += '<td style="width:250px;"><a href="#" title="view" id="' + i + '" class="view">' + data[i].first_name + '</a></td>';
                content += '<td style="width:250px;"><a href="#" title="view" id="' + i + '" class="view">' + data[i].last_name + '</a></td>';
                content += '<td style="width:250px;">' + data[i].phone_number + '</td>';
                content += '<td style="width:250px;">' + data[i].email + '</td>';
                content += '<td style="width:150px;">' + data[i].registration_status + '</td>';
                content += '<td class="action-row" style="text-align:middle;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" title="view" id="' + i + '" class="view"><i class="glyphicon glyphicon-eye-open glyphicon-large glyphicon-white"></i></a></td>';
                content += '</tr>';
                counter++;
            }
        }

        $('#passengers_admin_container tbody').html(content);



        $('.view').click(function() {

            hideAlert();
            hideProfileUpdate();

            $("#account-form #_i").val( this.id);
            $("#account-form #_id").val(data[this.id]._id);
            $("#account-form #first_name-tf").val(data[this.id].first_name);
            $("#account-form #last_name-tf").val(data[this.id].last_name);
            $("#account-form #phone_number-tf").val(data[this.id].phone_number);
            $("#account-form #email-tf").val(data[this.id].email);
            $("#account-form #_email").val(data[this.id].email);

            $("#preferences-form #tip-tf").val(data[this.id].pessengerDetails.tip);
            $("#preferences-form #state-tf").val(data[this.id].pessengerDetails.state);
            $("#preferences-form #city-tf").val(data[this.id].pessengerDetails.city);

            $.ajax({
                url: '/api/GetPassengerAffiliate/'+data[this.id]._id,
                type: 'GET',
                dataType: 'json',
                success: function(result){
                    $("#preferences-form #affiliate-tf").val(result.favourite_affiliate.name);
                },
                error: function(jqXHR){
                    console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
                }
            });

            if(data[this.id].pessengerDetails.user_image != 'undefined' && data[this.id].pessengerDetails.user_image != '')
                $("#imagePreviewProfile").css("background-image", "url('"+data[this.id].pessengerDetails.user_image+"')");
            else
                $("#imagePreviewProfile").css("background-image", "");

            $.ajax({
                url: '/api/userpayment/'+data[this.id]._id,
                type: 'GET',
                dataType: 'json',
                success: function(data){
                    var i=0;
                    var counter=1;
                    var content = '';
                    if(data.length>0){
                        for (i=0;i<data.length;i++)
                        {
                            content += '<tr id="' + data[i]._id + '">';
                            content += '<td style="width:10px;">' + counter + '</td>';
                            content += '<td style="width:250px;">' + data[i].cardholder_first_name + '</td>';
                            content += '<td style="width:250px;">' + data[i].cardholder_last_name + '</td>';
                            content += '<td style="padding-left:50px;" class="card_number-row '+data[i].type+'"> **** **** **** ' + data[i].card_number + '</td>';
                            content += '</tr>';
                            counter++;
                        }
                    }else{
                        content += '<tr><td colspan="4">No Payment Found</td></tr>';
                    }

                    $('#user_payments_container tbody').html(content);
                },
                error: function(jqXHR){
                    console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
                }
            });

            $('#modal-passenger .modal-header h4').text('Passenger Details');
            $('#modal-passenger').modal('show');
        });

        $('.paging').click(function() {

            hideAlert();
            hideProfileUpdate();

            _pageIndex = parseInt(this.id);
            var  form_data = $('#passenger_admin-form').serializeArray();
            form_data.push({ name:"pageIndex", value: this.id });
            $.ajax({
                url: '/api/GetPassengersAdmin',
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