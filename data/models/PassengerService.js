/**
 * Created by Asif on 8/10/2014.
 */

var mongoose = require('mongoose'),
    PassengerDetail = mongoose.model('PassengerDetail');


var repository=(function(){

    function create(data, callback)
    {
        var doc = new PassengerDetail();

        doc.user_id = data.user_id;
        doc.favourite_affiliate = data.favourite_affiliate;
        doc.tip = data.tip;
        doc.city = data.city;
        doc.state = data.state;
        doc.isactive = data.isactive;
        doc.save(function (error, result) {
            console.log(error);
            callback(error, result);
        });
    }


    function readAll(callback)
    {
        PassengerDetail.find({},function (error, result) {
            callback(error, result);
        });

    }



    function readOne(id,callback)
    {
        PassengerDetail.findById(id,function (error, result) {
            callback(error, result);
        });

    }

    function read(jsonCriteria,callback)
    {
        console.log(jsonCriteria);
        PassengerDetail.findOne(jsonCriteria,function (error, result) {
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

                doc.favourite_affiliate = data.favourite_affiliate;
                doc.tip = data.tip;
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

                PassengerDetail.remove(doc,function (err, result) {
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