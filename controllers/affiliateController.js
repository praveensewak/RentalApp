/**
 * Created by Asif on 8/4/2014.
 */

var mongoose = require('mongoose');
var validator=require("validator");
var request = require('request'),
    qs      = require('qs'), moment=require('moment');

var URL = 'http://maps.googleapis.com/maps/api/directions/json?';

var _validate=function(params){
    return  !validator.isNull(params.name);
}




function AffiliateController() {

//set Service
    var Service = require('../data/models/AffiliateService.js');

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

    };

    var _GetAllByCity = function(req, res) {
        console.log(req.params);
        var params=req.params;
        Service.GetAllByCriteria({country:params.city},function(error,docs) {

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

    var _init=function(app){
        app.post("/api/affiliate/add",_AddNew);
        app.get("/api/affiliate",_GetAll);
        app.get("/api/affiliate/:city",_GetAllByCity);
        app.post("/api/affiliate/id",_GetById);
    }

    return {
        init:_init
    };

};

module.exports=AffiliateController();