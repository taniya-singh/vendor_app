var userObj = require('./../../models/users/users.js');
var vendor = require('./../../models/vendordetails/vendordetails.js');
var order = require('./../../models/order/order.js');
var itemsObj = require('./../../models/items/items.js');
var device=require('./../../models/devices/devices.js')
let FCM = require('fcm-node');
let apn = require("apn");
let path = require('path');
let serverKey = 'AIzaSyAxYVocgXGryOjwZ-7WIW4KB1fQtZ5tXFY'; 
let fcm = new FCM(serverKey);
let moment = require('moment');
let constantObj = require('./../constants.js');
let crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

let options;
options = {
  token: {
    key: path.resolve("./common/AuthKey_4MVSAKPE86.p8"),
    keyId: "4MVSAKPE86",
    teamId: "UKZ733R4T6"
  },
  production: false
};


exports.notify = function(id,notificationKey){
    userObj.findOne({_id:id},function(err,result){
        if(result){
            if(result.device_type=='ios'){
                pushSendToIOS(result.token,notificationKey)
            }
            else if(result.device_type=='android'){
                pushToAndroid(result.token,notificationKey)
            }
        }
    })
}

let pushToAndroid = function  (token,key) {
    console.log("push to android")
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera) 
        to:  "dL-88Ju0VaA:APA91bGsdzHKJIcfsVSPNGQbno243M4NQqg0xwBkO0UkJPpixVWVzYPfFEiFuH1htU7I5MXBx2X7YMQqvsmr-ZjuW_rROlb6eA5oyLDdE5U3m5tQ-GofRas7eyPEyR6OmyuSoDSKDiJa", 
        // collapse_key: 'your_collapse_key', 
        notification: {
            title: 'Title of your push notification', 
            body: 'Body of your push notification' 
        },
        
        data: {  //you can send only notification or only data(or include both) 
            my_key: 'Appointment',
            my_another_key: 'my another value'
        }
    };

    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!");
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });
}

let pushSendToIOS = function(token,key) {
    console.log("push to ios")
    console.log("token here", token);
    let apnProvider = new apn.Provider(options);
    let deviceToken = "63933720580CE05CB091B58E3D2B9DF0C104DFA20A0A5002B6A9B8319E27045D";
    let note = new apn.Notification();
    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    note.badge = 3;
    note.sound = "ping.aiff";
    note.alert = "You have a new notification.";
    note.payload = {
        'messageFrom': 'Appointment'
    };
    note.topic = "com.development.BarbrDo";
    note.notifyType = "matchNotification"
    apnProvider.send(note, deviceToken).then((result) => {
        console.log("result is", JSON.stringify(result));
        if (result.failed.length > 0) {
            console.log("error in sending notification");
        } else {
            console.log("success in sending notification");
        }
    });
}



exports.encrypt = function(text) {
    let cipher = crypto.createCipher(algorithm, password)
    let crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

exports.decrypt = function(text) {
    let decipher = crypto.createDecipher(algorithm, password)
    let dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}

exports.makeid = function() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 15; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

exports.removeOffset = function(dobFormat) {
    let userOffset = new Date(dobFormat).getTimezoneOffset();
    let userOffsetMilli = userOffset * 60 * 1000;
    let dateInMilli = moment(dobFormat).unix() * 1000;
    let dateInUtc = dateInMilli - userOffsetMilli;
    return dateInUtc;
}
exports.addOffset = function(dobFormat) {
    let userOffset = new Date(dobFormat).getTimezoneOffset();
    let userOffsetMilli = userOffset * 60 * 1000;
    let dateInMilli = moment(dobFormat).unix() * 1000;
    let dateInUtc = dateInMilli + userOffsetMilli;
    return dateInUtc;
}

let accountSid = 'AC865177abe2f391adae3a6d528a87e4d7'; // Your Account SID from www.twilio.com/console
let authToken = '2eadab4ae69fe6583bbc54793208eea1';   // Your Auth Token from www.twilio.com/console

let twilio = require('twilio');
let client = new twilio(accountSid, authToken);

exports.sentMessage = function () {
client.messages.create({
    body: 'Hello from Node',
    to: '+91 7696516981',  // Text this number
    from: '+14157410903' // From a valid Twilio number
})
.then((message) => console.log(message.sid));
}