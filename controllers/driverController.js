/**
 * Created by Naveed on 7/3/2014.
 */
var mongoose = require('mongoose');
var validator=require("validator");
var geocoder = require('geocoder');
var gdistance=require('google-distance');

var async=require("async");

function DriverController() {

    //Set Service
    var Service = require('../data/models/DriverDetailService');
    var CabService = require('../data/models/CabService');
    var UserService = require('../data/models/UserService');
    var push=require('./notificationService');
    var Trip = require('../data/models/TripService');
    var TripLocation = require('../data/models/TripLocationService');
    var UserRatting = require('../data/models/UserRattingService');
    var Affiliate = require('../data/models/AffiliateService');
    var Utilities = require('../data/models/Utilities');
    var DAService = require('../data/models/DriverRequestService');
    var PassengerService  = require('../data/models/PassengerService');


    var _GetAll = function (req, res) {


        Service.GetAll(function (error, docs) {

                if (!error && docs) {
                    res.json({status: 201, data: docs});
                }
                else {
                    res.send(417);
                }
            }
        );
    };

    var _GetById = function (req, res) {
        console.log(req.body);
        var params = req.body;
        Service.GetById(params.id, function (error, doc) {

            if (!error && doc) {
                res.json({status: 201, data: doc});
            }
            else {
                res.send(417);
            }
        });

    };

    var _AddNew = function (req, res) {
        Service.AddNew(req.body,
            function (error, doc) {

                if (!error && doc) {
                    res.json({status: 201, data: doc});
                }
                else {
                    res.send(417, error.message);
                }
            }
        );
    };


    var _Update = function (req, res) {

        Service.Update(req.body, function (error, doc) {
                console.log("Update:" + doc);
                if (!error && doc) {
                    res.json({status: 201, data: doc});
                }
                else {
                    res.send(417);
                }
            }
        );
    };

    var _Remove = function (req, res) {


        Service.Remove(req.params.id, function (error, doc) {
            if (!error && doc) {
                res.json({status: 201, data: doc});
            }
            else {
                res.send(417);
            }
        });
    };

    //Create By Mukarram for use in Driver Administration.
    var _GetDriversAdmin = function(req,res){
        var _pageIndex = 0;
        var _pageSize = 20;

        if(req.query.pageIndex!= undefined && req.query.pageIndex != '' )
            _pageIndex = req.query.pageIndex;

        if(req.query.pageSize!= undefined && req.query.pageSize != '' )
            _pageSize = req.query.pageSize;

        var query = {user_type:"driver"};

        if(req.query.first_name != undefined && req.query.first_name != '' &&
            req.query.last_name != undefined && req.query.last_name != '')
                query = {user_type:"driver", first_name:req.query.first_name, last_name:req.query.last_name};

        if(req.query.first_name != undefined && req.query.first_name != '')
            query = {user_type:"driver", first_name:req.query.first_name};

        if(req.query.last_name != undefined && req.query.last_name != '')
            query = {user_type:"driver", last_name:req.query.last_name};

        var iRecordCount = 0;

        UserService.GetUsersByCriteria(query,true,_pageIndex,_pageSize,function (error, data) {
            if (!error && data) {
                iRecordCount = data.length;
            }
        });

        UserService.GetUsersByCriteria(query,false,_pageIndex,_pageSize,function (error, data) {
            if(!error && data){
                async.each(data, function( record, callback){
                    async.waterfall([
                        function (callback){
                            Service.GetByCriteria({user_id:record._id},function(error,doc){
                                if (!error && doc){
                                    record.record_count = iRecordCount;
                                    record.driverdetails = doc;
                                    callback(null, doc);
                                }else{
                                    res.send(error, "No Driver Details");
                                }
                            });
                        }
                    ],
                    function (err, response)
                    {
                        console.log("waterfall response");
                        console.log(record);
                        callback();
                    });
                },function(err){
                    if(!err)
                    {
                        res.setHeader('Content-Type', 'application/json');
                        res.send(200, data);
                    }else{
                        res.send(417,"No Driver Found");
                    }
                });
            }else{
                res.send(417,"No Driver Found");
            }
        });
    };

    var _DriverAccept=function(req,res){
        console.log(req.body);
        //udid(R), requestid(R),driverid(R),latitude(R),longitude(R)

        var params=req.body;
        var _validate=function(params){
            return  validator.isFloat(params.longitude) &&validator.isFloat( params.latitude) &&validator.isEmail(params.driverid)&&validator.isNumeric(params.requestid);
        }
        if(!_validate(params))
            res.send(417);
        else
        {

      //  params.status='accepted';
        /*var DAService = require('../data/models/DriverRequestService');
        DAService.GetByCriteria({driverid:params.driverid},function(error,doc){

            if (!error && doc) {
            doc.status="accepted";
            doc.save();*/


            //_notifyApp(params.driverid,"Ride Ready")
           var PassService=require('../data/models/PassengerRequestService');
           PassService.GetByCriteria({requestid:params.requestid,passenger_request_status:'pending'},function(error, doc){
                //console.log(doc);
                //console.log(error);

                if (!error && doc) {
                    //Updating Driver request
                    var driversearch = {requestid:params.requestid,driverid:params.driverid}
                    DAService.GetByCriteria(driversearch,function(daerr,dadoc){
                        if(dadoc){
                            dadoc.driver_request_status = "accepted";
                            dadoc.save();
                        }
                    });


                    geocoder.reverseGeocode(params.latitude,params.longitude,function(geoerr,geodata){
                        var accept_complete_address = geodata.results[0].formatted_address;
                        var accept_request_postalcode = "";
                        var accept_request_country = "";
                        var accept_request_city = "";
                        var driver_accept_state = "";

                        for(var i in geodata.results[0].address_components){
                            if(geodata.results[0].address_components[i].types.indexOf('street_number')>-1){
                                accept_complete_address = geodata.results[0].address_components[i].long_name;
                            }
                            if(geodata.results[0].address_components[i].types.indexOf('route')>-1){
                                accept_complete_address += ", "+geodata.results[0].address_components[i].short_name;
                            }
                            /*if(geodata.results[0].address_components[i].types.indexOf('locality')>-1){
                                accept_complete_address += ", "+geodata.results[0].address_components[i].short_name;
                            }*/
                            if(geodata.results[0].address_components[i].types.indexOf('postal_code')>-1){
                                accept_request_postalcode =geodata.results[0].address_components[i].long_name;
                            }
                            else if(geodata.results[0].address_components[i].types.indexOf('country')>-1){
                                accept_request_country=geodata.results[0].address_components[i].long_name;
                            }
                            else if(geodata.results[0].address_components[i].types.indexOf('locality')>-1){
                                accept_request_city = geodata.results[0].address_components[i].long_name;
                            }
                            else if(geodata.results[0].address_components[i].types.indexOf('administrative_area_level_1')>-1){
                                driver_accept_state = geodata.results[0].address_components[i].short_name;
                            }
                        }


                    doc.passenger_request_status='fulfilled';
                    doc.driverid = params.driverid;
                    doc.save();
                    //Getting driver details for medalion and affiliate id
                    var tripData = {
                        requestid:params.requestid,
                        passengerid:doc.passengerid,
                        driverid:params.driverid,
                        tripdatetime:new Date(),
                        passenger_request_latitude:doc.latitude,
                        passenger_request_longitude:doc.longitude,

                        passenger_request_postal_code:doc.request_postal_code,
                        passenger_request_address:doc.request_address,
                        passenger_request_country:doc.request_country,
                        passenger_request_city:doc.request_city,
                        passenger_request_datetime:doc.request_datetime,
                        passenger_request_state:doc.request_state,

                        trip_payment_choice:doc.payment_choice,

                        driver_accept_latitude:params.latitude,
                        driver_accept_longitude:params.longitude,
                        driver_accept_address:accept_complete_address,
                        driver_accept_postal_code:accept_request_postalcode,
                        driver_accept_country:accept_request_country,
                        driver_accept_city:accept_request_city,
                        driver_accept_state:driver_accept_state,
                        driver_accept_datetime:new Date(),

                        trip_contact_number:contact_number
                    }

                    Service.GetByCriteria({driverid:params.driverid},function(driverErr,driverDoc){
                        if(driverDoc){
                            driverDoc.status = "onjob";
                            driverDoc.save();

                            Affiliate.GetById(driverDoc.cab_affiliate_id,function(affErr,affDoc){
                                tripData.affiliate_id=affDoc.name;
                           
                            
                            tripData.cab_medallion_no=driverDoc.cab_medallion_number;
                            tripData.trip_driver_image_url = driverDoc.user_image;
                        
                        Trip.AddNew(tripData,function(tripErr,tripDoc){
                            if(tripDoc){
                                UserService.GetByCriteria({email:params.driverid},function(driverErr,driverDoc){
                                    if(driverDoc){
                                        //Saving driver phone number to trip
                                        tripDoc.driver_phone_number = driverDoc.phone_number;
                                        tripDoc.trip_driver_first_name = driverDoc.first_name;
                                        tripDoc.trip_driver_last_name = driverDoc.last_name;
                                        tripDoc.trip_driver_ratting = driverDoc.ratting;
                                        tripDoc.save();
                                    }                                  
                                
                                    UserService.GetByCriteria({email:tripData.passengerid},function(userSearchErr,userResult){
                                        //Saving passenger phone number to trip
                                        tripDoc.passenger_phone_number = userResult.phone_number;
                                        tripDoc.save();
                                        doc = JSON.parse(JSON.stringify(doc));
                                        console.log("Sending Notification to user");
                                        doc.tripid = tripDoc.tripid;
                                        if(userResult){
                                            push.SendNotification(userResult.device_id,"A driver has accepted your request",{requestid:tripData.requestid,tripid:tripDoc.tripid,'type':'passenger'});
                                            doc = Utilities.FixURL(doc);
                                            res.send(doc,200);
                                         }
                                        else{
                                            doc.message = "Unable to send notification";
                                            doc = Utilities.FixURL(doc);
                                            res.send(doc,200);                                    
                                        }
                                                
                                    });
                                });
                            }
                        });
                    });
}
                    });

                    
                    
                        
                    
                        
                    });
                    

                    
                    

                    //_notifyApp(doc.passengerid,"Your request is accepted")
                }
                else
                    res.send({message:"Request has been already accepted"},302);
            });
              //res.json({status: 200, data: doc});
             //   res.send(200);
            /*}
            else {
                res.send(417,"driver was not sent request");
            }*/
       // });
        }
    };

    var _DriverReject=function(req,res){
        console.log(req.body);
        //udid(R), requestid(R),driverid(R),latitude(R),longitude(R)

        var params=req.body;
        var _validate=function(params){
            return  validator.isFloat(params.longitude) &&validator.isFloat( params.latitude) &&validator.isNumeric( params.udid )&&validator.isEmail(params.driverid)&&validator.isNumeric(params.requestid);
        }
        if(!_validate(params))
            res.send(417);
        else
        {

            //  params.status='accepted';
            var DAService = require('../data/models/DriverRequestService');
            DAService.GetByCriteria({driverid:params.driverid},function(error,doc){

                if (!error && doc) {
                    doc.driver_request_status="rejected";
                    doc.save();


                    res.json({status: 200, data: "driver rejcted"});
                    //   res.send(200);
                }
                else {
                    res.send(417,"driver was not sent request");
                }
            });
        }
    };
//    Request ::   UDID    PickupRequestID    driverid    UserID    Date Time

//    Response ::   Driver Longitude    Driver Latitude    Driver Information    Cab information

    var _DriverLocation = function (req, res) {
      //  console.log(req.body);
        var params = req.body;
       // var cabService=require('../data/models/CabService');
        var _validate=function(params){
            
            return  validator.isFloat(params.longitude) &&validator.isFloat( params.latitude) || params.locations;
        }
        if(!_validate(params))
            res.send(417,"Validation Fails");

        else {
            if(params.locations){
                var requestData = params;
                for(var i in requestData.locations){
                    params = {};
                    params.driverid = requestData.driverid;
                    params.latitude = requestData.locations[i][0];
                    params.longitude = requestData.locations[i][1];
                    if(requestData.tripid){
                        params.tripid = requestData.tripid;
                    }
                    Service.GetByCriteria({driverid:params.driverid}, function (error, doc) {            
                            if (doc) {
                                    //if(doc) {
                                        //CabService.GetById(doc.cabid,function(cabErr,cabDoc){
                                            doc.position=[params.latitude,params.longitude];
                                            if(params.tripid){
                                                doc.status = "onjob";
                                            }else{
                                                doc.status = "online";
                                            }
                                            
                                            doc.save(function(err,res){console.log(err);console.log(res)});
                                            var cabres = JSON.parse(JSON.stringify(doc));
                                            cabres.message = "Location and status updated";
                                            if(params.tripid){              
                                                TripLocation.AddNew(params,function(err,affectedRows){
                                                    if(!err){
                                                        cabres.message += " with trip location log"
                                                        cabres = Utilities.FixURL(cabres);
                                                        res.send(cabres,200);
                                                    }else{
                                                        cabres.message += " error occurent in logging trip";
                                                        cabres = Utilities.FixURL(cabres);
                                                        res.send(cabres,500);
                                                    }
                                                });
                                            }else{
                                                cabres = Utilities.FixURL(cabres);
                                                res.json(cabres,200);
                                            }




                                            
                                        //});
                                        
                                   // }else{
                                     //   res.json({message: "cab not found"},404);
                                    //}


                                
                            }
                            else {
                                res.send({message:"Invalid driverid"},417);
                            }
                        });

                }

            }else{

                Service.GetByCriteria({driverid:params.driverid}, function (error, doc) {
            
            if (doc) {
                    //if(doc.cabid) {
                       // CabService.GetById(doc.cabid,function(cabErr,cabDoc){
                            doc.position=[params.latitude,params.longitude];
                            if(params.tripid){
                                doc.status = "onjob";
                            }else{
                                doc.status = "online";
                            }
                            
                            doc.save(function(err,res){console.log(err);console.log(res)});
                            var cabres = JSON.parse(JSON.stringify(doc));
                            cabres.message = "Location and status updated";
                            if(params.tripid){              
                                TripLocation.AddNew(params,function(err,affectedRows){
                                    if(!err){
                                        cabres.message += " with trip location log"
                                        res.send(cabres,200);
                                    }else{
                                        cabres.message += " error occurent in logging trip"
                                        res.send(cabres,500);
                                    }
                                });
                            }else{
                                res.json(cabres,200);
                            }




                            
                      //  });
                        
                    //}else{
                    //    res.json({message: "cab not found"},404);
                    //}


                
            }
            else {
                res.send({message:"Invalid driverid"},417);
            }
        });

            }
        
        }
    };

    var _DriverStatus = function (req, res) {
        console.log(req.body);
        var params = req.body;
        // var cabService=require('../data/models/CabService');
        if(!validator.isEmail(params.driverid))
            res.send(417,"Driver id missing");
        else {

        Service.GetByCriteria({driverid:params.driverid}, function (error, doc) {

            console.log(params);
            if (!error && doc) {

                var response={}
                response.driverid=doc.driverid;
                if(doc.cabid) {
                    response.latitude=doc.cabid.position[0];
                    response.longitude=doc.cabid.position[1];
                }


                res.json({status: 201, data: response});
            }
            else {
                res.send(417,"no driver found");
            }
        });
        }
    };

    var _dataTemp=function(req,res){


        temp(req,res);
        res.send(200);
    };

    function temp(req,res) {
        var j = 0, k = 0;
        for (var i = 0; i < 9; i++) {
            console.log("sec:"+i);

            var doc = {};

            /* firstname:String,
             lastname: String,
             middlename:String,
             dateofbirth:String,
             licenseno:String,
             isactive:Boolean,
             driverid:;*/
            doc.firstname = 'naveed';
            doc.dateofbirth = '12345';
            doc.licenseno = "123456";
            doc.driverid = "naveedjb"+i+"@hotmail.com";
            doc.isactive = i%2==0;
            Service.AddNew(doc, function (error, result) {
                console.log(result);
                if(error)
                    res.send(417);
            });
        }

        for (var i = 0; i < 10; i++) {
            console.log("first:"+i);

            var doc = {};

            /*doc.name = 'naveed';
             doc.typeid = new ObjectId ;
             doc.affiliateid=new ObjectId;
             doc.ownerid=new ObjectId;
             doc.driverid=new ObjectId;
             doc.statusid=new ObjectId;*/
            doc.firstname = 'naveed';
            doc.dateofbirth = '12345';
            doc.licenseno = "123456";
            doc.driverid = "naveedjbr"+i+"@live.com";
            doc.isactive = i%2==0;
            Service.AddNew(doc, function (error, result) {
                console.log(error);
                console.log(result);
                if(error)
                    res.send(417);

            });

        }

    }

    var _driverReqList=function(req,res){
        var DAService = require('../data/models/DriverRequestService');
        DAService.GetAll(function(error,doc){

            if (!error && doc) {

                res.json({status: 201, data: doc});
            }
            else {
                res.send(417);
            }


        })
    }
    var _DriverChargeFare = function(req,res){
        var params = req.body;
        var _validate=function(params){
            return  validator.isFloat(params.trip_fare);// &&validator.isNumeric( params.trip_tip)&&validator.isNumeric( params.trip_grandtotal)  && params.tripid &&validator.isEmail(params.driverid)&&validator.isEmail(params.passengerid);
        }
        if(!_validate(params)){
            res.send(404,"Invalid Parameters");
        }else{
            var trip_search = {tripid:params.tripid}
            Trip.GetOneByCriteria(trip_search,function(tripErr,tripDoc){
                if(tripDoc){
                    tripDoc.trip_fare = params.trip_fare;
                    // Search user from passenger id
                    // Get get passenger tip from user_id 
                    
                    var passenger_search = {"email":tripDoc.passengerid};
                    UserService.GetByCriteria(passenger_search,function(userErr,userDoc){
                        if(userDoc){
                            userDoc = JSON.parse(JSON.stringify(userDoc));
                            var user_search = {"user_id":userDoc._id}
                            PassengerService.GetByCriteria(user_search,function(passengerErr,PassengerDoc){
                                if(PassengerDoc){
                                    tripDoc.trip_tip_percentage = PassengerDoc.tip;
                                    tripDoc.trip_tip = Number(params.trip_fare)*(Number(PassengerDoc.tip)/100);
                                    tripDoc.trip_grandtotal = Number(tripDoc.trip_tip)+Number(tripDoc.trip_fare);
                                    tripDoc.save();
                                    tripDoc = JSON.parse(JSON.stringify(tripDoc));
                                    tripDoc = Utilities.FixURL(tripDoc);
                                    res.send(tripDoc,201);

                                }else{
                                    //tripDoc.trip_tip = params.trip_tip;
                                    //tripDoc.trip_grandtotal = params.trip_grandtotal;
                                    tripDoc.payment_mode = params.payment_mode;
                                    tripDoc.save();
                                    tripDoc = JSON.parse(JSON.stringify(tripDoc));
                                    tripDoc = Utilities.FixURL(tripDoc);
                                    tripDoc.message = "Passenger Not found";
                                    res.send(tripDoc,201);
                                }
                            });

                        }else{
                            //tripDoc.trip_tip = params.trip_tip;
                            //tripDoc.trip_grandtotal = params.trip_grandtotal;
                            tripDoc.payment_mode = params.payment_mode;
                            tripDoc.save();
                            tripDoc = JSON.parse(JSON.stringify(tripDoc));
                            tripDoc = Utilities.FixURL(tripDoc);
                            tripDoc.message = "User Not found";
                            res.send(tripDoc,201);
                        }
                    });
                    

                }
                else{
                    res.send({message:"Internal Server Error"},500);
                }
            });
        }
    }

    var _DriverEndTrip = function(req,res){
        var params = req.body;
        var _validate=function(params){
            return  validator.isFloat(params.trip_end_latitude) &&validator.isFloat( params.trip_end_longitude) && params.tripid;
        }
        if(!_validate(params)){
            res.send(404,"Invalid Parameters");
        }else{
            var trip_search = {tripid:params.tripid}
            Trip.GetOneByCriteria(trip_search,function(tripErr,tripDoc){
                if(tripDoc){
                    tripDoc.trip_end_latitude = params.trip_end_latitude;
                    tripDoc.trip_end_longitude = params.trip_end_longitude;
                    tripDoc.trip_end_address = params.trip_end_address;
                    tripDoc.trip_end_datetime = params.trip_end_datetime;
                    tripDoc.trip_status = 'Completed';
                    var t1 = new Date(params.trip_end_datetime);
                    var t2 = new Date(tripDoc.trip_start_datetime);
                    var dif = t1.getTime() - t2.getTime();

                    tripDoc.trip_actual_duration = dif;
                    tripDoc.save();
                    var tripStartLocation = [tripDoc.trip_start_latitude,tripDoc.trip_start_longitude];
                    var endTripLocation = [params.trip_end_latitude,params.trip_end_longitude];
                                gdistance.get(
                                        {
                                            origin: tripStartLocation.toString(),
                                            destination: endTripLocation.toString()
                                        },function(geolocerr,geolocdata){
                                            //console.log(geolocdata);
                                            if(geolocerr){
                                                res.send(tripDoc,200);
                                            }else{
                                            tripDoc.trip_actual_distance = geolocdata.distanceValue;  
                                            tripDoc.save();  
                                            res.send(tripDoc,200);
                                            }
                                        });

                }
                else{
                    res.send({message:"Internal Server Error"},500);
                }
            });
        }
    }

    var _DriverBeginTrip = function(req,res){
        var params = req.body;
        var _validate=function(params){
            return  validator.isFloat(params.trip_start_latitude) &&validator.isFloat( params.trip_start_longitude) && params.tripid;
        }
        if(!_validate(params)){
            res.send(404,"Invalid Parameters");
        }else{
            var trip_search = {tripid:params.tripid}
            Trip.GetOneByCriteria(trip_search,function(tripErr,tripDoc){
                if(tripDoc){
                    tripDoc.trip_start_latitude = params.trip_start_latitude;
                    tripDoc.trip_start_longitude = params.trip_start_longitude;
                    tripDoc.trip_start_address = params.trip_start_address;
                    tripDoc.trip_start_datetime = params.trip_start_datetime;
                    tripDoc.trip_status = 'tripstarted';
                    tripDoc.save();
                    res.send(tripDoc,201);

                }
                else{
                    res.send({message:"Internal Server Error"},500);
                }
            });
        }
    }

    var _DriverArrived=function(req,res){
        var params = req.body;
        // var cabService=require('../data/models/CabService');
        var _validate=function(params){
            return  validator.isFloat(params.trip_driver_arrival_latitude) &&validator.isFloat( params.trip_driver_arrival_longitude) && params.tripid;
        }
        if(!_validate(params))
            res.send(417,"Validation Fails");
        else
        {
            // Passenger notification of Driver Arrival
            //_notifyApp(params.passengerid,"Driver has arrived");
            var trip_search = {tripid:params.tripid}
            Trip.GetOneByCriteria(trip_search,function(tripErr,tripDoc){
                if(tripDoc){
                    tripDoc.trip_driver_arrival_latitude = params.trip_driver_arrival_latitude;
                    tripDoc.trip_driver_arrival_longitude = params.trip_driver_arrival_longitude;
                    tripDoc.trip_driver_arrival_address = params.trip_driver_arrival_address;
                    tripDoc.trip_driver_arrival_datetime = params.trip_driver_arrival_datetime;
                    tripDoc.trip_status = 'arrived';
                    tripDoc.save();
                    UserService.GetByCriteria({email:tripDoc.passengerid},function(UserErr,UserData){
                        if(UserData){                    
                            push.SendNotification(UserData.device_id,"Driver has arrived",{'type':'driverarrive'});
                        }
                    });
                    tripDoc.message = "Passenger notified about Driver Arrival";
                    res.send(200, tripDoc);
                }
            })


            

        }

        /*var DAService = require('../data/models/DriverRequestService');
        DAService.GetAll(function(error,doc){

            if (!error && doc) {

                res.json({status: 201, data: doc});
            }
            else {
                res.send(417);
            }


        })*/
    }

    var _notifyApp=function(id,message){

        UserService.GetByCriteria({email:id},function(error,doc){

            if(!error && doc)
            {
                var PushObj={
                    device_token:doc.device_id,
                    alert:message,
                    sound:"default",
                    badge:"+1"

                }

                push.NotifyService(PushObj,function(err,data){
                    if(err)
                        console.log("Passenger Accepted 1 failed")
                    else
                        console.log("Passenger Accepted 1 passed")

                })

            }


        } );


    }


    var _notifyPost=function(req,res){
// Require the module. The module provides a constructor function as main
// entry object.
        var UrbanAirshipPush = require('urban-airship-push');

// Your app access configuration. You will find this stuff in your App
// Settings under App Key, App Secret and App Master Secret.
        var config = {
            key: 'kuFyh2JtRAmf1licycGeEQ',
            secret: '9A3pz5DIQbK1ke9Xa87W3Q',
            masterSecret: 'iqf3JlD6TBSAIGkRpUJgPw'
        };

// Create a push object
        var urbanAirshipPush = new UrbanAirshipPush(config);

        var pushInfo = {
            device_types: 'all',
            audience: 'all',
            notification: {
                alert: 'Blubb blub bla'
            }
        };

        var pushOne={
            "device_types" : "all",
            "audience" : {
                "device_token" : "AF8CA64D6EED5300CD4762ED44A0410917D8E5AFFD80E865FB1D5D155E4889DB"
             //   "device_token" : "C54B9EBA49B8496C0157699ABBE8B504E15EA786"
            },
            "notification" : {
                "alert": "Hello",
                    "ios":{
                        "sound": "default",
                        badge:"+1"

                    }

            }

        };

     /*   {
            "audience": {"alias": "foo"},
            "notification": {
            "ios": {
                "badge": "+1",
                    "alert": "My badge is now 5!"
            }
        },
            "device_types": ["ios"]
        }*/
        var payload=req.body;
        console.log(payload)
        pushOne.audience.device_token=payload.device_tokens[0];
        pushOne.notification.alert=payload.aps.alert;
        pushOne.notification.ios.sound=payload.aps.sound;
        pushOne.notification.ios.badge=payload.aps.badge;
        //pushOne.notification=payload.aps;
        console.log(pushOne);
        var PushObj={
            device_token:payload.device_tokens[0],
            alert:payload.aps.alert,
            sound:payload.aps.sound,
            badge:payload.aps.badge

        }
     var PushService=require('./notificationService');

        PushService.NotifyService(PushObj,function (err, data) {
            if (err) {
                // Handle error

                res.send(417,"validation Fails");
            }
            else {

                res.json({status: 201, data: data});

            }
        })

    /*    urbanAirshipPush.push.validate(pushOne, function (err, data) {
            if (err) {
                // Handle error

                res.send(417,"validation Fails");
            }
            else {

                console.log(data);

                urbanAirshipPush.push.send(pushOne, function (err, data) {
                    if (err) {
                        // Handle error
                        console.log(err)
                        res.send(417,"Push Notification fails");
                        //return;
                    }

                    console.log(data);
                    res.json({status: 201, data: data});
                });
            }

        });*/
}
    var _notify=function(req,res){
    // Require the module. The module provides a constructor function as main
    // entry object.
            var UrbanAirshipPush = require('urban-airship-push');

    // Your app access configuration. You will find this stuff in your App
    // Settings under App Key, App Secret and App Master Secret.
            var config = {
                key: 'kuFyh2JtRAmf1licycGeEQ',
                secret: '9A3pz5DIQbK1ke9Xa87W3Q',
                masterSecret: 'iqf3JlD6TBSAIGkRpUJgPw'
            };

    // Create a push object
            var urbanAirshipPush = new UrbanAirshipPush(config);

            var pushInfo = {
                device_types: 'all',
                audience: 'all',
                notification: {
                    alert: 'Blubb blub bla'
                }
            };

            var pushOne={
                "device_types" : "all",
                "audience" : {
                    "device_token" : "AF8CA64D6EED5300CD4762ED44A0410917D8E5AFFD80E865FB1D5D155E4889DB"
                    //   "device_token" : "C54B9EBA49B8496C0157699ABBE8B504E15EA786"
                },
                "notification" : {
                    "alert" : "Hello Ayaz! pls SMS me if u receive "
                }

            };

            urbanAirshipPush.push.validate(pushOne, function (err, data) {
                if (err) {
                    // Handle error
                    res.send(417);
                 //   res.json({status: 417, data: err})
                }
                else {

                    console.log(data);

                    urbanAirshipPush.push.send(pushOne, function (err, data) {
                        if (err) {
                            // Handle error
                            console.log(err)
                            res.send(417);
                            //return;
                        }

                        console.log(data);
                        res.json({status: 201, data: data});
                    });
                }

            });



            /* if (!error && doc) {

             res.json({status: 201, data: doc});
             }
             else {
             res.send(417);
             }*/






    }

    var _notifyform=function(req,res){

        res.render('push');



}

    var _showpass=function(req,res){

        res.render('pass');



    }

    var _lookupForm=function(req,res){

        res.render('lookup');
    }
    var _sendNotification = function(token,message,payload){
        /*
        * APNS sent using argon-apn
        */
        token = '5833cddc651bc2292445f2a572fee72aa8edc8893f7744d6ed801f70a52fa3be';
        message = " For user 9 Json with payload";
        payload = {'requestid':2,'type':'driver'};

        var apn = require('apn');


        var certPath = __dirname+"\\ITVerticalEnterpriseDevCert.pem";
        var keyPath = __dirname+"\\ITVerticalEnterpriseDevKey.pem";
        
         console.log(certPath);
        var connectionOptions = {
                                    gateway:'gateway.sandbox.push.apple.com',
                                    key:keyPath,
                                    cert:certPath,
                                    port: 2195,
                                    passphrase:'taxi'
                                }

        var service = new apn.connection(connectionOptions);

        /*service.on('connected', function() {
            console.log("APNS Connected");
        });*/

        service.on('transmitted', function(notification, device) {
            console.log("Notification transmitted to:" + device.token.toString('hex'));
        });
        service.on('transmissionError', function(errCode, notification, device) {
            console.error("Notification caused error: " + errCode + " for device ", device, notification);
            if (errCode == 8) {
                console.log("A error code of 8 indicates that the device token is invalid. This could be for a number of reasons - are you using the correct environment? i.e. Production vs. Sandbox");
            }
        });
        /*service.on('timeout', function () {
            console.log("APNS Connection Timeout");
        });
        service.on('disconnected', function() {
            console.log("Disconnected from APNS");
        });*/
        service.on('socketError', console.error);


        var note = new apn.notification();
        note.setAlertText(message);
        note.badge = '+1';
        note.sound = "default";
        note.payload = payload;
        if(token instanceof Array){
            for(var i in token){
                service.pushNotification(note, token[i]);
            }
        }
        else{
            var device = new apn.device(token.toString('hex'));
            service.pushNotification(note, device);
        }

        



    }
    var tempTripData = function(req,res){

        console.log("Trip Temp data service");

        var tripData = {
                        requestid:"1",
                        passengerid:"hamdan@hamdan.com",
                        driverid:"baligh@baligh.com",
                        tripdatetime:new Date()
                    }
                    Trip.AddNew(tripData,function(tripErr,tripDoc){
                        console.log(tripData);
                        console.log(tripErr);
                        console.log(tripDoc);
                        if(tripDoc){
                            UserService.GetByCriteria({email:tripData.passengerid},function(userSearchErr,userResult){
                                tripDoc = JSON.parse(JSON.stringify(tripDoc));
                                console.log("Sending Notification to user");
                                if(userResult){
                                    //push.SendNotification(userResult.device_id,"A driver has accepted your request",{requestid:tripData.requestid,tripid:tripDoc.tripid});
                                    
                                    //doc.tripid = tripDoc.tripid;
                                    res.send(tripDoc,200);
                                 }
                                else{
                                    tripDoc.message = "Unable to send notification";
                                    res.send(tripDoc,200);                                    
                                }
                                        
                            });
                        }
                        else{
                            res.send(tripErr,200);
                        }
                    });

    }
    var _tripDetails = function(req,res){
        var params = req.body;
        // var cabService=require('../data/models/CabService');
        var _validate=function(params){
            return  validator.isFloat(params.latitude) &&validator.isFloat( params.longitude) && params.tripid;
        }
        if(!_validate(params))
            res.send(417,"Validation Fails");
        else
        {

            TripLocation.AddNew(params,function(err,affectedRows){
                if(!err){
                    res.send({message:"location updated"},200);
                }else{
                    res.send({message:"internal server error"},500);
                }
            });
            /*var trip_search = {tripid:params.tripid}  
            var position = new Array();
            position.push(params.latitude);
            position.push(params.longitude);

            Trip.UpdateLocation(trip_search,{trip_positions:position},function(posErr,posDoc){
                if(!posErr){
                    Trip.GetOneByCriteria(trip_search,function(tripErr,tripDoc){
                        if(tripDoc){
                            res.send(tripDoc,200);
                        }else{
                            res.send(404);
                        }
                    });
                }
                else{
                    res.send(404);
                }
            }); */        
        }
    }

    var _DriverLocationForPassenger = function(req,res){
        var params = req.params;
        Service.GetByCriteria({driverid:params.driverid}, function (error, doc) {
            
            if (doc) {
                    //if(doc.cabid) {
                       // CabService.GetById(doc.cabid,function(cabErr,cabDoc){    
                            //params.requestid   
                            var cabres = JSON.parse(JSON.stringify(doc));     
                             var PassService=require('../data/models/PassengerRequestService');
                             PassService.GetByCriteria({requestid:params.requestid},function(passerr,passdoc){
                                if(passdoc){
                                    var destination = [passdoc.latitude,passdoc.longitude];
                                    gdistance.get({
                                                    origin: cabres.position.toString(),
                                                    destination: destination.toString()
                                                    },function(gerr,gdoc){
                                                        if(gdoc){
                                                            //console.log(gdoc);
                                                            cabres.passenger_request_latitude = passdoc.latitude;
                                                            cabres.passenger_request_longitude = passdoc.longitude;
                                                            cabres.duration = gdoc.durationValue;
                                                            cabres.distance = gdoc.distanceValue;
                                                            cabres.contact_number = contact_number;
                                                            Trip.GetOneByCriteria({requestid:params.requestid},function(tripErr,tripDoc){
                                                                if(tripDoc){
                                                                    cabres.trip_actual_distance = tripDoc.trip_actual_distance;
                                                                    cabres.trip_actual_duration = tripDoc.trip_actual_duration;
                                                                }
                                                                if(typeof(tripDoc.trip_start_datetime)!="undefined")
                                                                {
                                                                    var t1 = new Date();
                                                                    var t2 = new Date(tripDoc.trip_start_datetime);
                                                                    var dif = t1.getTime() - t2.getTime();
                                                                    cabres.duration = dif;
                                                                }
                                                                cabres = Utilities.FixURL(cabres);
                                                                res.send(cabres,200);
                                                            });
                                                            

                                                        }else{
                                                            cabres = Utilities.FixURL(cabres);
                                                            res.send(cabres,200);
                                                        }
                                                    });

                                }else{
                                    cabres = Utilities.FixURL(cabres);
                                    res.send(cabres,200);
                                }

                             });               
                            
                            
                       // });
                        
                   // }else{
                   //     res.json({message: "cab not found"},404);
                   // }


                
            }
            else {
                res.send({message:"Invalid driverid"},417);
            }
        });

    };

    var _DriverJobStatus = function (req, res) {

        Service.UpdateDriverJobStatus(req.body, function (error, doc) {
                console.log("Update:" + doc);
                if (!error && doc) {
                    res.json({status: 201, data: doc});
                }
                else {
                    console.log("ERROR")
                    console.log(error);
                    res.send(417,error.message);
                }
            }
        );
    };

    var _UpdateCab = function (req, res) {

        Service.UpdateDriverCab(req.body, function (error, doc) {
                console.log("Update:" + doc);
                if (!error && doc) {
                    var CabHistoryService = require('../data/models/DriverCabHistoryService');
                    CabHistoryService.AddNew(doc,function(error2, doc2){
                        if (!error2 && doc2)
                        res.json({status: 201, data: doc});
                        else
                        res.json(417,{message:'error'});
                    });

                }
                else {
                    console.log("ERROR")
                    console.log(error);
                    res.json(417,{message:error.message});
                }
            }
        );
    };

    var _UpdateBankDetail = function (req, res) {

        Service.UpdateBankDetail(req.body, function (error, doc) {
                console.log("Update:" + doc);
                if (!error && doc) {
                    res.json({status: 201, data: doc});
                }
                else {
                    console.log("ERROR")
                    console.log(error);
                    res.json(417,{message:error.message});
                }
            }
        );
    };


    var _UserRatting = function(req,res){
        var params = req.body;
        if(params.userid && params.who_rated && params.tripid){
            UserRatting.AddNew(params,function(err,data){
                if(data){
                    res.send(data,201);
                }else{
                    res.send(err,417);
                }
            });
        }
        else{
            res.send("Validation Error",404);
        }
    }

    var _init=function(app){
        //error checking points
        app.post("/api/driver",_AddNew);
        app.get("/api/driver/data",_dataTemp);
        app.get("/api/driver/reqlist",_driverReqList);
        app.get("/api/push",_notify);
        //app.post("/api/push",_notifyPost);
        app.get("/api/mypush",_sendNotification); // added to check the function

        app.get("/api/pushform",_notifyform)
        app.get("/api/lookup",_lookupForm)
        app.get("/api/pass",_showpass)

        app.get("/api/triptempdata",tempTripData);

        //Get all drivers
        app.get("/api/GetDriversAdmin",_GetDriversAdmin);

        //Service Api
        app.post("/api/driver/accept",_DriverAccept);
        app.post("/api/driver/reject",_DriverReject);
        app.post("/api/driver/status",_DriverStatus);
        app.post("/api/driver/location",_DriverLocation);
        app.post("/api/driver/arrive",_DriverArrived);
        app.post("/api/driver/begintrip",_DriverBeginTrip);
        app.post("/api/driver/endtrip",_DriverEndTrip);
        app.post("/api/driver/chargefare",_DriverChargeFare);
        app.post("/api/tripDetail",_tripDetails);

        app.put("/api/driver/jobstatus",_DriverJobStatus);
        app.get("/api/driver/location/:driverid/:requestid",_DriverLocationForPassenger);
        app.get("/api/passenger/pickupstatus/:driverid/:requestid",_DriverLocationForPassenger);
        app.put("/api/driver/changecab",_UpdateCab);
        app.post("/api/starratting",_UserRatting);
        app.put("/api/driver/bankdetail",_UpdateBankDetail);
    }



    return {
        init:_init
    };


}

module.exports=DriverController();