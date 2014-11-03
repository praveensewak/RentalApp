
var mongoose = require('mongoose'),
    User = mongoose.model('User');


var repository=(function(){

    function create(data, callback)
    {
        var doc = new User();
        User.update({_id:doc._id}, data, function(err, numberAffected, rawResponse) {
            //handle it
            console.log(rawResponse);
            readOne(doc._id,callback);
            //  callback(error, rawResponse);
        })
        /*doc.tripname = data.tripname;
         doc.origin=data.origin;
         doc.position.push(data.latitude+","+data.longitude);
         *//*    doc.latitude=data.latitude;
         doc.longitude=data.longitude;*//*
         doc.driverid=data.driverid;
         doc.passengerid=data.passengerid;
         doc.status=data.status||"in progress";
         doc.save(function (error, result) {
         console.log(error);
         callback(error, result);
         });*/
    }


    function readAll(callback)
    {
        User.find({},function (error, result) {
            callback(error, result);
        });

    }



    function readOne(id,callback)
    {
        User.findById(id,function (error, result) {
            callback(error, result);
        });



    }

    function read(jsonCriteria,callback)
    {
        console.log(jsonCriteria);
        User.findOne(jsonCriteria,'',function (error, result) {
            callback(error, result);
        });

    }
    function readMany(jsonCriteria,callback)
    {
        console.log(jsonCriteria);
        User.find(jsonCriteria,'',function (error, result) {
            callback(error, result);
        });
    }

    //Create By Mukarram for use in Driver Administration.
    function readManyByCriteria(jsonCriteria,bGetRecordCount,pageindex,pagesize,callback)
    {
        if(bGetRecordCount)
            var query = User.find(jsonCriteria)
                .sort({$natural: -1})
                .lean()
                .exec(function(err,docs){
                    if(err)
                        callback(err);
                    else
                        callback(null,docs);
                });
        else
            var query = User.find(jsonCriteria)
                .skip(pageindex*pagesize)
                .limit(pagesize)
                .sort({$natural: -1})
                .lean()
                .exec(function(err,docs){
                    if(err)
                        callback(err);
                    else
                        callback(null,docs);
                });
    }


    function edit(data, callback)
    {
        readOne(data._id, function (err, doc) {
            if (err){
                callback(err, null);
            }
            else {

                doc.update(data, function(err, numberAffected, rawResponse) {
                    //handle it
                    console.log(rawResponse);
                    readOne(doc._id,callback);
                    //  callback(error, rawResponse);
                })


            }



        });
    }

    function remove(id,callback)
    {
        readOne(id, function (err, doc) {
            if (err){
                callback(err, null);
            } else {
                User.remove(doc,function (err, result) {
                    callback(err, result);
                });
            }
        });

    }
    function empty(callback){
        User.collection.remove();
        callback()
    }
    
    return {
        AddNew:create,
        GetById:readOne,
        GetByCriteria:read,
        GetByCriteriaMany:readMany,
        GetUsersByCriteria:readManyByCriteria,
        Update:edit,
        Remove:remove,
        GetAll:readAll,
        Empty:empty
    };
})();

module.exports=repository;