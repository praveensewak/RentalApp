/**
 * Created by Naveed on 7/3/2014.
 */


var mongoose = require('mongoose'),
    Passenger = mongoose.model('PassengerRequest');


var repository=(function(){

    function create(data, callback)
    {  //   console.log(data);

        var doc = new Passenger(data);
        doc.save(function(err,doc){
            if(!err){
                readOne(doc._id,callback);
            }else{
               callback(err,null);
            }

        });

        /*Passenger.update({_id:doc._id}, data, function(err, numberAffected, rawResponse) {
            //handle it
            if(!err){
                console.log(rawResponse);
                console.log(doc);
            }else{
                console.log(err);
            }
            
            //  callback(error, rawResponse);
        })*/

/*        doc.passengerid= data.passengerid;
        doc.driverid = data.driverid;
        doc.status= data.status;
        doc.save(function (error, result) {
           console.log("status saved");
            console.log(result);
            callback(error, result);
        });*/
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
                doc.update(data, function(err, numberAffected, rawResponse) {
                    //handle it
                    console.log(rawResponse);
                    readOne(doc._id,callback);
                    //  callback(error, rawResponse);
                })
                /*doc.driverid = data.driverid;
                doc.status= data.status;
                doc.save(function (error, result) {
                    console.log(error);
                    callback(error, result);
                });*/
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

    function readMany(jsonCriteria,result,sort,callback)
    {
        console.log(jsonCriteria);
        /*  Trip.find(jsonCriteria,'-_id -__v -latitude -longitude',sort,function (error, result) {
         callback(error, result);
         });*/

        var query = Passenger.find(jsonCriteria,result);
        query.sort(sort)
        query.lean()
        query.exec(callback);



    }

    return {
        AddNew:create,
        GetById:readOne,
        GetByCriteria:read,
        GetByCriteriaMany:readMany,
        Update:edit,
        UpdateStatus:editStatus,
        Remove:remove,
        GetAll:readAll
    };
})();

module.exports=repository;