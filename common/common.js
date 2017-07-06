
var userObj = require('./../app/models/users/users.js');
var gcm = require('android-gcm');
var apn = require("apn");
var path = require('path');
var gcmObject = new gcm.AndroidGcm('API_KEY');
var geocoder = require('geocoder');
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

var options;
var notification;

var options = {
  token: {
    key: path.resolve("./common/APNsAuthKey_W378WKXETM.p8"),
    cert: path.resolve('./common/apnsProduction.pem'),
    keyId: "W378WKXETM",
    teamId: "33P3VUARHV"
  },
  production: true
};

note = new apn.Notification();

exports.pushRequest = function(body,headers,cb) {

    console.log("req.body is pushRequest",body);
    console.log("req.headers",headers);
    if(headers.device_type == 'ios'){
        pushSendToIOS(headers.device_token)
    }
    if(headers.device_type == 'Android'){
        console.log("else part for android");
        pushSendToAndroid(headers.device_token);
    }
    userObj.findOne({
        _id: body.to
    }, function(userErr, userDetail) {
        if (userErr) {
            res.jsonp({
                'status': 'faliure',
                'messageId': 401,
                'message': 'There is problem in sending push notification when getting source name',
                "userdata": userErr
            });
        } else {
            console.log("userDetail",userDetail);
             if (userDetail.device_type == 'ios') {
                pushSendToIOS(userDetail.device_token);
                cb(null,"Notification send.");
            }
            if (userDetail.device_type == 'android') {
                pushSendToAndroid(userDetail.device_token);
                cb(null,"Notification send.");
            }
           
        }
    });

}

var pushSendToIOS = function(token) {
    console.log("token here",token);
    var apnProvider = new apn.Provider(options);
    let deviceToken = token;
    var note = new apn.Notification();
    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    note.badge = 3;
    note.sound = "ping.aiff";
    note.alert = "You have a new match.";
    note.payload = {
        'messageFrom': 'John Appleseed'
    };
    note.topic = "com.smartData.squad";
    note.notifyType = "matchNotification"
    apnProvider.send(note, deviceToken).then((result) => {
        console.log("result is", JSON.stringify(result));
        if(result.failed.length>0){
            console.log("error in sending notification");
        }
        else{
            console.log("success in sending notification");
        }
    }); 
}


var pushSendToAndroid = function(androidToken) {
    var message = new gcm.Message({
    registration_ids: [androidToken],
    data: {
        key1: 'You have a new match.'
    }
});

gcmObject.send(message, function(err, response) {});

}
exports.getLatLon = function(zipcode) {
    var result = {};
    geocoder.geocode(zipcode, function(err, data) {
        if (err) {
            // return 0;
            console.log('geolocation error : ' + err);
        } else {

            if (data.status == 'OK') {
                result.lat = data.results[0].geometry.location.lat;
                result.lng = data.results[0].geometry.location.lng;
                result.status = data.status;

                return result;
                //res.send(result);

            } else {

                result.status = data.status;
                return result;
                //res.send(result);
            }
        }
    });
}

exports.encrypt = function(text) {

    var cipher = crypto.createCipher(algorithm, password)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

exports.decrypt = function(text) {
    var decipher = crypto.createDecipher(algorithm, password)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}

//var hw = encrypt("hello world")
// outputs hello world
//console.log(decrypt(hw));


// exports.makeotp = function() {
//     var text = "";
//     var possible = "0123456789";

//     for (var i = 0; i < 4; i++)
//         text += possible.charAt(Math.floor(Math.random() * possible.length));

//     return text;
// }


exports.makeid = function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 15; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}