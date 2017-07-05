var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
exports.pushRequest = function(email, message,subject,callback) {
    console.log("here inside nodemailer");
    console.log("email",email);
    console.log("message",message);
    console.log("subject",subject);
    // console.log("callback",callback);
    var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'sharpsuter@gmail.com',
                                pass: 'shivenjuneja'
                            }
                        });
      var message = message;
                    transporter.sendMail({
                    from: 'squadApp',
                    to: email,
                    subject: subject,
                    html: message
                }, function(err,info) {
                    if (err) {
                        console.log(err);
                        outputJSON = {'status': 'failure',
                        'messageId': 200,
                        'message': "User registered successfully but mail not sent."
                        }
                       callback(err,null);
                    }
                    else{
                    outputJSON={
                    "status": 'success',
                    "messageId": 200,
                    "message": "User registered and Mail sent successfully."
                             }
                     callback(null,info);
                    }
                });

}