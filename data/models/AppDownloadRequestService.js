/**
 * Created by Asif on 9/12/2014.
 */

/**
 * Created by Naveed on 6/24/2014.
 */


var mongoose = require('mongoose'),
    AppDownloadRequest = mongoose.model('AppDownloadRequest');


var repository=(function(){

    function create(data, callback)
    {
        var doc = new AppDownloadRequest();

        doc.first_name = data.first_name;
        doc.last_name = data.last_name;
        doc.state = data.state;
        doc.email_address = data.email_address;
        doc.city = data.city;
        doc.affiliate = data.affiliate;
        doc.comments = data.comments;
        doc.save(function (error, result) {
            console.log(error);
            callback(error, result);
        });
    }


    function readAll(callback)
    {
        AppDownloadRequest.find({},function (error, result) {
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
        AppDownloadRequest.findById(id,function (error, result) {
            callback(error, result);
        });

    }

    function read(jsonCriteria,callback)
    {
        console.log(jsonCriteria);
        AppDownloadRequest.findOne(jsonCriteria,function (error, result) {
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

                AppDownloadRequest.remove(doc,function (err, result) {
                    callback(err, result);
                });
            }
        });

    }

    function readAllByCriteria(jsonCriteria,callback)
    {
        console.log(jsonCriteria);
        AppDownloadRequest.find(jsonCriteria,function (error, result) {
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