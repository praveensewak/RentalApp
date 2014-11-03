/**
 * Created by Naveed on 7/3/2014.
 */


var mongoose = require('mongoose'),
    DriverRequest = mongoose.model('DriverRequest');


var repository=(function(){

    function create(data, callback)
    {
        var doc = new DriverRequest();

        doc.driverid = data.driverid;
        doc.requestid = data.requestid;
        doc.status = data.status;
        doc.save(function (error, result) {
            console.log(error);
            callback(error, result);
        });
    }


    function readAll(callback)
    {
        DriverRequest.find({},function (error, result) {
            callback(error, result);
        });

    }



    function readOne(id,callback)
    {
        DriverRequest.findById(id,function (error, result) {
            callback(error, result);
        });

    }

    function read(jsonCriteria,callback)
    {
        console.log(jsonCriteria);
        DriverRequest.findOne(jsonCriteria,function (error, result) {
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

                doc.firstname = data.firstname;
                doc.lastname = data.lastname;
                doc.middlename=data.middlename;
                doc.dateofbirth=data.dateofbirth;
                doc.licenseno=data.licenseno;
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
                DriverRequest.remove(doc,function (err, result) {
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