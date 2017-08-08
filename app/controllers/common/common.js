let FCM = require('fcm-node');
var device = require('./../../models/devices/devices.js')
let apn = require("apn");
let path = require('path');
let serverKey = 'AIzaSyAGezexybpDqWCnASzL-rcEybb5AfrSXnA'; 
let fcm = new FCM(serverKey);

let options;
options = {
  token: {
    key: path.join(__dirname,"./../../../common/AuthKey_UEJKHFH34K.p8"),
    cert:path.join(__dirname,"./../../../common/certificates.pem"),
    keyId: "UEJKHFH34K",
    teamId: "Q9NZ7GGH6L"
  },
  production: false
};

/**
 * Input: This function gets automatically called after the payment is done
 * Output: Notification send or error appeared
 * This function gets called automatically whenever payment is received from a customer,It is userd to send notification to vendor, who receives the payment 
 * Developed by :smartData Enterprises Ltd.
 */


exports.notify = function(device_token,iteminfo,no_of_items,cbnotify){
    var item_information=iteminfo[0];
    var token=device_token;
    device.findOne({device_token:token},function(err,result){
        if(result){
            if(result.device_type=='ios'){
                pushSendToIOS(result.device_token,item_information,no_of_items,function (err,cb) {
                if(err){
                        cbnotify(err,{"message":"error in push notify"})

                }else{
                        cbnotify(null,{cb})

                }
                })
            }
            else if(result.device_type=='android'){
                pushToAndroid(result.device_token,item_information,no_of_items,function(err,cb) {
                    if(err){
                        cbnotify(err,{"message":"error in push notify"})
                    }else
                    {
                        cbnotify(null,{cb})
                    }
                })
            }
        }
    })
}
/* Push notification for android */

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
        if (err) {
            console.log("Something has gone wrong!",err);
            cb(err,{"message":"error in push notification android"})
        } else {
            console.log("Successfully sent with response: ", pushresponse);
            cb(null,{pushresponse})
        }
    });
}

/* Push notification for IOS */

let pushSendToIOS = function(token,item_information,no_of_items,cb) {
    console.log("inside ios")
    let apnProvider = new apn.Provider(options);
    let deviceToken = token;
    let note = new apn.Notification();
    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    note.badge = 1;
    note.alert = no_of_items+" "+item_information.p_name+" purchased from your account." ;
    note.payload = {
        'messageFrom': 'Bridgit'
    };
   
    note.notifyType = "matchNotification"
    apnProvider.send(note, deviceToken).then((err,pushresponse) => {
        if (err) {
            console.log("error in sending notification",err);
            cb(null,{pushresponse})

        } else {
            console.log("success in sending notification",pushresponse);
                        cb(null,{pushresponse})

        }
    });
}
