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
	//mailBody = mailBody.replace("{path}",appUrl);
	//mailBody = mailBody.replace("{token}", user.id);
	//var smtpTransport = require('nodemailer-smtp-transport');
	/*var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            // user: 'raman.sdei@gmail.com',
            // pass: 'raman@2015'
            user:  constantObj.messages.gmailID,
            pass:  constantObj.messages.gmailpassword
        }
    });*/
	/*var transport = nodemailer.createTransport(smtpTransport({
			host: sails.config.appSMTP.host,
			port: sails.config.appSMTP.port,
			debug: sails.config.appSMTP.debug,
			auth: {
				user: sails.config.appSMTP.auth.user
				pass: sails.config.appSMTP.auth.pass
			}
		})
	);*/
    var transporter = nodemailer.createTransport({
                    service: constantObj.gmailSMTPCredentials.service,
                    auth: {
                        user: constantObj.gmailSMTPCredentials.username,
                        pass: constantObj.gmailSMTPCredentials.password
                    }
                });
	// create reusable transporter object using SM,TP transport 
    // NB! No need to recreate the transporter object. You can use 
    // the same transporter object for all e-mails 
    // setup e-mail data with unicode symbols 
    // if(!from){
    // 	var from = 'Ramanpreet ✔ <raman411@gmail.com>';
    // }
    var from = 'bridgit ✔ <bridgit871@gmail.com>';
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


