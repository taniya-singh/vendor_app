var vendor = require('./../../models/admin/signup_vendor.js');
var items = require('./../../models/items/items.js');
var mongoose = require('mongoose');
var constantObj = require('./../../../constants.js');
var fs = require('fs');
var NodeGeocoder = require('node-geocoder');
var emailService = require('./../email/emailService.js');
var stripe = require("stripe")("sk_test_PirOevMb5V4TmELqMjPZxTnJ");
var nodemailer = require('nodemailer');
var device = require('./../../models/devices/devices.js')
var itemsObj = require('./../../models/items/items.js');
var order = require('./../../models/order/order.js');
var md5 = require('md5');
var moment = require('moment');
var async = require('async');


/* Vendor sign up form  */

exports.signupVendor = function(req, res) {
	var stripe_customer_details;
	var vendorobj = {};
	var bankdetails = {};
	var userDetails = {};
	var vdetails;
	bankdetails.country = 'US';
	bankdetails.currency = 'usd';
	bankdetails.routing_no = '110000000';
	bankdetails.account_no = '000123456789';
	bankdetails.account_holder_name = req.body.Account_Holder_Name;
	bankdetails.account_holder_type = req.body.Account_Holder_Type;

	vendorobj = req.body;
	console.log("vendorobj", vendorobj);
	vendor.findOne({
		"vendor_email": vendorobj.vendor_email
	}, function(err, ven) {
		if (err) {
			outputJSON = {
				'status': 'failure',
				'messageId': 401,
				'message': "Error occured,try again later"
			};
			res.jsonp(outputJSON);
		} else {
			if (ven == null) {
				var options = {
					provider: 'google'
				};
				/*To get the longitute and lattitude corressponding to address input field*/
				var geocoder = NodeGeocoder(options);
				geocoder.geocode(req.body.vendor_address)
					.then(function(addressdetails, err) {
						if (addressdetails) {
							//console.log("addressdetails",addressdetails)
							vendorobj.longitude = addressdetails[0].longitude;
							vendorobj.latitude = addressdetails[0].latitude;
							vendorobj.zipcode = addressdetails[0].zipcode;
							vendorobj.city = addressdetails[0].city;
							vendorobj.country = addressdetails[0].country;
							vendorobj.geo = [addressdetails[0].latitude, addressdetails[0].longitude]
							vendor(vendorobj).save(vendorobj, function(err, vendetails) {
								if (err) {
									console.log("data if err", err)
									switch (err.name) {
										case 'ValidationError':

											for (field in err.errors) {
												if (errorMessage == "") {
													errorMessage = err.errors[field].message;
												} else {
													errorMessage += ", " + err.errors[field].message;
												}
											} //for
											break;
									} //switch

									outputJSON = {
										'status': 'failure',
										'messageId': 401,
										'message': "Error occured,try again later"
									};
								} else {
									vdetails = vendetails;

									/* Send Email to Vendor */
									userDetails.email = vendorobj.vendor_email;
									userDetails.username = vendorobj.vendor_email;
									userDetails.pass = vendorobj.password;
									userDetails.firstname = vendorobj.vendor_name;
									userDetails.app_link = "<a href='http://www.google.com'>Link</a>";

									var frm = '<img src="images/app.png">';
									var emailSubject = 'Welcome to Bridgit';

									var emailTemplate = 'user_signup.html';
									emailService.send(userDetails, emailSubject, emailTemplate, frm);
									// end of send email

									/*Register account on stripe*/
									createStripeAccount(req, res, userDetails, bankdetails, vdetails);

									outputJSON = {
										'status': 'success',
										'messageId': 200,
										'message': "Vendor successful added ",
										"data": vendetails
									};
								}
								res.jsonp(outputJSON);
							});
						} //if address details not found
						else {
							console.log(err)
						}
					});
			} // end of if, if vendor is not already exists
			else {
				outputJSON = {
					'status': 'failure',
					'messageId': 400,
					'message': "Vendor already exists"
				};
				res.jsonp(outputJSON);
			}
		}
	})
}


