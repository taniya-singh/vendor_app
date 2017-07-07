var vendor = require('./../../models/admin/signup_vendor.js');
var mongoose = require('mongoose');
var constantObj = require('./../../../constants.js');
var fs=require('fs');
var NodeGeocoder = require('node-geocoder');
var emailService = require('./../email/emailService.js');



/* Vendor sign up form  */

exports.signupVendor = function(req, res) {
	var NodeGeocoder = require('node-geocoder');
	var vendorobj = {};
	
	vendorobj = req.body;
	console.log("vendorobj",vendorobj)
	vendor.findOne({"vendor_email":vendorobj.vendor_email,"vendor_name":vendorobj.vendor_name},function(err,ven){
		if(err){
			outputJSON = {'status': 'failure', 'messageId':401, 'message':"Error occured,try again later"};
			res.jsonp(outputJSON);	
		}
		else{
			if(ven==null){
				var options = {
				provider: 'google'
			};
			/*To get the longitute and lattitude corressponding to address input field*/		 
			var geocoder = NodeGeocoder(options); 
			geocoder.geocode(req.body.vendor_address)
			.then(function(addressdetails,err) {
				if(addressdetails){
					console.log("addressdetails",addressdetails)
					vendorobj.longitude=addressdetails[0].longitude;
					vendorobj.latitude=addressdetails[0].latitude;
					vendorobj.zipcode=addressdetails[0].zipcode;
					vendorobj.city=addressdetails[0].city;
					vendorobj.country=addressdetails[0].country;
					vendorobj.geo=[addressdetails[0].latitude,addressdetails[0].longitude]
				console.log("dfgfgfgh",vendorobj)
					vendor(vendorobj).save(vendorobj, function(err, data) { 
						if(err) {
							console.log("data if err",err)
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
							
							outputJSON = {'status': 'failure', 'messageId':401, 'message':"Error occured,try again later"};
						}
						else {
							/* Send Email to Vendor */

							var userDetails = {};
							userDetails.email = vendorobj.vendor_email;
							userDetails.username =vendorobj.vendor_email;
							userDetails.pass = vendorobj.password;
							userDetails.firstname = vendorobj.vendor_name;
							userDetails.app_link = "<a href='http://www.google.com'>Link</a>";

							var frm = '<img src="logo.png">';
							var emailSubject = 'bridgit Registration';

							var emailTemplate = 'user_signup.html';

							emailService.send(userDetails, emailSubject, emailTemplate, frm);


							outputJSON = {'status': 'success', 'messageId':200, 'message':"Vendor successfully added",'data': data};
						}
						res.jsonp(outputJSON);
					});
				}
				else{
					console.log(err)
				}
			});				
			} // end of if, if vendor is not already exists
			else{
					outputJSON = {'status': 'failure', 'messageId':400, 'message':"Vendor already exists"};
					res.jsonp(outputJSON);				
				}
		}
	})
}
/* Vendor login api*/
exports.vendor_login = function(req,res){
    	console.log("login ", res.req.user)

var data = res.req.user;
    	if(data.message=='Invalid username')
        {
        var outputJSON = {'status': 'failure', 'messageId':400, 'message':"Invalid username"}; 
        res.jsonp(outputJSON)    
        }
        else if(data.message=='Invalid password')
        {
        var outputJSON = {'status': 'failure', 'messageId':400, 'message':"Invalid password"}; 
        res.jsonp(outputJSON)     
        }
        else if(data.message=="Error")
        {
        var outputJSON = {'status': 'failure', 'messageId':400, 'message':"Error occured,try again later"}; 
        res.jsonp(outputJSON)
        }
        else{
        var outputJSON = {'status': 'success', 'messageId':200, 'message':"login successfully","data":data}; 
        res.jsonp(outputJSON)
            
        }
 } 	

/*update vendor information*/

exports.update_vendor_info2=function(req,res){
	console.log("inside vendor ")
	if(req.body._id){
		vendor.findOne({_id:req.body._id},function(err,data){
			if(err){
				outputJSON = {'status': 'error', 'messageId':400, 'message':"not a valid _id"}; 
				res.jsonp(outputJSON)
			}
			else{
                console.log("req.body",req.body)
				vendor.update({_id:req.body._id},{$set:{"pickup_time":req.body.pickup_time,"vendor_email":req.body.vendor_email,"password":req.body.password,"vendor_name":req.body.vendor_name,"vendor_address":req.body.vendor_address,"phone_no":req.body.phone_no}},function(err,updatedresponse){
					if(err){
						outputJSON = {'status': 'error', 'messageId':400, 'message':"not Updated"}; 
						res.jsonp(outputJSON)
					}
					else{
						console.log("inside responmse",updatedresponse);
						outputJSON = {'status': 'success', 'messageId':200, 'message':"updated successfully","data":updatedresponse}; 
					 	res.jsonp(outputJSON)
					 }
				})
			}
		})
	}
}



exports.vendorList = function(req,res){
	console.log("inside")
      var outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};

        vendor.find({},function(err,data){
                    if(err){
                        res.json("Error: "+err);
                        
                    }
                    else{
                        outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, "data":data }, 
                    res.json(outputJSON);
                    }
                });
    }