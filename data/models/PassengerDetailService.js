/**
 * Created by Asif on 8/10/2014.
 */

var mongoose = require('mongoose'),
    PassengerDetail = mongoose.model('PassengerDetail');


var repository=(function(){

    function create(data, callback)
    {
        var doc = new PassengerDetail();

        doc.city = data.city;
        doc.state = data.state;
        doc.tip = data.tip;
        doc.isactive = data.isactive;
        doc.user_id = data.user_id;
        doc.is_cash_enabled = data.is_cash_enabled;
        doc.is_cash_default = data.is_cash_default;
        doc.user_image=data.user_image;
        doc.favourite_affiliate=data.favourite_affiliate;


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

    function readOneCriteria(data,callback){
        PassengerDetail.findOne(data,function (error, result) {
            callback(error, result);
        });
    }



    function readOne(id,callback)
    {
        PassengerDetail.findById(id,function (error, result) {
            var ms = require('../../modules/message-settings');
            if(result)
            if(result._doc.affiliate_logo)
                result._doc.affiliate_logo = ms.url+result._doc.affiliate_logo;
            callback(error, result);
        });

    }

    function read(jsonCriteria,callback)
    {
        PassengerDetail.findOne(jsonCriteria,function (error, result) {
            callback(error, result);
        });

    }

    //favourite_affiliate
    function readPassengerAffiliate(jsonCriteria,callback)
    {
        var query = PassengerDetail.findOne(jsonCriteria).populate('favourite_affiliate')
            .exec(function(err,docs){
                if(err)
                    callback(err);
                else
                    callback(null,docs);
            });
    }

    function edit(data, callback)
    {
        readOne(data._id, function (err, doc) {
            if (err){
                callback(err, null);
            }
            else {
                doc.tip = data.tip;
                doc.favourite_affiliate = data.favourite_affiliate;
                doc.save(function (error, result) {
                    console.log(error);
                    callback(error, result);
                });
            }
        });
    }

    function _updatePassengerImage(data, callback)
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

    function editCashPayment(data, callback)
    {
        read({user_id:data.user_id}, function (err, doc) {
            if (err){
                callback(err, null);
            }
            else {
                if(doc) {
                    //doc.is_cash_enabled = data.is_cash_enabled;
                    doc.is_cash_default = data.is_cash_default;
                    doc.save(function (error, result) {
                        console.log(error);
                        if (result._doc.is_cash_default) {
                            if (result) {
                                var data = require("../../data");
                                data.updateUserPaymentMethodStatus(result._doc.user_id.toString(), function (err) {
                                    if (err)
                                        callback(err, result);
                                    else
                                        callback(error, result);
                                });
                            }
                            else
                                callback(error, result);
                        }
                        else
                            callback(error, result);

                    });
                }
                else
                    callback('Record not found', null);
            }
        });
    }

    function editPassengerImage(data, callback)
    {
        read({user_id:data.user_id}, function (err, doc) {
            if (err){
                callback(err, null);
            }
            else {
                doc.user_image = data.user_image;
                doc.save(function (error, result) {
                    console.log(error);
                        callback(error, result);
                });
            }
        });
    }

    function editPreference(data, callback)
    {
        read({user_id:data.user_id}, function (err, doc) {
            if (err){
                callback(err, null);
            }
            else {
                doc.tip = data.tip;
                doc.favourite_affiliate = data.favourite_affiliate;
                doc.save(function (error, result) {
                    console.log(error);
                    callback(error, result);

                });
            }
        });
    }



    return {
        AddNew:create,
        GetById:readOne,
        GetByCriteria:read,
        GetOneByCriteria:readOneCriteria,
        Update:edit,
        Remove:remove,
        GetAll:readAll,
        EditCashPayment:editCashPayment,
        EditPassengerImage:editPassengerImage,
        EditPreference:editPreference,
        UpdatePassengerImage: _updatePassengerImage,
        GetPassengerAffiliate:readPassengerAffiliate
    };
})();

module.exports=repository;