var createStripeAccount = function(req, res, userDetails, bankdetails, vdetails) {
	stripe.accounts.create({
		type: 'custom',
		country: 'US',
		email: userDetails.email
	}, function(err, account) {
		if (err) {
			console.log("errrrrrrr", err) // item detail != null
			outputJSON = {
				'status': 'failure',
				'messageId': 400,
				'message': "err"
			};
		} else {
			stripe_account_details = account
			console.log("customer created on stripe is", account.id) // item detail != null
			outputJSON = {
				'status': 'success',
				'messageId': 200,
				'message': "Customer created successfully",
				data: account
			};
			//res.json(outputJSON);
			createExtraAccount(req, res, bankdetails, stripe_account_details, vdetails)
		}
	});

}

/* Create extra account to add bank details corresponding to vendor*/

var createExtraAccount = function(req, res, bankdetails, stripe_account_details, vdetails) {
	//console.log("bank details are*******",bankdetails)
	var account_id = stripe_account_details.id;
	stripe.tokens.create({
		bank_account: {
			country: bankdetails.country,
			currency: bankdetails.currency,
			account_holder_name: bankdetails.account_holder_name,
			account_holder_type: bankdetails.account_holder_type,
			routing_number: bankdetails.routing_no,
			account_number: bankdetails.account_no
		}
	}, function(err, token) {
		if (err) {
			console.log("errrr", err)
		} else {
			if (token.id) {
				var btokId = token.id;
				stripe.accounts.createExternalAccount(
					account_id, {
						external_account: btokId
					},
					function(err, bank_account) {
						if (err) {
							console.log("errrrrrrrrrrrrrr", err)
							res.jsonp({
								'status': 'faliure',
								'messageId': 401,
								'message': "err",
								data: err
							});
						} else {
							vendor.update({
								_id: vdetails._id
							}, {
								$set: {
									stripe_account_id: stripe_account_details.id,
									bank_account_id: bank_account.id,
									connected_account_status: true
								}
							}, function(updateerr, updatevendor) {

								if (updateerr) {
									console.log("errrrrr", updateerr)
									outputJSON = {
										'status': 'faliure',
										'messageId': 401,
										'message': 'User connected_account_status is not updated, but bank info has done.'
									};
									//addCustomer(scretKey, acctId);
									// showResponse(res, outputJSON);
								} else {
									console.log("updatevendor", updatevendor)
									outputJSON = {
										'status': 'success',
										'messageId': 200,
										'message': "Bank info added successfully.",
										"data": bank_account
									};
									//addCustomer(scretKey, acctId);
									//showResponse(res, outputJSON);
								}

							});

						}
					}
				);
			}
		}

	});
}



/* Vendor login api*/
exports.vendor_login = function(req, res) {
	console.log("re body",req.body)
	console.log("login ", res.req.user)

	var data = res.req.user;
	if (data.message == 'Invalid username') {
		var outputJSON = {
			'status': 'failure',
			'messageId': 400,
			'message': "Invalid username"
		};
		res.jsonp(outputJSON)
	} else if (data.message == 'Invalid password') {
		var outputJSON = {
			'status': 'failure',
			'messageId': 400,
			'message': "Invalid password"
		};
		res.jsonp(outputJSON)
	} else if (data.message == "Error") {
		var outputJSON = {
			'status': 'failure',
			'messageId': 400,
			'message': "Error occured,try again later"
		};
		res.jsonp(outputJSON)
	} else {
		var vendorid=res.req.user.id
		var device_data={};
		device_data.device_type=req.body.device_type;
		device_data.device_token=req.body.device_token;
		device_data.vendor_id=res.req.user.id;

		device.find({vendor_id:vendorid},function(err,devicedetails){
			console.log("inosde find")
			if(err){
				console.log("err",err)

			}else{
				if(devicedetails.length>0){
					console.log("inside modifly")
					device.update({vendor_id:vendorid},{$set:device_data},function(err,deviceupdate){
						if(err){
							var outputJSON = {
								'status': 'failure',
								'messageId': 400,
								'message': "Err"
							};
							res.jsonp(outputJSON)

						}else{
							data.device_token=req.body.device_token;
							data.device_type=req.body.device_type;
							console.log("update",deviceupdate)
							console.log("data is",data)

							var outputJSON = {
								'status': 'success',
								'messageId': 200,
								'message': "login successfully",
								'data':data
							};
							res.jsonp(outputJSON)
						}
					})

				}else{
					console.log("insode save new")
					device(device_data).save(device_data,function(err,deviceadd){
						if(err){
							var outputJSON = {
								'status': 'failure',
								'messageId': 400,
								'message': "Err"
							};
							res.jsonp(outputJSON)
						}else{
							data.device_token=req.body.device_token;
							data.device_type=req.body.device_type;
							console.log("data is",data)
							var outputJSON = {
								'status': 'success',
								'messageId': 200,
								'message': "login successfully",
								'data':data
							};
							res.jsonp(outputJSON)

						}
					})
				}
				
			}
		})
	}
}


