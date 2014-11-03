var mongo = require('mongodb');
var BSON = mongo.BSONPure;

(function (data) {


    var database = require("./database");

    data.getNoteCategories = function (next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err, null);
            } else {
                db.notes.find().sort({ name: 1 }).toArray(function (err, results) {
                    if (err) {
                        next(err, null);
                    } else {
                        next(null, results);
                    }
                });
            }
        });
    };

    data.getNotes = function (categoryName, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.notes.findOne({ name: categoryName }, next);
            }
        });
    };

    data.addNote = function (categoryName, noteToInsert, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.notes.update({ name: categoryName }, { $push: { notes: noteToInsert } }, next);
            }
        });
    };

    data.createNewCategory = function (categoryName, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.notes.find({ name: categoryName }).count(function (err, count) {

                    if (err) {
                        next(err);
                    } else {

                        if (count != 0) {
                            next("Category already exists");
                        } else {
                            var cat = {
                                name: categoryName,
                                notes: []
                            };
                            db.notes.insert(cat, function (err) {
                                if (err) {
                                    next(err);
                                } else {
                                    next(null);
                                }
                            });
                        }
                    }
                });
            }
        });
    };


    data.addUser = function (user, next) {
        database.getDb(function (err, db) {
            if (err) {
                console.log("Failed to seed database: " + err);
            } else {
                db.users.insert(user, next);
            }
        });
    };

    data.getUser = function (email, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.users.findOne({ email: email }, next);
            }
        });
    };

    data.getVerifiedUser = function (email, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.users.findOne({ "email": email, $or: [
                    { "registration_status": 'verified' },
                    { "registration_status": 'complete' }
                ]
                }, next)
            }
        });
    };

    data.getUserByEmail = function (email, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.users.findOne({ email: email }, next);
            }
        });
    };

    data.getUserById = function (id, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.users.findOne({ _id: new BSON.ObjectID(id) }, next);
            }
        });
    };

    data.getUserByEmailOrNumber = function (email, phone_number, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.users.findOne({$or: [
                    {"email": email},
                    {"phone_number": phone_number}
                ]}, next);
            }
        });
    };

    data.getUserByToken = function (reset_password_token, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.users.findOne({ reset_password_token: reset_password_token, reset_password_expires: { $gt: Date.now() } }, next);
            }
        });
    };

    data.getUserByRegToken = function (registration_token, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {

                db.users.findOne({ registration_token: registration_token }, next);
            }
        });
    };

    data.getUserByPhoneNumber = function (phone_number, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.users.findOne({ phone_number: phone_number }, next);
            }
        });
    };

    data.getUserByPhoneNumber = function (phone_number, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {

                db.users.findOne({ phone_number: phone_number }, next);
            }
        });
    };

    data.getUserByRegTokenAndCode = function (registration_token, registration_code, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.users.findOne({ registration_token: registration_token, registration_code: registration_code }, next);
            }
        });
    };

    data.updateUserPasswordRestToken = function (user, next) {
        database.getDb(function (err, db) {
            if (err) {
                console.log("Failed to seed database: " + err);
            } else {
                db.users.update({email: user.email }, { $set: { reset_password_token: user.reset_password_token, reset_password_expires: user.reset_password_expires} }, next);
            }
        });
    };

    data.updateUserRegistrationCode = function (user, next) {
        database.getDb(function (err, db) {
            if (err) {
                console.log("Failed to seed database: " + err);
            } else {
                db.users.update({registration_token: user.registration_token }, { $set: { registration_code: user.registration_code } }, next);
            }
        });
    };

    data.updateUserPassword = function (user, next) {
        database.getDb(function (err, db) {
            if (err) {
                console.log("Failed to seed database: " + err);
            } else {
                db.users.update({email: user.email }, { $set: { reset_password_token: undefined, reset_password_expires: undefined, passwordHash: user.passwordHash, salt: user.salt} }, next);
            }
        });
    };

    data.updateUserRegistrationStatus = function (registration_status, user, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.users.update({_id: user._id }, { $set: { registration_status: registration_status, phone_number: user.phone_number } }, next);
            }
        });
    };

    data.updateUserRegistrationStatustoUnverified = function (registration_status, user, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.users.update({phone_number: user.phone_number }, { $set: { registration_status: registration_status, phone_number: ''} }, { multi: true }, next);
            }
        });
    };

    data.updateUserPaymentMethodStatus = function (user_id, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.user_payment_details.update({ $or: [
                        { user_id: user_id },
                        { user_id: new BSON.ObjectID(user_id) }
                    ] },
                    { $set: {is_default: 'false'} }, { multi: true }, next);
            }
        });
    };

    data.getUserPaymentMethod = function (user_id, next) {
        database.getDb(function (err, db) {
            if (err) {
                next("Failed to seed database: " + err);
            } else {
                //{_id: new BSON.ObjectID(newData._id)}

                db.user_payment_details.find({ $or: [
                    { user_id: user_id },
                    { user_id: new BSON.ObjectID(user_id) }
                ] }).toArray(function (err, results) {
                    if (err) {
                        next(err, null);
                    } else {
                        next(null, results);
                    }
                });
            }
        });
    };

    data.getUserFirstPaymentMethod = function (user_id, next) {
        database.getDb(function (err, db) {
            if (err) {
                next("Failed to seed database: " + err);
            } else {
                //{_id: new BSON.ObjectID(newData._id)}
                var tep = user_id.toHexString();

                db.user_payment_details.findOne(
                    { $or: [
                        { user_id: user_id },
                        { user_id: user_id.toHexString() }
                    ] }
                    ,function (err, results) {
                        if (err) {
                            next(err, null);
                        } else {
                            next(null, results);
                        }
                    });
            }
        });
    };

    data.addUserPaymentMethod = function (user_payment_detail, next) {
        database.getDb(function (err, db) {
            if (err) {
                next("Failed to seed database: " + err, null);
            } else {

                if(user_payment_detail.is_default.toLowerCase() == 'true')
                {
                    var _passengerDetailService = require("../data/models/PassengerDetailService");
                    _passengerDetailService.EditCashPayment({user_id: user_payment_detail.user_id,is_cash_default:false},function(error,result) {
                        if (error)
                            callback(err, null);
                        else
                        {
                            data.updateUserPaymentMethodStatus(result._doc.user_id.toString(), function (err) {
                                if (err)
                                    next("Failed to seed database: " + err, null);
                                else
                                    db.user_payment_details.insert(user_payment_detail, function (err, docsInserted) {
                                        if (err)
                                            next("Failed to seed database: " + err, null);
                                        else {
                                            next(null, docsInserted[0]);
                                        }
                                    });
                            });
                        }
                    });
                }
                else
                {
                    db.user_payment_details.insert(user_payment_detail, function (err, docsInserted) {
                        if (err)
                            next("Failed to seed database: " + err, null);
                        else {
                            next(null, docsInserted[0]);
                        }
                    });
                }
            }
        });
    };

    data.updateUserPaymentMethod = function (newData, callback) {
        database.getDb(function (err, db) {
            if (err) {
                callback("Failed to seed database: " + err, null);
            } else {
                db.user_payment_details.findOne({_id: new BSON.ObjectID(newData._id)}, function (e, o) {
                    if (o) {
                        o.expiry_date = newData.expiry_date;
                        o.cvv_number = newData.cvv_number;
                        o.zip_code = newData.zip_code;
                        o.card_use_type = newData.card_use_type;
                        o.is_default = newData.is_default;

                        if(o.is_default.toLowerCase() == 'true')
                            data.updateUserPaymentMethodStatus(o.user_id.toString(),
                                function(error) {
                                    if(!error)
                                    {
                                        var _passengerDetailService = require("../data/models/PassengerDetailService");
                                        _passengerDetailService.EditCashPayment({user_id: o.user_id,is_cash_default:false},function(error,result){
                                            if(error)
                                                callback(err, null);
                                            else
                                                db.user_payment_details.save(o, {safe: true}, function (err, docsUpdated) {
                                                        if (err) callback(err, null);
                                                        else {
                                                            callback(null, o);
                                                        }
                                                    }
                                                )
                                        });
                                    }
                                });
                        else
                            db.user_payment_details.save(o, {safe: true}, function (err, docsUpdated) {
                                if (err) callback(err, null);
                                else
                                {
                                    callback(null, o);
                                }
                            });
                    }
                });
            }
        });
    };

    data.deleteUserPaymentMethod = function (user_payment_detail, callback) {
        database.getDb(function (err, db) {
            if (err) {
                next("Failed to seed database: " + err);
            } else {
                db.user_payment_details.findOne({_id: new BSON.ObjectID(user_payment_detail._id)}, function (e, o) {
                    if (o) {
                        db.user_payment_details.remove(o, {safe: true}, function (err, docsUpdated) {
                            if (err) callback(err, null);
                            else
                            {
                                callback(null, o);
                            }
                        });
                    }
                });
            }
        });
    };

    data.autoLogin = function (user, pass, callback) {
        accounts.findOne({email: user}, function (e, o) {
            if (o) {
                o.password == pass ? callback(o) : callback(null);
            } else {
                callback(null);
            }
        });
    };

    data.manualLogin = function (user, pass, callback) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.users.findOne({email: user}, function (e, o) {
                    if (o == null) {
                        callback('user-not-found');
                    } else {
                        validatePassword(pass, o.pass, function (err, res) {
                            if (res) {
                                callback(null, o);
                            } else {
                                callback('invalid-password');
                            }
                        });
                    }
                });
            }
        });
    };

    data.addDriverDetails = function (newData, drive_user, callback) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                newData.user_id = drive_user[0]._id.toString();
                newData.driverid=drive_user[0].email;
                db.driver_details.insert(newData, {safe: true}, callback);
            }
        });
    };

    data.addNewAccount = function (newData, userDetails, callback) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.users.findOne({email: newData.email}, function (e, o) {
                    if (o) {
                        callback('email-taken');
                    } else {
                        db.users.findOne({phone_number: newData.phone_number}, function (e, o) {
                            if (o) {
                                if (newData.force_registration == 'true') {
                                    if (o.registration_status == 'complete') {
                                        db.users.insert(newData, {safe: true}, function (err, docsInserted) {
                                            if (newData.user_type == 'driver') {
                                                data.addDriverDetails(userDetails, docsInserted, callback)
                                            }
                                            else
                                                callback();
                                        });
                                    }
                                    else {
                                        db.users.insert(newData, {safe: true}, function (err, docsInserted) {
                                            if (newData.user_type == 'driver') {
                                                data.addDriverDetails(userDetails, docsInserted, callback)
                                            }
                                            else
                                                callback();
                                        });
                                    }
                                }
                                else {
                                    if (o.registration_status == 'complete')
                                        callback('phonenumber-taken-complete');
                                    else
                                        callback('phonenumber-taken');
                                }
                            } else {
                                // append date stamp when record was created //
                                // newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
                                db.users.insert(newData, {safe: true}, function (err, docsInserted) {
                                    if (newData.user_type == 'driver') {
                                        data.addDriverDetails(userDetails, docsInserted, callback)
                                    }
                                    else
                                        callback();
                                });
                            }
                        });
                    }
                });
            }
        });
    };

    data.setupAdministratorAccount = function (newData, userDetails, callback) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.users.findOne({email: newData.email}, function (e, o) {
                    if (o) {
                        callback('email-taken');
                    } else {
                        db.users.findOne({phone_number: newData.phone_number}, function (e, o) {
                            if (o) {
                                if (newData.force_registration == 'true') {
                                    if (o.registration_status == 'complete') {
                                        db.users.insert(newData, {safe: true}, function (err, docsInserted) {
                                            if (newData.user_type == 'admin') {
                                                data.addDriverDetails(userDetails, docsInserted, callback)
                                            }
                                            else
                                                callback();
                                        });
                                    }
                                    else {
                                        db.users.insert(newData, {safe: true}, function (err, docsInserted) {
                                            if (newData.user_type == 'admin') {
                                                data.addDriverDetails(userDetails, docsInserted, callback)
                                            }
                                            else
                                                callback();
                                        });
                                    }
                                }
                                else {
                                    if (o.registration_status == 'complete')
                                        callback('phonenumber-taken-complete');
                                    else
                                        callback('phonenumber-taken');
                                }
                            } else {
                                // append date stamp when record was created //
                                // newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
                                db.users.insert(newData, {safe: true}, function (err, docsInserted) {
                                    if (newData.user_type == 'admin') {
                                        data.addDriverDetails(userDetails, docsInserted, callback)
                                    }
                                    else
                                        callback();
                                });
                            }
                        });
                    }
                });
            }
        });
    };

    data.UpdateDriverChauffeur = function(userDetails, callback){
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.driver_details.findOne({user_id: userDetails._id}, function (e, doc_detail){
                    if (doc_detail){
                        doc_detail.taxi_company = userDetails.taxi_company;
                        doc_detail.chauffeur_license_no = userDetails.chauffeur_license_no;
                        doc_detail.chauffeur_license_state = userDetails.chauffeur_license_state;
                        doc_detail.chauffeur_license_city = userDetails.chauffeur_license_city;
                        doc_detail.chauffeur_expiration_date = userDetails.chauffeur_expiration_date
                        if (userDetails.chauffeur_license_attachment != '')
                            doc_detail.chauffeur_license_attachment = userDetails.chauffeur_license_attachment;

                        db.driver_details.save(doc_detail, {safe: true}, function (err) {
                            if (!err)
                                callback(null, userDetails);
                            else
                                callback(err);
                        });
                    }
                });
            }
        });
    };

    data.DeleteDriverChauffeur = function(DriverDetails, callback){
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.driver_details.findOne({user_id: DriverDetails._id}, function (e, doc_detail){
                    if (doc_detail){
                        doc_detail.chauffeur_license_attachment = '';
                        db.driver_details.save(doc_detail, {safe: true}, function (err) {
                            if (!err)
                                callback(null, DriverDetails);
                            else
                                callback(err);
                        });
                    }
                });
            }
        });
    };


    data.UpdateDriverLicense = function(userDetails, callback){
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.driver_details.findOne({user_id: userDetails._id}, function (e, doc_detail){
                    if (doc_detail){
                        doc_detail.driver_license_expiration_date = userDetails.driver_license_expiration_date;
                        doc_detail.driver_license_no = userDetails.driver_license_no;
                        doc_detail.driver_license_state = userDetails.driver_license_state;
                        doc_detail.driver_license_city = userDetails.driver_license_city;
                        if(userDetails.driver_license_attachment != '')
                            doc_detail.driver_license_attachment = userDetails.driver_license_attachment;
                        db.driver_details.save(doc_detail, {safe: true}, function (err) {
                            if (!err)
                                callback(null, userDetails);
                            else
                                callback(err);
                        });
                    }
                });
            }
        });
    };

    data.DeleteDriverLicense = function(DriverDetails, callback){
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.driver_details.findOne({user_id: DriverDetails._id}, function (e, doc_detail){
                    if (doc_detail){
                        doc_detail.driver_license_attachment = '';
                        db.driver_details.save(doc_detail, {safe: true}, function (err) {
                            if (!err)
                                callback(null, DriverDetails);
                            else
                                callback(err);
                        });
                    }
                });
            }
        });
    };



    data.UploadImage = function (user_id, user_image, callback) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.users.findOne({_id: new BSON.ObjectID(user_id)}, function (e, o) {
                    if (o) {
                        if(o.user_type == 'driver' || o.user_type == 'admin'){
                            var _driverDetailService = require("../data/models/DriverDetailService");
                            _driverDetailService.GetByCriteria({user_id: o._id}, function (e, doc_detail) {
                                if (doc_detail) {
                                    doc_detail.user_image = user_image;
                                    _driverDetailService.UpdateDriverImage(doc_detail, function (err,result) {
                                        if (!err)
                                            callback(null, result);
                                        else
                                            callback(err,null);
                                    });
                                }else{
                                    res.send(417,"Cannot Upload Image. No Detail Found");
                                }
                            });
                        }else{
                            var _passengerDetailService = require("../data/models/PassengerDetailService");
                            _passengerDetailService.GetByCriteria({user_id: o._id}, function (e, doc_detail) {
                                if (doc_detail) {
                                    doc_detail.user_image = user_image;
                                    _passengerDetailService.UpdatePassengerImage(doc_detail, function (err,result) {
                                        if (!err)
                                            callback(null, result);
                                        else
                                            callback(err,null);
                                    });
                                }else{
                                    res.send(417,"Cannot Upload Image. No Detail Found");
                                }
                            });
                        }
                    }else{
                        callback(e);
                    }
                });
            }
        });
    };


    data.updateNewAccount = function (newData, userDetails, callback) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                // db.users.findOne({email: newData.email}, function (e, o) {
                db.users.findOne({ $and: [
                    { _id: { $ne: new BSON.ObjectID(newData._id)} },
                    {email: newData.email}
                ] }, function (e, o) {
                    if (o) {
                        callback('email-taken');
                    } else {
                        /*                        db.users.findOne({ $and: [ { _id: { $ne: new BSON.ObjectID(newData._id)} }, {phone_number: newData.phone_number} ] }, function (e, o) {
                         if (!o) {*/
                        db.users.findOne({_id: new BSON.ObjectID(newData._id)}, function (e, o) {
                            if (o) {
                                //o.email = newData.email;
                                o.first_name = newData.first_name;
                                o.force_registration = newData.fra;
                                o.last_name = newData.last_name;
                                //o.passwordHash = newData.passwordHash;
                                o.phone_number = newData.phone_number;
                                o.registration_code = newData.registration_code;
                                o.registration_status = newData.registration_status;
                                o.registration_token = newData.registration_token;
                                o.reset_password_expires = newData.reset_password_expires;
                                o.reset_password_token = newData.reset_password_token;
                                //o.salt = newData.salt;
                                //o.user_type = newData.user_type;
                                db.users.save(o, {safe: true}, function (err) {
                                    if (err) callback(err);
                                    else {
                                        if (userDetails && o.user_type == 'driver') {
                                            db.driver_details.findOne({user_id: o._id}, function (e, doc_detail) {
                                                if (doc_detail) {
                                                    doc_detail.chauffeur_license_no = userDetails.chauffeur_license_no;
                                                    doc_detail.chauffeur_license_state = userDetails.chauffeur_license_state;
                                                    doc_detail.chauffeur_license_city = userDetails.chauffeur_license_city;
                                                    doc_detail.chauffeur_expiration_date = userDetails.chauffeur_expiration_date
                                                    if(userDetails.chauffeur_license_attachment!='')
                                                        doc_detail.chauffeur_license_attachment = userDetails.chauffeur_license_attachment;
                                                    doc_detail.date_of_birth = userDetails.date_of_birth;
                                                    doc_detail.taxi_company = userDetails.taxi_company;
                                                    doc_detail.social_security_number = userDetails.social_security_number;

                                                    db.driver_details.save(doc_detail, {safe: true}, function (err) {
                                                        if(!err)
                                                            callback(null, o);
                                                    });
                                                }
                                                else
                                                {
                                                    userDetails.user_id = newData._id;
                                                    db.driver_details.insert(userDetails, {safe: true}, function (err) {
                                                        if(!err)
                                                            callback(null, o);
                                                    });
                                                }
                                            });
                                        }
                                        else
                                            callback(null, o);
                                    }
                                });
                            }
                        });
                        /*                                    }
                         else
                         {
                         if (o.registration_status == 'complete')
                         callback('phonenumber-taken-complete');
                         else
                         callback('phonenumber-taken');
                         }

                         });*/
                    }
                });
            }
        });
    };

    data.updateUserDevices = function (device_id, user_id, driverFields, callback) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.users.findOne({_id: user_id}, function (e, o) {
                    o.device_id = device_id;
                    db.users.save(o, {safe: true}, function (err) {
                        if (err)
                            callback(err);
                    });
                });
            }
        });
    };

    data.getDriverDetail = function (user_id, callback) {
        database.getDb(function (err, db) {
            if (err) {
                callback(err, null);
            } else {
                db.driver_details.findOne(
                    {$or: [
                        {"user_id": user_id},
                        {"user_id": user_id.toString()}
                    ]}, function (e, driver_detail) {
                        if (e)
                            callback(e, null);
                        else
                            callback(null, driver_detail);

                    });
            }
        });
    };

    data.updateAccount = function (newData, detailFields, callback) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.users.findOne({_id: new BSON.ObjectID(newData._id)}, function (e, o) {
                    o.first_name = newData.first_name;
                    o.last_name = newData.last_name;
                    //o.user_image = newData.user_image;
                    db.users.save(o, {safe: true}, function (err) {
                        if (err) callback(err);
                        else {
                            if (o.user_type == 'driver' || o.user_type == 'admin') {
                                db.driver_details.findOne({user_id: new BSON.ObjectID(newData._id),user_id: newData._id}, function (e, driver_detail) {
                                    if (driver_detail) {
                                        driver_detail.social_security_number = detailFields.social_security_number;
                                        driver_detail.date_of_birth = detailFields.date_of_birth;
                                        driver_detail.address1 = detailFields.address1;
                                        driver_detail.address2 = detailFields.address2;
                                        driver_detail.city = detailFields.city;
                                        driver_detail.state = detailFields.state;
                                        driver_detail.zipcode = detailFields.zipcode;
                                        if(detailFields.user_image!= '') driver_detail.user_image = detailFields.user_image;
                                        db.driver_details.save(driver_detail, {safe: true}, function (err) {
                                            if(err)
                                                callback(err);
                                        });
                                    }
                                    else
                                        callback(e);
                                });
                                db.users.findOne({_id: new BSON.ObjectID(newData._id)}, function (e, user) {
                                    if (user)
                                        callback(null, user)
                                    else
                                        callback(e);
                                });
                            }
                            if(o.user_type == 'passenger')
                            {
                                if(detailFields.user_image != '') {
                                    var _passengerDetailService = require("../data/models/PassengerDetailService");
                                    _passengerDetailService.EditPassengerImage({user_id: o._id.toString(), user_image: detailFields.user_image}, function (error, result) {
                                        if (error)
                                            callback(error);
                                        else
                                            db.users.findOne({_id: new BSON.ObjectID(newData._id)}, function (e, user) {
                                                if (user){
                                                    callback(null, user)
                                                }else
                                                    callback(e);
                                            });
                                    });
                                }
                                else
                                {
                                    db.users.findOne({_id: new BSON.ObjectID(newData._id)}, function (e, user) {
                                        if (user)
                                            callback(null, user)
                                        else
                                            callback(e);
                                    });
                                }
                            }
                        };
                    });
                });
            }
        });
    };

    data.approveUser = function (newData, callback) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.users.findOne({_id: new BSON.ObjectID(newData._id)}, function (e, o) {
                    o.registration_status = 'complete';
                    //o.user_image = newData.user_image;
                    db.users.save(o, {safe: true}, function (err) {
                        if (err) callback(err);
                        else {
                            db.users.findOne({_id: new BSON.ObjectID(newData._id)}, function (e, user) {
                                if (user)
                                    callback(null, user)
                                else
                                    callback(e);
                            });
                        };
                    });
                });
            }
        });
    };

    /***** Update User Status Mukarram 14-sep-2014*****/
    data.UpdateUserStatus = function (newData, callback) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.users.findOne({_id: new BSON.ObjectID(newData._id)}, function (e, o) {
                    o.status = newData.status;
                    //o.user_image = newData.user_image;
                    db.users.save(o, {safe: true}, function (err) {
                        if (err) callback(err);
                        else {
                            db.users.findOne({_id: new BSON.ObjectID(newData._id)}, function (e, user) {
                                if (user)
                                    callback(null, user)
                                else
                                    callback(e);
                            });
                        };
                    });
                });
            }
        });
    };

})(module.exports);