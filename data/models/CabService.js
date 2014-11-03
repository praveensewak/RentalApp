/**
 * Created by Naveed on 6/24/2014.
 */


var mongoose = require('mongoose');


var Cab = mongoose.model('Cab');



var repository=(function(){

    function create(data, callback)
    {
        console.log(data);
        var doc = new Cab();

        doc.name = data.name;
        doc['type'] = data.typeid ;
        doc.affiliateid=data.affiliateid;
        doc.ownerid=data.ownerid;
        doc.driverid=data.driverid;
        doc.statusid=data.statusid;
        doc.position=[data.latitude,data.longitude];
      /*  doc.latitude=data.latitude;*/
        doc.isactive = data.isactive;
        doc.duration=data.duration;

        doc.user_id=data.user_id;
        doc.make_id=data.make_id;
        doc.model_id=data.model_id;
        doc.year=data.year;
        doc.interior_color=data.interior_color;
        doc.exterior_color=data.exterior_color;
        doc.license_plate=data.license_plate;
        doc.is_default = data.is_default;
        doc.medallion_number = data.medallion_number;

        doc.save(function (error, result) {
            console.log(error);
     //       console.log(result);
            /*if(!error && cab)
            {
            var DService=require('../data/models/DriverService');
            DService.GetByCriteria({driverid:cab.driverid},function(err,result){
                if(!error && result)
                {
                    result.cabid=cab._id;
                    result.save(function(err,res){console.log(err);console.log(res)});
                }

            })
            }*/

            callback(error, result);



        });
    }

    function readAllByPosition(pos,callback)
    {
        /*Cab.find({},function (error, result) {
         callback(error, result);
         });*/
        //    {coords : { $near : [req.params.lon, req.params.lat], $maxDistance : req.params.dist/68.91}}
        console.log(pos);
        Cab.find({statusid:"online", position : { $near : pos, $maxDistance : 1}})
            .limit(10)
            .exec(callback);



    }


    function readAll(callback)
    {
        /*Cab.find({},function (error, result) {
            callback(error, result);
        });*/
    //    {coords : { $near : [req.params.lon, req.params.lat], $maxDistance : req.params.dist/68.91}}
  /*  Cab.find({ position : { $near : [req.params.lon, req.params.lat], $maxDistance : req.params.dist/68.91}})
        .where('latitude').gt(20).lt(40)
        .where('longitude').gt(1).lt(20)
        .limit(10)
        .populate("Affiliate")
        .exec(callback);*/

        Cab.find({},function (error, result) {
            callback(error, result);
        });

    }

    function getCabByLocationAndStatus(jsonCriteria,callback){
        //  [36.026608,-80.024635] // Sample position
        Cab.findOne({ position : { $near : jsonCriteria.position, $maxDistance : 1},isactive:true})
           .exec(function(err,docs){
                /*
                 * Need to implement a criteria to avoid already occoupied cabs
                 */
                callback(err,docs);

           });
       
    }
    function _getCabByLocationAndStatusAndIgnoredDrivers(jsonCriteria,callback){
        //  [36.026608,-80.024635] // Sample position
        //console.log({driverid:jsonCriteria.driverid, position : { $near : jsonCriteria.position, $maxDistance : 1},isactive:true});
        Cab.findOne({driverid:jsonCriteria.driverid, position : { $near : jsonCriteria.position, $maxDistance : 1},isactive:true})
           .exec(function(err,docs){
                /*
                 * Need to implement a criteria to avoid already occoupied cabs
                 */
                callback(err,docs);

           });
       
    }

    function readTen(jsonCriteria,callback)
    {
        Cab.find(jsonCriteria)
            .limit(10)
            .exec(callback);

    }

    function readOne(id,callback)
    {
        Cab.findById(id,function (error, result) {
            callback(error, result);
        });

    }

    function read(jsonCriteria,callback)
    {
        console.log(jsonCriteria);
        Cab.findOne(jsonCriteria,function (error, result) {
            callback(error, result);
        });

    }

    function readAllByCriteria(jsonCriteria,callback)
    {
        console.log(jsonCriteria);
        Cab.find(jsonCriteria,function (error, result) {
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
                doc.typeid = data.typeid ;
                doc.affiliateid=data.affiliateid;
                doc.ownerid=data.ownerid;
                doc.driverid=data.driverid;
                doc.statusid=data.statusid;
                doc.position=[data.latitude,data.longitude];
                doc.isactive = data.isactive;
                doc.position=[data.latitude,data.longitude];
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

    function empty(callback){
        Cab.collection.remove();
        callback()
    }



        return {
        AddNew:create,
        GetById:readOne,
        GetByCriteria:read,
        GetTenByCriteria:readTen,
        Update:edit,
        Remove:remove,
        GetAll:readAll,
        GetAllByPosition:readAllByPosition,
        Empty:empty,
        GetCabByLocationAndStatus:getCabByLocationAndStatus,
        GetAllByCriteria:readAllByCriteria,
        getCabByLocationAndStatusAndIgnoredDrivers:_getCabByLocationAndStatusAndIgnoredDrivers
    };
})();

module.exports=repository;