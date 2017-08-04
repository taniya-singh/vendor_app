//let userObj = require('./../models/User.js');
let FCM = require('fcm-node');
var device = require('./../../models/devices/devices.js')
let apn = require("apn");
let path = require('path');
let serverKey = 'AIzaSyAGezexybpDqWCnASzL-rcEybb5AfrSXnA '; 
let fcm = new FCM(serverKey);
let moment = require('moment');

//let constantObj = require('./../constants.js');
/*let crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';
*/
let options;
options = {
  token: {
    key: path.join(__dirname,"./../../../common/AuthKey_UEJKHFH34K.p8"),
    cert:path.resolve(__dirname,"./../../../common/certificates.pem"),
    keyId: "UEJKHFH34K",
    teamId: "Q9NZ7GGH6L"
  },
  production: false
};

console.log("ggg",path.join(__dirname,"./../../../common/AuthKey_UEJKHFH34K.p8"))

exports.notify = function(device_token,iteminfo,no_of_items,cbnotify){
    console.log("notifyyyyyyyyyyyy",device_token,iteminfo)
    var item_information=iteminfo[0];
     var token=device_token;
    device.findOne({device_token:token},function(err,result){
        console.log("found resild",result)
        if(result){
            if(result.device_type=='ios'){
                pushSendToIOS(result.device_token,item_information,no_of_items,function (err,cb) {
                if(err){

                }else{

                }
                })
            }
            else if(result.device_type=='android'){
                pushToAndroid(result.device_token,item_information,no_of_items,function(err,cb) {
                    if(err){
                        cbnotify(err,{"message":"error in push notify"})
                    }else
                    {console.log(cb)
                        cbnotify(null,{cb})
                    }
                })
            }
        }
    })
}

let pushToAndroid = function  (token,item_information,no_of_items,cb) {
    console.log("insode android",token)
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera) 
        to: token , 
        // collapse_key: 'your_collapse_key', 
        notification: {
            title: 'Item purchased', 
            body:no_of_items+" "+item_information.p_name+" purchased from your account."   
        },
        
        data: {  //you can send only notification or only data(or include both) 
            my_key: 'Appointment',
            my_another_key: 'my another value'
        }
    };

    fcm.send(message, function(err, pushresponse){
        console.log("inside function msg send")
        if (err) {
            console.log("Something has gone wrong!",err);
            cb(err,{"message":"error in push notification android"})
        } else {
            console.log("Successfully sent with response: ", pushresponse);
            cb(null,{pushresponse})
        }
    });
}

let pushSendToIOS = function(token) {
    console.log("token here", token);
    let apnProvider = new apn.Provider(options);
    let deviceToken = token;
    let note = new apn.Notification();
    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    note.badge = 3;
    //note.sound = "ping.aiff";
    note.alert = "You have a new notification.";
    note.payload = {
        'messageFrom': 'Appointment'
    };
    note.topic = "Bridgit";
    note.notifyType = "matchNotification"
    apnProvider.send(note, deviceToken).then((result) => {
        console.log("result is", JSON.stringify(result));
        if (result.failed.length > 0) {
            console.log("error in sending notification");
        } else {
            console.log("success in sending notification",result);
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