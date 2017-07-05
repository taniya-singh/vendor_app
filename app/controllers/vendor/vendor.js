var vendorDbObj = require('./../../models/vendor/vendor.js');
var mongoose = require('mongoose');
var constantObj = require('./../../../constants.js');
var fs=require('fs');
var emailService = require('./../email/emailService.js');
/* Vendor sign up form  */

exports.add = function(req, res) {
	var vendorobj = {};
		vendorobj = req.body;
		vendorDbObj.findOne({"vendor_email":vendorobj.vendor_email},function(err,ven){
			if(err){
				outputJSON = {'status': 'failure', 'messageId':401, 'message':"Error occured,try again later"};
				res.jsonp(outputJSON);	
			}
			else{
				if(ven==null){
					vendorDbObj(vendorobj).save(req.body, function(err, data) { 
						if(err) {
							console.log("data if err",err)
							switch(err.name) {
								case 'ValidationError':
								
									for(field in err.errors) {
										if(err) {
											errorMessage = err.errors[field].message;
										}
										else {							
											errorMessage+=", " + err.errors[field].message;
										}
									}//for
								break;
							}//switch
							
							outputJSON = {'status': 'failure', 'messageId':401, 'message':"Error occured,try again later"};
						}//if
						else {


							/* Send Email to Vendor */

							var userDetails = {};
							userDetails.email = vendorobj.vendor_email;
							userDetails.username =vendorobj.vendor_email;
							userDetails.pass = vendorobj.password;
							userDetails.firstname = vendorobj.vendor_name;
							userDetails.app_link = "<a href='http://www.google.com'>Link</a>";

							var frm = 'MunchApp<noreply@oddjob.com>';
							var emailSubject = 'MunchApp Registration';

							var emailTemplate = 'user_signup.html';

							emailService.send(userDetails, emailSubject, emailTemplate, frm);


							outputJSON = {'status': 'success', 'messageId':200, 'message':"Vendor successfully added",'data': data};
						}
						res.jsonp(outputJSON);
					});	
				}
				else{
					outputJSON = {'status': 'failure', 'messageId':400, 'message':"Vendor already exists"};
					res.jsonp(outputJSON);				
				}
			}
		})
		
}




exports.vendorList = function(req,res){
      var outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};

        vendorDbObj.find({},function(err,data){
                    if(err){
                        res.json("Error: "+err);
                        
                    }
                    else{
                        outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, "data":data }, 
                    res.json(outputJSON);
                    }
                });
    }




/* Vendor login api*/
exports.vendor_login = function(req,res){
    	console.log("login ", res.req.user)

var data = res.req.user;
    	var outputJSON = {'status': 'success', 'messageId':200, 'message':"login successfully","data":data}; 
					   	res.jsonp(outputJSON)
	
		// vendorDbObj.findOne({"vendor_email" : req.body.vendor_email, "password" : req.body.password},function(err,data){
		// 	if(err) {
			
		// 			 	switch(err.name) {
		// 			 	case 'ValidationError':
		// 			 	for(field in err.errors) {
		// 			 		if(errorMessage == "") {
		// 			 			errorMessage = err.errors[field].message;
		// 			 			}
		// 			 	    else {							
		// 			 			errorMessage+=", " + err.errors[field].message;
		// 			 			}
		// 					}//for
		// 				break;
		// 			}//switch
							
		// 	 	outputJSON = {'status': 'failure', 'messageId':401, 'message':err};
		// 	 	res.jsonp(outputJSON);
		// 	  }
		//   	else{
		// 		  	if(data==null){
		// 		  	outputJSON = {'status': 'invalid credentials', 'messageId':400, 'message':"invalid credentials"}; 
		// 		    res.jsonp(outputJSON);
		// 		    }
		// 		    else {
		// 				outputJSON = {'status': 'success', 'messageId':200, 'message':"login successfully","data":data}; 
		// 			   	res.jsonp(outputJSON)
		// 	  		}
	 //      		}
	 //  	});
 } 	


