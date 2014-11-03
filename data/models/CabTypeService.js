/**
 * Created by Naveed on 6/24/2014.
 */


var mongoose = require('mongoose'),
    CabType = mongoose.model('CabType');


var repository=(function(){

    function create(data, callback)
    {
        var doc = new CabType();

        doc.name = data.name;
        doc.save(function (error, result) {
            console.log(error);
            callback(error, result);
        });
    }


    function readAll(callback)
    {
        CabType.find({},function (error, result) {
            callback(error, result);
        });

    }



    function readOne(id,callback)
    {
        CabType.findById(id,function (error, result) {
            callback(error, result);
        });

    }

    function read(jsonCriteria,callback)
    {
        console.log(jsonCriteria);
        CabType.findOne(jsonCriteria,function (error, result) {
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

                Cab.remove(doc,function (err, result) {
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