/*update vendor information*/

exports.update_vendor_info2 = function(req, res) {
	console.log("req.body", req.body)
	var updatedinfo = {};
	updatedinfo = req.body;

	vendor.update({
		_id: req.body._id
	}, {
		$set: updatedinfo
	}, function(err, updatedresponse) {
		if (err) {
			outputJSON = {
				'status': 'error',
				'messageId': 400,
				'message': "not Updated"
			};
			res.jsonp(outputJSON)
		} else {
			console.log("inside responmse", updatedresponse);
			outputJSON = {
				'status': 'success',
				'messageId': 200,
				'message': "updated successfully",
				"data": updatedresponse
			};
			res.jsonp(outputJSON)
		}
	})


}



exports.vendorList = function(req, res) {
	var outputJSON = {
		'status': 'failure',
		'messageId': 203,
		'message': constantObj.messages.errorRetreivingData
	};
	vendor.find({
		is_deleted: false
	}, function(err, data) {

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
		//console.log("sortquery", sortquery);
		//console.log("page", page);
		//console.log("count", count);
		//console.log("skipNo",skipNo)
		var query = {};
		var searchStr = req.body.search;
		if (req.body.search) {
			query.$or = [{
				vendor_name: new RegExp(searchStr, 'i')

			}, {
				vendor_email: new RegExp(searchStr, 'i')
			}, {
				phone_no: new RegExp(searchStr, 'i')
			}]
		}
		query.is_deleted = false;
		// console.log("-----------query-------", query);
		vendor.find(query).exec(function(err, data) {
			//console.log("hahahahhahahhahahaha",data);
			if (err) {
				res.json("Error: " + err);
			} else {
				//outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, "data":data }, 
				//res.json(outputJSON);

				var length = data.length;
				vendor.find(
						query
					).skip(skipNo).limit(count).sort(sortquery)
					.exec(function(err, data1) {
						//console.log(data)
						if (err) {
							console.log("tttte", err)
							outputJSON = {
								'status': 'failure',
								'messageId': 203,
								'message': 'data not retrieved '
							};
						} else {
							outputJSON = {
								'status': 'success',
								'messageId': 200,
								'message': 'data retrieve from products',
								'data': data1,
								'count': length
							}
						}
						res.status(200).jsonp(outputJSON);
					})
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



exports.deleteVendor = function(req, res) {

	if (req.body._id) {
		vendor.remove({
			'_id': req.body._id
		}, function(err, data) {

			if (err) {
				console.log("err", err);
			} else {
				items.remove({
					'vendor_id': req.body._id
				}, function(err, data) {

					if (err) {
						console.log(err);
					} else {
						//  console.log("device id updated", updRes);
						outputJSON = {
							'status': 'success',
							'messageId': 200,
							'message': "Vendor  has been deleted successfully"
						};
						res.jsonp(outputJSON);
					}
				});
			}
		});
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
					'message': req.headers.lang == "ch" ? chConstantObj.messages.errorRetreivingData : constantObj.messages.errorRetreivingData

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
	console.log("daada", req.body);
	console.log(req.files);
	var _id = req.body._id;
	var details = {};
	// details._id = _id;
	var imagesToDelete = [];
	if (req.body.deleteImages) {
		var imgArray = req.body.deleteImages;
		imagesToDelete = JSON.parse(imgArray.toString('utf8'));
	}

	var detailsData = JSON.parse(JSON.stringify(req.body));
	console.log("detailsData", detailsData);
	console.log("imagesToDelete", imagesToDelete);


	console.log(req.body._id);

	// var utfString = fields.conditions;
	// conditions = JSON.parse(utfString.toString('utf8'));
	var allImages = {};

	if (req.body.WebRequest == "WebRequest") {
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
		var saveData = {};

		saveData.userImages = [{
			name: photoname
		}];

		//console.log("asdfasdsa",saveData)

		fs.writeFile(imagename, base64Data, 'base64', function(err) {
			if (err) {
				console.log(err);
				callback("Failure Upload");


			} else {

				vendor.update({
					'_id': data._id
				}, {
					$set: {
						"profileImg": photoname
					}
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


/*exports.forget_password=function(req,res){
	console.log("inside email")
	if(req.body.vendor_email)
            vendor.findOne({vendor_email : req.body.vendor_email},function(err,data){
                if(err){
                    outputJSON = {'status': 'failure', 'messageId':400, 'message':"Error Occured"};
                    res.jsonp(outputJSON);
                }else{
                    if(data==null){
                        outputJSON={'status': 'failure', 'messageId':400,'message':"Please enter a valid Email ID"};
                        res.jsonp(outputJSON)    
                    }else
                    {
                    var mailDetail="smtps://osgroup.sdei@gmail.com:mohali2378@smtp.gmail.com";
                    var resetUrl = "http://"+req.headers.host+"/#"+"/resetpassword/"+data._id;
                    console.log("reset url",resetUrl)
                    var transporter = nodemailer.createTransport(mailDetail);
                        
                        var mailOptions = {
                            from: "abc",
                            to: req.body.vendor_email,
                            subject: 'Reset password',
                            html: 'Welcome to Bridgit!Your request for reset password is being proccessed .Please Follow the link to reset your password    \n  ' + resetUrl
                        };
                    transporter.sendMail(mailOptions, function(error, response) {
                        if (error) {

                            console.log("err",error)
                             outputJSON={'status': 'failure', 'messageId':401,'message':"error"};
                            res.jsonp(outputJSON)    
                        }else{
                            var response = {
                            "status": 'success',
                            "messageId": 200,
                            "message": "Reset password link has been send to your Mail. Kindly reset.",
                            "Sent on":Date(),
                            "From":"Taniya Singh"}  
                            res.jsonp(response)
                        }
                    })  
                    }        
                 }
            })
}
exports.reset_password = function(req, res) {
	console.log("AAAAAAAAAA")
    console.log("new pass", req.body.password.newpassword)
    if (req.body._id != null) {

        vendor.update({
            _id: req.body._id
        }, {
            $set: {
                "password": req.body.password.newpassword
            }
        }, function(err, updatedresponse) {
            if (err) {
                outputJSON = {
                    'status': 'error',
                    'messageId': 400,
                    'message': "Password not updated, Try again later"
                };
                res.jsonp(outputJSON)
            } else {
                outputJSON = {
                    'status': 'success',
                    'messageId': 200,
                    'message': "password updated successfully",
                    "data": updatedresponse
                };
                res.jsonp(outputJSON)
            }
        })
    } else {
        outputJSON = {
            'status': 'failure',
            'messageId': 400,
            'message': "session expired"
        };
        res.jsonp(outputJSON)
    }
}*/

exports.totalSales = function(req, res) {
	console.log("KKKKKKKKKKKKKKKKKKKKKKKKKKKK")

	order.aggregate([{
		$match: {
			status: "Picked Up"
		}
	}, {
		$group: {
			_id: null,
			total_Count: {
				$sum: "$item_count"
			}
		}
	}], function(err, totalsales) {
		console.log("total sales", totalsales)
		if (err) {
			outputJSON = {
				'status': 'failure',
				'messageId': 400,
				'message': "err"

			};
			res.jsonp(outputJSON)
		} else {
			outputJSON = {
				'status': 'success',
				'messageId': 200,
				'message': "Total sales retreived successfully",
				'data': totalsales
			};
			res.jsonp(outputJSON)
		}
	})

}
exports.totalVendor = function(req, res) {

	var outputJSON = "";
	vendor.count({
		is_deleted: false
	}, function(err, data) {
		if (err) {
			outputJSON = {
				'status': 'failure',
				'messageId': 203,
				'message': constantObj.messages.errorRetreivingData
			};
		} else {
			outputJSON = {
				'status': 'success',
				'messageId': 200,
				'message': constantObj.messages.successRetreivingData,
				'data': data
			}
		}
		res.jsonp(outputJSON);
	});
}

exports.totalRevenue = function(req, res) {
	var total = 0;
	var total_revenew = 0;
	console.log("insiode tottal")
	order.aggregate([{
		$lookup: {
			from: "items",
			localField: "item_id",
			foreignField: "_id",
			as: "items"
		}

	}, {
		$unwind: "$items"
	}], function(err, orderdetails) {
		if (err) {
			outputJSON = {
				'status': 'Failure',
				'messageId': 400,
				'message': "Error"

			}
			res.jsonp(outputJSON);

		} else {
			//console.log(orderdetails)
			for (var i = 0; i < orderdetails.length; i++) {
				var calculated_price = orderdetails[i].item_count * orderdetails[i].items.p_price
				total = parseFloat(total) + parseFloat(calculated_price);

			}
			console.log("total revenew is", total.toFixed(2))
			total_revenew = total.toFixed(2)

			outputJSON = {
				'status': 'success',
				'messageId': 200,
				'message': "total revenew retreive successfully",
				'data': total_revenew
			}
			res.jsonp(outputJSON);

		}
	})
}






exports.saleData = function(req,res)
{
	let vendor_id = req.body.vendor_id;
	function firstDayOfMonth() {
        var d = new Date(Date.apply(null, arguments));
        d.setDate(1);
        return d.toISOString();
    }
    function lastDayOfMonth() {
        var d = new Date(Date.apply(null, arguments));
        d.setMonth(d.getMonth() + 1);
        d.setDate(0);
        return d.toISOString();
    }

    var now = Date.now();
    //Below line for getting the first date of current month
    var startDayOfMonth = firstDayOfMonth(now);
    console.log("startdate",startDayOfMonth)
    //Below line for getting the last date of current month
    var endDayOfMonth = lastDayOfMonth(now);
    console.log("enddate",endDayOfMonth)
    //Below line for getting the current week first day
    var currentDayOfweek = moment().day(0); // Sunday
    console.log("currentdat",currentDayOfweek)
    //Below line for getting the current week last day
    var lastDayOfweek = moment().day(6); // saturday
    console.log("lastdayeweek",lastDayOfweek)
    console.log("vendor id",vendor_id)
    async.parallel({
        one: function (parallelCb) {
            // get barber total sales of current month
            getTotalSaleOnDates(vendor_id, startDayOfMonth, endDayOfMonth, function (err, result) {
                parallelCb(null, result)
                 console.log(">>>>>>>>>>>>>>>>1111111",result)
            });
        },
        two: function (parallelCb) {
            // get barber sale of current week
            getTotalSaleOnWeek(vendor_id, currentDayOfweek, lastDayOfweek, function (err, result) {
                parallelCb(null, result)
                console.log(">>>>>>>>>>>>>>>>22222222",result)
            });
        }
    }, function (err, results) {
        // results will have the results of all 3
        console.log("total month sale", results.one);
        console.log("total week sale", results.two);
        if(err){
        	outputJSON = {
				'status': 'Failure',
				'messageId': 400,
				'message': "Err"
				
			}
			res.jsonp(outputJSON);

        }else{
        	console.log("the results id ",results)
        	outputJSON = {
				'status': 'success',
				'messageId': 200,
				'message': "Data retreive successfully",
				'data': results
			}
			res.jsonp(outputJSON);
        }


        /*res.status(200).send({
            msg: constantObj.messages.successRetreivingData,
            data: {
                monthSale: results.one,
                weekSale: results.two,

            }
        })*/
    });

}


var getTotalSaleOnDates = function(vendor_id, startDate, endDate, cb) {
    var vendorId = mongoose.Types.ObjectId(vendor_id);
    console.log("vendor here",vendorId)
    var Startdate = new Date(moment(startDate, "YYYY-MM-DD").format("YYYY-MM-DD[T]HH:mm:ss.SSS") + 'Z');
    var Enddate = new Date(moment(endDate, "YYYY-MM-DD").add(1, 'day').format("YYYY-MM-DD[T]HH:mm:ss.SSS") + 'Z');
   console.log("startDate>>>>>>>>>>>>>>>>>",Startdate)
   console.log("enddate>>>>>>>>>>>>>>>>>>>",Enddate)
   order.aggregate([  
    {      
    	$lookup:      
              {        
               from: "items", 
               localField: "item_id", 
               foreignField: "_id", 
               as: "items"       
               }  },
    
    {  
        $match: 
               { 
               	  $and: 
               	          
                              [{ vendor_id : vendorId }, 
                              {
                                  created_date: {
                                  $lte: Enddate,
                                  $gte: Startdate 
                                  }    
                              }   
                              ]
                          
                }
    },
    {
        $group :   
        {      
            _id : null,   
            total_Count: { $sum: "$item_count" }
         }
     }
  ]).exec(function(err, result) {
    console.log("here",result);
        if (err) {
            cb(err, null);
            
        } else {
            cb(null, result)
            console.log("database",result)
        }
    })
}


var getTotalSaleOnWeek = function(vendor_id, currentDayOfweek, lastDayOfweek, cb) {
    var vendorId = mongoose.Types.ObjectId(vendor_id);
    console.log("vendor here",vendorId)
    var currentDayOfweek = new Date(moment(currentDayOfweek, "YYYY-MM-DD").format("YYYY-MM-DD[T]HH:mm:ss.SSS") + 'Z');
    var lastDayOfweek = new Date(moment(lastDayOfweek, "YYYY-MM-DD").add(1, 'day').format("YYYY-MM-DD[T]HH:mm:ss.SSS") + 'Z');
   console.log("currentDayOfweek>>>>>>>>>>>>>>>>>",currentDayOfweek)
   console.log("lastDayOfweek>>>>>>>>>>>>>>>>>>>",lastDayOfweek)
   order.aggregate([  
    {      
    	$lookup:      
              {        
               from: "items", 
               localField: "item_id", 
               foreignField: "_id", 
               as: "items"       
               }  },
    
    {  
        $match: 
               { 
               	  $and: 
               	          
                              [{ vendor_id : vendorId }, 
                              {
                                  created_date: {
                                  $lte: lastDayOfweek,
                                  $gte: currentDayOfweek 
                                  }    
                              }   
                              ]
                          
                }
    },
    {
        $group :   
        {      
            _id : null,   
            total_Count: { $sum: "$item_count" }
         }
     }
  ]).exec(function(err, result) {
    console.log("here",result);
        if (err) {
            cb(err, null);
            
        } else {
            cb(null, result)
            console.log("database",result)
        }
    })
}

exports.revenueData = function(req,res)
{
	let vendor_id = req.body.vendor_id;
	function firstDayOfMonth() {
        var d = new Date(Date.apply(null, arguments));
        d.setDate(1);
        return d.toISOString();
    }
    function lastDayOfMonth() {
        var d = new Date(Date.apply(null, arguments));
        d.setMonth(d.getMonth() + 1);
        d.setDate(0);
        return d.toISOString();
    }

    var now = Date.now();
    var startDayOfMonth = firstDayOfMonth(now);
    console.log("startdate",startDayOfMonth)
    var endDayOfMonth = lastDayOfMonth(now);
    console.log("enddate",endDayOfMonth)
    //Below line for getting the current week first day
    var currentDayOfweek = moment().day(0); // Sunday
    console.log("currentdat",currentDayOfweek)
    //Below line for getting the current week last day
    var lastDayOfweek = moment().day(6); // saturday
    console.log("lastdayeweek",lastDayOfweek)
    console.log("vendor id",vendor_id)
    async.parallel({
        one: function (parallelCb) {
            // get barber total sales of current month
           getTotalRevenueOnDates(vendor_id, startDayOfMonth, endDayOfMonth, function (err, result) {
                parallelCb(null, result)
                 console.log(">>>>>>>>>>>>>>>>1111111",result)
            });
        },
        two: function (parallelCb) {
            // get barber sale of current week
            getTotalRevenueOnWeek(vendor_id, currentDayOfweek, lastDayOfweek, function (err, result) {
                parallelCb(null, result)
                console.log(">>>>>>>>>>>>>>>>22222222",result)
            });
        }
    }, function (err, results) {
        // results will have the results of all 3
        console.log("total month sale", results.one);
        console.log("total week sale", results.two);
        res.status(200).send({
            msg: constantObj.messages.successRetreivingData,
            data: {
                monthSale: results.one,
                weekSale: results.two,

            }
        })
    });

}


var getTotalRevenueOnDates = function(vendor_id, startDate, endDate, cb) {
     var total=0;
	var total_revenew=0;
    var vendorId = mongoose.Types.ObjectId(vendor_id);
    console.log("vendor here",vendorId)
    var Startdate = new Date(moment(startDate, "YYYY-MM-DD").format("YYYY-MM-DD[T]HH:mm:ss.SSS") + 'Z');
    var Enddate = new Date(moment(endDate, "YYYY-MM-DD").add(1, 'day').format("YYYY-MM-DD[T]HH:mm:ss.SSS") + 'Z');
   console.log("startDate>>>>>>>>>>>>>>>>>",Startdate)
   console.log("enddate>>>>>>>>>>>>>>>>>>>",Enddate)
   var total=0;
	var total_revenew=0;
	console.log("insiode tottal")
	order.aggregate([
        
         {
		$lookup: {
			from: "items",
			localField: "item_id",
			foreignField: "_id",
			as: "items"
		}

	},{  
        $match: 
               { 
               	  $and: 
               	          
                              [{ vendor_id : vendorId }, 
                              {
                                  created_date: {
                                  $lte: Enddate,
                                  $gte: Startdate 
                                  }    
                              }   
                              ]
                          
                }
    }, {
		$unwind: "$items"
	}]).exec(function(err, result) {
    // console.log("here",result);
        if (err) {
            cb(err, null);
            
        } else{
	  		//console.log(orderdetails)
	  		for(var i=0;i<result.length;i++){
	  			var calculated_price=result[i].item_count*result[i].items.p_price
	  			total=parseFloat(total)+parseFloat(calculated_price);
	  			
	  		}
	  		console.log("total revenew is",total.toFixed(2))
	  		total_revenew=total.toFixed(2)

	  	}
    })
}


var getTotalRevenueOnWeek = function(vendor_id, currentDayOfweek, lastDayOfweek, cb) {
   var total=0;
	var total_revenew=0;
    var vendorId = mongoose.Types.ObjectId(vendor_id);
    console.log("vendor here",vendorId)
    var currentDayOfweek = new Date(moment(currentDayOfweek, "YYYY-MM-DD").format("YYYY-MM-DD[T]HH:mm:ss.SSS") + 'Z');
    var lastDayOfweek = new Date(moment(lastDayOfweek, "YYYY-MM-DD").add(1, 'day').format("YYYY-MM-DD[T]HH:mm:ss.SSS") + 'Z');
   console.log("currentDayOfweek>>>>>>>>>>>>>>>>>",currentDayOfweek)
   console.log("lastDayOfweek>>>>>>>>>>>>>>>>>>>",lastDayOfweek)
   order.aggregate([
         {
		$lookup: {
			from: "items",
			localField: "item_id",
			foreignField: "_id",
			as: "items"
		}

	},{  
        $match: 
               { 
               	  $and: 
               	          
                              [{ vendor_id : vendorId }, 
                              {
                                  created_date: {
                                  $lte: lastDayOfweek,
                                  $gte: currentDayOfweek 
                                  }    
                              }   
                              ]
                          
                }
    }, {
		$unwind: "$items"
	}]).exec(function(err, result) {
    // console.log("here",result);
        if (err) {
            cb(err, null);
            
        } else{
	  		//console.log(orderdetails)
	  		for(var i=0;i<result.length;i++){
	  			var calculated_price=result[i].item_count*result[i].items.p_price
	  			total=parseFloat(total)+parseFloat(calculated_price);
	  			
	  		}
	  		console.log("total revenewwwwwwwwwwwwwwww is",total.toFixed(2))
	  		total_revenew=total.toFixed(2)

	  	}
    })

}
