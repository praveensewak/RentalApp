/**
 * Created by naveed on 8/10/14.
 */

'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var async =require('async');
//1-load schema:already done in server.js
//2-load Repository




function CallRedidrectController(){

//set Service
    var Service=require('../data/models/CallRedirectService');
    var UserService = require('../data/models/UserService');

    var _GetAll = function(req, res) {


        Service.GetAll(function(error,docs) {
                console.log(entity+".GetAll:"+docs);
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

        Service.GetById(req.params.id,function (error, doc) {
            console.log("GetById:"+doc);
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
                console.log("AddNew:"+doc);
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

    var _Update=function(req,res){

        Service.Update(req.body,function(error,json) {
                console.log("Update Result:");
                console.log(json);

                if(!error && json)
                {
                    res.json({status:201,data:json});
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
                res.send(error.status);
            }
        });
    };

    var _callNew=function(req,res){

       /* UDID
        TripID
        passengerid
        driverid
        DateTime
        CallTyp*/
    var params=req.body;
        async.series({
                passengerid: function(callback) {

                    UserService.GetByCriteria({email:params.passengerid},function(error,doc){

                        if(!error && doc)
                        {
                            doc.phone_number = doc.phone_number.replace(/\D/g,'');
                            callback(null, doc.phone_number);

                           // res.json({status:201,data:doc});
                        }
                        else
                        {
                            res.send(error.status);
                        }



                    })


                },
                driverid: function(callback) {

                    UserService.GetByCriteria({email:params.driverid},function(error,doc){

                        if(!error && doc)
                        {

                            doc.phone_number = doc.phone_number.replace(/\D/g,'');
                            callback(null, doc.phone_number);

                            // res.json({status:201,data:doc});
                        }
                        else
                        {
                            res.send(error.status);
                        }



                    })

                 //   callback(null, 'JavaScript');
                }
            },
            function(err, response) {
                console.log(response);
                // response == {passengerid: 'Node.js', driverid: 'JavaScript'}
                var callObj ={ udid:params.udid||'',   tripid: params.tripid||'', useridFrom:"", CallFrom:"",useridTo:"",CallTo:""}


                if(params.CallType==1){
                callObj.useridFrom=params.passengerid;
                callObj.CallFrom=response.passengerid;
                callObj.useridTo=params.driverid;
                callObj.CallTo=response.driverid;

                }
                else {
                    callObj.useridFrom=params.driverid;
                    callObj.CallFrom=response.driverid
                    callObj.useridTo=params.passengerid;
                    callObj.CallTo=response.passengerid;


                }

                Service.GetByCriteria({CallFrom:callObj.CallFrom},function(error,doc){

                    if(!error)
                    {
                        if(doc){

                            doc.useridTo=callObj.useridTo;
                            doc.CallTo=callObj.CallTo;
                            doc.save()
                            res.json({status:201,data:doc});
                        }
                        else
                        {
                            Service.AddNew(callObj,
                                function(error,doc) {
                                    console.log("AddNew:"+doc);
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



                        }



                    }
                    else
                    {
                        res.send(error.status);
                    }


                })
            }
        );

    }


    var _callRedirect=function(req,res){

        var params=req.body;
        params.From = params.From.replace(/\D/g,'');

        Service.GetByCriteria({CallFrom:params.From.substring(1)},function(error,doc){

            if(!error)
            {
                var result;
                    if(doc && doc.CallTo)
                    {
                    result=_getForwardCallBody(doc.CallTo);

                    }
                    else
                    {
                    result=_getPlaySongBody();

                    }

                res.header('Content-Type','text/xml').send(result)
            }
            else{
                res.send(400);

            }

        });


    }

  var   _getForwardCallBody =function(number)
    {
        var callerId = '+1 813-513-9522';
        var body = "<Response><Say voice=\"man\">Thank you for calling taxi. Please Hold. We are connecting your taxi Driver.</Say><Dial callerId='" + callerId + "'>";
        if (/^[\d\(\)\-\+ ]+$/.test( number)) {
            body +=  "<Number>" +"+1"+ number + "</Number>";
        } else {
            body +="<Client>"+number+"</Client>";
        }
        body +="</Dial></Response>";
        return body;
    }

// Get TwiML xml string to play song
   var _getPlaySongBody=function()
    {
        var body = "<Response><Say voice=\"man\">Thank you for calling taxi. Your taxi Driver could not be reached at this moment, please try again.</Say></Response>";
        return body;
    }


    var _init=function(app){
        //error checking points
        app.post("/api/call",_callNew);
        app.post("/api/call/redirect",_callRedirect);

    }


    return {
        init:_init
    };
};

module.exports=CallRedidrectController();