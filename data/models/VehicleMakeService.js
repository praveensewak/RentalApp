/**
 * Created by Asif on 8/9/2014.
 */

var mongoose = require('mongoose'),
    VehicleMake = mongoose.model('VehicleMake');


var repository=(function(){

    function create(data, callback)
    {
        var doc = new VehicleMake();

        doc.name = data.name;
        doc.country = data.country;
        doc.city = data.city;
        doc.isactive = data.isactive;
        doc.save(function (error, result) {
            console.log(error);
            callback(error, result);
        });
    }


    function readAll(callback)
    {
        VehicleMake.find({},function (error, result) {
            callback(error, result);
        });

    }



    function readOne(id,callback)
    {
        VehicleMake.findById(id,function (error, result) {
            callback(error, result);
        });

    }

    function read(jsonCriteria,callback)
    {
        console.log(jsonCriteria);
        VehicleMake.findOne(jsonCriteria,function (error, result) {
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
                doc.isactive = data.isactive;
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

                VehicleMake.remove(doc,function (err, result) {
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