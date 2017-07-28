var nodemailer = require('nodemailer');
var constantObj = require('./../../../constants.js');
exports.send = function(user, subjectVal, view, from) {
	/* var path = require('path');
	var rootPath = path.resolve(sails.config.appPath); */
	var fs = require('fs');
	var mailBody = fs.readFileSync('./emailTemplates/'+view).toString();
	//mailBody = view;
	mailBody = mailBody.replace("{{username}}", user.username);
	mailBody = mailBody.replace("{{name}}", user.firstname);
    mailBody = mailBody.replace("{{password}}",user.pass);
    mailBody = mailBody.replace("{{app_link}}",user.app_link);
	mailBody = mailBody.replace("{{reference_code}}",user.reference_code);
	
    var transporter = nodemailer.createTransport({
                    service: constantObj.gmailSMTPCredentials.service,
                    auth: {
                        user: constantObj.gmailSMTPCredentials.username,
                        pass: constantObj.gmailSMTPCredentials.password
                    }
                });
	
    var from = 'Bridgit <hi@youbridgit.com>';
    var mailOptions = {
        from:  from,// sender address 
        to: user.email, // list of receivers 
        subject: subjectVal, // Subject line 
        //text: mailBody, // plaintext body 
        html: mailBody // html body 
    };
    // send mail with defined transport object 
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
};


