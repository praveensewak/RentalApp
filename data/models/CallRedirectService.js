/**
 * Created by naveed on 8/10/14.
 */



var mongoose = require('mongoose'),
    CallRedirect = mongoose.model('CallRedirect');


var repository=(function(){

    function create(data, callback)
    {
        var doc = new CallRedirect();

       // doc.name = data.name;
        doc.save(function (error, result) {
        CallRedirect.update({_id:doc._id}, data, function(err, numberAffected, rawResponse) {
            //handle it
            console.log(rawResponse);
            read({_id:doc._id},callback);
            //  callback(error, rawResponse);
        })

        });
        /*doc.save(function (error, result) {
            console.log(error);
            callback(error, result);
        });*/
    }


    function readAll(callback)
    {
        CallRedirect.find({},function (error, result) {
            callback(error, result);
        });

    }



    function readOne(id,callback)
    {
        CallRedirect.findById(id,function (error, result) {
            callback(error, result);
        });

    }

    function read(jsonCriteria,callback)
    {
        console.log(jsonCriteria);
        CallRedirect.findOne(jsonCriteria,function (error, result) {
            callback(error, result);
        });

    }

    function edit(data, callback)
    {
        readOne(data._id, function (err, doc) {
            if (err){
                callback(err, null);
            }
            else {

                doc.name = data.name;
                doc.save(function (error, result) {
                    console.log(error);
                    callback(error, result);
                });
            }
        });
    }

    function remove(id,callback)
    {
        readOne(id, function (err, doc) {
            if (err){
                callback(err, null);
            } else {

                CallRedirect.remove(doc,function (err, result) {
                    callback(err, result);
                });
            }
        });

    }

    return {
        AddNew:create,
        GetById:readOne,
        GetByCriteria:read,
        Update:edit,
        Remove:remove,
        GetAll:readAll
    };
})();

module.exports=repository;