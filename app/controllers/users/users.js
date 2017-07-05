var userObj = require('./../../models/users/users.js');
var vendor = require('./../../models/vendordetails/vendordetails.js');
var device=require('./../../models/devices/devices.js')
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

    exports.userlogin = function(req,res){
    	console.log("login ", res.req.user)
		var data = res.req.user;
    	var outputJSON = {'status': 'success', 'messageId':200, 'message':"login successfully","data":data}; 
		res.jsonp(outputJSON)
	  	};
	
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

	if (req.body.login_type == 2) {
        if (!req.body.facebook_id) {
            res.jsonp({
                'status': 'failure',
                'messageId': 401,
                'message': 'Facebook Authentication Failed.'
            });
        }
        else {
            var details = {};
            
            if (req.body.first_name) {
                details.first_name = req.body.first_name;
            }
            if (req.body.last_name) {
                details.last_name = req.body.last_name;
            }
            if (req.body.phone_no) {
                details.phone_no = req.body.phone_no;
            }
            if (req.body.email) {
                details.email = req.body.email;
            }  
            details.login_type = req.body.login_type;
            details.facebook_id = req.body.facebook_id;
            userObj.findOne({facebook_id:details.facebook_id},function(err, user) {
                if (err) {
                    var response = {
                        "status": 'faliure',
                        "messageId": "401",
                        "message": "Sorry, Problem to login with facebook."
                    };
                    res.status(401).json(response);
                } 
                else {
                    if (user == null) {
                        console.log("create new credentials",details)
                        var dateTime = Math.floor(Date.now() / 1000);
                        var profilePic = dateTime + "_profile_pic.jpg";
                            userObj(details).save(req.body,function(err, adduser) {
                                if (err) {
                                    res.jsonp({
                                        'status': 'failure',
                                        'messageId': 401,
                                        'message': 'User is not found'
                                    });
                                } else {
                                    var data = {};
                                    data.user_id = adduser._id;
                                    data.device_id = req.body.device_id;
                                    data.device_type = req.body.device_type;
                                    device(device).save(req.body,function(err, devicedata) {
                                        if (err) {
                                            res.jsonp({
                                                'status': 'faliure',
                                                'messageId': 401,
                                                'message': 'Either device_id or device_type is not available!'
                                            });
                                        } else {
                                            res.jsonp({
                                                'status': 'success',
                                                'messageId': 200,
                                                'message': 'User logged in successfully',
                                                "userdata": adduser
                                            });
                                        }
                                    })
                                }
                            })
                    } else {
                        console.log("use old")
                        var dev = {};
                        dev.user_id = user._id;
                        dev.device_id = req.body.device_id;
                        dev.device_type = req.body.device_type;
                        device(dev).save(function(err, data) {
                            if (err) {
                                res.jsonp({
                                    'status': 'faliure',
                                    'messageId': 401,
                                    'message': 'Either device_id or device_type is not available!'
                                });
                            } else {
                                res.jsonp({
                                    'status': 'success',
                                    'messageId': 200,
                                    'message': 'Facebook credentials already exists',
                                    "userdata": user
                                });
                            }
                        })
                    }
                }
            })
        }
    } else if (req.body.login_type == "Google") {

        if (!req.body.id) {
            res.jsonp({
                'status': 'faliure',
                'messageId': 401,
                'message': 'Google Id required!'
            });
        } else {
            var details = {};
            if (req.body.firstname) {
                details.firstname = req.body.firstname;
            }
            if (req.body.phone) {
                details.phone = req.body.phone;
            }
            if (req.body.dob) {
                details.dob = req.body.birthday;
            }
            if (req.body.user_type) {
                details.user_type = req.body.user_type;
            }
            details.login_type = req.body.login_type;
            details.google_id = req.body.id;
            details.email = req.body.email;
            details.gender = req.body.gender;
            if (req.body.profile_path) {
                details.image_path = req.body.profile_path;
            }

            userObj.findOne(details.google_id, details.user_type, details.email, function(err, user) {

                if (err) {

                    var response = {
                        "status": 'faliure',
                        "messageId": "401",
                        "message": "Google Authentication Failed!"
                    };
                    res.status(401).json(response);
                } else {
                    var pro = paths.resolve(appDir + "./../public/images/profile_pic/");
                    if (user == null) {
                        var dateTime = Math.floor(Date.now() / 1000);
                        var profilePic = dateTime + "_profile_pic.jpg";
                        download(details.image_path, pro + "/" + profilePic, function() {
                            var host = req.get('host');
                            var protocall = req.protocol;

                            if (details.image_path) {
                                details.image_path = protocall + '://' + host + '/images/profile_pic/' + profilePic;
                            }

                            userObj.insert(details, function(err, user) {
                                if (err) {
                                    return done(null, false);
                                } else {
                                    req.session.user = user;
                                    var data = {};
                                    data.userId = user._id;
                                    data.device_id = req.body.device_id;
                                    data.device_type = req.body.device_type;
                                    userObj.device(data, function(err, data) {
                                            if (err) {
                                                res.jsonp({
                                                    'status': 'faliure',
                                                    'messageId': 401,
                                                    'message': 'Something went wrong!'
                                                });
                                            } else {
                                                res.jsonp({
                                                    'status': 'success',
                                                    'messageId': 200,
                                                    'message': 'User logged in successfully',
                                                    "userdata": user
                                                });
                                            }
                                        })
                                        //res.jsonp({'status':'success', 'messageId':200, 'message':'User logged in successfully',"userdata":user});

                                }
                            })
                        });
                    } else {

                        //if (user.google_id == req.body.id && user.user_type != req.body.user_type) {
                        //    if (user.user_type == "Host") {
                        //        res.jsonp({ 'status': 'faliure', 'messageId': 401, 'message': 'User is already registered as Local Pro with this Id.' });
                        //    } else {
                        //        res.jsonp({ 'status': 'faliure', 'messageId': 401, 'message': 'User is already registered as Traveler with this Id.' });
                        //    }
                        //} else {
                        req.session.user = user;
                        var data = {};
                        data.userId = user._id;
                        data.device_id = req.body.device_id;
                        data.device_type = req.body.device_type;
                        userObj.device(data, function(err, data) {
                                if (err) {
                                    res.jsonp({
                                        'status': 'faliure',
                                        'messageId': 401,
                                        'message': 'Either device_id or device_type is not available!'
                                    });
                                } else {
                                    res.jsonp({
                                        'status': 'success',
                                        'messageId': 200,
                                        'message': 'User logged in successfully',
                                        "userdata": user
                                    });
                                }
                            })
                            //res.jsonp({ 'status': 'success', 'messageId': 200, 'message': 'User logged in successfully', "userdata": user });
                            //}
                    }

                }
            })
        }

    } else {
        res.jsonp({
            'status': 'faliure',
            'messageId': 401,
            'message': 'something wrong here'
        });
    }
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
		userObj.findOne({email:req.body.email},function(err,user){
			console.log("user",user)
			if(err){
				outputJSON = {'status': 'failure', 'messageId':401, 'message':errorMessage};
			}
			else{
				if(user ==null){
					console.log("inside if");
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
				else{
					console.log("inside else")
					outputJSON = {'status': 'failure', 'messageId':401, 'message':"user already exists"};
					res.jsonp(outputJSON);
				}
			}})
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


exports.userList = function(req,res){
      var outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};

        userObj.find({},function(err,data){
                    if(err){
                        res.json("Error: "+err);
                    }
                    else{
                        outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, "data":data }, 
                    res.json(outputJSON);
                    }
                });
    }