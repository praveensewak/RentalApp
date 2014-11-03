/**
 * Created by Asif on 9/5/2014.
 */

var mongoose = require('mongoose'),
    DriverCabHistory = mongoose.model('DriverCabHistory');


var repository=(function(){

    function create(data, callback)
    {
        var doc = new DriverCabHistory();

        doc.cab_medallion_number = data.cab_medallion_number;
        doc.cab_affiliate_id = data.cab_affiliate_id;
        doc.user_id = data.user_id;

        doc.save(function (error, result) {
            console.log(error);
            callback(error, result);
        });
    }


    function readAll(callback)
    {
        DriverCabHistory.find({},function (error, result) {
            var  i = result.length;
            while(i--){
                console.log(result[i]);
                if(result[i].affiliate_logo)
                {
                    var ms = require('../../modules/message-settings');
                    result[i].affiliate_logo = ms.url+result[i].affiliate_logo;
                }
            }
            callback(error, result);
        });

    }



    function readOne(id,callback)
    {
        DriverCabHistory.findById(id,function (error, result) {
            callback(error, result);
        });

    }

    function read(jsonCriteria,callback)
    {
        console.log(jsonCriteria);
        DriverCabHistory.findOne(jsonCriteria,function (error, result) {
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

                DriverCabHistory.remove(doc,function (err, result) {
                    callback(err, result);
                });
            }
        });

    }

    function readAllByCriteria(jsonCriteria,callback)
    {
        console.log(jsonCriteria);
        DriverCabHistory.find(jsonCriteria,function (error, result) {
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
    };
})();

module.exports=repository;