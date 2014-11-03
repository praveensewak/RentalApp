var mongo = require('mongodb');
var BSON = mongo.BSONPure;

// auth/index.js
(function (auth) {
    var ms = require('../modules/message-settings');
    var data = require("../data");
    var controllers = require("../controllers");
    var hasher = require("./hasher");
    var passport = require("passport");
    var localStrategy = require("passport-local").Strategy;
    var nodemailer = require('nodemailer');
    var async = require('async');
    var crypto = require('crypto');
    var validator=require("validator");


    function userVerifyById(id, password, next) {
        data.getUserById(id, function (err, user) {
            if (!err && user) {
                var testHash = hasher.computeHash(password, user.salt);
                if (testHash === user.passwordHash) {
                    next(null, user);
                    return;
                }
            }
            next(null, false, { message: "Invalid Credentials." });
        });
    }

    function userVerify(email, password, next) {
        data.getUser(email, function (err, user) {
            if (!err && user) {
                var testHash = hasher.computeHash(password, user.salt);
                if (testHash === user.passwordHash) {
                    next(null, user);
                    return;
                }
            }
            next(null, false, { message: "Invalid Credentials." });
        });
    }

    auth.ensureAuthenticated = function (req, res, next) {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.redirect("/login");
        }
    };

    auth.ensureApiAuthenticated = function (req, res, next) {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.send(401, "Not authorized");
        }
    };

    auth.init = function (app) {
        // setup passport authentication
        passport.use(new localStrategy(userVerify));
        passport.serializeUser(function (user, next) {
            next(null, user.email);
        });
        passport.deserializeUser(function (key, next) {
            data.getUser(key, function (err, user) {
                if (err || !user) {
                    next(null, false, { message: "Could not find user" });
                } else {
                    next(null, user);
                }
            });
        });
        app.use(passport.initialize());
        app.use(passport.session());

        app.get("/login", function (req, res) {
            res.render("login", { title: "Login to the taxi web portal", message: req.flash("loginError") });
        });

        app.get("/SetupAdministratorAccount", function (req, res) {
            var user_profile = {
                first_name: 'Administrator',
                last_name: 'Account',
                email: 'Administratortaxi@itverticals.com',
                phone_number:'(300) 123-8585',
                passwordHash:'084285cc5c579997c8dbaffb65c24165b3cb33e2',
                salt: 'e0540f91',
                registration_status:'complete',
                registration_token:'c2ef82b17ae66feb6d0cef8d8a66d7bdf5e7ff19',
                registration_code: '386576',
                user_type:'admin'
            }
            var detail_fields = {
                address1: '',
                address2: '',
                city: 'Chicago',
                state: 'IL',
                zipcode: '98765-2222',
                social_security_number: '897-65-4321',
                date_of_birth: '3-5-1988',
                driverid: 'driver.itv.ios@gmail.com',
                user_image: ''
            }
            data.setupAdministratorAccount(user_profile, detail_fields, function (err, user, userDetails) {
                if (err) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(400, JSON.stringify({message: e}));
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(200, user);
                }
            });
        });

        app.post("/login", function (req, res, next) {
            var authFunction = passport.authenticate("local", function (err, user, info) {
                if (err) {
                    next(err);
                } else {
                    req.logIn(user, function (err) {
                        if (err) {
                            next(err);
                        } else {
                            res.redirect("/");
                        }
                    });
                }
            });
            authFunction(req, res, next);
        });


        app.post('/', function (req, res) {
            userVerify(req.body.email, req.body.password, function (e, o) {
                if (!o) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(e, 400);
                } else {
                    if (o.registration_status == 'complete' || o.registration_status == 'registered') {
                        if(o.user_type == 'driver' || o.user_type == 'admin') {
                            var _driverDetailService = require("../data/models/DriverDetailService");
                            _driverDetailService.GetByCriteria({user_id: o._id}, function (e, doc_detail) {
                                if (doc_detail) {
                                    o.user_image = doc_detail.user_image;
                                    req.session.user = o;
                                    if (req.param('remember-me') == 'true') {
                                        var hour = 3600000;
                                        res.cookie('email', o.email, { maxAge: 90 * 24 * hour });
                                        res.cookie('password', o.passwordHash, { maxAge: 90 * 24 * hour });
                                    }
                                    req.logIn(o, function (err) {
                                        if (err) {
                                            next(err);
                                        } else {
                                            res.setHeader('Content-Type', 'application/json');
                                            res.send(200, JSON.stringify({registration_status: o.registration_status, registration_token: o.registration_token, user_type: o.user_type }));
                                        }
                                    });
                                }
                            });
                        }else{
                            var _passengerDetailService = require("../data/models/PassengerDetailService");
                            _passengerDetailService.GetByCriteria({user_id: o._id}, function (e, doc_detail) {
                                if (doc_detail) {
                                    o.user_image = doc_detail.user_image;
                                    req.session.user = o;
                                    if (req.param('remember-me') == 'true') {
                                        var hour = 3600000;
                                        res.cookie('email', o.email, { maxAge: 90 * 24 * hour });
                                        res.cookie('password', o.passwordHash, { maxAge: 90 * 24 * hour });
                                    }
                                    req.logIn(o, function (err) {
                                        if (err) {
                                            next(err);
                                        } else {
                                            res.setHeader('Content-Type', 'application/json');
                                            res.send(200, JSON.stringify({registration_status: o.registration_status, registration_token: o.registration_token, user_type: o.user_type }));
                                        }
                                    });
                                }
                            });
                        }
                    }
                    else if (o.registration_status == 'verified') {
                        res.setHeader('Content-Type', 'application/json');
                        res.send(200, JSON.stringify({registration_status: o.registration_status, registration_token: o.registration_token, user_type: o.user_type }));
                    }
                    else if (o.registration_status == 'pending') {
                        res.setHeader('Content-Type', 'application/json');
                        res.send(200, JSON.stringify({registration_status: o.registration_status, registration_token: o.registration_token, user_type: o.user_type }));
                    }
                }
            });

            /*
             data.manualLogin(req.param('email'), req.param('password'), function(e, o){
                 if (!o){
                    res.send(e, 400);
                 }	else{
                    req.session.user = o;
                    if (req.param('remember-me') == 'true'){
                        res.cookie('email', o.email, { maxAge: 900000 });
                        res.cookie('password', o.password, { maxAge: 900000 });
                    }
                    res.send(o, 200);
                 }
             });
             */
        });

        app.get('/logout', function (req, res) {
            req.session.destroy();
            req.logout();
            res.redirect('/');
        });

        app.get('/verify_existing/:token', function (req, res) {
            data.getUserByRegToken(req.params.token, function (err, user) {
                if (!user) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send("Invalid token", 400);
                }
                else {

                    res.render('verify', { title: "Verify registration", message: req.flash("verror") });
                }
            });
        });

        app.post('/verify_existing/:token', function (req, res) {
            data.getUserByRegToken(req.params.token, function (err, user) {
                if (!user) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send("Invalid token", 400);
                }
                else {
                    data.getUserByPhoneNumber(user.phone_number, function (err, existing_user) {
                        if (existing_user) {
                            data.updateUserRegistrationStatustoUnverified('pending', existing_user, function (e) {
                                if (e) {
                                    res.send(e, 400);
                                } else {
                                    data.updateUserRegistrationStatus('verified', user,
                                        function (e) {
                                            if (e) {
                                                res.send(e, 400);
                                            } else {

                                                res.send(req.params.token, 200);
                                            }
                                        });
                                }
                            });
                        }
                    });
                }
            });
        });

        app.get('/sample', function (req, res) {
            res.render('sample', { title: "Verify registration", message: req.flash("verror") });
        });

        app.get('/user_payments', function (req, res) {
            if (req.session.user == null) {
                // if user is not logged-in redirect back to login page //
                res.redirect('/');
            } else {
                var _passengerDetailService = require("../data/models/PassengerDetailService");
                _passengerDetailService.GetByCriteria({user_id: req.session.user._id}, function (err, result) {
                    if (result) {
                        res.render('user_payments', {
                            title: 'My Payments',
                            udata: req.session.user,
                            pdata: result._doc
                        });
                    }
                    else
                    {
                        res.render('user_payments', {
                            title: 'My Payments',
                            udata: req.session.user,
                            pdata:{}
                        });
                    }
                });

            }
        });

        app.get('/Driver_Admin', function (req, res) {
            if (req.session.user == null) {
                // if user is not logged-in redirect back to login page //
                res.redirect('/');
            } else {
                res.render('Driver_Admin', {
                    title: 'Driver Administration',
                    udata: req.session.user
                });
            }
        });

        app.get('/Passenger_Admin', function (req, res) {
            if (req.session.user == null) {
                // if user is not logged-in redirect back to login page //
                res.redirect('/');
            } else {
                res.render('Passenger_Admin', {
                    title: 'Passenger Administration',
                    udata: req.session.user
                });
            }
        });

        app.get('/support', function (req, res) {
            if (req.session.user == null) {
                // if user is not logged-in redirect back to login page //
                res.redirect('/');
            } else {
                res.render('support', {
                    title: 'Support',
                    udata: req.session.user
                });
            }
        });

        app.get('/promotions', function (req, res) {
            if (req.session.user == null) {
                // if user is not logged-in redirect back to login page //
                res.redirect('/');
            } else {
                res.render('promotions', {
                    title: 'Promotions',
                    udata: req.session.user
                });
            }
        });

        app.get('/passenger_mytrips', function (req, res) {
            if (req.session.user == null) {
                // if user is not logged-in redirect back to login page //
                res.redirect('/');
            } else {
                res.render('passenger_mytrips', {
                    title: 'My Trips',
                    udata: req.session.user
                });
            }
        });

        app.get('/DriverBankDetails', function (req, res) {
            if (req.session.user == null) {
                // if user is not logged-in redirect back to login page //
                res.redirect('/');
            } else {

                var _driverDetailService = require("../data/models/DriverDetailService");
                _driverDetailService.GetByCriteria({user_id: req.session.user._id.toString() }, function (err, driver) {
                    if (driver._doc )
                    {
                        res.render('driver_bank_detail', {
                            title: 'Driver Bank Details',
                            udata: req.session.user,
                            ddata: driver._doc
                        });
                    }
                });
            }
        });

        app.get('/api/GetPassengerPreferences/:user_id', function (req, res) {
            var userID = req.params._id;
            var _passengerDetailService = require("../data/models/PassengerDetailService");
            _passengerDetailService.GetByCriteria({user_id: userID.toString()}, function (err, result) {
                if (result)
                    if (result._doc) {
                        var _affiliateService = require("../data/models/AffiliateService");
                        _affiliateService.GetAll(function (err, result2) {
                            res.json({status: 201, pdata: result._doc,affiliates: result2});
                        });
                    }
            });
        });

        app.get('/api/GetPassengerAffiliate/:user_id', function (req, res) {
            var userID = req.params._id;
            if(userID == undefined || userID=='') userID = req.params.user_id;
            var _passengerDetailService = require("../data/models/PassengerDetailService");
            _passengerDetailService.GetPassengerAffiliate({user_id: userID.toString()}, function (err, result) {
                if (!result) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(400, JSON.stringify({message: 'invalid-request'}));
                }else {
                    res.json(200, result);
                }
            });
        });

        app.get('/api/GetDriverDetails/:user_id', function (req, res) {
            var user = req.session.user;
            var mongo = require('mongodb');
            var BSON = mongo.BSONPure;
            var _driverService = require("../data/models/DriverDetailService");
            data.getDriverDetail(new BSON.ObjectID(req.session.user._id), function (err, result) {
                if (!result) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(400, JSON.stringify({message: 'invalid-request'}));
                }
                else {
                    res.json(200, result);
                }
            });

            /*
            data.getUserPaymentMethod(req.params.user_id,
            function (err, userpayments) {
                if (!userpayments) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(400, JSON.stringify({message: 'invalid-request'}));
                }
                else {
                    for (var key in userpayments) {
                        if (userpayments.hasOwnProperty(key)) {
                            var stringLength = userpayments[key].card_number.length; // this will be 16
                            if (stringLength > 4) {
                                var lastChar = userpayments[key].card_number.substring(stringLength - 4);
                                userpayments[key].card_number = userpayments[key].card_number.substring(stringLength - 4);
                            }
                        }
                    }
                    //res.setHeader('Content-Type', 'application/json; charset=utf-8');
                    res.json(200, userpayments);
                }
            });*/
        });

        app.get('/DriverDocuments', function (req, res) {
            if (req.session.user == null) {
                // if user is not logged-in redirect back to login page //
                res.redirect('/');
            } else {
                if (req.session.user.user_type == 'driver') {
                    var user = req.session.user;
                    var mongo = require('mongodb');
                    var BSON = mongo.BSONPure;
                    var _driverService = require("../data/models/DriverDetailService");
                    data.getDriverDetail(new BSON.ObjectID(req.session.user._id), function (err, result) {
                        user.chauffeur_license_no = result.chauffeur_license_no;
                        user.chauffeur_expiration_date = result.chauffeur_expiration_date;
                        user.chauffeur_license_state = result.chauffeur_license_state;
                        user.chauffeur_license_city = result.chauffeur_license_city;
                        user.chauffeur_license_attachment = result.chauffeur_license_attachment;

                        user.driver_license_no = result.driver_license_no;
                        user.driver_license_expiration_date = result.driver_license_expiration_date;
                        user.driver_license_state = result.driver_license_state;
                        user.driver_license_city = result.driver_license_city;
                        user.driver_license_attachment = result.driver_license_attachment;

                        user.address1 = result.address1;
                        user.address2 = result.address2;
                        user.city = result.city;
                        user.state = result.state;
                        user.zipcode = result.zipcode;

                        user.taxi_company = result.taxi_company;
                        user.social_security_number = result.social_security_number;
                        user.date_of_birth = result.date_of_birth;
//                      user.user_image = result.user_image;
//                      _driverService.ByUser(new BSON.ObjectID(req.session.user._id),function(err,result) {
                        var _affiliateService = require("../data/models/AffiliateService");
                        _affiliateService.GetAll(function (err, result) {
                            res.render('DriverDocuments', {
                                title: 'Driver Documents',
                                udata: user,
                                affiliates: result
                            });
                        });
                    });
                }
                else {
                    res.render('home', {
                        title: 'Control Panel',
                        udata: req.session.user
                    });
                }
            }
        });

        app.get('/FAQ', function (req, res) {
            if (req.session.user == null) {
                // if user is not logged-in redirect back to login page //
                res.redirect('/');
            } else {
                res.render('FAQ', {
                    title: 'Frequently Asked Questions',
                    udata: req.session.user
                });
            }
        });

        app.get('/app_download_link', function (req, res) {
            var _affiliateService = require("../data/models/AffiliateService");
            _affiliateService.GetAll(function (err, result) {
                res.render('app_download_link', {
                    title: 'Please compelte form to get download link',
                    affiliates: result
                });
            });
        });



        app.post('/api/app_download_link',function(req, res){


            if (validator.isEmail(req.body.email_address) && (!validator.isNull(req.body.first_name))
                && (!validator.isNull(req.body.state))
                ) {

                var _appDownloadRequestService = require("../data/models/AppDownloadRequestService");
                _appDownloadRequestService.AddNew(req.body, function (e) {
                    if (e) {
                        res.setHeader('Content-Type', 'application/json');
                        res.send(400, JSON.stringify({message: e}));

                    }
                    else {

                        var affiliate_name = '';

                        var _affiliateService = require("../data/models/AffiliateService");
                        _affiliateService.GetByCriteria({_id: req.body.affiliate }, function (err, affiliate) {
                            if (affiliate) {
                                affiliate_name = affiliate._doc.name;
                            }


                            var smtpTransport = nodemailer.createTransport('SMTP', {
                                host: ms.host, // hostname
                                secureConnection: false, // use SSL
                                port: 25, // port for secure SMTP
                                auth: {
                                    user: ms.user,
                                    pass: ms.password
                                }
                            });
                            var mailOptions = {
                                to: ms.app_download_link_to,
                                cc: req.body.email_address,
                                from: ms.user,
                                subject: 'taxi app download link request',
                                text: req.body.first_name+' requested taxi application download link, request details are as follow.\n\n First Name: '+req.body.first_name+'\n Last Name: '+req.body.last_name+'\n Email: '+req.body.email_address+'\n State: '+req.body.state+'\n City: '+ req.body.city+'\n Affiliate: '+affiliate_name+'\n Link Request: ' + req.body.comments
                            };
                            smtpTransport.sendMail(mailOptions, function (err) {
                                if (err)
                                {
                                    res.setHeader('Content-Type', 'application/json');
                                    res.send(400, JSON.stringify({message: 'email-server-error'}));
                                }
                                else {
                                    res.setHeader('Content-Type', 'application/json');
                                    res.send(200, JSON.stringify({message: 'ok'}));
                                }
                                //done(err, 'done');
                            });
                        });

                    }
                });
            }
            else
            {
                res.setHeader('Content-Type', 'application/json');
                res.send(417, JSON.stringify({message: 'Validation Failed'}));
            }
        });



        app.get('/payment_view', function (req, res) {
            res.render('getReadForm', { title: "Verify registration", message: req.flash("verror") });
        });

        app.get('/verify/:token', function (req, res) {
            res.render('verify', { title: "Verify registration", message: req.flash("verror") });
        });

        app.post("/api/verify/:token", function (req, res) {
            data.getUserByRegTokenAndCode(req.params.token, req.body.registration_code, function (err, user) {
                if (!user) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(400, JSON.stringify({message: 'invalid-request'}));
                }
                else {
                    data.getUserByPhoneNumber(user.phone_number, function (err, existing_user) {
                        if (existing_user) {
                            data.updateUserRegistrationStatustoUnverified('pending', existing_user, function (e) {
                                if (e) {
                                    res.setHeader('Content-Type', 'application/json');
                                    res.send(400, JSON.stringify({message: e}));
                                } else {
                                    var registration_status = '';
                                    if (user.user_type == 'passenger')
                                        registration_status = 'verified';
                                    else if (user.user_type == 'driver')
                                        registration_status = 'registered';
                                    data.updateUserRegistrationStatus(registration_status, user,
                                        function (e) {
                                            if (e) {
                                                res.setHeader('Content-Type', 'application/json');
                                                res.send(400, JSON.stringify({message: e}));
                                            } else {
                                                res.setHeader('Content-Type', 'application/json');
                                                res.send(200, JSON.stringify({registration_token: req.params.token, user_type: user.user_type}));
                                            }
                                        });
                                }
                            });
                        }
                    });
                }
            });
        });

        app.post('/api/resendregcode', function (req, res) {
            data.getUserByRegToken(req.body.registration_token, function (err, user) {
                if (!user) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(400, JSON.stringify({message: 'invalid-request'}));
                } else {
                    var registration_code = '';
                    try {
                        var buf = crypto.randomBytes(4);
                        registration_code = parseInt(buf.toString('hex'), 16).toString().substr(0, 6);
                        user.registration_code = registration_code;
                    } catch (ex) {
                        res.setHeader('Content-Type', 'application/json');
                        res.send(500, JSON.stringify({message: ex}));
                    }

                    data.updateUserRegistrationCode(user, (function (err) {
                            if (!err) {
                                var client = require('twilio')(ms.accountSid, ms.authToken);

                                client.messages.create({
                                    to: user.phone_number,
                                    from: "+18135139522",
                                    body: "Your taxi verification code: " + registration_code
                                }, function (err, message) {
                                    var msg = message;
                                });
                                res.setHeader('Content-Type', 'application/json');
                                res.send(200, JSON.stringify({message: 'ok'}));
                            }
                            else {
                                res.setHeader('Content-Type', 'application/json');
                                res.send(500, JSON.stringify({message: err}));
                            }
                        })
                    );
                }
            });
        });

        app.get('/api/GetUserProfile', function (req, res) {
            if (req.session.user == null) {
                // if user is not logged-in redirect back to login page //
                res.redirect('/');
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.send(200, JSON.stringify({user: req.session.user}));
            }
        });

        app.get('/api/userpayment/:user_id', function (req, res) {
            data.getUserPaymentMethod(req.params.user_id,
                function (err, userpayments) {
                    if (!userpayments) {
                        res.setHeader('Content-Type', 'application/json');
                        res.send(400, JSON.stringify({message: 'invalid-request'}));
                    }
                    else {
                        for (var key in userpayments) {
                            if (userpayments.hasOwnProperty(key)) {
                                var stringLength = userpayments[key].card_number.length; // this will be 16
                                if (stringLength > 4) {
                                    var lastChar = userpayments[key].card_number.substring(stringLength - 4);
                                    userpayments[key].card_number = userpayments[key].card_number.substring(stringLength - 4);
                                }
                            }
                        }
                        //res.setHeader('Content-Type', 'application/json; charset=utf-8');
                        res.json(200, userpayments);
                    }
                });

        });

        var _CreateUserPayment = function (req, res) {
            //var user_id =new BSON.ObjectID(req.body.user_id);
            var mongo = require('mongodb');
            var BSON = mongo.BSONPure;
            var user_payment_detail = {
                cardholder_first_name: req.body.cardholder_first_name,
                cardholder_last_name: req.body.cardholder_last_name,
                card_number: req.body.card_number.replace(/[\s\. ,:-]+/g, ""),
                expiry_date: req.body.expiry_date,
                cvv_number: req.body.cvv_number,
                zip_code: req.body.zip_code,
                user_id: req.body.user_id,
                type: req.body.type,
                card_use_type: req.body.card_use_type,
                is_default: req.body.is_default
            }

            data.addUserPaymentMethod(user_payment_detail, function (err, obj) {
                if (err) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(400, JSON.stringify({message: err}));
                } else {
                    if (obj) {
                        if (obj.card_number.length >= 4) {
                            var myString = obj.card_number;
                            var stringLength = myString.length; // this will be 16
                            var lastChar = myString.substring(stringLength - 4);
                            obj.card_number = lastChar;
                        }
                        res.setHeader('Content-Type', 'application/json');
                        res.send(200, obj);
                    }
                    else
                        res.send(400, JSON.stringify({message: 'there is problem in returning object.'}));
                }
            });
        };

        var _UpdatePayment = function (req, res) {
            var user_payment_detail = {
                //cardholder_first_name: req.body.cardholder_first_name,
                //cardholder_last_name: req.body.cardholder_last_name,
                //card_number: req.body.card_number,
                expiry_date: req.body.expiry_date,
                cvv_number: req.body.cvv_number,
                zip_code: req.body.zip_code,
                _id: req.body._id,
                //user_id: req.body.user_id,
                //type:req.body.type,
                card_use_type: req.body.card_use_type,
                is_default: req.body.is_default
            }
            data.updateUserPaymentMethod(user_payment_detail, function (err, obj) {
                if (err) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(400, JSON.stringify({message: e}));
                } else {
                    if (obj.card_number.length >= 4) {
                        var myString = obj.card_number;
                        var stringLength = myString.length; // this will be 16
                        var lastChar = myString.substring(stringLength - 4);
                        obj.card_number = lastChar;
                    }
                    res.setHeader('Content-Type', 'application/json');
                    res.send(200, obj);
                }
            });
        };


        var _DeletePayment = function (req, res) {
            var user_payment_detail = {
                _id: req.body._id
            }
            data.deleteUserPaymentMethod(user_payment_detail, function (err, obj) {
                if (err) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(400, JSON.stringify({message: e}));
                } else {
                    if (obj.card_number.length >= 4) {
                        var myString = obj.card_number;
                        var stringLength = myString.length; // this will be 16
                        var lastChar = myString.substring(stringLength - 4);
                        obj.card_number = lastChar;
                    }
                    res.setHeader('Content-Type', 'application/json');
                    res.send(200, obj);
                }
            });
        };

        app.get('/payment/:token', function (req, res) {
            data.getUserByRegToken(req.params.token, function (err, user) {
                if (!user) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(400, JSON.stringify({message: 'invalid-request'}));
                }
                else {
                    if (user.user_type == 'passenger')
                        res.render('payment', { title: "Payment detail", message: req.flash("loginError") });
                    else if (user.user_type == 'driver')
                        res.render('login', { title: "Login", message: req.flash("loginError") });
                }
            });
        });


        var _CreatePayment = function (req, res)
        {
            data.getUserByRegToken(req.body.registration_token, function (err, user) {
                if (!user) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(400, JSON.stringify({message: 'invalid-request'}));
                }
                else {
                    var user_payment_detail = {
                        cardholder_first_name: req.body.cardholder_first_name,
                        cardholder_last_name: req.body.cardholder_last_name,
                        card_number: req.body.card_number,
                        expiry_date: req.body.expiry_date,
                        cvv_number: req.body.cvv_number,
                        zip_code: req.body.zip_code,
                        user_id: user._id.toString(),
                        type: req.body.type,
                        card_use_type: req.body.card_use_type,
                        is_default: 'true'
                    }
                    data.addUserPaymentMethod(user_payment_detail, function (err, obj) {
                        if (err) {
                            res.setHeader('Content-Type', 'application/json');
                            res.send(400, JSON.stringify({message: e}));
                        } else {
                            var user_registration_status = '';
                            if (user.user_type == 'driver')
                                user_registration_status = 'registered';
                            else if (user.user_type == 'passenger')
                                user_registration_status = 'complete';

                            data.updateUserRegistrationStatus(user_registration_status, user,
                                function (e) {
                                    if (e) {
                                        res.setHeader('Content-Type', 'application/json');
                                        res.send(400, JSON.stringify({message: e}));
                                    } else {

                                        //require the Twilio module and create a REST client
                                        var client = require('twilio')(ms.accountSid, ms.authToken);

                                        client.messages.create({
                                            to: user.phone_number,
                                            from: "+18135139522",
                                            body: "Your registration has been completed."
                                        }, function (err, message) {
                                            var msg = message;
                                        });

                                        var smtpTransport = nodemailer.createTransport('SMTP', {
                                            host: ms.host, // hostname
                                            secureConnection: false, // use SSL
                                            port: 25, // port for secure SMTP
                                            auth: {
                                                user: ms.user,
                                                pass: ms.password
                                            }
                                        });
                                        var mailOptions = {
                                            to: user.email,
                                            from: ms.user,
                                            subject: 'Your taxi registration has been completed',
                                            text: 'Hello,\n\n' +
                                                'You are now registered with taxi, Thanks.\n'
                                        };
                                        smtpTransport.sendMail(mailOptions, function (err) {
                                            //done(err);
                                        });
                                        res.setHeader('Content-Type', 'application/json');
                                        //res.send(200, JSON.stringify({message:'ok'}) );
                                        res.send(200, JSON.stringify({first_name: user.first_name, last_name: user.last_name, email: user.email, phone_number: user.phone_number, registration_status: user_registration_status, user_type: user.user_type, _id: user._id, device_id: user.device_id }));
                                    }
                                });
                        }
                    });
                }
            });
        };


        // password reset //
        app.post('/lost-password', function (req, res) {
            async.waterfall([
                function (done) {
                    crypto.randomBytes(20, function (err, buf) {
                        var token = buf.toString('hex');
                        done(err, token);
                    });
                },
                function (token, done) {
                    data.getUserByEmail(req.body.email, function (err, user) {
                        if (!err && user) {

                            user.reset_password_token = token;
                            user.reset_password_expires = Date.now() + (3600000 * 24); // 1 hour

                            data.updateUserPasswordRestToken(user, (function (err) {
                                    if (err)
                                        res.setHeader('Content-Type', 'application/json');
                                        res.send(JSON.stringify({message:'there is problem in processing this request.'}), 400);
                                })
                            );
                            var smtpTransport = nodemailer.createTransport('SMTP', {
                                host: ms.host, // hostname
                                secureConnection: false, // use SSL
                                port: 25, // port for secure SMTP
                                auth: {
                                    user: ms.user,
                                    pass: ms.password
                                }
                            });
                            var mailOptions = {
                                to: user.email,
                                from: ms.user,
                                subject: 'taxi Password Reset',
                                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                            };
                            smtpTransport.sendMail(mailOptions, function (err) {
                                if (err) {
                                    res.send('email-server-error', 400);
                                }
                                else {
                                    res.send('ok', 200);
                                }
                                //done(err, 'done');
                            });
                        }
                        else {
                            res.send('email-not-found', 400);
                        }
                    });
                }
            ], function (err) {
                if (err) return next(err);
                res.redirect('/forgot');
            });
        });

        app.put('/lost-password', function (req, res) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');

                data.getUserByEmail(req.body._email, function (err, user) {
                    if (!err && user) {

                        user.reset_password_token = token;
                        user.reset_password_expires = Date.now() + (3600000 * 24); // 1 hour

                        data.updateUserPasswordRestToken(user, (function (err) {
                                if (err)
                                    res.setHeader('Content-Type', 'application/json');
                                res.send(JSON.stringify({message:'there is problem in processing this request.'}), 400);
                            })
                        );
                        var smtpTransport = nodemailer.createTransport('SMTP', {
                            host: ms.host, // hostname
                            secureConnection: false, // use SSL
                            port: 25, // port for secure SMTP
                            auth: {
                                user: ms.user,
                                pass: ms.password
                            }
                        });
                        var mailOptions = {
                            to: user.email,
                            from: ms.user,
                            subject: 'taxi Password Reset',
                            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                                'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                        };
                        smtpTransport.sendMail(mailOptions, function (err) {
                            if (err) {
                                res.send('email-server-error', 400);
                            }
                            else {
                                res.json({status: 201});
                                //res.send(200, JSON.stringify({message:'OK'}));
                                //res.send('ok', 200);
                            }
                            //done(err, 'done');
                        });
                    }
                    else {
                        res.send('email-not-found', 400);
                    }
                });
            });
        });

        app.get('/reset-password', function (req, res) {
            var email = req.query["e"];
            var passH = req.query["p"];
            AM.validateResetLink(email, passH, function (e) {
                if (e != 'ok') {
                    res.redirect('/');
                } else {
                    // save the user's email in a session instead of sending to the client //
                    req.session.reset = { email: email, passHash: passH };
                    res.render('reset', { title: 'Reset Password' });
                }
            })
        });

        app.post('/reset-password', function (req, res) {
            var nPass = req.param('pass');
            // retrieve the user's email from the session to lookup their account and reset password //
            var email = req.session.reset.email;
            // destory the session immediately after retrieving the stored email //
            req.session.destroy();
            AM.updatePassword(email, nPass, function (e, o) {
                if (o) {
                    res.send('ok', 200);
                } else {
                    res.send('unable to update password', 400);
                }
            })
        });

        app.get('/reset/:token', function (req, res) {
            data.getUserByToken(req.params.token, function (err, user) {
                if (!user) {
                    return res.redirect('/');
                }
                else {
                    res.render("reset", { title: "Reset you taxi web portal password", message: req.flash("loginError") });
                }
            });
        });

        app.post("/reset/:token", function (req, res) {

            data.getUserByToken(req.params.token, function (err, user) {
                if (!user) {
                    return res.redirect('/');
                }

                var salt = hasher.createSalt();

                user.passwordHash = hasher.computeHash(req.body.pass, salt);
                user.salt = salt;
                user.reset_password_token = undefined;
                user.reset_password_expires = undefined;


                data.updateUserPassword(user, function (err) {

                        req.logIn(user, function (err) {
                            if (err) {
                                next(err);
                            } else {
                                res.redirect("/");
                            }
                        });

                        var smtpTransport = nodemailer.createTransport('SMTP', {
                            host: ms.host, // hostname
                            secureConnection: false, // use SSL
                            port: 25, // port for secure SMTP
                            auth: {
                                user: ms.user,
                                pass: ms.password
                            }
                        });
                        var mailOptions = {
                            to: user.email,
                            from: ms.user,
                            subject: 'Your taxi password has been changed',
                            text: 'Hello,\n\n' +
                                'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
                        };
                        smtpTransport.sendMail(mailOptions, function (err) {
                            req.flash('success', 'Success! Your password has been changed.');
                            //done(err);
                        });
                    }
                );
            });
        });


        //password recovery section end
        // creating new accounts //

        app.get('/driver_signup', function (req, res) {
            var _affiliateService = require("../data/models/AffiliateService");
            _affiliateService.GetAll(function (err, result) {
                res.render('driver_signup', {  title: 'taxi Driver Signup', affiliates: result});
            });
        });


        var _DriverSignUp = function (req, res) {
            if (validator.isEmail(req.body.email) && (!validator.isNull(req.body.first_name))
                && (!validator.isNull(req.body.last_name)) && (!validator.isNull(req.body.phone_number))
                && (!validator.isNull(req.body.password))
                && validator.isDate(req.body.chauffeur_expiration_date) && validator.isDate(req.body.date_of_birth))
            {
                var target_path_chauffeur = '';
                try {
                    if (req.files)
                        if (req.files.chauffeur_license_attachment) {
                            var fs = require('fs');
                            var tmp_path = req.files.chauffeur_license_attachment.path;
                            // set where the file should actually exists - in this case it is in the "images" directory
                            //var target_path = './public/users/registration/attachments/' + req.files.chauffeur_license_attachment.name;
                            target_path_chauffeur = './public/user_attachments/' + req.files.chauffeur_license_attachment.name;
                            // move the file from the temporary location to the intended location
                            var is = fs.createReadStream(tmp_path);
                            var os = fs.createWriteStream(target_path_chauffeur);
                            is.pipe(os);
                            is.on('end', function () {
                                fs.unlinkSync(tmp_path);
                            });
                            target_path_chauffeur = target_path_chauffeur.replace("./public", "" );
                        }
                } catch (ex) {

                }

                var salt = hasher.createSalt();
                var registration_token = '';
                try {
                    var buf = crypto.randomBytes(20);
                    registration_token = buf.toString('hex');
                } catch (ex) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(500, JSON.stringify({message: ex}));
                }

                var registration_code = '';
                try {
                    var buf = crypto.randomBytes(4);
                    registration_code = parseInt(buf.toString('hex'), 16).toString().substr(0, 6);
                } catch (ex) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(500, JSON.stringify({message: ex}));
                }

                data.addNewAccount({
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        email: req.body.email,
                        phone_number: req.body.phone_number,
                        passwordHash: hasher.computeHash(req.body.password, salt),
                        salt: salt,
                        registration_status: 'pending',
                        registration_token: registration_token,
                        registration_code: registration_code,
                        user_type: "driver",
                        reset_password_token: undefined,
                        reset_password_expires: undefined,
                        force_registration: req.body.fra,
                        device_id: req.body.device_id,
                        status: 'offline',
                        ratting:'5',
                        number_of_trips:'0'
                    },
                    {
                        chauffeur_license_no: req.body.chauffeur_license_no,
                        chauffeur_license_state: 'IL',
                        chauffeur_license_city: 'Chicago',
                        chauffeur_expiration_date: req.body.chauffeur_expiration_date,
                        chauffeur_license_attachment: target_path_chauffeur,
                        address1: req.body.address1,
                        address2: req.body.address2,
                        city: req.body.city,
                        state: req.body.state,
                        zipcode: req.body.zipcode,
                        date_of_birth: req.body.date_of_birth,
                        taxi_company: req.body.taxi_company,
                        social_security_number: req.body.social_security_number
                    }
                    , function (e) {
                        if (e) {
                            if (e == 'phonenumber-taken-complete') {
                                res.setHeader('Content-Type', 'application/json');
                                res.send(400, JSON.stringify({message: 'phone-registered-completed'}));
                            }
                            else if (e == 'phonenumber-taken') {
                                res.setHeader('Content-Type', 'application/json');
                                res.send(400, JSON.stringify({message: 'account-registered-pending'}));
                            }
                            else {
                                res.setHeader('Content-Type', 'application/json');
                                return res.send(400, JSON.stringify({message: 'email-taken'}));
                            }
                        }
                        else {
                            //require the Twilio module and create a REST client
                            var client = require('twilio')(ms.accountSid, ms.authToken);

                            client.messages.create({
                                to: req.body.phone_number,
                                from: "+18135139522",
                                body: "Your taxi verification code: " + registration_code
                            }, function (err, message) {
                                var msg = message;
                            });


                            var smtpTransport = nodemailer.createTransport('SMTP', {
                                host: ms.host, // hostname
                                secureConnection: false, // use SSL
                                port: 25, // port for secure SMTP
                                auth: {
                                    user: ms.user,
                                    pass: ms.password
                                }
                            });
                            var mailOptions = {
                                to: req.body.email,
                                from: ms.user,
                                subject: 'Welcome to taxi',
                                text: 'You are just registered with taxi, your verification code is : "' + registration_code + '" Please use this code to verify your account.\n'
                            };
                            smtpTransport.sendMail(mailOptions, function (err) {
                                if (err)
                                    res.send('email-server-error', 400);
                                //done(err, 'done');
                            });

                            res.setHeader('Content-Type', 'application/json');
                            res.send(200, JSON.stringify({registration_token: registration_token}));
                        }
                    });
            }
            else
                res.send(417, "Validation Failed");
        };

        app.get('/signup', function (req, res) {
            res.render('passenger_signup', {  title: 'taxi Signup' });
        });

        app.get('/signup/:registration_token', function (req, res) {
            data.getUserByRegToken(req.params.registration_token, function (err, user) {
                if (user) {
                    res.render('signup', {  title: 'taxi Signup', udata: user });
                }
                else {
                    res.render('login', {  title: 'login' });
                }
            });
        });

        app.get('/driver_signup/:registration_token', function (req, res) {
            data.getUserByRegToken(req.params.registration_token, function (err, user) {
                if (user) {
                    data.getDriverDetail(user._id, function (err, driver) {
                        if (driver) {
                            user.chauffeur_license_no = driver.chauffeur_license_no;
                            user.license_expiration_date = driver.license_expiration_date;
                            user.driver_license_state = driver.driver_license_state;
                            //user.license_attachment = driver.license_attachment;
                            user.driver_address1 = driver.driver_address1;
                            user.driver_address2 = driver.driver_address2;
                            user.city = driver.city;
                            user.state = driver.state;
                            user.zipcode = driver.zipcode;


                            user.social_security_number = driver.social_security_number;
                            user.taxi_company = driver.taxi_company;
                            user.chauffeur_license_no = driver.chauffeur_license_no;
                            user.chauffeur_expiration_date = driver.chauffeur_expiration_date;
                            user.chauffeur_license_state = driver.chauffeur_license_state;
                            user.chauffeur_license_city = driver.chauffeur_license_city;
                            user.chauffeur_license_attachment = driver.chauffeur_license_attachment;
                            user.city = driver.city;
                            user.date_of_birth = driver.date_of_birth;

                            var _affiliateService = require("../data/models/AffiliateService");
                            _affiliateService.GetAll(function (err, result) {
                                res.render('driver_signup', {  title: 'taxi Driver Signup', udata: user, affiliates: result});
                            });

                        }
                        else {
                            res.render('login', {  title: 'login' });
                        }
                    });
                }
                else {
                    res.render('login', {  title: 'login' });
                }
            });
        });

        var _UpdateSignUp = function (req, res)
        {
            if ((!validator.isNull(req.body._id)) && (!validator.isNull(req.body.first_name))
                && (!validator.isNull(req.body.last_name)) && (!validator.isNull(req.body.phone_number))
                && validator.isDate(req.body.chauffeur_expiration_date) && validator.isDate(req.body.date_of_birth)) {
                var target_path_chauffeur = '';
                try {
                    if (req.files)
                        if (req.files.chauffeur_license_attachment) {
                            var fs = require('fs');
                            var tmp_path = req.files.chauffeur_license_attachment.path;
                            // set where the file should actually exists - in this case it is in the "images" directory
                            //var target_path_chauffeur = './public/users/registration/attachments/' + req.files.chauffeur_license_attachment.name;
                            target_path_chauffeur = './public/user_attachments/' + req.files.chauffeur_license_attachment.name;
                            // move the file from the temporary location to the intended location
                            var is = fs.createReadStream(tmp_path);
                            var os = fs.createWriteStream(target_path_chauffeur);
                            is.pipe(os);
                            is.on('end', function () {
                                fs.unlinkSync(tmp_path);
                            });
                            target_path_chauffeur = target_path_chauffeur.replace("./public", "" );
                        }
                } catch (ex) {

                }


                var salt = hasher.createSalt();
                var registration_token = '';
                try {
                    var buf = crypto.randomBytes(20);
                    registration_token = buf.toString('hex');
                } catch (ex) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(500, JSON.stringify({message: ex}));
                }

                var registration_code = '';
                try {
                    var buf = crypto.randomBytes(5);
                    registration_code = parseInt(buf.toString('hex'), 16).toString().substr(0, 6);
                } catch (ex) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(500, JSON.stringify({message: ex}));
                }
                data.updateNewAccount({
                    _id: req.body._id,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    //email: req.body.email,
                    phone_number: req.body.phone_number,
                    //passwordHash: hasher.computeHash(req.body.password, salt),
                    //salt: salt,
                    registration_status: 'pending',
                    registration_token: registration_token,
                    registration_code: registration_code,
                    //user_type: "passenger",
                    reset_password_token: undefined,
                    reset_password_expires: undefined,
                    force_registration: req.body.fra,
                    device_id: req.body.device_id,
                    ratting:'5',
                    number_of_trips:'0'
                }, {
                    chauffeur_license_no: req.body.chauffeur_license_no,
                    chauffeur_license_state: req.body.driver_license_state,
                    chauffeur_license_city: req.body.chauffeur_license_city,
                    chauffeur_expiration_date: req.body.chauffeur_expiration_date,
                    chauffeur_license_attachment: target_path_chauffeur,
                    address1: req.body.address1,
                    address2: req.body.address2,
                    city: req.body.city,
                    state: req.body.state,
                    zipcode: req.body.zipcode,
                    date_of_birth: req.body.date_of_birth,
                    taxi_company: req.body.taxi_company,
                    social_security_number: req.body.social_security_number
                }, function (e) {
                    if (e) {
                        if (e == 'phonenumber-taken-complete') {
                            res.setHeader('Content-Type', 'application/json');
                            res.send(400, JSON.stringify({message: 'phone-registered-completed'}));
                        }
                        else if (e == 'phonenumber-taken') {
                            res.setHeader('Content-Type', 'application/json');
                            res.send(400, JSON.stringify({message: 'account-registered-pending'}));
                        }
                        else {
                            res.setHeader('Content-Type', 'application/json');
                            return res.send(400, JSON.stringify({message: 'email-taken'}));
                        }
                    }
                    else {
                        //require the Twilio module and create a REST client
                        var client = require('twilio')(ms.accountSid, ms.authToken);

                        client.messages.create({
                            to: req.body.phone_number,
                            from: "+18135139522",
                            body: "Your taxi verification code: " + registration_code
                        }, function (err, message) {
                            var msg = message;
                        });

                        var smtpTransport = nodemailer.createTransport('SMTP', {
                            host: ms.host, // hostname
                            secureConnection: false, // use SSL
                            port: 25, // port for secure SMTP
                            auth: {
                                user: ms.user,
                                pass: ms.password
                            }
                        });
                        var mailOptions = {
                            to: req.body.email,
                            from: ms.user,
                            subject: 'Welcome to taxi',
                            text: 'You are just registered with taxi, your verification code is : "' + registration_code + '" Please use this code to verify your account.\n'
                        };
                        smtpTransport.sendMail(mailOptions, function (err) {
                            if (err)
                                res.send('email-server-error', 400);
                            //done(err, 'done');
                        });

                        res.setHeader('Content-Type', 'application/json');
                        res.send(200, JSON.stringify({registration_token: registration_token}));
                    }
                });
            }
            else
                res.send(417, "Validation Failed");
        };

        var _Signup = function (req, res) {


            if (validator.isEmail(req.body.email) && (!validator.isNull(req.body.first_name))
                && (!validator.isNull(req.body.last_name)) && (!validator.isNull(req.body.phone_number))
                && (!validator.isNull(req.body.password))) {
                var salt = hasher.createSalt();
                var registration_token = '';
                try {
                    var buf = crypto.randomBytes(20);
                    registration_token = buf.toString('hex');
                } catch (ex) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(500, JSON.stringify({message: ex}));
                }

                var registration_code = '';
                try {
                    var buf = crypto.randomBytes(4);
                    registration_code = parseInt(buf.toString('hex'), 16).toString().substr(0, 6);
                } catch (ex) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(500, JSON.stringify({message: ex}));
                }

                data.addNewAccount({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    phone_number: req.body.phone_number,
                    passwordHash: hasher.computeHash(req.body.password, salt),
                    salt: salt,
                    registration_status: 'pending',
                    registration_token: registration_token,
                    registration_code: registration_code,
                    user_type: "passenger",
                    reset_password_token: undefined,
                    reset_password_expires: undefined,
                    force_registration: req.body.fra,
                    device_id: req.body.device_id,
                    ratting:'5',
                    number_of_trips:'0'
                }, null, function (e) {
                    if (e) {
                        if (e == 'phonenumber-taken-complete') {
                            res.setHeader('Content-Type', 'application/json');
                            res.send(400, JSON.stringify({message: 'phone-registered-completed'}));
                        }
                        else if (e == 'phonenumber-taken') {
                            res.setHeader('Content-Type', 'application/json');
                            res.send(400, JSON.stringify({message: 'account-registered-pending'}));
                        }
                        else {
                            res.setHeader('Content-Type', 'application/json');
                            return res.send(400, JSON.stringify({message: 'email-taken'}));
                        }
                    }
                    else {
                        //require the Twilio module and create a REST client
                        var client = require('twilio')(ms.accountSid, ms.authToken);

                        client.messages.create({
                            to: req.body.phone_number,
                            from: "+18135139522",
                            body: "Your taxi verification code: " + registration_code
                        }, function (err, message) {
                            var msg = message;
                        });


                        var smtpTransport = nodemailer.createTransport('SMTP', {
                            host: ms.host, // hostname
                            secureConnection: false, // use SSL
                            port: 25, // port for secure SMTP
                            auth: {
                                user: ms.user,
                                pass: ms.password
                            }
                        });
                        var mailOptions = {
                            to: req.body.email,
                            from: ms.user,
                            subject: 'Welcome to taxi',
                            text: 'You are just registered with taxi, your verification code is : "' + registration_code + '" Please use this code to verify your account.\n'
                        };
                        smtpTransport.sendMail(mailOptions, function (err) {
                            if (err)
                                res.send('email-server-error', 400);
                            //done(err, 'done');
                        });

                        data.getUserByRegToken(registration_token, function (err, user) {
                            var _passengerDetailService = require("../data/models/PassengerDetailService");
                            _passengerDetailService.AddNew({user_id: user._id.toString(), city: 'Chicago', state: 'IL', isactive: true, is_cash_enabled: true, is_cash_default: false, user_image: '', favourite_affiliate: '',tip: '20'}, function (error, obj) {
                                if (error) {
                                    res.setHeader('Content-Type', 'application/json');
                                    res.send(200, JSON.stringify({message: error}));
                                }
                                else {
                                    res.setHeader('Content-Type', 'application/json');
                                    res.send(200, JSON.stringify({registration_token: user.registration_token}));
                                }
                            })
                        });
                    }
                });
            }
            else
                res.send(417, "Validation Failed");
        };

        app.get('/account_security', function (req, res) {
            if (req.session.user == null) {
                // if user is not logged-in redirect back to login page //
                res.redirect('/');
            } else {
                res.render('account_security', {
                    title: 'Change Password',
                    udata: req.session.user
                });
            }
        });

        app.get('/my_account', function (req, res) {
            if (req.session.user == null) {
                    // if user is not logged-in redirect back to login page //
                    res.redirect('/');
                } else {
                    if (req.session.user.user_type === 'driver' || req.session.user.user_type === 'admin') {
                        var user = req.session.user;
                        var mongo = require('mongodb');
                        var BSON = mongo.BSONPure;
                        var _driverService = require("../data/models/DriverDetailService");
                        data.getDriverDetail(new BSON.ObjectID(req.session.user._id), function (err, result) {
                            user.chauffeur_license_no = result.chauffeur_license_no;
                            user.chauffeur_expiration_date = result.chauffeur_expiration_date;
                            user.driver_license_state = result.chauffeur_license_state;

                            user.chauffeur_license_city = result.chauffeur_license_city;
                            user.chauffeur_license_attachment = result.chauffeur_license_attachment;
                            user.driver_license_no = result.driver_license_no;

                            user.driver_license_expiration_date = result.driver_license_expiration_date;
                            user.driver_license_state = result.driver_license_state;
                            user.driver_license_city = result.driver_license_city;

                            user.driver_license_attachment = result.driver_license_attachment;
                            user.address1 = result.address1;
                            user.address2 = result.address2;

                            user.city = result.city;
                            user.state = result.state;
                            user.zipcode = result.zipcode;

                            user.taxi_company = result.taxi_company;
                            user.social_security_number = result.social_security_number;
                            user.user_image = result.user_image;
                            user.date_of_birth = result.date_of_birth;

                            // _driverService.ByUser(new BSON.ObjectID(req.session.user._id),function(err,result) {
                            var _affiliateService = require("../data/models/AffiliateService");
                            _affiliateService.GetAll(function (err, result) {
                                res.render('driver_account', {
                                    title: 'Control Panel',
                                    udata: user,
                                    affiliates: result
                                });
                            });
                        });
                    }
                    else {
                        res.render('my_account', {
                            title: 'Control Panel',
                            udata: req.session.user
                        });
                    }
            }
        });


        // logged-in user homepage //

        app.get('/home', function (req, res) {
            var user = req.session.user;
            if (user == null) {
                // if user is not logged-in redirect back to login page //
                res.redirect('/');
            } else {
                /*res.render('home', {
                    title: 'taxi Home',
                    udata: user,
                    data:[]
                });*/
                if(user.user_type == 'admin'){
                    res.redirect('/admin/trips?isWeb=true');
                }
                else if(user.user_type == 'passenger'){
                    res.redirect('/passenger/trips?isWeb=true');
                }
                else{
                    res.redirect('/driver/trips?isWeb=true');
                }



            }
        });

        app.post('/home', function (req, res) {
            if (req.param('user') != undefined) {
                AM.updateAccount({
                    user: req.param('user'),
                    name: req.param('name'),
                    email: req.param('email'),
                    country: req.param('country'),
                    pass: req.param('pass')
                }, function (e, o) {
                    if (e) {
                        res.send('error-updating-account', 400);
                    } else {
                        req.session.user = o;
                        // update the user's login cookies if they exists //
                        if (req.cookies.user != undefined && req.cookies.pass != undefined) {
                            res.cookie('user', o.user, { maxAge: 900000 });
                            res.cookie('pass', o.pass, { maxAge: 900000 });
                        }
                        res.send('ok', 200);
                    }
                });
            } else if (req.param('logout') == 'true') {


                req.session.destroy(function (e) {
                    res.clearCookie('connect.sid', { path: '/' });
                    res.clearCookie('email',{ path: '/' });
                    res.clearCookie('password',{ path: '/' });
                    res.send('ok', 200);
                });
            }
        });

        var _Login = function (req, res, next) {
            userVerify(req.body.email, req.body.password, function (e, o) {
                if (!o) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(400, JSON.stringify({message: 'invalid-credentials'}));
                } else {

                    data.updateUserDevices(req.body.device_id, o._id, function (err) {
                        if (err)
                            next(err);
                    });
                    o.device_id = req.body.device_id;
                    req.session.user = o;
                    req.logIn(o, function (err) {
                        if (err) {
                            next(err);
                        } else {
                            if (o.user_type == 'passenger') {

                                var user_first_payment = '{"card_number": "", "type": "", "card_use_type": "", "city": "", "state": "", "_id": "", "passenger_detail_id":"", "user_image":"","is_cash_default":"false"}';
                                user_first_payment = JSON.parse(user_first_payment);
                                var lastChar = '';
                                data.getUserFirstPaymentMethod(o._id, function (err, user_first_payment) {
                                    if (user_first_payment) {
                                        var myString = user_first_payment.card_number;
                                        var stringLength = myString.length; // this will be 16
                                        var lastChar = myString.substring(stringLength - 4);
                                    }
                                    else {
                                        user_first_payment = '{"card_number": "", "type": "", "card_use_type": "", "city": "", "state": "", "_id": "", "passenger_detail_id":"", "user_image":"","is_cash_default":"false"}';
                                        user_first_payment = JSON.parse(user_first_payment);
                                    }
                                    var _passengerDetailService = require("../data/models/PassengerDetailService");
                                    _passengerDetailService.GetByCriteria({user_id: o._id}, function (err, result) {
                                        if (result) {
                                            if (result._doc.is_cash_default) {
                                                lastChar = 'cash';

                                                user_first_payment.card_number = 'cash';
                                                user_first_payment.type = '';
                                                user_first_payment.card_use_type = '';
                                                user_first_payment.city = '';
                                                user_first_payment.state = '';
                                                user_first_payment._id = '';
                                                user_first_payment.is_cash_default = 'true';
                                            }
                                            else
                                            {
                                                user_first_payment.is_cash_default = 'fasle';
                                            }
                                            if(result._doc.user_image)
                                                result._doc.user_image = ms.url + result._doc.user_image;
                                            res.setHeader('Content-Type', 'application/json');
                                            res.send(200, JSON.stringify({first_name: o.first_name, last_name: o.last_name, email: o.email, phone_number: o.phone_number, registration_status: o.registration_status, user_type: o.user_type, registration_token: o.registration_token, _id: o._id, device_id: o.device_id, card_number: lastChar, type: user_first_payment.type, card_use_type: user_first_payment.card_use_type, card_id: user_first_payment._id, state: result._doc.state, city: result._doc.city, passenger_detail_id: result._doc._id, image: result._doc.user_image, is_cash_default : user_first_payment.is_cash_default}));

                                        }
                                        else {
                                            res.setHeader('Content-Type', 'application/json');
                                            res.send(200, JSON.stringify({first_name: o.first_name, last_name: o.last_name, email: o.email, phone_number: o.phone_number, registration_status: o.registration_status, user_type: o.user_type, registration_token: o.registration_token, _id: o._id, device_id: o.device_id, card_number: lastChar, type: user_first_payment.type, card_use_type: user_first_payment.card_use_type, card_id: user_first_payment._id, state: user_first_payment.state, city: user_first_payment.city, passenger_detail_id: user_first_payment.passenger_detail_id, image: user_first_payment.user_image, is_cash_default : user_first_payment.is_cash_default }));
                                            //res.send(200, JSON.stringify({first_name: o.first_name, last_name: o.last_name, email: o.email, phone_number: o.phone_number, registration_status: o.registration_status, user_type: o.user_type, registration_token: o.registration_token, _id: o._id, device_id: o.device_id, card_number: lastChar, type: user_first_payment.type, card_use_type: user_first_payment.card_use_type, card_id: user_first_payment._id, state: user_first_payment.state, city: user_first_payment.city, passenger_detail_id: user_first_payment.passenger_detail_id }));
                                        }
                                    });
                                });
                            }
                            else if (o.user_type == 'driver') {

                                var driver_detail = '{"state":"","city":"","medallion_number":"","affiliate":"","affiliate_logo":"","driver_detail_id":"","user_image":"","social_security_number":"","date_of_birth":"","address1":"","address2":"","city":"","state":"","zipcode":""}';
                                driver_detail = JSON.parse(driver_detail);


                                var mongo = require('mongodb');
                                var BSON = mongo.BSONPure;

                                var _driverDetailService = require("../data/models/DriverDetailService");
                                _driverDetailService.GetByCriteria({user_id: o._id.toString() }, function (err, driver) {
                                    if (driver) {
                                        driver_detail.state = driver._doc.state;
                                        driver_detail.city = driver._doc.city;
                                        driver_detail.driver_detail_id = driver._doc._id;
                                        driver_detail.user_image = ms.url + driver._doc.user_image;
                                        driver_detail.medallion_number = driver._doc.cab_medallion_number;
                                        driver_detail.cab_affiliate_id = driver._doc.cab_affiliate_id;

                                        driver_detail.social_security_number = driver._doc.social_security_number;
                                        driver_detail.date_of_birth = driver._doc.date_of_birth;

                                        driver_detail.address1 = driver._doc.address1;
                                        driver_detail.address2 = driver._doc.address2;
                                        driver_detail.city = driver._doc.city;
                                        driver_detail.state = driver._doc.state;
                                        driver_detail.zipcode = driver._doc.zipcode;
                                    }
                                    var _cabService = require("../data/models/cabService");
                                    _cabService.GetByCriteria({user_id: "53e757eae11f699c1f52da63"}, function (err, result) {
                                        //if (result)
                                            //driver_detail.medallion_number = result._doc.medallion_number;

                                        if (driver) {
                                            var _affiliateService = require("../data/models/AffiliateService");
                                            _affiliateService.GetByCriteria({_id: driver._doc.cab_affiliate_id }, function (err, affiliate) {
                                                if (affiliate)
                                                {
                                                    driver_detail.affiliate = affiliate._doc.name;
                                                    driver_detail.affiliate_logo = ms.url+affiliate._doc.affiliate_logo;
                                                }

                                                res.setHeader('Content-Type', 'application/json');
                                                res.send(200, JSON.stringify({first_name: o.first_name, last_name: o.last_name, email: o.email, phone_number: o.phone_number, registration_status: o.registration_status, user_type: o.user_type, registration_token: o.registration_token, _id: o._id,ratting: o.ratting,number_of_trips: o.number_of_trips, device_id: o.device_id, state: driver_detail.state, city: driver_detail.city, medallion_number: driver_detail.medallion_number, affiliate: driver_detail.affiliate, affiliate_logo: driver_detail.affiliate_logo, driver_detail_id: driver_detail.driver_detail_id,image: driver_detail.user_image,cab_affiliate_id: driver_detail.cab_affiliate_id,date_of_birth:driver_detail.date_of_birth,social_security_number:driver_detail.social_security_number,address1:driver_detail.address1,address2:driver_detail.address2,city:driver_detail.city,state:driver_detail.state,zipcode:driver_detail.zipcode }));
                                            });
                                        }
                                        else {
                                            res.setHeader('Content-Type', 'application/json');
                                                res.send(200, JSON.stringify({first_name: o.first_name, last_name: o.last_name, email: o.email, phone_number: o.phone_number, registration_status: o.registration_status, user_type: o.user_type, registration_token: o.registration_token, _id: o._id,ratting: o.ratting,number_of_trips: o.number_of_trips, device_id: o.device_id, state: driver_detail.state, city: driver_detail.city, medallion_number: driver_detail.medallion_number, affiliate: driver_detail.affiliate, affiliate_logo: driver_detail.affiliate_logo, driver_detail_id: driver_detail.driver_detail_id,image: driver_detail.user_image,cab_affiliate_id: driver_detail.cab_affiliate_id,date_of_birth:driver_detail.date_of_birth,social_security_number:driver_detail.social_security_number,address1:driver_detail.address1,address2:driver_detail.address2,city:driver_detail.city,state:driver_detail.state,zipcode:driver_detail.zipcode }));
                                        }
                                    });
                                });
                            }
                        }
                    });
                }
            });
        };

        var _Profile = function (req, res, next) {
            var target_path_user_image = req.body.hdn_image;

            try {
                if (req.files)
                    if (req.files.image) {
                        var fs2 = require('fs');
                        var tmp_path2 = req.files.image.path;
                        // set where the file should actually exists - in this case it is in the "images" directory
                        //var target_path = './public/users/registration/attachments/' + req.files.image.name;
                        target_path_user_image = './public/user_attachments/' + req.files.image.name;
                        // move the file from the temporary location to the intended location
                        var is2 = fs2.createReadStream(tmp_path2);
                        var os2 = fs2.createWriteStream(target_path_user_image);
                        is2.pipe(os2);
                        is2.on('end', function () {
                            fs2.unlinkSync(tmp_path2);
                        });
                        target_path_user_image = target_path_user_image.replace("./public", "" );
                    }
            } catch (ex) {

            }

            var user_profile = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                _id: req.body._id
            }
            var driver_fields = {
                address1: req.body.address1,
                address2: req.body.address2,
                city: req.body.city,
                state: req.body.state,
                zipcode: req.body.zipcode,
                social_security_number: req.body.social_security_number,
                date_of_birth: req.body.date_of_birth,
                user_image: target_path_user_image
            }
            data.updateAccount(user_profile, driver_fields, function (err, o) {
                if (err) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(400, JSON.stringify({message: e}));
                } else {
                    o.user_image = driver_fields.user_image;
                    req.session.user = o;
                    res.setHeader('Content-Type', 'application/json');
                    res.send(200, JSON.stringify({first_name: o.first_name, last_name: o.last_name, email: o.email, phone_number: o.phone_number, registration_status: o.registration_status, user_type: o.user_type, registration_token: o.registration_token, _id: o._id }));
                }
            });
        };


        var _UpdateProfile = function (req, res, next) {
            data.getUserById(req.body._id, function (err, user) {
                async.waterfall([
                        function(callback){
                            var request_validated = true;
                            if (user)
                                if (user.user_type == 'driver')
                                    if ((!validator.isNull(req.body._id)) && (!validator.isNull(req.body.first_name))
                                        && (!validator.isNull(req.body.last_name)) && (!validator.isNull(req.body.social_security_number))
                                        && validator.isDate(req.body.date_of_birth))
                                            callback(null,true);
                                        else
                                            callback(null,false);

                                    else if (user.user_type == 'passenger')
                                        if ((!validator.isNull(req.body._id)) && (!validator.isNull(req.body.first_name))
                                            && (!validator.isNull(req.body.last_name)))
                                                callback(null,true);
                                            else
                                                callback(null,false);
                        },
                    function (request_validated){

                            if (request_validated) {

                                /*var target_path_license = '';
                                try {
                                    if (req.files)
                                        if (req.files.driver_license_attachment) {
                                            var fs = require('fs');
                                            var tmp_path = req.files.driver_license_attachment.path;
                                            target_path_license = './public/user_attachments/' + req.files.driver_license_attachment.name;
                                            var is = fs.createReadStream(tmp_path);
                                            var os = fs.createWriteStream(target_path_license);
                                            is.pipe(os);
                                            is.on('end', function () {
                                                fs.unlinkSync(tmp_path);
                                            });
                                            target_path_license = target_path_license.replace("./public", "" );
                                        }
                                } catch (ex) {

                                }*/

                                var target_path_user_image = '';

                                // added by Mukarram for updating user image in session. 14-sep-2014

                                if(req.body.hdn_image != undefined && req.body.hdn_image != '')
                                    target_path_user_image = req.body.hdn_image;

                                // added by Mukarram for updating user image in session. 14-sep-2014

                                try {
                                    if (req.files)
                                        if (req.files.image) {
                                            var fs = require('fs');
                                            var tmp_path = req.files.image.path;
                                            target_path_user_image = './public/user_attachments/' + req.files.image.name;
                                            var is = fs.createReadStream(tmp_path);
                                            var os = fs.createWriteStream(target_path_user_image);
                                            is.pipe(os);
                                            is.on('end', function () {
                                                fs.unlinkSync(tmp_path);
                                            });
                                            target_path_user_image = target_path_user_image.replace("./public", "" );
                                        }
                                } catch (ex) {

                                }


                                var user_profile = {
                                    first_name: req.body.first_name,
                                    last_name: req.body.last_name,
                                    _id: req.body._id,
                                    user_image: target_path_user_image
                                }
                                var driver_fields = {
                                    address1: req.body.address1,
                                    address2: req.body.address2,
                                    city: req.body.city,
                                    state: req.body.state,
                                    zipcode: req.body.zipcode,
                                    social_security_number: req.body.social_security_number,
                                    date_of_birth: req.body.date_of_birth,
                                    user_image: target_path_user_image
//                                    driver_license_no: req.body.driver_license_no,
//                                    driver_license_expiration_date: req.body.driver_license_expiration_date,
//                                    driver_license_state: req.body.driver_license_state,
//                                    driver_license_city: req.body.driver_license_city,
//                                    driver_license_attachment: target_path_license,
                                }
                                data.updateAccount(user_profile, driver_fields, function (err, o) {
                                    if (err) {
                                        res.setHeader('Content-Type', 'application/json');
                                        res.send(400, JSON.stringify({message: e}));
                                    } else {

                                        // added by Mukarram for updating user image in session. 14-sep-2014

                                        o.user_image = target_path_user_image;

                                        // added by Mukarram for updating user image in session. 14-sep-2014

                                        req.session.user = o;
                                        var output = o;

                                        if (o.user_type == 'passenger') {
                                            var _passengerDetailService = require("../data/models/PassengerDetailService");
                                            _passengerDetailService.GetByCriteria({user_id: o._id}, function (err, result) {
                                                if (result) {
                                                    for (var key in o) output[key] = o[key];
                                                    for (var key in result._doc) output[key] = result._doc[key];
                                                    if(output.user_image)
                                                     output.user_image = ms.url+output.user_image;
                                                    res.setHeader('Content-Type', 'application/json');
                                                    res.send(200, JSON.stringify({first_name: output.first_name, last_name: output.last_name, email: output.email, phone_number: output.phone_number, registration_status: output.registration_status, user_type: output.user_type, registration_token: output.registration_token, _id: o._id, image: output.user_image }));

                                                }
                                                else {
                                                    res.setHeader('Content-Type', 'application/json');
                                                    res.send(200, JSON.stringify({first_name: output.first_name, last_name: output.last_name, email: output.email, phone_number: output.phone_number, registration_status: output.registration_status, user_type: output.user_type, registration_token: output.registration_token, _id: o._id, image: '' }));
                                                }
                                            });
                                        }
                                        else {
                                            var _driverDetailService = require("../data/models/DriverDetailService");
                                            _driverDetailService.GetByCriteria({user_id: o._id.toString()}, function (err, result) {
                                                if (result) {
                                                    for (var key in o) output[key] = o[key];
                                                    for (var key in result._doc) output[key] = result._doc[key];
                                                    if(output.user_image)
                                                        output.user_image = ms.url+output.user_image;
                                                    res.setHeader('Content-Type', 'application/json');
                                                    res.send(200, JSON.stringify({first_name: o.first_name, last_name: o.last_name, email: o.email, phone_number: o.phone_number, registration_status: o.registration_status, user_type: o.user_type, registration_token: o.registration_token, _id: o._id,image:output.user_image,social_security_number:output.social_security_number,date_of_birth:output.date_of_birth,address1:output.address1,address2:output.address2,city:output.city,state:output.state,zipcode:output.zipcode }));
                                                }
                                                else
                                                {
                                                    res.setHeader('Content-Type', 'application/json');
                                                    res.send(200, JSON.stringify({first_name: o.first_name, last_name: o.last_name, email: o.email, phone_number: o.phone_number, registration_status: o.registration_status, user_type: o.user_type, registration_token: o.registration_token, _id: o._id,image:'',social_security_number:'',date_of_birth:'',address1:'',address2:'',city:'',state:'',zipcode:'' }));
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                            else {

                                res.setHeader('Content-Type', 'application/json');
                                res.send(417, "Validation Failed");
                            }
                        }
                    ]);
            });
        };

        var _ApproveProfile = function (req, res, next) {
            var user_profile = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                _id: req.body._id
            }
            data.approveUser(user_profile, function (err, o) {
                if (err) {
                    console.log("ERROR")
                    console.log(error);
                    res.send(417,err.message);
                } else {
                    res.json({status: 201, data: o});
                }
            });
        };

        var _ProfileDriverAdmin = function (req, res, next) {
            var user_image = req.body.hdn_image;
            var user_profile = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                _id: req.body._id
            }
            var driver_fields = {
                address1: req.body.address1,
                address2: req.body.address2,
                city: req.body.city,
                state: req.body.state,
                zipcode: req.body.zipcode,
                social_security_number: req.body.social_security_number,
                date_of_birth: req.body.date_of_birth,
                user_image: user_image
            }
            data.updateAccount(user_profile, driver_fields, function (err, o) {
                if (err) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(400, JSON.stringify({message: e}));
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(200, JSON.stringify({first_name: o.first_name, last_name: o.last_name, email: o.email, phone_number: o.phone_number, registration_status: o.registration_status, user_type: o.user_type, registration_token: o.registration_token, _id: o._id }));
                }
            });
        };

        app.get('/passenger_preferences', function (req, res) {
            if (req.session.user == null) {
                // if user is not logged-in redirect back to login page //
                res.redirect('/');
            } else {
                if (req.session.user.user_type == 'driver') {

                }
                else
                if (req.session.user.user_type == 'passenger'){

                    var _passengerDetailService = require("../data/models/PassengerDetailService");
                    _passengerDetailService.GetByCriteria({user_id: req.session.user._id.toString()}, function (err, result) {
                        if (result)
                            if (result._doc) {
                                var _affiliateService =require("../data/models/AffiliateService");
                                _affiliateService.GetAll(function(err,result2) {
                                    res.render('passenger_preference', {
                                        title: 'Preferences',
                                        udata:req.session.user,
                                        pdata: result._doc,
                                        affiliates:result2
                                    });
                                });
                            }
                    });
                }
            }
        });

        // password reset //
        var _AccountSecurity = function (req, res) {
            userVerifyById(req.body._id,req.body.current_password, function (err, user) {
                if (!user) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(400, 'invalid credentials');
                }
                else {

                    var salt = hasher.createSalt();

                    user.passwordHash = hasher.computeHash(req.body.new_password, salt);
                    user.salt = salt;
                    user.reset_password_token = undefined;
                    user.reset_password_expires = undefined;

                    data.updateUserPassword(user, function (err) {
                            var smtpTransport = nodemailer.createTransport('SMTP', {
                                host: ms.host, // hostname
                                secureConnection: false, // use SSL
                                port: 25, // port for secure SMTP
                                auth: {
                                    user: ms.user,
                                    pass: ms.password
                                }
                            });
                            var mailOptions = {
                                to: user.email,
                                from: ms.user,
                                subject: 'Your taxi password has been changed',
                                text: 'Hello,\n\n' +
                                    'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
                            };
                            smtpTransport.sendMail(mailOptions, function (err) {
                                res.setHeader('Content-Type', 'application/json');
                                res.send(200, JSON.stringify({message: 'done'}));
                            });
                        }
                    );
                }
            });
        };

        var _UpdateDriverChauffeur = function (req, res){
            var target_path_chauffeur = req.body.chauffeur_license;
            try {
                if (req.files && req.body.chauffeur_license != '')
                    if (req.files.chauffeur_license_attachment) {
                        var fs = require('fs');
                        var tmp_path = req.files.chauffeur_license_attachment.path;
                        // set where the file should actually exists - in this case it is in the "images" directory
                        //var target_path_chauffeur = './public/users/registration/attachments/' + req.files.chauffeur_license_attachment.name;
                        target_path_chauffeur = './public/user_attachments/' + req.files.chauffeur_license_attachment.name;
                        // move the file from the temporary location to the intended location
                        var is = fs.createReadStream(tmp_path);
                        var os = fs.createWriteStream(target_path_chauffeur);
                        is.pipe(os);
                        is.on('end', function () {
                            fs.unlinkSync(tmp_path);
                        });
                        target_path_chauffeur = target_path_chauffeur.replace("./public", "" );
                    }
            } catch (ex) {

            }

            var driver_fields = {
                _id: req.body._id,
                chauffeur_license_no: req.body.chauffeur_license_no,
                chauffeur_license_state: req.body.chauffeur_license_state,
                chauffeur_license_city: req.body.chauffeur_license_city,
                chauffeur_expiration_date: req.body.chauffeur_expiration_date,
                chauffeur_license_attachment: target_path_chauffeur,
                taxi_company: req.body.taxi_company
            }

            data.UpdateDriverChauffeur(driver_fields,function (e) {
                if (e) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(400, JSON.stringify({message: e}));
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(200, JSON.stringify({message:'done', chauffeur_license:target_path_chauffeur}));
                }
            });
        };

        var _DeleteChuaffeurLicense = function(req,res){
            var driver_fields = {
                _id: req.body._id,
                chauffeur_license_attachment: ''
            }
            data.DeleteDriverChauffeur(driver_fields,function (e) {
                if (e) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(400, JSON.stringify({message: e}));
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(200, JSON.stringify({message:'done', chauffeur_license:''}));
                }
            });
        };

        var _UpdateDriverLicense = function (req, res){
            var target_path_license = req.body.driver_license;
            try {
                if (req.files)
                    if (req.files.driver_license_attachment && req.body.driver_license != '') {
                        var fs = require('fs');
                        var tmp_path = req.files.driver_license_attachment.path;
                        // set where the file should actually exists - in this case it is in the "images" directory
                        //var target_path = './public/users/registration/attachments/' + req.files.driver_license_attachment.name;
                        target_path_license = './public/user_attachments/' + req.files.driver_license_attachment.name;
                        // move the file from the temporary location to the intended location

                        var is = fs.createReadStream(tmp_path);
                        var os = fs.createWriteStream(target_path_license);
                        is.pipe(os);
                        is.on('end', function () {
                            fs.unlinkSync(tmp_path);
                        });
                        target_path_license = target_path_license.replace("./public", "" );
                    }
            } catch (ex) {
                res.send(500, JSON.stringify({message: ex}));
            }

            var driver_fields = {
                _id: req.body._id,
                driver_license_no: req.body.driver_license_no,
                driver_license_expiration_date: req.body.driver_license_expiration_date,
                driver_license_state: req.body.driver_license_state,
                driver_license_city: req.body.driver_license_city,
                driver_license_attachment: target_path_license
            }

            data.UpdateDriverLicense(driver_fields,function (e) {
                if (e) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(400, JSON.stringify({message: e}));
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(200, JSON.stringify({message:'done', driver_license:target_path_license}));
                }
            });
        };

        var _DeleteDriverLicense = function(req,res){
            var driver_fields = {
                _id: req.body._id,
                driver_license_attachment: ''
            }
            data.DeleteDriverLicense(driver_fields,function (e) {
                if (e) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(400, JSON.stringify({message: e}));
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(200, JSON.stringify({message:'done', driver_license:''}));
                }
            });
        };


        var _UploadProfileImage = function(req,res)
        {
            var target_path_user_image = '';

            try {
                if (req.files)
                    if (req.files.image) {
                        var fs2 = require('fs');
                        var tmp_path2 = req.files.image.path;
                        // set where the file should actually exists - in this case it is in the "images" directory
                        //var target_path = './public/users/registration/attachments/' + req.files.image.name;
                        target_path_user_image = './public/user_attachments/' + req.files.image.name;
                        // move the file from the temporary location to the intended location
                        var is2 = fs2.createReadStream(tmp_path2);
                        var os2 = fs2.createWriteStream(target_path_user_image);
                        is2.pipe(os2);
                        is2.on('end', function () {
                            fs2.unlinkSync(tmp_path2);
                        });
                        target_path_user_image = target_path_user_image.replace("./public", "" );
                    }
            } catch (ex) {
                res.send(500, JSON.stringify({message: ex}));
            }

            data.UploadImage(req.body._id,target_path_user_image , function (e, result){
                if (e) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(400, JSON.stringify({message: e}));
                } else {
                    if (req.session.user == null) {
                        // if user is not logged-in redirect back to login page //
                        res.redirect('/');
                    } else {
                        req.session.user.user_image = result.user_image;
                        if (req.session.user.user_type === 'driver' || req.session.user.user_type === 'admin') {
                            var user = req.session.user;
                            var mongo = require('mongodb');
                            var BSON = mongo.BSONPure;
                            var _driverService = require("../data/models/DriverDetailService");
                            data.getDriverDetail(new BSON.ObjectID(req.session.user._id), function (err, result) {
                                user.chauffeur_license_no = result.chauffeur_license_no;
                                user.chauffeur_expiration_date = result.chauffeur_expiration_date;
                                user.driver_license_state = result.chauffeur_license_state;

                                user.chauffeur_license_city = result.chauffeur_license_city;
                                user.chauffeur_license_attachment = result.chauffeur_license_attachment;
                                user.driver_license_no = result.driver_license_no;

                                user.driver_license_expiration_date = result.driver_license_expiration_date;
                                user.driver_license_state = result.driver_license_state;
                                user.driver_license_city = result.driver_license_city;

                                user.driver_license_attachment = result.driver_license_attachment;
//                                user.address1 = result.address1;
//                                user.address2 = result.address2;
//
//                                user.city = result.city;
//                                user.state = result.state;
//                                user.zipcode = result.zipcode;
//
//                                user.taxi_company = result.taxi_company;
//                                user.social_security_number = result.social_security_number;
//                                user.user_image = result.user_image;
//                                user.date_of_birth = result.date_of_birth;

                                // _driverService.ByUser(new BSON.ObjectID(req.session.user._id),function(err,result) {
                                var _affiliateService = require("../data/models/AffiliateService");
                                _affiliateService.GetAll(function (err, result) {
                                    res.render('driver_account', {
                                        title: 'Control Panel',
                                        udata: user,
                                        message:'Profile image has been uploaded successfully.',
                                        affiliates: result
                                    });
                                });
                            });

                        }
                        else {
                            res.render('my_account', {
                                title: 'Control Panel',
                                udata: req.session.user,
                                message:'Profile image has been uploaded successfully.'
                            });
                        }
                    }
                }
            });

        };


        app.post('/api/payment', _CreatePayment);
        app.delete('/api/payment', _DeletePayment);
        app.delete('/api/userpayment', _DeletePayment);
        app.put('/api/userpayment', _UpdatePayment);
        app.post('/api/userpayment', _CreateUserPayment);
        app.post('/api/updatedriverchauffeur', _UpdateDriverChauffeur);
        app.post('/api/updatedriverlicense', _UpdateDriverLicense);

        app.post('/api/driver_signup', _DriverSignUp);
        app.post('/api/updatesignup', _UpdateSignUp);
        app.post("/api/signup", _Signup);
        app.post("/api/login", _Login);
        app.post("/api/profile", _Profile);
        app.post("/api/profileDriverAdmin", _ProfileDriverAdmin);
        app.put("/api/approveProfile", _ApproveProfile);
        app.put("/api/profile", _UpdateProfile);

        app.post("/api/upload_profile_image", _UploadProfileImage);
        app.post("/api/Remove_Chauffeur_License", _DeleteChuaffeurLicense);
        app.post("/api/Remove_Driver_License", _DeleteDriverLicense);

        app.post("/api/accountsecurity", _AccountSecurity);
    }

})(module.exports);