/**
 * Created by Asif on 8/11/2014.
 */


var mongoose = require('mongoose');
var validator=require("validator");
var request = require('request');

var async=require("async");

var _validate=function(params){
    return  !validator.isNull(params.name);
}

function PassengerDetailController() {

//set Service
    var Service = require('../data/models/PassengerDetailService');
    var UserService = require('../data/models/UserService');
    var AffiliateService = require("../data/models/AffiliateService");

    var _AddNew = function (req, res) {

        var params=req.body;
        params.isactive = true;

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

    var _GetAll = function (req, res) {
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

    var _GetById = function (req, res) {
        console.log(req.params);
        var params=req.params;
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
    var _Update = function (req, res) {
        var params=req.body;
        var data={tip:params.tip, favourite_affiliate:params.favourite_affiliate  }

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
    var _UpdateCashPayment = function (req, res) {

        Service.EditCashPayment(req.body, function (error, doc) {
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

    var _UpdatePreference = function (req, res) {

        Service.EditPreference(req.body, function (error, doc) {
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

    //Create By Mukarram for use in Passenger Administration.
    var _GetPassengersAdmin = function(req,res){
        var _pageIndex = 0;
        var _pageSize = 20;

        if(req.query.pageIndex!= undefined && req.query.pageIndex != '' )
            _pageIndex = req.query.pageIndex;

        if(req.query.pageSize!= undefined && req.query.pageSize != '' )
            _pageSize = req.query.pageSize;

        var query = {user_type:"passenger"};

        if(req.query.first_name != undefined && req.query.first_name != '' &&
            req.query.last_name != undefined && req.query.last_name != '')
            query = {user_type:"passenger", first_name:req.query.first_name, last_name:req.query.last_name};

        if(req.query.first_name != undefined && req.query.first_name != '')
            query = {user_type:"passenger", first_name:req.query.first_name};

        if(req.query.last_name != undefined && req.query.last_name != '')
            query = {user_type:"passenger", last_name:req.query.last_name};

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
                                        record.pessengerDetails = doc;
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

    var _init=function(app){
        app.get("/api/passenger_detail/:id",_GetById);
        app.post("/api/passenger_detail",_AddNew);
        app.get("/api/passenger_detail/all",_GetAll);
        app.post("/api/passenger_detail/id",_GetById);
        app.put("/api/passenger_detail",_Update);
        app.put("/api/passenger_detail/cash_payment",_UpdateCashPayment);
        app.put("/api/passenger_detail/preference",_UpdatePreference);

        //Get all passengers
        app.get("/api/GetPassengersAdmin",_GetPassengersAdmin);

    }

    return {
        init:_init
    };

};

module.exports=PassengerDetailController();