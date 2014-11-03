
$(document).ready(function(){
    /*var map;
    var polygon;
    var bounds = new google.maps.LatLngBounds();
    var i;
    var myLatLng = new google.maps.LatLng(52.5, 6.6);
    var myOptions = {
        zoom: 3,
        center: myLatLng,
        mapTypeId: google.maps.MapTypeId.TERRAIN
    };
    map = new google.maps.Map($('.ss-map')[0],
        myOptions);

    var polygonCoords = [
        new google.maps.LatLng(52.524268, 13.406290),

        new google.maps.LatLng(52.370215, 4.8951678),
        //Start & end point
    ];

    polygon = new google.maps.Polygon({
        paths: polygonCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: "#FF0000",
        fillOpacity: 0.05
    });
    polygon.setMap(map);

    for (i = 0; i < polygonCoords.length; i++) {
        bounds.extend(polygonCoords[i]);
    }

    // The Center of the polygon
    var latlng = bounds.getCenter();


    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        title: latlng.toString()
    });
*/
    var date_from_string = function(str){
        /*var months = ["jan","feb","mar","apr","may","jun","jul",
            "aug","sep","oct","nov","dec"];
        var pattern = "^([a-zA-Z]{3})\\s*(\\d{2}),\\s*(\\d{4})$";
        var re = new RegExp(pattern);
        var DateParts = re.exec(str).slice(1);

        var Year = DateParts[2];
        var Month = $.inArray(DateParts[0].toLowerCase(), months);
        var Day = DateParts[1];
         return new Date(Year, Month, Day);
        */
        return new Date(str);
    }

    $('.trips').jExpand();

    $('.trips').stupidtable({
        "date":function(a,b){

            // Get these into date objects for comparison.
            var aDate = date_from_string(a);
            var bDate = date_from_string(b);

            return aDate - bDate;
        }
    });
	var hc = new HomeController();
	var av = new AccountValidator();
	
	$('#account-form').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			if (av.validateForm() == false){
				return false;
			} 	else{
			// push the disabled username field onto the form data array //
				formData.push({name:'user', value:$('#user-tf').val()})
				return true;
			}
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') hc.onUpdateSuccess();
		},
		error : function(e){
			if (e.responseText == 'email-taken'){
			    av.showInvalidEmail();
			}	else if (e.responseText == 'phonenumber-taken'){
			    av.showInvalidUserName();
			}
		}
	});
	$('#name-tf').focus();
	$('#github-banner').css('top', '41px');

// customize the account settings form //
	
	$('#account-form h1').text('Account Settings');
	$('#account-form #sub1').text('Here are the current settings for your account.');
	$('#user-tf').attr('disabled', 'disabled');
	$('#account-form-btn1').html('Delete');
	$('#account-form-btn1').addClass('btn-danger');
	$('#account-form-btn2').html('Update');

// setup the confirm window that displays when the user chooses to delete their account //

	$('.modal-confirm').modal({ show : false, keyboard : true, backdrop : true });
	$('.modal-confirm .modal-header h3').text('Delete Account');
	$('.modal-confirm .modal-body p').html('Are you sure you want to delete your account?');
	$('.modal-confirm .cancel').html('Cancel');
	$('.modal-confirm .submit').html('Delete');
	$('.modal-confirm .submit').addClass('btn-danger');
    console.log($('.trips'));


    /*table.bind('aftertablesort', function (event, data) {
        // data.column - the index of the column sorted after a click
        // data.direction - the sorting direction (either asc or desc)
         console.log("Sorter Called");

    });*/

})