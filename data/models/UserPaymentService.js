/**
 * Created by Asif on 8/30/2014.
 */

var mongoose = require('mongoose'),
    UserPayment = mongoose.model('UserPayment');


var repository=(function(){

    function create(data, callback)
    {
        var doc = new UserPayment();

        doc.name = data.name;
        doc.country = data.country;
        doc.city = data.city;
        doc.affiliate_logo = data.affiliate_logo;
        doc.isactive = data.isactive;
        doc.save(function (error, result) {
            console.log(error);
            callback(error, result);
        });
    }


    function readAll(callback)
    {
        UserPayment.find({},function (error, result) {
            callback(error, result);
        });

    }



    function readOne(id,callback)
    {
        UserPayment.findById(id,function (error, result) {
            callback(error, result);
        });

    }

    function read(jsonCriteria,callback)
    {
        console.log(jsonCriteria);
        UserPayment.findOne(jsonCriteria,function (error, result) {
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

                UserPayment.remove(doc,function (err, result) {
                    callback(err, result);
                });
            }
        });

    }

    function readAllByCriteria(jsonCriteria,callback)
    {
        console.log(jsonCriteria);
        UserPayment.find(jsonCriteria,function (error, result) {
            callback(error, result);
        });

    }

    return {
        AddNew:create,
        GetById:readOne,
        GetByCriteria:read,
        Update:edit,
        Remove:remove,
        GetAll:readAll,
        GetAllByCriteria:readAllByCriteria
        //UndefaultAll:unDefaultAll
    };
})();

module.exports=repository;