/**
 * Created by Asif on 9/13/2014.
 */
/**
 * Created by naveed on 8/3/14.
 */


function NotifyApp(){

    var UrbanAirshipPush = require('urban-airship-push');

// Your app access configuration. You will find this stuff in your App
// Settings under App Key, App Secret and App Master Secret.
    var config = {
        key: 'kuFyh2JtRAmf1licycGeEQ',
        secret: '9A3pz5DIQbK1ke9Xa87W3Q',
        masterSecret: 'iqf3JlD6TBSAIGkRpUJgPw'
    };

// Create a push object
    var urbanAirshipPush = new UrbanAirshipPush(config);

    var pushInfo = {
        device_types: 'all',
        audience: 'all',
        notification: {
            alert: 'Blubb blub bla'
        }
    };

    var pushOne={
        "device_types" : "all",
        "audience" : {
            "device_token" : "AF8CA64D6EED5300CD4762ED44A0410917D8E5AFFD80E865FB1D5D155E4889DB"
            //   "device_token" : "C54B9EBA49B8496C0157699ABBE8B504E15EA786"
        },
        "notification" : {
            "alert": "Hello",
            "ios":{
                "sound": "default",
                badge:"+1"

            }

        }

    };

    /*   {
     "audience": {"alias": "foo"},
     "notification": {
     "ios": {
     "badge": "+1",
     "alert": "My badge is now 5!"
     }
     },
     "device_types": ["ios"]
     }*/
    //  var payload=req.body;
    //  console.log(payload)

    var _pushApp=function(obj,callback){
        pushOne.audience.device_token=obj.device_token;
        pushOne.notification.alert=obj.alert ||"Hello";
        pushOne.notification.ios.sound=obj.sound ||"default";
        pushOne.notification.ios.badge=obj.badge ||"+1";
        //pushOne.notification=payload.aps;
        console.log(pushOne);
        urbanAirshipPush.push.validate(pushOne, function (err, data) {
            if (err) {
                // Handle error
                callback(err,data)

            }
            else {

                console.log(data);

                urbanAirshipPush.push.send(pushOne, callback);
            }

        });
    }
    var _sendNotification = function(token,message,payload){
        /*
         * APNS sent using argon-apn
         */
        //token = '816f5f5fd715ebb2f6be80bcee83a6fa17f7bdf47ec8595b9dad8c44b57d44f4';
        //message = "Temp Message Hello";

        var apn = require('apn');

        //Development Settings
//        var certPath = __dirname+"\\ITVerticalEnterpriseDevCert.pem";
//        var keyPath = __dirname+"\\ITVerticalEnterpriseDevKey.pem";
//
//         console.log(certPath);
//        var connectionOptions = {
//                                    gateway:'gateway.sandbox.push.apple.com',
//                                    key:keyPath,
//                                    cert:certPath,
//                                    port: 2195,
//                                    passphrase:'taxi'
//                                }
//


        //Production Setting
        var certPath = __dirname+"\\ITVertialEnterpriseCert.pem";
        var keyPath = __dirname+"\\ITVertialEnterpriseKey.pem";

        console.log(certPath);
        var connectionOptions = {
            gateway:'gateway.push.apple.com',
            key:keyPath,
            cert:certPath,
            port: 2195,
            passphrase:'taxi'
        }

        //Global Setting



//        var ms = require('../modules/message-settings');
//
//        var certPath = __dirname+ms.cert_path;
//        var keyPath = __dirname+ms.key_path;
//
//        console.log(certPath);
//        var connectionOptions = {
//            gateway:ms.gate_way,
//            key:keyPath,
//            cert:certPath,
//            port: 2195,
//            passphrase:'taxi'
//        }


        var service = new apn.connection(connectionOptions);

        /*service.on('connected', function() {
         console.log("APNS Connected");
         });*/

        service.on('transmitted', function(notification, device) {
            console.log("Notification transmitted to:" + device.token.toString('hex'));
        });
        service.on('transmissionError', function(errCode, notification, device) {
            console.error("Notification caused error: " + errCode + " for device ", device, notification);
            if (errCode == 8) {
                console.log("A error code of 8 indicates that the device token is invalid. This could be for a number of reasons - are you using the correct environment? i.e. Production vs. Sandbox");
            }
        });
        /*service.on('timeout', function () {
         console.log("APNS Connection Timeout");
         });
         service.on('disconnected', function() {
         console.log("Disconnected from APNS");
         });*/
        service.on('socketError', console.error);


        var note = new apn.notification();
        note.setAlertText(message);
        note.badge = '+1';
        note.sound = "default";
        if(typeof(payload)=='object'){
            note.payload = payload;
        }

        if(token instanceof Array){
            for(var i in token){
                service.pushNotification(note, token[i]);
            }
        }
        else{
            try{
                var device = new apn.device(token.toString('hex'));
                service.pushNotification(note, device);
            }
            catch(e){
                service.pushNotification(note, token);
            }

        }



    }

    return {

        NotifyService:_pushApp,
        SendNotification:_sendNotification

    }

}

module.exports=NotifyApp();