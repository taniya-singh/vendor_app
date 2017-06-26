var userObj = require('./../../models/users/users.js');
var vendor = require('./../../models/vendordetails/vendordetails.js');

var mongoose = require('mongoose');
var twilio=require('twilio');
var constantObj = require('./../../../constants.js');
var accountSid = 'ACf8246b33d4d1342704dee12500c7aba2'; // Your Account SID from www.twilio.com/console
var authToken = '53800350222c1f6974ce1617563aaaa5';   // Your Auth Token from www.twilio.com/console
var client = new twilio(accountSid, authToken);   
        /**
		 * Find role by id
		 * Input: roleId
		 * Output: Role json object
		 * This function gets called automatically whenever we have a roleId parameter in route. 
		 * It uses load function which has been define in role model after that passes control to next calling function.
		 */

    exports.login = function(req,res){
    	console.log("login ", req.body)
	
		userObj.findOne({"email" : req.body.email, "password" : req.body.password},function(err,data){
			if(err) {
			
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
							
			 	outputJSON = {'status': 'failure', 'messageId':401, 'message':err};
			 	res.jsonp(outputJSON);
			  }
		  	else{
				  	if(data==null){
				  	outputJSON = {'status': 'invalid credentials', 'messageId':400, 'message':"invalid credentials"}; 
				    res.jsonp(outputJSON);
				    }
				    else {console.log("inside correrect login");
						outputJSON = {'status': 'success', 'messageId':200, 'message':"login successfully","data":data}; 
					   	res.jsonp(outputJSON)

				  //   	if(data.user_type=='vendor')
				  //   	{
				  //   		console.log("inside the vendor",data._id);

						// 	var outputJSON = "";
						// 	var vendorModelObj = {};
						// 	vendorModelObj.vendor_id=data._id;
						// 	vendorModelObj.vendor_email=data.email;
						// 	vendorModelObj.vendor_password=data.password
							
							
						// 	vendor.findOne({vendor_id:data._id},function(err,findData){
						// 		console.log("findData",findData)
						// 		if(err)
						// 		{

						// 		}	
						// 		else
						// 		{
						// 			if(findData){
										
						// 				outputJSON = {'status': 'success', 'messageId':200, 'message':"login successfully","data":data}; 
					 //   					res.jsonp(outputJSON)
					 //   				}
					 //   				else{
						// 				vendor.(vendorModelObj).save(function(err, vendordata){
						// 					if(err) {
						// 						console.log("inside error")
						// 						outputJSON = {'status': 'error', 'messageId':401, 'message':"error occured"}; 
						//     				}
						//     				else{
						//     				console.log("inside else",vendordata)
						//     				outputJSON = {'status': 'success', 'messageId':200, 'message':"login successfully","data":data};
						//     				res.jsonp(outputJSON)
						//     				}
						// 				})
						// 			}
				  //   			}
				  //   		})
						// }
					 //   	else
					 //   	{
					 //   		outputJSON = {'status': 'success', 'messageId':200, 'message':"login successfully","data":data}; 
					 //   		res.jsonp(outputJSON)

					 //   	}
			  		}
	      		}
	  	});
 } 	
//update vendor information

exports.update_vendor_info=function(req,res){
	if(req.body){
		userObj.findOne({_id:req.body._id},function(err,data){
			if(err){
				outputJSON = {'status': 'error', 'messageId':400, 'message':"not a valid _id"}; 
				res.jsonp(outputJSON)
			}
			else{
				userObj.update({_id:data._id},{$set:{pickup_time:req.body.pickup_time,email:req.body.email,password:req.body.password}},function(err,updatedresponse){
					if(err){
						outputJSON = {'status': 'error', 'messageId':400, 'message':"not Updated"}; 
						res.jsonp(outputJSON)
					}
					else{
						console.log("inside responmse");
						outputJSON = {'status': 'success', 'messageId':200, 'message':"updated successfully","data":updatedresponse}; 
					 	res.jsonp(outputJSON)
					 }
				})
			}
		})
	}
}

exports.faceBookLogin = function(req, res) {
	//console.log("in faceBookLogin");
	var errorMessage = '';
	var messages = '';
	//console.log(req.body);
	req.body.faceBookFlag = true;
	req.body.password="123213213";
	if (req.body.facebook_id) {
		userObj.findOne({
			facebook_id: req.body.facebook_id
		}, function(err, data1) {
			if (err) {
				outputJSON = {
					'status': 'failure',
					'messageId': 401,
					'message': 'Error' + errorMessage
				};
				res.status(200).jsonp(outputJSON);
			} else {
				//console.log("data1", data1);
				if (data1 == null) {
					console.log(req.body);
					var saveData = req.body;
					userObj(saveData).save(saveData, function(err, data) {
								if (err) {
									console.log("err.code", err);
									if (err) {
										outputJSON = {
											'status': 'failure',
											'messageId': 401,
											'message': '401' 
										};
									}  else if (err.errors.email) {
										outputJSON = {
											'status': 'failure',
											'messageId': 401,
											'message': 'Please enter Email'
										};
									}
									res.status(200).jsonp(outputJSON)
								} else {
									
									// saveSetting(data);
									 login(data, res);
									
								}
							})
					
				} else {
					
					login(data1, res);
				}
			}
		})
	} else {
		var response = {
			"status": 'failure',
			"messageId": 401,
			'message': ''	
		};
		res.status(200).json(response);
	}

}

