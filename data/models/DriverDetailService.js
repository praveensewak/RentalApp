
var mongoose = require('mongoose'),
    Driver = mongoose.model('DriverDetails');

var repository=(function(){

    function create(data, callback)
    {
        var doc = new Driver();
        Driver.update({_id:doc._id}, data, function(err, numberAffected, rawResponse) {
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
        Driver.find({},function (error, result) {
            callback(error, result);
        });

    }



    function readOne(id,callback)
    {
        Driver.findById(id,function (error, result) {
            callback(error, result);
        });
    }

    function read(jsonCriteria,callback)
    {
        console.log(jsonCriteria);
        Driver.findOne(jsonCriteria,function (error, result) {
            callback(error, result);
        });
    }

    function readByUserId(user_id,callback)
    {
        console.log(user_id);
        Driver.findOne({user_id: user_id},function (error, result) {
            callback(error, result);
        });
    }

    function readMany(jsonCriteria,callback)
    {
        console.log(jsonCriteria);
        Driver.find(jsonCriteria,function (error, result) {
            callback(error, result);
        });
    }

    //Create By Mukarram for use in Driver Administration.
    function readManyByCriteria(jsonCriteria,callback)
    {
        Driver.find(function (error, result) {
            callback(error, result);
        });
        /*
        var query = Driver.find()
            .sort({$natural:-1})
            .exec(function(err,docs){
                if(err)
                    callback(err);
                else
                    callback(null,docs);
            });
        */
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
                Driver.remove(doc,function (err, result) {
                    callback(err, result);
                });
            }
        });

    }
    function empty(callback){
        Driver.collection.remove();
        callback()
    }

    function updateDriverJobStatus(data, callback)
    {
        readByUserId(data.user_id, function (err, doc) {
            if (err){
                callback(err, null);
            }
            else {
                doc.status = data.status;
                doc.save(function (error, result) {
                    console.log(error);
                    callback(error, result);
                });
            }
        });
    }

    function updateDriverCab(data, callback)
    {
        read( {driverid: data.user_id} , function (err, doc) {
            if (err){
                callback(err, null);
            }
            else
            if(doc)
            {
                doc.cab_affiliate_id = data.cab_affiliate_id;
                doc.cab_medallion_number = data.cab_medallion_number;
                doc.save(function (error, result) {
                    console.log(error);
                    callback(error, result);
                });
            }
            else
                callback({message:'record not found.'}, doc);

        });
    }

    function _updateDriverImage(data, callback)
    {
        read( {user_id: data.user_id} , function (err, doc) {
            if (err){
                callback(err, null);
            }
            else
            if(doc)
            {
                doc.user_image = data.user_image;
                doc.save(function (error, result) {
                    console.log(error);
                    callback(error, result);
                });
            }
            else
                callback({message:'record not found.'}, doc);

        });
    }


    function updateBankDetail(data, callback)
    {
        read( {user_id: data.user_id} , function (err, doc) {
            if (err){
                callback(err, null);
            }
            else
            if(doc)
            {

                doc.bank_name = data.bank_name;
                doc.bank_routing_number = data.bank_routing_number;
                doc.bank_account_number = data.bank_account_number;
                doc.bank_phone_number = data.bank_phone_number;
                doc.bank_contact_person = data.bank_contact_person;
                doc.notes = data.notes;
                doc.save(function (error, result) {
                    console.log(error);
                    callback(error, result);
                });
            }
            else
                callback({message:'record not found.'}, doc);
        });
    }

    function readAllByPosition(pos,callback)
    {
        /*Cab.find({},function (error, result) {
         callback(error, result);
         });*/
        //    {coords : { $near : [req.params.lon, req.params.lat], $maxDistance : req.params.dist/68.91}}
        console.log(pos);
        Driver.find({status:"online", position : { $near : pos, $maxDistance : 1}})
            .limit(10)
            .exec(callback);



    }
    function getCabByLocationAndStatus(jsonCriteria,callback){
        //  [36.026608,-80.024635] // Sample position
        Driver.findOne({ status:"online",position : { $near : jsonCriteria.position, $maxDistance : 1}})
           .exec(function(err,docs){
                /*
                 * Need to implement a criteria status:"online",to avoid already occoupied cabs
                 */
                callback(err,docs);

           });
       
    }
    function _getCabByLocationAndStatusAndIgnoredDrivers(jsonCriteria,callback){
        //  [36.026608,-80.024635] // Sample position
        //console.log({driverid:jsonCriteria.driverid, position : { $near : jsonCriteria.position, $maxDistance : 1},isactive:true});
        Driver.findOne({driverid:jsonCriteria.driverid,status:"online", position : { $near : jsonCriteria.position, $maxDistance : 1}})
           .exec(function(err,docs){
                /*
                 * Need to implement a criteria to avoid already occoupied cabs
                 */
                callback(err,docs);

           });
       
    }
    function readAllByPosition(pos,callback)
    {
        /*Cab.find({},function (error, result) {
         callback(error, result);
         });*/
        //    {coords : { $near : [req.params.lon, req.params.lat], $maxDistance : req.params.dist/68.91}}
        console.log(pos);
        Driver.find({status:"online", position : { $near : pos, $maxDistance : 1}})
            .limit(10)
            .exec(callback);



    }

    return {
        AddNew:create,
        GetById:readOne,
        GetByCriteria:read,
        GetByCriteriaMany:readMany,
        GetDriversByCriteria:readManyByCriteria,
        Update:edit,
        Remove:remove,
        GetAll:readAll,
        ByUser:readByUserId,
        Empty:empty,
        UpdateDriverJobStatus:updateDriverJobStatus,
        UpdateDriverCab:updateDriverCab,
        UpdateBankDetail:updateBankDetail,
        UpdateDriverImage: _updateDriverImage,
        getCabByLocationAndStatusAndIgnoredDrivers:_getCabByLocationAndStatusAndIgnoredDrivers,
        GetCabByLocationAndStatus:getCabByLocationAndStatus,
        GetAllByPosition:readAllByPosition
    };
})();

module.exports=repository;