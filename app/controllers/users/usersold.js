var userObj = require('./../../models/users/users.js');
var mongoose = require('mongoose');
var constantObj = require('./../../../constants.js');
var nodemailer = require('nodemailer');
var fs = require('fs');
var crypto = require('crypto');
var key = 'MySecretKey12345';
var iv = '1234567890123456';
var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);

//authenticate
exports.authenticate = function(req, res) { 
		
			if(res.req.user.error==true){

				res.jsonp({'status':'failure', 'messageId':203, 'message':'Incorrect Username / Password'});

		
			}else{


				userObj.find({_id:res.req.user.id}).populate({
		path:'skill',select: 'skill'
		,match: {"is_deleted": false,"enable":true}
	})
	.exec(function(err, data) { 


		if(err) {
			outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
		}
		//console.log(data);
		// req.session._id=data[0]._id;
		// req.session.email=data[0].email;
		// req.session.loggedInUsername=data[0].display_name;
		
		res.jsonp({'status':'success', 'messageId':200, 'message':'User logged in successfully','data':data[0],'sessionID':data[0]._id});

		
	});
			}

	

	}

//forgot password
exports.forgotPassword = function(req, res) {

	var outputJSON = "";
	console.log(req.body)

	userObj.findOne({email:req.body.username},{'first_name':1,'last_name':1,'email':1,'password':1}, function(err, data) {
		console.log(data);
		if(err) {
			outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
		}
		else {
			
			if(data) {
				var key = 'MySecretKey12345';
		        var iv = '1234567890123456';
		        var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
		        var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
				var decrypted = decipher.update(data.password, 'hex', 'binary');
          		decrypted += decipher.final('binary');

        console.log('Decrypted: ', decrypted);

				var transporter = nodemailer.createTransport({
				    service: constantObj.gmailSMTPCredentials.service,
				    auth: {
				        user: constantObj.gmailSMTPCredentials.username,
				        pass: constantObj.gmailSMTPCredentials.password
				    }
				});				

				message='<table><tr><td>';
		message+='Hello '+data.first_name+' ,<br/><br>';
		message+='Your password : <strong>'+decrypted+'</strong><br/>';
		
		message+='<br/><br/>Thanks<br/>Oddjob Team';
		message+='</td></tr></table>';	


				transporter.sendMail({
				    from: 'anurags@smartdatainc.net',
				    to: data.email,
				    //to:"rajeevkushwah007@gmail.com",
				    subject: 'Your Password',
				    html: message
				});

				outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successSendingForgotPasswordEmail}
			}
			else {
				outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
			}

		}

		res.jsonp(outputJSON);

	});
}
		/**
		 * Find role by id
		 * Input: roleId
		 * Output: Role json object
		 * This function gets called automatically whenever we have a roleId parameter in route. 
		 * It uses load function which has been define in role model after that passes control to next calling function.
		 */
		 exports.user = function(req, res, next, id) {
		 	userObj.load(id, function(err, user) {
		 		if (err){
		 			res.jsonp(err);
		 		}
		 		else if (!user){
		 			res.jsonp({err:'Failed to load role ' + id});
		 		}
		 		else{
		 			
		 			req.userData = user;
		 			//console.log(req.user);
		 			next();
		 		}
		 	});
		 };


		/**
		 * Show user by id
		 * Input: User json object
		 * Output: Role json object
		 * This function gets role json object from exports.role 
		 */
		 exports.findOne = function(req, res) {
		 	if(!req.userData) {
		 		outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
		 	}
		 	else {
		 		outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 
		 		'data': req.userData}
		 	}
		 	res.jsonp(outputJSON);
		 };


		 /**
		 * List all user object
		 * Input: 
		 * Output: User json object
		 */
		 exports.list = function(req, res) {
		 	var outputJSON = "";
		 	userObj.find({is_deleted:false}, function(err, data) {
		 		if(err) {
		 			outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
		 		}
		 		else {
		 			outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 
		 			'data': data}
		 		}
		 		res.jsonp(outputJSON);
		 	});
		 }


		/**
		 * Create new user object
		 * Input: User object
		 * Output: User json object with success
		 */
		exports.add = function(req, res) {
		var errorMessage = "";
		var outputJSON = "";
		var userModelObj = {};
		if(req.body.password!=undefined){
			var key = 'MySecretKey12345';
	        var iv = '1234567890123456';
	        var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
	        var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
			var encrypted = cipher.update(req.body.password, 'utf8', 'binary');
				encrypted += cipher.final('binary');
				hexVal = new Buffer(encrypted, 'binary');
				newEncrypted = hexVal.toString('hex');
				req.body.password=newEncrypted;

		}

		console.log(req.body);
		userModelObj = req.body;

		userObj(userModelObj).save(req.body, function(err, data) { 
			if(err) { //console.log(err);
				switch(err.name) {
					case 'ValidationError':
					
						for(field in err.errors) {
							if(errorMessage == "") {
								errorMessage = err.errors[field].message;
							}
							else {							
								errorMessage+=", " + err.errors[field].message;
							}
						}//for
					break;
				}//switch
				console.log(data);
				if(req.body.provider!=undefined && req.body.provider!=""){
					
						userObj.find({email:req.body.email}).populate({
								path:'skill',select: 'skill'
								,match: {"is_deleted": false,"enable":true}
							})
							.exec(function(error, datares) { 


								if(error) {
									outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
								}
								
								res.jsonp({'status':'success','existId':100, 'messageId':200, 'message':'User logged in successfully','data':datares[0]});

								
							});

				}else{
					outputJSON = {'status': 'failure', 'messageId':401, 'message':errorMessage};
			
					res.jsonp(outputJSON);
				}

				}//if
			else {
				if(data) {

				var transporter = nodemailer.createTransport({
				    service: constantObj.gmailSMTPCredentials.service,
				    auth: {
				        user: constantObj.gmailSMTPCredentials.username,
				        pass: constantObj.gmailSMTPCredentials.password
				    }
				});	
				if(data.first_name==undefined){
					data.first_name="";
				}

				message='<table><tr><td>';
				message+='Hello '+data.first_name+' ,<br/><br>';
				message+='You have successfully registered. your username is   <strong>'+data.email+'</strong><br/>';
				
				message+='<br/><br/>Thanks<br/>Oddjob Team';
				message+='</td></tr></table>';	

				transporter.sendMail({
				    from: 'anurags@smartdatainc.net',
				    to: data.email,
				    //to:"rajeevkushwah007@gmail.com",
				    subject: 'Oddjob Registration',
				    html: message
				});

				}
				outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.successSendingForgotPasswordEmail, 'data': data};
				res.jsonp(outputJSON);
			}

			

		});

	}


		 /**
		 * Update user object
		 * Input: User object
		 * Output: User json object with success
		 */
		 exports.update = function(req, res) {
		 	console.log('update_user')
		 	var errorMessage = "";
		 	var outputJSON = "";
		 	var user = req.userData;
		 	user.first_name = req.body.first_name;
			user.last_name = req.body.last_name;
			user.email = req.body.email;
			user.user_name = req.body.user_name;
			user.display_name = req.body.display_name;
			user.phone=req.body.phone;			
		 	user.role = req.body.role;
		 	user.skill = req.body.skill;
		 	user.zipcode = req.body.zipcode;
		 	user.enable = req.body.enable;
		 	
				//console.log(user);return false;
			if (req.body.prof_image != "" && req.body.prof_image != undefined)
				    {
					reqdata={};
					reqdata._id=req.body._id;
					reqdata.prof_image=req.body.prof_image;
					uploadProImg(reqdata,function(responce){
						console.log(responce);
						});
					}	
			
		 	user.save(function(err, data) {
		 		console.log(err);
		 		console.log(data);
		 		if(err) {
		 			switch(err.name) {
		 				case 'ValidationError':
		 				for(field in err.errors) {
		 					if(errorMessage == "") {
		 						errorMessage = err.errors[field].message;
		 					}
		 					else {							
		 						errorMessage+="\r\n" + err.errors[field].message;
		 					}
									}//for
									break;
							}//switch
							outputJSON = {'status': 'failure', 'messageId':401, 'message':errorMessage};
							res.jsonp(outputJSON);
						}//if
						else {


							userObj.find({_id:data._id}).populate({
										path:'skill',select: 'skill'
										,match: {"is_deleted": false,"enable":true}
									})
									.exec(function(error, dataRes) { 
										console.log("here",dataRes);

										if(error) {
											outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
										}
										outputJSON = {'status':'success', 'messageId':200, 'message':constantObj.messages.userStatusUpdateSuccess,'data':dataRes[0]};
										res.jsonp(outputJSON);

										
									});


							//outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.userStatusUpdateSuccess, 'data': data};
						}
						
					});
		 }


		 /**
		 * Update user object(s) (Bulk update)
		 * Input: user object(s)
		 * Output: Success message
		 * This function is used to for bulk updation for user object(s)
		 */
		 exports.bulkUpdate = function(req, res) {
		 	var outputJSON = "";
		 	var inputData = req.body;
		 	var roleLength = inputData.data.length;
		 	var bulk = userObj.collection.initializeUnorderedBulkOp();
		 	for(var i = 0; i< roleLength; i++){
		 		var userData = inputData.data[i];
		 		var id = mongoose.Types.ObjectId(userData.id);  
		 		bulk.find({_id: id}).update({$set: userData});
		 	}
		 	bulk.execute(function (data) {
		 		outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.userStatusUpdateSuccess};
		 	});
		 	res.jsonp(outputJSON);
		 }

			uploadProImg= function(data,callback){

				      var photoname = data._id+'_'+Date.now() + '.jpg';
				      var imagename = __dirname+"/../../../public/assets/upload/profileImg/"+photoname;
				      if(data.prof_image.indexOf("base64,")!=-1){	
				     var Data = data.prof_image.split('base64,');
				     var base64Data = Data[1]; 
				      fs.writeFile(imagename, base64Data, 'base64', function(err) {
				      if (err) {
				        console.log(err);
				        callback("Failure Upload");


				      }
				        else{
				        	
						console.log(data);
					userObj.update({'_id':data._id},{$set: {'prof_image':photoname}},function(err,res){
						console.log(res);
						callback("Success Uploaded");
					});
				        
				        
				        }
				      });
				  }else{
				  	callback("Image  not selected");
				  }
				    }


				    encrypt= function(string,callback){ 

	
						}
						decrypt= function(string,callback){ 

	
						}