function login(req,res){
console.log("daa",req)
userObj.findOne({"email" : req.email, "password" : req.password},function(err,data){
		
		//var mySession="";
		//mySession=req.body.email;
		//var type=data.Type;
		if(err) {
			console.log("err----->",err)
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
						
		 	outputJSON = {'status': 'failure', 'messageId':401, 'message':err};
		 	res.jsonp(outputJSON);
		  }//if
	  else {
	  	console.log("data--->",data)
	   outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.LoginSuccess, 'data': data}; 
	    res.jsonp(outputJSON);
	  }
       
    });
}

exports.register = function(req, res) {
				 	var errorMessage = "";
				 	var outputJSON = "";
				 	var userModelObj = {};
				 	questionnaireModelObj = req.body;

				 	console.log(questionnaireModelObj)
				 	userObj(questionnaireModelObj).save(req.body, function(err, data) { 
				 		if(err) {
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
						
						outputJSON = {'status': 'failure', 'messageId':401, 'message':err};
					}//if
					else {
						outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.userSuccess, 'data': data};
					}
					
					
					login(data, res);

					//res.jsonp(outputJSON);

				});

				 }


          exports.register111=function(req,res){
	console.log(req.body);
			userObj.findOne({"email":req.body.email},function(err,data){
		if(err){
			res.json("Sorry : "+err);
		}
                 
			
			else{

				if(data==null){

					var user=new userObj({
					//_id:req.body.id,
					first_name:req.body.first_name,
					last_name:req.body.last_name,
					user_name:req.body.user_name,
					address:req.body.Address,
					//phone:req.body.Phone,
					email:req.body.email,
					password:req.body.password,
					type:req.body.type
				});
				console.log("user",user);
				user.save(function(err){
					if(err){
						console.log(err);
						res.send({"Error":"data not inserted"});
					}
					else{
						res.send({"Success":"Data inserted successfully"});
					}
				});



				}
				
			}
	});
}







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
		 	userObj.find({}, function(err, data) {
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

		console.log(req.body);
		userModelObj = req.body;
		userObj(userModelObj).save(req.body, function(err, data) { 
			if(err) {
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
				
				outputJSON = {'status': 'failure', 'messageId':401, 'message':errorMessage};
			}//if
			else {
				outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.userSuccess, 'data': data};
			}

			res.jsonp(outputJSON);

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
		 	user.role = req.body.role;
		 	user.enable = req.body.enable;
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
						}//if
						else {
							outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.userStatusUpdateSuccess};
						}
						res.jsonp(outputJSON);
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

exports.reset_password=function(req,res){
	
	if(req.body._id!=null){
				userObj.update({_id:req.body._id},{$set:{password:req.body.password}},function(err,updatedresponse){
					if(err){
						outputJSON = {'status': 'error', 'messageId':400, 'message':"pasword not Updated"}; 
						res.jsonp(outputJSON)
					}
					else{
						outputJSON = {'status': 'success', 'messageId':200, 'message':"password updated successfully","data":updatedresponse}; 
					 	res.jsonp(outputJSON)
					 }
				})
			}
			else{
				outputJSON = {'status': 'failure', 'messageId':400, 'message':"session expired"}; 
				res.jsonp(outputJSON)
				
			}
		}



		 exports.forgetpassword=function(req,res){
		 	
		 console.log("inside forget password");
		 userObj.findOne({phone_no : req.body.phone_no},function(err,data){
		 		if(err){
		 			outputJSON = {'status': 'failure', 'messageId':401, 'message':"Error Occured"};
					res.jsonp(outputJSON);
				}
		 		else{
			 			
			 			if(data==null){
							outputJSON = {'status': 'failure', 'messageId':401, 'message':"Not a valid phone number"};
							res.jsonp(outputJSON)	
									
			 			}
			 			else{
			 				console.log("not a validph",req.body.phone_no)
			 				var url="http://"+req.headers.host+"/#"+"/resetpassword/"+data._id;
							console.log("url",url)
							client.messages.create({
		    					body: 'Click on link to reset password '+ url,
		    					to:  req.body.phone_no,  // Text this number
		    					from: '(480) 526-9615' // From a valid Twilio number
							},function(err,response)
							{
								if(err){
									outputJSON={'status': 'failure', 'messageId':401,'message':"error"};
									res.jsonp(outputJSON)	
									
								}
								else{
								outputJSON={'status': 'success', 'messageId':200, 'message':"success"};
								res.jsonp(outputJSON)
								
									
								}
							
							})
						}		
		 			}
		 })



		 }


/*exports.twilioTest = function(){

console.log("m here i ")
						client.messages.create({
	    					body: 'Hello from Node',
	    					to: '+918054218147',  // Text this number
	    					from: '(480) 526-9615' // From a valid Twilio number
						},function(err,response){
							if(err){
								console.log(err)
							}else{
								console.log("response",response)
							}
						})
						

}*/
