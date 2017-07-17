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
	vendor.findOne({"vendor_email":vendorobj.vendor_email},function(err,ven){
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
				console.log("GVSHBVVVVVVVVVVVV");
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
      var outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
        vendor.find({is_deleted:false},function(err,data){

        	var page = req.body.page || 1,
		count = req.body.count || 1;
	var skipNo = (page - 1) * count;

	var sortdata = {};
	var sortkey = null;
	for (key in req.body.sort) {
		sortkey = key;
	}
	if (sortkey) {
		var sortquery = {};
		sortquery[sortkey ? sortkey : '_id'] = req.body.sort ? (req.body.sort[sortkey] == 'desc' ? -1 : 1) : -1;
	}
	 //console.log("-----------query-------", query);
	console.log("sortquery", sortquery);
	console.log("page", page);
	console.log("count", count);
	console.log("skipNo",skipNo)
	var query = {};
	var searchStr = req.body.search;
	if (req.body.search) {
		query.$or = [{
			vendor_name:new RegExp(searchStr, 'i')
			
		}, {
			vendor_email: new RegExp(searchStr, 'i')
		},{
			phone_no: new RegExp(searchStr, 'i')
		}]
	}
	query.is_deleted=false;
    console.log("-----------query-------", query);
	vendor.find(query).exec(function(err, data) {
		console.log(data)
                    if(err){
                        res.json("Error: "+err);   
                    }
                    else{
                        outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, "data":data }, 
                    	res.json(outputJSON);
                    }
                });

    });

}
 

       exports.bulkUpdate = function(req, res) {
	var outputJSON = "";
	var inputData = req.body;
	var roleLength = inputData.data.length;
	var bulk = vendor.collection.initializeUnorderedBulkOp();
	for (var i = 0; i < roleLength; i++) {
		var userData = inputData.data[i];
		var id = mongoose.Types.ObjectId(userData.id);
		bulk.find({
			_id: id
		}).update({
			$set: userData
		});
	}
	bulk.execute(function(data) {
		outputJSON = {
			'status': 'success',
			'messageId': 200,
			'message': constantObj.messages.userStatusUpdateSuccess
		};
		res.jsonp(outputJSON);
	});
	

}




    exports.deleteVendor = function(req,res){

    if(req.body._id){
        vendor.update({
                _id: req.body._id
            }, {
                $set: {
                    is_deleted:true
                }
            }, function(err, updRes) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("device id updated", updRes);
                    outputJSON = {
                    'status': 'failure',
                    'messageId': 203,
                    'data': updRes,
                    'message': "Customer has been deleted successfully"
                     };
                res.jsonp(outputJSON);


                }

            })
    }
    
}



exports.getCurrentVendorData = function(req, res) {
 vendor.findOne({
			_id: req.body._id
		}, {
			password: 0
		})
		.exec(function(err, data) {
			if (err) {
				onsole.log(err);
				outputJSON = {
					'status': 'failure',
					'messageId': 203,
					'message': req.headers.lang=="ch" ? chConstantObj.messages.errorRetreivingData : constantObj.messages.errorRetreivingData
			
				};
				res.status(200).jsonp(outputJSON);
			} else {
				res.status(200).jsonp({
					'status': 'success',
					'messageId': 200,
					'data': data
				});
			}
		})
}

// var generateOtp = function () {
// var text = "";
// var possible = "0123456789";
//  for (var i = 0; i < 4; i++){
// 	text += possible.charAt(Math.floor(Math.random() * possible.length));
//  }
//  return text;
// }


exports.updateVendorInformation = function(req, res) {
	// console.log("inside update user information");
	console.log("daada",req.body);
	console.log(req.files);
	var _id = req.body._id;
	var details = {};
	// details._id = _id;
	var imagesToDelete = [];
	if(req.body.deleteImages){
		var imgArray = req.body.deleteImages;
	 	imagesToDelete = JSON.parse(imgArray.toString('utf8'));	
	}
	
	var detailsData = JSON.parse(JSON.stringify(req.body));
	console.log("detailsData",detailsData);
	console.log("imagesToDelete",imagesToDelete);
	
	
	console.log(req.body._id);
	
	// var utfString = fields.conditions;
	// conditions = JSON.parse(utfString.toString('utf8'));
	 var allImages = {};

	if(req.body.WebRequest=="WebRequest"){
		if (req.body.password) {
			detailsData.password = md5(req.body.password);
		}
	if (req.body.UploadMultipleImages) {
		var userimg = [];
		
		if ((req.files) && (req.files.length > 0)) {
			for (var i = 0; i < req.files.length; i++) {
				var obj = {};
				obj.name = req.files[i].filename;
				userimg.push(obj);
			}
			detailsData.userImages = userimg;
			// detailsData.userImages = req.files[0].filename;
		}
	}
  }
}


exports.updateVendordata = function(req, res) {

	reqdata = {};
	reqdata._id = req.body._id;


	if (req.body.profile_image != undefined)
		reqdata.profile_image = req.body.profile_image;

	if (req.body.profile_image != undefined)
		reqdata.profile_image = req.body.profile_image;
	if (req.body.profile_image != undefined || req.body.profile_image != undefined) {

		//console.log("req",req.body)
		uploadProImg(reqdata, function(responce) {
			console.log(responce);
			//outputJSON = {'status':'success', 'messageId':200, 'message':constantObj.messages.userStatusUpdateSuccess,'data':responce};
			//	res.jsonp(outputJSON);
			delete req.body.profile_image;
			delete req.body.userImages;
			
			vendor.update({
					'_id': req.body._id
				}, {
					$set: req.body
				}, function(err, res1) {
					console.log(err);
					if (err) {
						outputJSON = {
							'status': 'failure',
							'messageId': 203,
							'message': constantObj.messages.errorRetreivingData
						};
					}
					outputJSON = {
						'status': 'success',
						'messageId': 200,
						'message': constantObj.messages.userStatusUpdateSuccess,
						'data': res1[0]
					};
					res.jsonp(outputJSON);
				});

			
		});
	} else {




		outputJSON = {
			'status': 'failure',
			'messageId': 203,
			'message': "Please select image."
		};
		res.jsonp(outputJSON);
	}
}


uploadProImg = function(data, callback) {

	//console.log("data",data);
	var photoname = data._id + '_' + Date.now() + '.jpg';

	var folder = "";
	var updateField = {
		'profile_image': photoname
	};
	var height = 125;
	var width = 125;
	
	var imagename = __dirname + "/../../../public/assets/upload/profileImg/" + folder + photoname;
	if (data.profile_image.indexOf("base64,") != -1) {
		var Data = data.profile_image.split('base64,');
		var base64Data = Data[1];
		var saveData={};

		saveData.userImages = [{name:photoname}];

		//console.log("asdfasdsa",saveData)

		fs.writeFile(imagename, base64Data, 'base64', function(err) {
			if (err) {
				console.log(err);
				callback("Failure Upload");


			} else {
	
				vendor.update({
					'_id': data._id
				}, {
					$set:{"profileImg":photoname}
				}, function(err, res) {
					console.log(res);
					callback(saveData);
				});


			}
		});
	} else {
		callback("Image  not selected");
	}
}