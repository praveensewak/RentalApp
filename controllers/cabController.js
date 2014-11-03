/**
 * Created by Naveed on 6/24/2014.
 */


var mongoose = require('mongoose');
var validator=require("validator");
var distance=require('google-distance-matrix');
var _=require('underscore');
var gdistance=require('google-distance');
var parse    =require('parse-duration')
var async =require('async');
var geocoder = require('geocoder');
//gdistance.apiKey = 'AIzaSyBNN8WUcDjqq-zU32GJxdkBGIeuenajEhA';
//mongoose.connect(process.env.CUSTOMCONNSTR_taxi);

//mongoose.connect('mongodb://localhost:27017/taxi');
//1-load schema:already done in server.js
//2-load Repository
ObjectId=mongoose.Schema.Types.ObjectId;
var db = mongoose.connection;
/*db.on("error",function(){
    console.log("error");
})
db.once("open",function(){
    console.log("OPEN")
})*/

function CabController(){

//set Service
    var Service=require('../data/models/CabService');
    var DriverModel=mongoose.model('DriverDetails');
    var push=require('./notificationService')
    var UserService = require('../data/models/UserService')
    var DAService = require('../data/models/DriverRequestService')
    var DriverService=require('../data/models/DriverDetailService');
    var PassService1=require('../data/models/PassengerRequestService');
    var Trip = require('../data/models/TripService');
    var Utilities = require('../data/models/Utilities');


    var _GetAllByPosition=function(req,res){
        console.log(req.body);
        var params=req.body
        //    _validate(params);
      //  if(!(params.longitude && params.latitude && params.udid && params.email))
        if(!(_validate(params)))
            res.send({"message":"not valid data"},417);

        DriverService.GetAllByPosition([params.latitude,params.longitude],  function(error,docs) {

                if(!error && docs)
                {
                    docs = JSON.parse(JSON.stringify(docs));
                    var a=0;
                    docs.forEach(function(element){
                        //     element.duration={};

                        gdistance.get(
                            {
                                origin: [params.latitude,params.longitude].toString(),
                                destination: element.position.toString()
                            },
                            function(err, data) {
                                a++
                                if (err) 
                                 res.send({"message":"google api error","error":err},417);
                                else
                                {
                                    //console.log("Google Duration :"data.durationValue);
                                    console.log(data);
                                    element.duration = Math.ceil(data.durationValue/60);
                                }
                                // console.log(docs);
                                //   console.log(element);
                                if(a==docs.length){
                                    //console.log(docs)
                                    docs=_.sortBy(docs,'duration');
                                    res.send({status:200,data:docs});
                                }
                            })
                    });
                    if(docs.length==0){
                        res.send({"message":"No cab found"},404);
                    }

                }
                else
                {
                    res.send({"message":"error in getting cabs"},417);
                }
            }
        );
    }


var _validate=function(params){



  return  validator.isFloat(params.longitude) &&validator.isFloat( params.latitude) &&validator.isEmail(params.email);


}



    var _GetAll = function(req, res) {



        Service.GetAll(function(error,docs) {

                if(!error && docs)
                {
                    res.json({status:201,data:docs});
                }
                else
                {
                    res.send(417);
                }
            }
        );
    };

    var _GetAllByCriteria = function(req, res) {
        console.log(req.params);
        var params=req.params;
        Service.GetAllByCriteria({user_id:params.driver_id},function(error,docs) {

                if(!error && docs)
                {
                    res.json({status:201,data:docs});
                }
                else
                {
                    res.send(417);
                }
            }
        );
    };

    var _GetById=function (req, res) {
        console.log(req.body);
        var params=req.body;
        Service.GetById(params.id,function (error, doc) {

            if(!error && doc)
            {
                res.json({status:201,data:doc});
            }
            else
            {
                res.send(417);
            }
        });

    };

    var _AddNew = function(req, res) {

        Service.AddNew(req.body,
            function(error,doc) {

                if(!error && doc)
                {
                    var DService=require('../data/models/DriverDetailService');
                    DService.GetByCriteria({email:doc.driverid},function(err,result){
                        if(!error && result)
                        {
                        result.cabid=doc._id;
                            DriverModel.update({ _id: result._id }, { $set: { cabid: doc._id }}).exec();
                            /*DriverModel.update({_id:result._id},{cabid:doc._id}, function(err, numberAffected, rawResponse) {
                                //handle it
                                console.log(rawResponse);
                            //    readOne(doc._id,callback);
                                //  callback(error, rawResponse);
                            })*/
                   //     result.save(function(err,res){console.log(err);console.log(res)});
                        }

                    })

                    res.json({status:201,data:doc});
                }
                else
                {
                    res.send(417,error.message);
                }
            }
        );
    };


    var _Update=function(req,res){

        Service.Update(req.body,function(error,doc) {
                console.log("Update:"+doc);
                if(!error && doc)
                {
                    res.json({status:201,data:doc});
                }
                else
                {
                    res.send(417);
                }
            }
        );
    };

    var _Remove=function(req,res){


        Service.Remove(req.params.id,function(error,doc){
            if(!error && doc)
            {
                res.json({status:201,data:doc});
            }
            else
            {
                res.send(417);
            }
        });
    };





    var _dataTemp=function(req,res){


    temp(req,res);
      //  res.send(200);
    };


function temp(req,res) {


    var first=   [ 36.0129466,-80.039485,
        36.0276883,-80.025504,
        36.0319571,-80.01882 ,
        36.0261611,  -80.0333683,
        36.0203994,-80.0164811,
        36.0374398,-80.0110205,
        36.0306898,-80.0272425,
        36.0280955,-80.0149043,
        36.0130573,-80.0132736,
        36.0093255,-80.0088104
    ];



    var sec=[  26.4043029,-80.2178059, 26.3906084,-80.2288781,
        26.4237991,-80.1720153,
        26.4835067,-80.1963054,
        26.4340215,-80.1403437,
        26.4209551,-80.184804 ,
        26.579957,-80.1738177 ,
        26.5120816,-80.121976 ,
        26.5719737,-80.2078067

    ]

    var j = 0, k = 0;
    for (var i = 0; i < 9; i++) {
        console.log("sec:"+i);

        var doc = {};


        doc.name = 'naveed';
        doc.typeid = 'Cab';
        doc.affiliateid = "123456";
        doc.ownerid = "123456";
        doc.driverid = i+"naveed@yahoo.com";
        doc.statusid = "123456";
        doc.latitude = sec[i + j];
        k += 1;
        doc.longitude = sec[i + k];
        doc.isactive = i%2==0;
        j += 1;
        doc.duration=1;
        Service.AddNew(doc, function (error, doc) {

            if(error)
                res.send(417);
            else{
                var DService=require('../data/models/DriverDetailService');
                DService.GetByCriteria({email:doc.driverid},function(err,result){
                    if(!error && result)
                    {
                        result.cabid=doc._id;
                        DriverModel.update({ _id: result._id }, { $set: { cabid: doc._id }}).exec();
                        /*DriverModel.update({_id:result._id},{cabid:doc._id}, function(err, numberAffected, rawResponse) {
                         //handle it
                         console.log(rawResponse);
                         //    readOne(doc._id,callback);
                         //  callback(error, rawResponse);
                         })*/
                        //     result.save(function(err,res){console.log(err);console.log(res)});
                    }

                })


            }

        });
    }
    j = 0, k = 0;
    for (i = 0; i < 10; i++) {
        console.log("first:"+i);

        var doc = {};


        doc.name = 'naveed';
        doc.typeid = 'Cab';
        doc.affiliateid = "123456";
        doc.ownerid = "123456";
        doc.driverid = (10+i)+"naveed@yahoo.com";
        doc.statusid = "123456";
        doc.latitude = first[i + j];
        k += 1;
        doc.longitude = first[i + k];
        doc.isactive = i%2==0;
        j += 1;
        doc.duration=1;
        Service.AddNew(doc, function (error, doc) {

         //   console.log(result);
           if(error)
            res.send(417);
            else{

               var DService=require('../data/models/DriverDetailService');
               DService.GetByCriteria({email:doc.driverid},function(err,result){
                   if(!error && result)
                   {
                       result.cabid=doc._id;
                       DriverModel.update({ _id: result._id }, { $set: { cabid: doc._id }}).exec();

                   }

               })
           }

        });

    }
    res.send(200);
}

var _cabRequestById = function(req,res){
    var params=req.params;
    var PassService=require('../data/models/PassengerRequestService');
    var passenger_req_search = {
        requestid:params.requestid
    }
    PassService.GetByCriteria(passenger_req_search,function(err,Passdoc){
        if(!err&&(Passdoc!=null)){

            var newDoc = JSON.parse(JSON.stringify(Passdoc));
            if(typeof(Passdoc.passengerid)!="undefined"){
                UserService.GetByCriteria({"email":Passdoc.passengerid},function(perr,pdoc){
                    if(!perr){
                     newDoc.passenger = pdoc;
                    }else{
                      newDoc.message = "error getting passenger"
                    }
                    res.send(newDoc,200);
                });
            }
            else{
                    res.send({message:"Invalid request"},404);
            }

        }
        else{
                res.send({message:"Invalid request"},404);
            }
        
        
    });
}

var _cabRequestCancel = function(req,res){
    var params=req.body;
    var PassService=require('../data/models/PassengerRequestService');
    var passenger_req_search = {
        requestid:params.requestid
    }
    PassService.GetByCriteria(passenger_req_search,function(err,Passdoc){
        if(Passdoc){
            if(Passdoc.passenger_request_status == 'pending'){
                Passdoc.passenger_request_status = "cancelled";
                Passdoc.save();
            }
            res.send(Passdoc,200);
            

        }
    });
}

var _cabRequestStatus = function(req,res){
    var params=req.body;
    var PassService=require('../data/models/PassengerRequestService');
    var passenger_req_search = {
        requestid:params.requestid
    }
    PassService.GetByCriteria(passenger_req_search,function(err,Passdoc){
        if(Passdoc){
            var addinReq = JSON.parse(JSON.stringify(Passdoc));
            if(addinReq.passenger_request_status=='pending'){

                 
                            
                            /*
                             * Searching a driver based on their active status and location
                             */
                             //doc = Passdoc;
                             var cab_search = {
                                position:[addinReq.latitude,addinReq.longitude],
                                driverid:{$nin:Passdoc.requested_drivers},
                                status:"online"
                             }
                             DriverService.getCabByLocationAndStatusAndIgnoredDrivers(cab_search,function(err,docs){
                                if(docs){
                                    /*
                                     * Adding Driver Request
                                     */
                                    
                                    //addinReq.driverid = docs.driverid;
                                    var driver_request_search = {
                                            driverid:docs.driverid,
                                            requestid:addinReq.requestid
                                        }
                                    console.log("Driver found");

                                    var driversArr = Passdoc.requested_drivers;
                                    driversArr.push(docs.driverid);
                                    Passdoc.requested_drivers = driversArr;
                                    Passdoc.save();

                                    DAService.GetByCriteria(driver_request_search,function(driverRequestErr,driverRequestResult){
                                        if(driverRequestResult){
                                            //Send Notification to User Functionality
                                            var user_search = {
                                                email:driver_request_search.driverid
                                            }

                                            UserService.GetByCriteria(user_search,function(userSearchErr,userResult){
                                                //res.send(userSearchErr);

                                                console.log("Sending Notification to user");
                                                if(userResult){
                                                    addinReq.driver_phone_number = userResult.phone_number;
                                                    var notificationData = {
                                                                "email":user_search.email,
                                                                "latitude":addinReq.latitude,
                                                                "longitude":addinReq.longitude,
                                                                "requestid":addinReq.requestid
                                                            }
                                                    passengerRequestNotification(notificationData, addinReq,res);
                                                    


                                                    
                                                 }
                                                else{
                                                    addinReq.message = "Unable to send notification"
                                                    res.send(addinReq,200);                                    
                                                }
                                                        
                                            });
                                            
                                        }else{
                                            driver_request_search.driver_request_status = "pending";
                                            //Add new request
                                            var user_search = {
                                                email:driver_request_search.driverid
                                            }
                                            DAService.AddNew(driver_request_search,function(AddErr,AddResult){
                                                if(!AddErr){
                                                    //Send Notification to driver
                                                    UserService.GetByCriteria(user_search,function(userSearchErr,userResult){
                                                        //res.send(userSearchErr);
                                                        console.log("Sending Notification to user");
                                                        if(userResult){
                                                            addinReq.driver_phone_number = userResult.phone_number;
                                                            var notificationData = {
                                                                "email":user_search.email,
                                                                "latitude":addinReq.latitude,
                                                                "longitude":addinReq.longitude,
                                                                "requestid":addinReq.requestid
                                                            }
                                                            passengerRequestNotification(notificationData, addinReq,res);
    
                                                         }
                                                        else{
                                                            addinReq.message = "Unable to send notification"
                                                            res.send(addinReq,200);                                    
                                                        }
                                                                
                                                    });
                                                    
                                                }
                                            });
                                        }
                                    });

                                }
                                else{
									//Implement Lookup
									//********** Lookup implementation for testing start ************//
									var lookup_search = {passengerid:addinReq.passengerid};
									var LookupService = require('../data/models/LookupService');
									LookupService.GetByCriteria(lookup_search,function(err,doc){
										if(doc){
											var driverid = doc.driverid;
											//Send Notification to User Functionality
											var user_search = {
														email:driverid
											}
											

										   UserService.GetByCriteria(user_search,function(userSearchErr,userResult){
												//res.send(userSearchErr);
												console.log("Sending Notification to user");
												if(userResult){
													addinReq.driver_phone_number = userResult.phone_number;
													var notificationData = {
																"email":user_search.email,
																"latitude":addinReq.latitude,
																"longitude":addinReq.longitude,
																"requestid":addinReq.requestid
															}
													passengerRequestNotification(notificationData, addinReq,res);                     
				   
												 }
												else{
													addinReq.message = "Unable to send notification"
													res.send(addinReq,200);                                    
												}
														
											});
										
										}else{
											addinReq.message = "No cab found";
											res.send(addinReq,404);
										}
									});
									
									
                                   
                                }
                             });                              

            }
            else if(addinReq.passenger_request_status=='fulfilled'){
                /*
                 * Finding trip id in case of fulfilled
                 */
                 var tripSearch = {"requestid":String(addinReq.requestid)}
                 Trip.GetOneByCriteria(tripSearch,function(triperr,tripData){
                    if(tripData){
                        addinReq.tripid = tripData.tripid;
                        addinReq.message = "request has been fulfilled";
                    }else{
                        addinReq.searchQuery = tripSearch;
                    }
                    
                    res.send(addinReq,200);
                 });
                 

            }

        }
        else{

            /*
             * Request not found
             */
            res.send({"message":"Passenger do not exists"},404);

        }

    });
}

var passengerRequestNotification = function(data, responseJson,res){
        var addinReq = responseJson;

        /*data.email;
        data.latitude;
        data.longitude;
        data.requestid*/

        var payLoadJson = {
                            'requestid':data.requestid,
                            'type':'driver',
                            'M':'1',
                            'E':expireDuration
                            //'PS':Number(userResult.ratting).toFixed(1)
                        }

        var user_search = {'email':data.email}
        UserService.GetByCriteria(user_search,function(userSearchErr,userResult){
            console.log("Sending Notification to user");
            if(userResult){
                payLoadJson.PS = Number(userResult.ratting).toFixed(1);
                payLoadJson.FN = userResult.first_name +" "+userResult.last_name;
                DriverService.GetByCriteria({"driverid":user_search.email},function(err,cabDoc){
                    
                    var driverPosition = [cabDoc.position];
                    //var driverPosition = [data.latitude,data.longitude];
                    var passengerPosition = [data.latitude,data.longitude]; 
                    gdistance.get({
                        origin: driverPosition.toString(),
                        destination: passengerPosition.toString()
                        },function(err,data){
                            if(data){
                                //console.log(data);
                                payLoadJson.M = data.distance;
                                payLoadJson.D = data.duration;
                                console.log(payLoadJson);

                                push.SendNotification(userResult.device_id,"You have a passenger to pick",payLoadJson);
                                addinReq.message = "Notification Sent to driver";
                                res.send(addinReq,200);
                            }else{
                                console.log(err);
                                addinReq.message = "Error in google request";
                                res.send(addinReq,200);
                            }                                                    
                    });
                });
            }
            else{
                addinReq.message = "Unable to send notification to "+data.email;
                res.send(addinReq,200);                                    
            }
                                        
        });
}




var _cabRequestNew = function(req,res){
    var params=req.body;
    var PassService=require('../data/models/PassengerRequestService');
    var passenger_req_search = {
        passengerid:params.passengerid,
        passenger_request_status:'pending'
    }

    /*
    *  Searching already existing request
    */
    PassService.GetByCriteria(passenger_req_search,function(err,doc){
        if(doc){
            console.log(doc);
            var addinReq = JSON.parse(JSON.stringify(doc));
            addinReq.requestid = doc.requestid;
            addinReq.message = "Passenger request alredy exists searching driver in progress";

            res.send(addinReq,200);  


            /*
            * Already in request que
            */
            //********** Lookup implementation for testing start ************//
                /*   var lookup_search = {passengerid:params.passengerid};
                    var LookupService = require('../data/models/LookupService');
                    LookupService.GetByCriteria(lookup_search,function(err,doc){

                        if(doc){
                            var driverid = doc.driverid;
                            var notificationData = {
                                "email":driverid,
                                "latitude":addinReq.latitude,
                                "longitude":addinReq.longitude,
                                "requestid":addinReq.requestid
                            }
                            passengerRequestNotification(notificationData, addinReq,res);

                        }
                        else{
                            res.send({"message":"Passenger request alredy exists searching driver in progress"},302);   
                        }

                    });*/

                    //*** Lookup implementaion end ********/
            
        }
        else{
            /*
            * Adding passenger request
            */
            var addinReq = params;
            addinReq.passenger_request_status = "pending"; // inserting with pending status
            addinReq.expireDuration = expireDuration;
			addinReq.request_datetime = new Date();
            geocoder.reverseGeocode(addinReq.latitude,addinReq.longitude,function(geoerr,geodata){

                console.log(geodata.results[0].address_components);

                var passenger_request_complete_address = geodata.results[0].formatted_address;
                var passenger_request_postalcode = "";
                var passenger_request_country = "";
                var passenger_request_city = "";
                var passenger_request_state = "";


                for(var i in geodata.results[0].address_components){
                    if(geodata.results[0].address_components[i].types.indexOf('street_number')>-1){
                        passenger_request_complete_address = geodata.results[0].address_components[i].long_name;
                    }
                    if(geodata.results[0].address_components[i].types.indexOf('route')>-1){
                        passenger_request_complete_address += ", "+geodata.results[0].address_components[i].short_name;
                    }
                    /*if(geodata.results[0].address_components[i].types.indexOf('locality')>-1){
                        passenger_request_complete_address += ", "+geodata.results[0].address_components[i].short_name;
                    }*/
                    if(geodata.results[0].address_components[i].types.indexOf('postal_code')>-1){
                        passenger_request_postalcode = geodata.results[0].address_components[i].long_name;
                    }
                    else if(geodata.results[0].address_components[i].types.indexOf('country')>-1){
                        passenger_request_country = geodata.results[0].address_components[i].long_name;
                    }
                    else if(geodata.results[0].address_components[i].types.indexOf('locality')>-1){
                        passenger_request_city = geodata.results[0].address_components[i].long_name;
                    }
                    else if(geodata.results[0].address_components[i].types.indexOf('administrative_area_level_1')>-1){
                        passenger_request_state = geodata.results[0].address_components[i].short_name;
                    }
                

                }
                addinReq.request_address = passenger_request_complete_address;
                addinReq.request_postal_code = passenger_request_postalcode;
                addinReq.request_city = passenger_request_city;
                addinReq.request_country = passenger_request_country;
                addinReq.request_state = passenger_request_state;

            
            PassService.AddNew(addinReq,function(err,doc){
                var Passdoc = doc
                if(!err){
                    console.log(addinReq);
                    console.log(doc);
                    addinReq.requestid = doc.requestid;
                    console.log('Passenger inserted with pending status');                    

                    //********** Lookup implementation for testing start ************//
                    var lookup_search = {passengerid:params.passengerid};
                    var LookupService = require('../data/models/LookupService');
                    LookupService.GetByCriteria(lookup_search,function(err,lokupdoc){

                        
                            /*
                             * Searching a driver based on their active status and location
                             */
                             var cab_search = {
                                position:[addinReq.latitude,addinReq.longitude],
                                status:"online"
                             }
                             DriverService.GetCabByLocationAndStatus(cab_search,function(err,cabdocs){
                                if(cabdocs){
                                    /*
                                     * Adding Driver Request
                                     */
                                    
                                    //addinReq.driverid = docs.driverid;
                                    //console.log(cabdocs);
                                    var driver_request_search = {
                                            driverid:cabdocs.driverid,
                                            requestid:addinReq.requestid
                                        }
                                    console.log("Driver found");

                                    var driversArr = doc.requested_drivers;
                                    driversArr.push(cabdocs.driverid);
                                    doc.requested_drivers = driversArr;
                                    doc.save();

                                    DAService.GetByCriteria(driver_request_search,function(driverRequestErr,driverRequestResult){
                                        if(driverRequestResult){
                                            //Send Notification to User Functionality
                                            
                                            var user_search = {
                                                email:driver_request_search.driverid
                                            }
                                            var notificationData = {
                                                "email":driver_request_search.driverid,
                                                "latitude":addinReq.latitude,
                                                "longitude":addinReq.longitude,
                                                "requestid":addinReq.requestid
                                            }
                                            passengerRequestNotification(notificationData, addinReq,res);
                                            
                                        }else{
                                            driver_request_search.driver_request_status = "pending";
                                            //Add new request
                                            DAService.AddNew(driver_request_search,function(AddErr,AddResult){
                                                if(!AddErr){
                                                    var notificationData = {
                                                        "email":driver_request_search.driverid,
                                                        "latitude":addinReq.latitude,
                                                        "longitude":addinReq.longitude,
                                                        "requestid":addinReq.requestid
                                                    }
                                                    passengerRequestNotification(notificationData, addinReq,res);
                                                    
                                                }
                                            });
                                        }
                                    });

                                }
                                else{
                                    if(lokupdoc){
                                        var driverid = lokupdoc.driverid;
                                        //Send Notification to User Functionality
                                        var user_search = {
                                                    email:driverid
                                        }
                                        var notificationData = {
                                            "email":driverid,
                                            "latitude":addinReq.latitude,
                                            "longitude":addinReq.longitude,
                                            "requestid":addinReq.requestid
                                        }
                                        passengerRequestNotification(notificationData, addinReq,res);

                                    }else{
                                        addinReq.message = "No Cab Found";
                                         res.send(addinReq,404);      
                                    }                              
                                }
                             });


                        

                    });

                    //*** Lookup implementaion end ********/

                    



                }
                else{
                    res.send({"message":"Internal Server Error"},500);
                }
                


            });
			});

        }
    });
    

}


    var _CabRequest=function(req,res){
        console.log(req.body);
        //udid(R), requestid(R),driverid(R),cabid(R),datetime(R) ,latitude(R),longitude(R)

        var params=req.body;

        if(!(params.longitude && params.latitude && params.udid && params.passengerid && params.requestid))
            res.send(417);

        var _validate=function(params){
            return  validator.isFloat(params.longitude) &&validator.isFloat( params.latitude)  &&validator.isEmail(params.passengerid);
        }

        var PassService=require('../data/models/PassengerRequestService');

        PassService.GetByCriteria({passengerid:params.passengerid, status:'pending'},function(error, doc){
            if(!error && doc)
            {
                //    params.d
                res.json({status:200,data:"IN PROGRESS"});
            }
            else
            {
                params.status="pending";
                PassService.AddNew(params,function(err,docs){

                    if(err)
                        res.send(417,"Passenger not added");

                    async.series([
                        function(next){
                            // do some stuff ...
              var LookupService = require('../data/models/LookupService')
                LookupService.GetByCriteria({passengerid:params.passengerid},function(error,docs){

                        if(!error && docs)
                        {
                            var requestData={driverid:docs.driverid,requestid:params.requestid,status:'pending'}
                            DAService.AddNew(requestData,function(error,doc){
                                console.log(doc);
                                if (error) {
                                    res.send(417,"driver");
                                }
                                else{

                                    UserService.GetByCriteria({email:docs.driverid},function(error,doc){
                                        if(!error && doc)
                                        {
                                            var PushObj={
                                                device_token:doc.device_id,
                                                alert:"a ride is avaialble for you",
                                                sound:"default",
                                                badge:"+1"

                                            }

                                            push.NotifyService(PushObj,function(err,data){
                                                if(err)
                                                    console.log("Driver Notificatin 1 failed")
                                                else
                                                    console.log("Driver Notificatin 1 passed")

                                            })


                                            //    res.json({status:200,data:doc});
                                        }

                                        //   res.send(417,''+error+":"+request.driverid);


                                    })


                                }
                                 setTimeout(function(){  
                                    DAService.GetByCriteria({driverid:docs.driverid,requestid:params.requestid},function(error,doc){
                                    console.log("DAService");
                                    console.log(doc);
                                    console.log(error);


                                    if(!error && doc)
                                    {

                                        if(doc.status=="accepted")
                                        {
                                            //send notification to passenger

                                            UserService.GetByCriteria({email:params.passengerid},function(error,doc){

                                                if(!error && doc)
                                                {
                                                    var PushObj={
                                                        device_token:doc.device_id,
                                                        alert:"Your request has been accpted the details are here",
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




                                            })
                                            console.log("STATUS ACCEPTED")
                                            next(null,"Accepted");

                                        }
                                        else if(doc.status=="reject")
                                        {
                                            // continue;
                                            console.log("STATUS REJECTED")
                                            //  next();
                                        }
                                        else
                                        {
                                            console.log("STATUS NORESPONSE")
                                            doc.status="noresponse";
                                            doc.save();

                                            next(null,"noresponse");
                                        }}

                                })},1000);

                            });
                        }
                        else
                        {
                            next();

                        }

                })
                        },
                        function(callback){


                    var criteria=     { position : { $near : [params.latitude,params.longitude], $maxDistance : 1},isactive:true };
                    Service.GetTenByCriteria(criteria,  function(error,docs) {

                        if(!error && docs)
                        {

                            var a=0;
                            docs.forEach(function(element){
                                //     element.duration={};

                                gdistance.get(
                                    {
                                        origin: [params.latitude,params.longitude].toString(),
                                        destination: element.position.toString()
                                    },
                                    function(err, data) {
                                        a++
                                        if (err)  res.send(417,err.message);
                                        else
                                        {

                                            element.duration=parse(data.duration);

                                        }

                                        if(a==docs.length){
                                            console.log(docs)
                                            docs=_.sortBy(docs,'duration');
                                              var b=0;
                                            async.eachLimit(docs,1,function (request,next) {
                                           /* docs.some(function(request){*/
                                              //  console.log(docs.length+":"+b);
                                                /*if(b==docs.length)
                                                    next("Exit")*/
                                            //    request=docs.shift();
                                                console.log("CALLED");


                                                console.log("req"+request);
                                                    console.log("End")
                                                var requestData={driverid:request.driverid,requestid:params.requestid,status:'pending'}
                                                DAService.AddNew(requestData,function(error,doc){
                                                    console.log(doc);
                                                    if (error) {
                                                        res.send(417,"driver");
                                                    }
                                                    else{

                                                        UserService.GetByCriteria({email:request.driverid},function(error,doc){
                                                            if(!error && doc)
                                                            {
                                                                var PushObj={
                                                                    device_token:doc.device_id,
                                                                    alert:"a ride is avaialble for you",
                                                                    sound:"default",
                                                                    badge:"+1"

                                                                }

                                                                push.NotifyService(PushObj,function(err,data){
                                                                    if(err)
                                                                    console.log("Driver Notificatin 1 failed"+request.driverid)
                                                                    else
                                                                        console.log("Driver Notificatin 1 passed")

                                                                })


                                                            //    res.json({status:200,data:doc});
                                                            }

                                                             //   res.send(417,''+error+":"+request.driverid);


                                                        })


                                                    }
                                             DAService.GetByCriteria({driverid:request.driverid,requestid:params.requestid},function(error,doc){
                                                        console.log("DAService");
                                                        console.log(doc);
                                                        console.log(error);


                                                        if(!error && doc)
                                                        {

                                                            if(doc.status=="accepted")
                                                            {
                                                                //send notification to passenger

                                                                UserService.GetByCriteria({email:params.passengerid},function(error,doc){

                                                                    if(!error && doc)
                                                                    {
                                                                        var PushObj={
                                                                            device_token:doc.device_id,
                                                                            alert:"Your request has been accpted the details are here",
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




                                                                })
                                                           console.log("STATUS ACCEPTED")
                                                                next({status:"Accepted", driverid:request.driverid});

                                                            }
                                                            else if(doc.status=="reject")
                                                            {
                                                                // continue;
                                                                console.log("STATUS REJECTED")
                                                              //  next();
                                                            }
                                                            else
                                                            {
                                                                console.log("STATUS NORESPONSE")
                                                                doc.status="noresponse";
                                                                doc.save();

                                                                next({status:"noresponse", driverid:request.driverid});
                                                            }}

                                                    })

                                                });

                                                //   setTimeout(function(){},100);


                                           /* });*/
                                            //    next("loop exit");
                                            }, function(answer){
                                                var time=10000;
                                                if(answer.status=="Accepted")
                                                    time=0;
                                                setTimeout(function(){

                                                PassService1.GetByCriteria({passengerid:params.passengerid, status:"pending"},function(error,doc){
                                                    console.log("Passenger searched")
                                                    console.log(params);
                                                    console.log("dd"+doc);
                                                    if(!error && doc)
                                                    {
                                                        console.log(answer);
                                                       var message="no ride is available at this time please try again";

                                                        if(answer.status=="Accepted"){
                                                            doc.status="fulfilled";
                                                            doc.save();
                                                           DriverService.GetByCriteria({driverid:answer.driverid},function(error,doc){
                                                                if(!error && doc)
                                                                {
                                                                    message=doc;

                                                                }

                                                               res.json({status:200,data:message});
                                                               callback(null,"cancel")


                                                           })





                                                        }
                                                        else
                                                        {
                                                            doc.status="not-fulfilled";
                                                            doc.save();
                                                            res.json({status:200,data:message});
                                                            callback(null,"cancel")
                                                        }


                                                    }
                                                    else
                                                    {
                                                        res.send(417,"Passenger not available");
                                                        //res.send(417,"criteria failed");
                                                    }
                                                });},time)})
                                           // res.json({status:201,data:docs});
                                        }

                                    });

                            });
                        }
                        else
                        {
                            res.send(417,"Get Ten Error");
                        }

                    })}],
// optional callback
                        function(err,answer){
                        console.log(answer)
                           if(answer[1]!='cancel') {
                            PassService1.GetByCriteria({passengerid:params.passengerid, status:"pending"},function(error,doc){
                                console.log("Passenger searched")
                                console.log(params);
                                console.log("dd"+doc);
                                if(!error && doc)
                                {
                                    console.log(answer);
                                    var message="no ride is available at this time please try again";

                                    if(answer=="Accepted"){
                                        doc.status="fulfilled";
                                        message="Your ride is confirmed";
                                    }
                                    else
                                    {
                                        doc.status="not-fulfilled";

                                    }
                                    doc.save();
                                    res.json({status:200,data:message});
                                }
                                else
                                {
                                    res.send(417,"Passenger not available");
                                    //res.send(417,"criteria failed");
                                }
                            });
                        } // results is now equal to ['one', 'two']
                        });

                })
                //res.send(417,"criteria failed");
            }
           /* setTimeout(function(){         var PassService1=require('../data/models/PassengerRequestService');
                PassService1.GetByCriteria({passengerid:params.passengerid, status:"pending"},function(error,doc){
                    console.log("Passenger searched")
                    console.log(params);
                    console.log("dd"+doc);
                    if(!error && doc)
                    {


                        doc.status="not-fulfilled";
                        doc.save();
                        res.json({status:200,data:"no ride is available at this time please try again"});
                    }
                    else
                    {
                        res.send(417,"Passenger not available");
                        //res.send(417,"criteria failed");
                    }
                });},10000);*/
        });






    };


var _DropCollection=function(req,res){

    var collection = mongoose.connection.collections['cabs']
    collection.remove(function(err) {
        if (err )
            res.send(417,err.message);

    })
    collection = mongoose.connection.collections['drivers']
    collection.remove(function(err) {
        if (err )
            res.send(417,err.message);

    })
    res.send(200)

}
    var _DropRequest=function(req,res){

        var collection = mongoose.connection.collections['driverrequests']
        collection.remove(function(err) {
            if (err )
                res.send(417,err.message);

        })
        collection = mongoose.connection.collections['passengerrequests']
        collection.remove(function(err) {
            if (err )
                res.send(417,err.message);

        })

    }


    var _Distance=function(req,res){
            Service.GetAllByPosition([36.0129466,-80.039485],  function(error,docs) {
                if(!error && docs)
                {
                    var doc=[{},{},{},{},{},{},{},{},{},{}]
                    var a=0;
                    docs.forEach(function(element){
                   //     element.duration={};

                        gdistance.get(
                            {
                                origin: [36.0129466,-80.039485].toString(),
                                destination: element.position.toString()
                            },
                            function(err, data) {
                                a++
                                if (err)  res.send(417,"driver");
                                else
                                {
                                   console.log(parse('1 hr 20 mins 20 sec'));

                                    element.duration=parse(data.duration);

                                }
                               //
                                if(a==docs.length){
                                     console.log(docs)
                                    docs=_.sortBy(docs,'duration');
                                    res.json({status:201,data:docs});
                                }

                            });
                        console.log(a);


                    });


                }
                else
                {
                    res.send(417);
                }
            }
        )
    /*    distance.matrix(['36.0129466,-80.039485'], destinations, function (err, distances) {
            if (!err && distances){

                res.json({status:200,data:distances});
        }
        else
        {
            res.send(417,"distance error");
            //res.send(417,"criteria failed");
        }
        })*/

    }

    var _init=function(app){
        // testing points
        app.get("/api/cab/data",_dataTemp);
        app.get("/api/cab/all",_GetAll);
        app.get("/api/cab/drivercabs/:driver_id",_GetAllByCriteria);
        app.get("/api/cab/drop",_DropCollection);
        app.get("/api/cab/droprequest",_DropRequest);
        app.get("/api/cab/distance",_Distance);
        app.post("/api/cab/id",_GetById);
        app.post("/api/cab/add",_AddNew);


        app.get("/api/cabrequest/:requestid",_cabRequestById)
        // api Service
        app.post("/api/cab/request",_CabRequest);
        app.post("/api/v1/cab/request",_cabRequestNew);
        app.post("/api/v1/cab/requeststatus",_cabRequestStatus);
        app.post("/api/cab/request/cancel",_cabRequestCancel);

        
        app.post("/api/cab",_GetAllByPosition);

    }



    return {
          init:_init
    };
};

module.exports=CabController();