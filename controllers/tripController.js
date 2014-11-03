/**
 * Created by naveed on 7/17/14.
 */
var mongoose = require('mongoose');
var validator=require("validator");
var _=require("underscore");
var gdistance=require('google-distance');
var request = require('request'), qs = require('qs'), moment=require('moment');
var map=require('googlemaps');
var async=require("async");

var URL = 'http://maps.googleapis.com/maps/api/directions/json?';

var _validate=function(params){



    return  validator.isFloat(params.longitude) &&validator.isFloat( params.latitude) &&validator.isNumeric( params.passengerid )&&validator.isNumeric(params.driverid);
}




    function TripController() {

//set Service
    var Service = require('../data/models/PassengerRequestService');
    var UserService=require('../data/models/UserService');
    var DriverService=require('../data/models/DriverDetailService');
    var PassengerService=require('../data/models/PassengerDetailService');
    var Trip = require('../data/models/TripService');
    var TripLocation = require('../data/models/TripLocationService');
    var Utilities = require('../data/models/Utilities');





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
        var params=req.body;
        var params = req.body;
        if(!_validate(params))
            res.send(417,"Validation Fails");

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


    var _UpdateDetails = function (req, res) {
        var params=req.body;

        var data={tripid:params.tripid, longitude:params.longitude,latitude:params.latitude  }
        Service.Update(req.body, function (error, doc) {
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
    var _UpdateStatus = function (req, res) {
        //{latitude:24.849028,longitude:66.997302,tripid:14}
        var params=req.body;

        params.status="complete";
        params.enddate=Date.now();

     //   var data={tripid:params.tripid, longitude:params.longitude,latitude:params.latitude, status:params.status, destination: params.destination, enddate:Date.now() }

        Service.Update(params, function (error, doc) {
                console.log(doc);
                if (!error && doc) {
                    calculateRoute(doc,res);
                    /*Service.GetByCriteria({tripid:params.tripid}, function (error, docs) {

                        if (!error && docs) {
                           // res.json({status: 201, data: docs});
                            calculateRoute(docs.position,res)
                        }
                        else {
                            res.send(417,"No Data Found");
                        }
                    });*/


               //     res.json({status: 201, data: doc});
                }
                else {
                    res.send(417,error.message);
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





    var calculateRoutea=function(){

        var map;
        var origin = "36.0129466,-80.039485"
        var destinations = [
            "36.0261611,-80.0333683",
            "36.0280955,-80.0149043",
            "36.0306898,-80.0272425"
        ];
        var directionsDisplay;
    //    var directionsService = new google.maps.DirectionsService();

        function calculateDistances() {
            var service = new google.maps.DistanceMatrixService();
            service.getDistanceMatrix({
                origins: [origin], //array of origins
                destinations: destinations, //array of destinations
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC,
                avoidHighways: false,
                avoidTolls: false
            }, callback);
        }

        function callback(response, status) {
            if (status != google.maps.DistanceMatrixStatus.OK) {
                alert('Error was: ' + status);
            } else {
                //we only have one origin so there should only be one row
                var routes = response.rows[0];
                var sortable = [];
                var resultText = "Origin: <b>" + origin + "</b><br/>";
                resultText += "Possible Routes: <br/>";
                for (var i = routes.elements.length - 1; i >= 0; i--) {
                    var rteLength = routes.elements[i].duration.value;
                    resultText += "Route: <b>" + destinations[i] + "</b>, " + "Route Length: <b>" + rteLength + "</b><br/>";
                    sortable.push([destinations[i], rteLength]);
                }
                //sort the result lengths from shortest to longest.
                sortable.sort(function (a, b) {
                    return a[1] - b[1];
                });
                //build the waypoints.
                var waypoints = [];
                for (j = 0; j < sortable.length - 1; j++) {
                    console.log(sortable[j][0]);
                    waypoints.push({
                        location: sortable[j][0],
                        stopover: true
                    });
                }
                //start address == origin
                var start = origin;
                //end address is the furthest desitnation from the origin.
                var end = sortable[sortable.length - 1][0];
                //calculate the route with the waypoints
                calculateRoute(start, end, waypoints);
                //log the routes and duration.
                $('#results').html(resultText);
            }
        }

//Calculate the route of the shortest distance we found.







    }
    function calculateRoute(doc,res) {
    //    var directionsService = new google.maps.DirectionsService();
        var points=doc.position;
        var start=points[0];
        var end=points[points.length-1];
        var waypoints=[];
        for (var i =1;i< points.length - 2; i++) {

            waypoints.push({
                location: points[i],
                stopover: true
            });
        }

        var options = {
            origin: start,
            destination: end,
            waypoints: waypoints,
            optimizeWaypoints: true

        };

        var requestURL = URL + qs.stringify(options);
        request(requestURL, function(err, response, data) {
            if (err || response.statusCode != 200) {
              //  return callback(new Error('Google API request error: ' + data));
                res.send(417);
            }
            data=JSON.parse(data);
           var add=data.routes[0].legs[0];
           var summary={distance:add.distance,duration:add.duration,start:add.start_location,end:add.end_location};
            doc.summary=summary;
            res.json({status: 201, data:{doc:doc,summary:summary}});
        });
       /* directionsService.route(request, function (result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                var totalDistance = 0;
                var totalDuration = 0;
                var legs = result.routes[0].legs;
                for(var i=0; i<legs.length; ++i) {
                    totalDistance += legs[i].distance.value;
                    totalDuration += legs[i].duration.value;
                }
        res.json({status: 201, data:{distance:totalDistance, duration:totalDuration}})


            }
        });*/
    }

        function getRoute(req,res) {
            //    var directionsService = new google.maps.DirectionsService();
     /*       var points=doc.position;
            var start=points[0];
            var end=points[points.length-1];
            var waypoints=[];
            for (var i =1;i< points.length - 2; i++) {

                waypoints.push({
                    location: points[i],
                    stopover: true
                });
            }*/

            var options = {
                origin: '24.8508674,67.0181026',
                destination: '24.8536955,67.0060709',
                travelMode: 'DRIVING'


            };

            var requestURL = "https://maps.googleapis.com/maps/api/js?v=3.exp" + qs.stringify(options);
            map.directions('24.8508674,67.0181026','24.8536955,67.0060709', function(err, data) {
                if (err || data.status !="OK") {
                    //  return callback(new Error('Google API request error: ' + data));
                    res.send(417);
                }
                /*data=JSON.parse(data);
                 var add=data.routes[0].legs[0];
                 var summary={distance:add.distance,duration:add.duration,start:add.start_location,end:add.end_location};
                 doc.summary=summary;*/
                res.json({status: 201, data:data.routes[0].overview_polyline});
            });
           /* request(requestURL, function(err, response, data) {
                if (err || response.statusCode != 200) {
                    //  return callback(new Error('Google API request error: ' + data));
                    res.send(417);
                }
                *//*data=JSON.parse(data);
                var add=data.routes[0].legs[0];
                var summary={distance:add.distance,duration:add.duration,start:add.start_location,end:add.end_location};
                doc.summary=summary;*//*
                res.json({status: 201, data:data});
            });*/
            /* directionsService.route(request, function (result, status) {
             if (status == google.maps.DirectionsStatus.OK) {
             var totalDistance = 0;
             var totalDuration = 0;
             var legs = result.routes[0].legs;
             for(var i=0; i<legs.length; ++i) {
             totalDistance += legs[i].distance.value;
             totalDuration += legs[i].duration.value;
             }
             res.json({status: 201, data:{distance:totalDistance, duration:totalDuration}})


             }
             });*/
        }

    var _GetTrip=function(req,res){

         var params=req.body;
        var d = new Date();
        console.log(moment('2014-7-31').toDate());
   //    var start =params.startdate?moment(params.startdate)._d: moment().subtract('days', 1)._d;
        var start =params.startdate?new Date(params.startdate): moment().subtract('days', 1)._d;
      //  start.setDate(d.getDate()-2);
   //     var end =params.enddate?moment(params.enddate)._d: moment()._d;
        var end =params.enddate?moment(params.enddate).hours(24).toDate(): moment()._d;
        Service.GetByCriteriaMany({driverid:params.driverid,"startdate": {"$gte": start, "$lt": moment(params.enddate).hours(24).toDate()}}, function (error, docs) {

         if (!error && docs) {
          res.json({status: 201, data: docs});

         }
         else {
         res.send(417,"No Data Found");
         }
         });




    }
var _GetPassengerTripsNew=function(req,res){



    var params;
    if( !_.isEmpty(req.body) ) {
        params = req.body;
    } else {
        params = {
            startdate:'2014-07-22',
            enddate:  ''

        };
    }
    params.isWeb=req.query.isWeb;

    if(!params.passengerid && !req.session.user){

        if(params.isWeb)
            res.redirect('/');
        else
            res.send(417);
        //     res.redirect('/');
        return false;
    }

    if(!params.passengerid)
        params.passengerid=req.session.user.email;


    var start =params.startdate?new Date(params.startdate): moment().subtract('days', 7)._d;
    var end =params.enddate?moment(params.enddate).hours(23).toDate(): moment()._d;
    //    var end =params.enddate?new Date(params.enddate).setHours(23).toUTCString(): new Date();
    var status=params.status;

    var query;
    if(!status||status=="all")
        query = {passengerid:params.passengerid,"request_datetime": {"$gte": start,"$lte": end }};
    else
        query = {passengerid:params.passengerid,passenger_request_status:status,"request_datetime": {"$gte": start,"$lte": end }};

    Service.GetByCriteriaMany(query,'',null,function (error, data) {

        if (!error && data) {

            async.each(data, function( record, callback) {

                if(record.passenger_request_status=='fulfilled')
                {
                    async.waterfall([
                        function(callback) {

                            Trip.GetOneByCriteria({requestid:record.requestid},function(error,doc){
                                console.log("user_name 1")
                                console.log(record.passengerid);

                                if(!error && doc)
                                {
                                    record.trip=doc
                                    callback(null,doc);

                                    // res.json({status:201,data:doc});
                                }
                                else
                                {
                                    res.send(error,"no User");
                                }



                            })


                        },
                        function(trip,callback) {

                            UserService.GetByCriteria({email:record.driverid},function(error,doc){
                                console.log("user_name 1")
                                console.log(record.passengerid);

                                if(!error && doc)
                                {
                                    record.first_name=doc.first_name;
                                    record.last_name=doc.last_name;
                                    callback(null,doc);

                                    // res.json({status:201,data:doc});
                                }
                                else
                                {
                                    res.send(error,"no User");
                                }



                            })


                        },
                        function(user,callback) {
                            console.log("user_name 2")
                            console.log(user._id)
                            DriverService.GetByCriteria({user_id:user._id},function(error,doc){

                                console.log(doc);
                                if(!error && doc)
                                {
                                    record.user_image=doc.user_image;
                                    callback(null, user);

                                    // res.json({status:201,data:doc});
                                }
                                else
                                {
                                    res.send(417,error);
                                }



                            })

                            //   callback(null, 'JavaScript');
                        }
                    ],
                        function(err, response) {
                            console.log("waterfall response");
                            //    console.log(response);
                            console.log(record);

                            callback();

                        });
                }
                else
                    callback();

            }, function(err){
                // if any of the file processing produced an error, err would equal that error
                if( err ) {
                    // One of the iterations produced an error.
                    // All processing will now stop.
                    console.log('A file failed to process');
                } else {
                    console.log('All files have been processed successfully');
                    //     res.setHeader('Content-Type', 'application/json');
                    //    res.send(200, data);
                    if(params.isWeb){
                        res.render('home_new',{
                            data: data,
                            udata: req.session.user,
                            query: query
                        })
                    }
                    else
                    {
                        res.setHeader('Content-Type', 'application/json');
                        res.send(200, data);

                        //res.json({status: 201, data: data});
                    }
                }
            });





        }
        else {
            res.send(417,"No Data Found");
        }
    });




}

        var _GetPassengerTrips=function(req,res){


            var params;
            if( !_.isEmpty(req.body) ) {
                params = req.body;
            } else {
                params = {
                    startdate:'',
                    enddate:  ''

                };
            }
            params.isWeb=req.query.isWeb;

            if(!params.passengerid && !req.session.user){

                if(params.isWeb)
                    res.redirect('/');
                else
                res.send(417);
           //     res.redirect('/');
                return false;
            }

            if(!params.passengerid)
                params.passengerid=req.session.user.email;


            var start =params.startdate?new Date(params.startdate): moment().subtract('days', 7)._d;
            var end =params.enddate?moment(params.enddate).hours(23).toDate(): moment()._d;
       //    var end =params.enddate?new Date(params.enddate).setHours(23).toUTCString(): new Date();
            var status=params.status;

            var query;
            if(!status||status=="all")
                query = {passengerid:params.passengerid,"trip_start_datetime": {"$gte": start,"$lte": end }};
            else
                query = {passengerid:params.passengerid,trip_status:status,"trip_start_datetime": {"$gte": start,"$lte": end }};

            Trip.GetByCriteriaLean(query,function (error, data) {

                if (!error && data) {

                    async.each(data, function( record, callback) {

                        async.waterfall([
                            function(callback) {

                                UserService.GetByCriteria({email:record.driverid},function(error,doc){
                                    console.log("user_name 1")


                                    if(!error && doc)
                                    {
                                        record.first_name=doc.first_name;
                                        record.last_name=doc.last_name;
                                        callback(null,doc);

                                        // res.json({status:201,data:doc});
                                    }
                                    else
                                    {
                                        res.send(error,"no User");
                                    }



                                })


                            },
                            function(user,callback) {
                                console.log("user_name 2")
                                console.log(user._id)
                                DriverService.GetByCriteria({user_id:user._id},function(error,doc){

                                    console.log(doc);
                                    if(!error && doc)
                                    {
                                        record.user_image=doc.user_image;
                                        callback(null, user);

                                        // res.json({status:201,data:doc});
                                    }
                                    else
                                    {
                                        res.send(417,error);
                                    }



                                })

                                //   callback(null, 'JavaScript');
                            },
                            function(user,callback) {
                                var origin=record.trip_start_latitude+","+record.trip_start_longitude;
                                var destination=record.trip_end_latitude+","+record.trip_end_longitude;
                                map.directions(origin,destination, function(err, data) {
                                    if (err || data.status !="OK") {
                                        //  return callback(new Error('Google API request error: ' + data));
                                        res.send(417);
                                    }
                                    else
                                    {
                                        record.overview_polyline=data.routes[0].overview_polyline.points;
                                        callback(null, user);
                                    }

                                });



                            }
                        ],
                            function(err, response) {
                                console.log("waterfall response");
                                //    console.log(response);
                                console.log(record);

                                callback();

                            });


                    },
                        function(err){
                        // if any of the file processing produced an error, err would equal that error
                        if( err ) {
                            // One of the iterations produced an error.
                            // All processing will now stop.
                            console.log('A file failed to process');
                        } else {
                            console.log('All files have been processed successfully');
                       //     res.setHeader('Content-Type', 'application/json');
                        //    res.send(200, data);
                            if(params.isWeb){
                                res.render('home',{
                                    data: data,
                                    udata: req.session.user,
                                    query: query
                                })
                            }
                            else
                            {
                                res.setHeader('Content-Type', 'application/json');
                                res.send(200, data);

                                //res.json({status: 201, data: data});
                            }
                        }
                    });

                }
                else {
                    res.send(417,"No Data Found");
                }
            });




        }

        var _GetDriverTrips=function(req,res){

          /*  Trip DateTime ( request DateTime )
            StartAddress
            EndAddress
            Total Miles
            Total Minutes
            Total Fare
            Status*/

            var params;
            if( !_.isEmpty(req.body) ) {
                params = req.body;
            } else {
                params = {
                    startdate:'',
                    enddate:  ''

                };
            }


            params.isWeb=req.query.isWeb;
            if(!params.driverid && !req.session.user){
                if(params.isWeb)
                    res.redirect('/');
                else
                    res.send(417);

                return false;

            }

            if(!params.driverid)
            params.driverid=req.session.user.email;

            var start =params.startdate?new Date(params.startdate): moment().subtract('days', 7)._d;
            var end =params.enddate?moment(params.enddate).hours(23).toDate(): moment()._d;
           // var end =params.enddate?new Date(params.enddate): new Date();
            var status=params.status;
            var query;
            if(!status||status=="all")
                query = {driverid:params.driverid,"trip_start_datetime": {"$gte": start,"$lte": end }};
            else
                query = {driverid:params.driverid,trip_status:status,"trip_start_datetime": {"$gte": start,"$lte": end }};
            /*if(params.startdate && params.enddate && params.status)
                query= {driverid:params.driverid,status:status,"startdate": {"$gte": start,"$lte": end }};
            else if(params.startdate && params.enddate )
                query= {driverid:params.driverid,"startdate": {"$gte": start, "$lte": end}};
            else
                query= {driverid:params.driverid,"startdate": {"$gte": start}};*/
            Trip.GetByCriteriaLean(query, function (error, data) {

                if (!error && data) {

                    async.each(data, function( record, callback) {

                        async.waterfall([
                                 function(callback) {

                                    UserService.GetByCriteria({email:record.passengerid},function(error,doc){
                                        console.log(doc)


                                        if(!error && doc)
                                        {
                                            record.first_name=doc.first_name;
                                            record.last_name=doc.last_name;
                                            callback(null,doc);

                                            // res.json({status:201,data:doc});
                                        }
                                        else
                                        {
                                            res.send(error,"no User");
                                        }



                                    })


                                },
                               function(user,callback) {

                                    PassengerService.GetByCriteria({user_id:user._id},function(error,doc){

                                        console.log(doc);
                                        if(!error && doc)
                                        {
                                            record.user_image=doc.user_image;
                                            callback(null, user);

                                            // res.json({status:201,data:doc});
                                        }
                                        else
                                        {
                                            res.send(417,error);
                                        }



                                    })

                                    //   callback(null, 'JavaScript');
                                },
                            function(user,callback) {
                                var origin=record.trip_start_latitude+","+record.trip_start_longitude;
                                var destination=record.trip_end_latitude+","+record.trip_end_longitude;
                                map.directions(origin,destination, function(err, data) {
                                    if (err || data.status !="OK") {
                                        //  return callback(new Error('Google API request error: ' + data));
                                        res.send(417);
                                    }
                                    else
                                    {
                                        record.overview_polyline=data.routes[0].overview_polyline.points;
                                        callback(null, user);
                                    }

                                });



                            }
                            ],
                            function(err, response) {
                                console.log("waterfall response");
                            //    console.log(response);
                                console.log(record);

                                callback();

                            });


                    }, function(err){
                        // if any of the file processing produced an error, err would equal that error
                        if( err ) {
                            // One of the iterations produced an error.
                            // All processing will now stop.
                            console.log('A file failed to process');
                        } else {
                            console.log('All files have been processed successfully');

                         if(params.isWeb){
                            res.render('home',{
                                data: data,
                                udata: req.session.user,
                                query: query
                            })
                        }
                        else
                        {
                            res.setHeader('Content-Type', 'application/json');
                            res.send(200, data);

                            //res.json({status: 201, data: data});
                        }

                        }
                    });


                }
                else {
                    res.send(417,"No Data Found");
                }
            });
        }

        var _GetAdminTrips=function(req,res){

            /*  Trip DateTime ( request DateTime )
             StartAddress
             EndAddress
             Total Miles
             Total Minutes
             Total Fare
             Status*/

            var params;
            if( !_.isEmpty(req.body) ) {
                params = req.body;
            } else {
                params = {
                    startdate:'',
                    enddate:  ''

                };
            }


            params.isWeb=req.query.isWeb;
            /*if(params.startdate=='undefined' && !req.session.user){
                    if(params.isWeb)
                    res.redirect('/');
                else
                    res.send(417);

                return false;

            }
*/


            var start =params.startdate?new Date(params.startdate): moment().subtract('days', 7)._d;
            var end =params.enddate?moment(params.enddate).hours(23).toDate(): moment()._d;
            // var end =params.enddate?new Date(params.enddate): new Date();
            var status=params.status;
            var query;
            if(!status||status=="all")
                query = {"trip_start_datetime": {"$gte": start,"$lte": end }};
            else
                query = {trip_status:status,"trip_start_datetime": {"$gte": start,"$lte": end }};
            /*if(params.startdate && params.enddate && params.status)
             query= {driverid:params.driverid,status:status,"startdate": {"$gte": start,"$lte": end }};
             else if(params.startdate && params.enddate )
             query= {driverid:params.driverid,"startdate": {"$gte": start, "$lte": end}};
             else
             query= {driverid:params.driverid,"startdate": {"$gte": start}};*/
            Trip.GetByCriteriaLean(query, function (error, data) {

                if (!error && data) {

                    async.each(data, function( record, callback) {

                        async.waterfall([
                                function(callback) {

                                    UserService.GetByCriteria({email:record.passengerid},function(error,doc){
                                        console.log(doc)


                                        if(!error && doc)
                                        {
                                            record.first_name=doc.first_name;
                                            record.last_name=doc.last_name;
                                            callback(null,doc);

                                            // res.json({status:201,data:doc});
                                        }
                                        else
                                        {
                                            res.send(error,"no User");
                                        }



                                    })


                                },
                                function(user,callback) {

                                    PassengerService.GetByCriteria({user_id:user._id},function(error,doc){

                                        console.log(doc);
                                        if(!error && doc)
                                        {
                                            record.user_image=doc.user_image;
                                            callback(null, user);

                                            // res.json({status:201,data:doc});
                                        }
                                        else
                                        {
                                            res.send(417,error);
                                        }



                                    })

                                    //   callback(null, 'JavaScript');
                                },
                            function(user,callback) {

                                DriverService.GetByCriteria({driverid:record.driverid},function(error,doc){

                                    console.log(doc);
                                    if(!error && doc)
                                    {
                                        record.chauffeur_license_no=doc.chauffeur_license_no;
                                        callback(null, user);

                                        // res.json({status:201,data:doc});
                                    }
                                    else
                                    {
                                        res.send(417,error);
                                    }



                                })

                                //   callback(null, 'JavaScript');
                            },
                            function(user,callback) {
                                var origin=record.trip_start_latitude+","+record.trip_start_longitude;
                                var destination=record.trip_end_latitude+","+record.trip_end_longitude;
                                map.directions(origin,destination, function(err, data) {
                                    if (err || data.status !="OK") {
                                        //  return callback(new Error('Google API request error: ' + data));
                                   //     res.send(417);
                                    }
                                    else
                                    {
                                        record.overview_polyline=data.routes[0].overview_polyline.points;

                                    }
                                    callback(null, user);
                                });



                            }

                            ],
                            function(err, response) {
                                console.log("waterfall response");
                                //    console.log(response);
                                console.log(record);

                                callback();

                            });


                    }, function(err){
                        // if any of the file processing produced an error, err would equal that error
                        if( err ) {
                            // One of the iterations produced an error.
                            // All processing will now stop.
                            console.log('A file failed to process');
                        } else {
                            console.log('All files have been processed successfully');

                            if(params.isWeb){
                                res.render('home',{
                                    data: data,
                                    udata: req.session.user,
                                    query: query
                                })
                            }
                            else
                            {
                                res.setHeader('Content-Type', 'application/json');
                                res.send(200, data);

                                //res.json({status: 201, data: data});
                            }

                        }
                    });


                }
                else {
                    res.send(417,"No Data Found");
                }
            });
        }

        var _GetTripsByRole=function(req,res){


            var params;
            if( !_.isEmpty(req.body) ) {
                params = req.body;
            } else {
                params = {
                    startdate:'2014-07-22',
                    enddate:  ''

                };
            }
            params.isWeb=req.query.isWeb;

/*            if(!params.passengerid && !req.session.user){

                if(params.isWeb)
                    res.redirect('/');
                else
                    res.send(417);
                //     res.redirect('/');
                return false;
            }*/

/*            if(!params.passengerid)
                params.passengerid=req.session.user.email;*/
            var query={}

/*
            var start =params.startdate?new Date(params.startdate): moment().subtract('days', 7)._d;
            var end =params.enddate?moment(params.enddate).hours(23).toDate(): moment()._d;
            //    var end =params.enddate?new Date(params.enddate).setHours(23).toUTCString(): new Date();
            var status=params.status;

            var query;
            if(!status||status=="all")
                query = {passengerid:params.passengerid,"startdate": {"$gte": start,"$lte": end }};
            else
                query = {passengerid:params.passengerid,status:status,"startdate": {"$gte": start,"$lte": end }};*/

            Trip.GetByCriteria(query,function (error, data) {

                if (!error && data) {
                    var newData=_.map(data,function(record){ return record._doc; })
                    async.each(newData, function( record, callback) {

                        async.waterfall([
                            function(callback) {

                                UserService.GetByCriteria({email:record.driverid},function(error,doc){
                                    console.log("user_name 1")
                                    console.log(doc);
                                   // record.first_name=doc.first_name;
                                 //   record.last_name=doc.last_name;

                                    if(!error && doc)
                                    {
                                        record.driver=doc;
                                        callback(null,doc);

                                        // res.json({status:201,data:doc});
                                    }
                                    else
                                    {
                                        res.send(error,"no User");
                                    }



                                })


                            },
                            function(user,callback) {
                                console.log("user_name 2")
                                console.log(user._id)
                                DriverService.GetByCriteria({user_id:user._id},function(error,doc){

                                    console.log(doc);
                                    if(!error && doc)
                                    {
                                        record.driver._doc.user_image=doc.user_image;
                                        callback(null, user);

                                        // res.json({status:201,data:doc});
                                    }
                                    else
                                    {
                                        res.send(417,error);
                                    }



                                })

                                //   callback(null, 'JavaScript');
                            },
                            function(user,callback) {

                                UserService.GetByCriteria({email:record.passengerid},function(error,doc){


                                    if(!error && doc)
                                    {
                                        record.passenger=doc;
                                //       record.last_name=doc.last_name;
                                        callback(null,doc);

                                        // res.json({status:201,data:doc});
                                    }
                                    else
                                    {
                                        res.send(error,"no User");
                                    }



                                })


                            },
                            function(user,callback) {

                                PassengerService.GetByCriteria({user_id:user._id},function(error,doc){

                                    console.log(doc);
                                    if(!error && doc)
                                    {
                                        record.passenger._doc.user_image=doc.user_image;
                                        callback(null, user);

                                        // res.json({status:201,data:doc});
                                    }
                                    else
                                    {
                                        res.send(417,error);
                                    }



                                })

                                //   callback(null, 'JavaScript');
                            }
                        ],
                            function(err, response) {
                                console.log("waterfall response");
                                //    console.log(response);
                                console.log(record);

                                callback();

                            });


                    }, function(err){
                        // if any of the file processing produced an error, err would equal that error
                        if( err ) {
                            // One of the iterations produced an error.
                            // All processing will now stop.
                            console.log('A file failed to process');
                        } else {
                            console.log('All files have been processed successfully');
                            //     res.setHeader('Content-Type', 'application/json');
                            //    res.send(200, data);
                            if(params.isWeb){
                                res.render('home_admin',{
                                    data: newData,
                                    udata: req.session.user,
                                    query: query
                                })
                            }
                            else
                            {
                                res.setHeader('Content-Type', 'application/json');
                                res.send(200, newData);

                                //res.json({status: 201, data: data});
                            }
                        }
                    });





                }
                else {
                    res.send(417,"No Data Found");
                }
            });




        }

        var _getTripByIdPolyline = function(req,res){
            var params = req.params;
            if(params.tripid){
                Trip.GetOneByCriteria({tripid:params.tripid},function(err,doc){
                    if(!err){
                        var newDoc = JSON.parse(JSON.stringify(doc));
                        UserService.GetByCriteria({"email":doc.passengerid},function(perr,pdoc){
                            if(!err){
                                newDoc.passenger = JSON.parse(JSON.stringify(pdoc));
                                PassengerService.GetOneByCriteria({user_id:pdoc._id},function(passerr,passdoc){
                                    newDoc.passenger.user_image = "no image";
                                    if(passdoc.user_image){
                                        newDoc.passenger.user_image = passdoc.user_image;
                                    }
                                    UserService.GetByCriteria({"email":doc.driverid},function(derr,ddoc){
                                        if(!err){
                                            newDoc.driver = JSON.parse(JSON.stringify(ddoc));
                                            DriverService.ByUser(ddoc._id,function(drierr,dridoc){
                                                newDoc.driver.user_image = "no image";
                                                if(dridoc.user_image){
                                                    newDoc.driver.user_image = dridoc.user_image;
                                                }
                                                var origin=newDoc.trip_start_latitude+","+newDoc.trip_start_longitude;
                                                var destination=newDoc.trip_end_latitude+","+newDoc.trip_end_longitude;
                                                map.directions(origin,destination, function(err, data) {

                                                    if (err || data.status !="OK") {
                                                        //  return callback(new Error('Google API request error: ' + data));
                                                        newDoc.message = "error getting map"
                                                    }
                                                    else
                                                    {
                                                        newDoc.overview_polyline=data.routes[0].overview_polyline.points;
                                                    }
                                                    if(req.query.isWeb)
                                                    {
                                                        res.render("trip_detail",{
                                                            o: newDoc,
                                                            udata: req.session.user
                                                        })
                                                    }
                                                    else{
                                                        newDoc = Utilities.FixURL(newDoc);
                                                        res.send(newDoc,200);
                                                    }
                                                });


                                            });

                                        }else{
                                            newDoc.message = "error getting passenger"
                                            //res.send(newDoc,200);;

                                        }

                                    });

                                });

                            }else{
                                newDoc.message = "error getting passenger"
                            }

                        });

                    }else{
                        res.send({message:"invalid trip id"},404);
                    }

                })
            }

        }


//#{o.user_image}
    var _getTripById = function(req,res){
        var params = req.params;
        if(params.tripid){
            Trip.GetOneByCriteria({tripid:params.tripid},function(err,doc){
                if(!err){
                    var newDoc = JSON.parse(JSON.stringify(doc));
                    UserService.GetByCriteria({"email":doc.passengerid},function(perr,pdoc){
                        if(!err){
                            newDoc.passenger = JSON.parse(JSON.stringify(pdoc));
                            PassengerService.GetOneByCriteria({user_id:pdoc._id},function(passerr,passdoc){
                                newDoc.passenger.user_image = "no image";
                                if(passdoc.user_image){
                                    newDoc.passenger.user_image = passdoc.user_image;
                                }
                                UserService.GetByCriteria({"email":doc.driverid},function(derr,ddoc){
                                    if(!err){
                                        newDoc.driver = JSON.parse(JSON.stringify(ddoc));
                                        DriverService.ByUser(ddoc._id,function(drierr,dridoc){
                                            newDoc.driver.user_image = "no image";
                                            if(dridoc.user_image){
                                                newDoc.driver.user_image = dridoc.user_image;
                                            }

                                            if(req.query.isWeb)
                                            {
                                                res.render("trip_detail",{
                                                    o: newDoc,
                                                    udata: req.session.user
                                                })
                                            }
                                            else{
                                                newDoc = Utilities.FixURL(newDoc);
                                                res.send(newDoc,200);
                                            }
                                            
                                        });
                                        
                                    }else{
                                        newDoc.message = "error getting passenger"
                                        //res.send(newDoc,200);;

                                    }
                                    
                                });
                                
                            });
                            
                        }else{
                            newDoc.message = "error getting passenger"
                        }
                        
                    });
                    
                }else{
                    res.send({message:"invalid trip id"},404);
                }

            })
        }

    }
    var _GetPassengerTripStatus = function(req,res){
        var params = req.params;
        if(params.tripid){
            Trip.GetOneByCriteria({tripid:params.tripid},function(err,doc){
                if(!err){
                    var newDoc = JSON.parse(JSON.stringify(doc));

                    if(typeof(newDoc.trip_driver_arrival_latitude)=='undefined'){
                        newDoc.message = "Driver en-route";
                    }else if((typeof(newDoc.trip_driver_arrival_latitude)!='undefined')&&(typeof(newDoc.trip_start_latitude)=="undefined")){
                        newDoc.message = "Driver is arrived. please on board";
                    }else if((typeof(newDoc.trip_start_latitude)!="undefined")&&(typeof(newDoc.trip_end_latitude)=="undefined")){
                        newDoc.message = "Driving to destination";
                    }else if((typeof(newDoc.trip_end_latitude)!="undefined")&&(typeof(newDoc.trip_fare)=="undefined")){
                        newDoc.message = "Charge fare";
                    }
                    else if(typeof(newDoc.trip_fare)!="undefined"){
                        newDoc.message = "Show Trip Summary";
                    }
                    //Getting trip location
                    TripLocation.GetRecentTripLocation({tripid:params.tripid},function(err,locdata){
                        if(!err&&locdata){
                            newDoc.current_location = [locdata.latitude,locdata.longitude];
                            if(newDoc.message == "Show Trip Summary"){

                                //[36.026618,-81.027635]
                                var tripStartLocation = [newDoc.trip_start_latitude,newDoc.trip_start_longitude];
                                var endTripLocation = [newDoc.trip_end_latitude,newDoc.trip_end_longitude];
                                gdistance.get(
                                        {
                                            origin: tripStartLocation.toString(),
                                            destination: endTripLocation.toString()
                                        },function(geolocerr,geolocdata){
                                            if(geolocerr){
                                                res.send(newDoc,200);
                                            }else{
                                            doc.save();  
                                            newDoc.total_distance = geolocdata.distanceValue;
                                            newDoc.total_duration = geolocdata.durationValue;
                                            //console.log(geolocerr);
                                            //console.log(geolocdata);
                                            newDoc = Utilities.FixURL(newDoc);
                                            res.send(newDoc,200);
                                            }
                                        });
                            }
                            else{
                                newDoc = Utilities.FixURL(newDoc);
                                res.send(newDoc,200);
                            }

                            
                        }      
                        else{
                            newDoc = Utilities.FixURL(newDoc);
                            res.send(newDoc,200);
                        }                  
                        
                    });
                    
                }else{
                    res.send({message:"invalid trip id"},404);
                }

            })
        }

    }
    var _init=function(app){
        //error checking points
       //localhost key  AIzaSyDXvxaIwftgxf-QMXeC2Pkgl_yF1FMozig

        //Start Trip /api/Trip
        app.post("/api/trip",_AddNew);
        // POST] /api/TripDetail
        app.post("/api/tripdetail",_UpdateDetails);
        //  [PUT] /api/Trip
        app.put("/api/trip",_UpdateStatus);
      //  app.post("/api/passenger/trip",_GetTrip)
        app.post("/api/passenger/trip",_GetPassengerTrips)
        app.get("/passenger/trips",_GetPassengerTrips)
        app.get("/driver/trips",_GetDriverTrips)
        app.post("/api/driver/trip",_GetDriverTrips)
        app.get("/admin/trips",_GetAdminTrips)
        app.post("/api/admin/trip",_GetAdminTrips)
        app.get("/api/trip/:tripid/:role/:passengerid",_getTripById);
        app.get("/api/trip/:tripid/polyline",_getTripByIdPolyline);
        app.get("/api/passenger/tripstatus/:tripid",_GetPassengerTripStatus);
        app.get("/api/trip/:role",_GetTripsByRole);

        app.get("/api/trip",getRoute);
    }

    return {
        init:_init
    };


}

module.exports=TripController();

//32623966