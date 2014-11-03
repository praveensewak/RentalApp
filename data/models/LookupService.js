/**
 * Created by naveed on 8/4/14.
 */
/**
 * Created by Naveed on 7/3/2014.
 */


var mongoose = require('mongoose'),
    Passenger = mongoose.model('Lookup');


var repository=(function(){

    function create(data, callback)
    {  //   console.log(data);

        var doc = new Passenger();
        doc.passengerid= data.passengerid;
        doc.driverid = data.driverid;
        doc.status= data.status;
        doc.save(function (error, result) {
            console.log("status saved");
            console.log(result);
            callback(error, result);
        });
    }


    function readAll(callback)
    {
        Passenger.find({},function (error, result) {
            callback(error, result);
        });

    }



    function readOne(id,callback)
    {
        Passenger.findById(id,function (error, result) {
            callback(error, result);
        });

    }

    function read(jsonCriteria,callback)
    {
        console.log(jsonCriteria);
        Passenger.findOne(jsonCriteria,function (error, result) {
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

                doc.driverid = data.driverid;
                doc.status= data.status;
                doc.save(function (error, result) {
                    console.log(error);
                    callback(error, result);
                });
            }
        });
    }

    function editStatus(data, callback)
    {
        read({passengerid:data.passengerid, status:'pending'}, function (err, doc) {

            if(!err && doc)
            {

                // doc.driverid = data.driverid;
                doc.status= data.status;
                doc.save(function (error, result) {
                    console.log(result);
                    callback(error, result);
                });
            }
            else
            {
                callback(err, null);
            }

        });
    }

    function remove(id,callback)
    {
        readOne(id, function (err, doc) {
            if (err){
                callback(err, null);
            } else {
                Passenger.remove(doc,function (err, result) {
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
        UpdateStatus:editStatus,
        Remove:remove,
        GetAll:readAll
    };
})();

module.exports=repository;