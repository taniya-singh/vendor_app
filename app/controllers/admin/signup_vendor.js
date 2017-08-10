var vendor = require('./../../models/admin/signup_vendor.js');
var items = require('./../../models/items/items.js');
var mongoose = require('mongoose');
var device = require('./../../models/devices/devices.js')
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
									createStripeAccount(req, res, userDetails, bankdetails, vdetails, function(err, create_stripe_response) {
										if (err) {
											outputJSON = {
												'status': 'Failure',
												'messageId': 400,
												'message': " vendor not addes "
											};
										} else {
											outputJSON = {
												'status': 'success',
												'messageId': 200,
												'message': "Vendor successful added ",
												"data": vendetails
											};
											res.jsonp(outputJSON);
										}
									});
								}

							});
						} //if address details not found
						else {
							outputJSON = {
								'status': 'Failure',
								'messageId': 400,
								'message': " vendor not addes "
							};
							res.jsonp(outputJSON);
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


var createStripeAccount = function(req, res, userDetails, bankdetails, vdetails, cbb) {
	stripe.accounts.create({
		type: 'custom',
		country: 'US',
		email: userDetails.email
	}, function(err, account) {
		if (err) {
			cbb(err, {
				"message": "Err"
			})
		} else {
			stripe_account_details = account
			console.log("customer created on stripe is", account.id)
			createExtraAccount(req, res, bankdetails, stripe_account_details, vdetails, function(err, accountresponse) {
				if (err) {

				} else {
					cbb(null, account)
				}
			})
		}
	});

}

/* Create extra account to add bank details corresponding to vendor*/

var createExtraAccount = function(req, res, bankdetails, stripe_account_details, vdetails, cb) {
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
			cb(null, {
				"message": "Err"
			})
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
							cb(null, {
								"message": "Err"
							})
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
									cb(err, {
										"message": "User connected_account_status is not updated, but bank info has done."
									})
								} else {
									console.log("updatevendor", updatevendor)
									cb(null, bank_account)

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
		var vendorid = res.req.user.id
		var device_data = {};
		device_data.device_type = req.body.device_type;
		device_data.device_token = req.body.device_token;
		device_data.vendor_id = res.req.user.id;
		device.find({
			vendor_id: vendorid
		}, function(err, devicedetails) {
			if (err) {
				console.log("err", err)

			} else {
				if (devicedetails.length > 0) {
					device.update({
						vendor_id: vendorid
					}, {
						$set: device_data
					}, function(err, deviceupdate) {
						if (err) {
							var outputJSON = {
								'status': 'failure',
								'messageId': 400,
								'message': "Err"
							};
							res.jsonp(outputJSON)

						} else {
							data.device_token = req.body.device_token;
							data.device_type = req.body.device_type;
							var outputJSON = {
								'status': 'success',
								'messageId': 200,
								'message': "login successfully",
								'data': data
							};
							res.jsonp(outputJSON)
						}
					})

				} else {
					console.log("insode save new")
					device(device_data).save(device_data, function(err, deviceadd) {
						if (err) {
							var outputJSON = {
								'status': 'failure',
								'messageId': 400,
								'message': "Err"
							};
							res.jsonp(outputJSON)
						} else {
							data.device_token = req.body.device_token;
							data.device_type = req.body.device_type;
							var outputJSON = {
								'status': 'success',
								'messageId': 200,
								'message': "login successfully",
								'data': data
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
		vendor.find(query).exec(function(err, data) {
			if (err) {
				res.json("Error: " + err);
			} else {
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



exports.updateVendorInformation = function(req, res) {
	console.log("daada", req.body);
	console.log(req.files);
	var _id = req.body._id;
	var details = {};
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


exports.totalSales = function(req, res) {
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



exports.saleData = function(req, res) {
	// console.log("here in controller>>>>>>>>>>")
	var vendor_id = req.body.vendor_id;

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
	var endDayOfMonth = lastDayOfMonth(now);
		var currentDayOfweek = moment().day(0); // Sunday
	var lastDayOfweek = moment().day(6); // saturday
	async.parallel({
		monthsale: function(parallelCb) {
			getTotalSaleOnDates(vendor_id, startDayOfMonth, endDayOfMonth, function(err, result) {
				parallelCb(null, result)
			});
		},
		weeksale: function(parallelCb) {
			getTotalSaleOnWeek(vendor_id, currentDayOfweek, lastDayOfweek, function(err, result) {
				parallelCb(null, result)
			});
		},
		monthrevenue: function(parallelCb) {
			getTotalRevenueOnDates(vendor_id, startDayOfMonth, endDayOfMonth, function(err, result) {
				parallelCb(null, result)
			});
		},
		weekrevenue: function(parallelCb) {
			getTotalRevenueOnWeek(vendor_id, currentDayOfweek, lastDayOfweek, function(err, result) {
				parallelCb(null, result)
				// console.log(">>>>>>>>>>>>>>>>22222222", result)
			});
		}
	}, function(err, result) {
		if (err) {
			outputJSON = {
				'status': 'failure',
				'messageId': 203,
				'message': constantObj.messages.errorRetreivingData
			};
		} else {

			// console.log("monthrev", JSON.stringify(result.monthrevenue))
			// console.log("weekrev", JSON.stringify(result.weekrevenue));
			// console.log("monthsale", JSON.stringify(result.monthsale))
			// console.log("weeksale", JSON.stringify(result.weeksale));

			let resultArray1 = [];
			let resultArray2 = [];
			for (var i = 0; i < result.monthsale.length; i++) {
				let k = 0;
				for (var j = 0; j < result.weeksale.length; j++) {
					// console.log(result.monthsale[i].vendor_details[0]._id,result.weeksale[j].vendor_details[0]._id)
					if (result.monthsale[i].vendor_details[0]._id.equals(result.weeksale[j].vendor_details[0]._id)) {
						// console.log("inside")
						let obj = {
							_id: result.monthsale[i].vendor_details[0]._id,
							name: result.monthsale[i].vendor_details[0].vendor_name,
							monthsale: result.monthsale[i].tot_sales,
							weeksale:result.weeksale[j].tot_sales
						}
						resultArray1.push(obj)
						k=1;
					}
				}
				if(k==0){
					let obj = {
							_id: result.monthsale[i].vendor_details[0]._id,
							name: result.monthsale[i].vendor_details[0].vendor_name,
							monthsale: result.monthsale[i].tot_sales
						}
						resultArray1.push(obj)
				}
			}

			// console.log()

			for (var m = 0; m < result.monthrevenue.length; m++) {
				let r = 0;
				for (var n = 0; n < result.weekrevenue.length; n++) {
					// console.log(result.monthsale[i].vendor_details[0]._id,result.weeksale[j].vendor_details[0]._id)
					if (result.monthrevenue[m].vendor_details[0]._id.equals(result.weekrevenue[n].vendor_details[0]._id)) {
						// console.log("inside")
						let obj = {
							_id: result.monthrevenue[m].vendor_details[0]._id,
							name: result.monthrevenue[m].vendor_details[0].vendor_name,
							monthrevenue: result.monthrevenue[m].rev,
							weekrevenue:result.weekrevenue[n].rev
						}
						resultArray2.push(obj)
						r=1;
					}
				}
				if(r==0){
					let obj = {
							_id: result.monthrevenue[m].vendor_details[0]._id,
							name: result.monthrevenue[m].vendor_details[0].vendor_name,
							monthrevenue: result.monthrevenue[m].rev
						}
						resultArray2.push(obj)
				}
			}

			for(var p=0;p<resultArray1.length;p++){
	  			for(var q=0;q<resultArray2.length;q++)
	  			{
	  				resultArray1[q].monthrevenue = resultArray2[q].monthrevenue;
	  				resultArray1[q].weekrevenue = resultArray2[q].weekrevenue;
	  			}
	  	
	  		}

				// var new_array = old_array.concat(value1[, value2[, ...[, valueN]]])

			console.log("resultArray1",JSON.stringify(resultArray1));
			// console.log("resultArray2",JSON.stringify(resultArray2));
			outputJSON = {
				'status': 'success',
				'messageId': 200,
				'message': constantObj.messages.successRetreivingData,
				"data" : resultArray1
			}
			res.jsonp(outputJSON);
		}
		
	});
}


var getTotalSaleOnDates = function(vendor_id, startDate, endDate, cb) {
	var vendorId = mongoose.Types.ObjectId(vendor_id);
	// console.log("vendor here",vendorId)
	var Startdate = new Date(moment(startDate, "YYYY-MM-DD").format("YYYY-MM-DD[T]HH:mm:ss.SSS") + 'Z');
	var Enddate = new Date(moment(endDate, "YYYY-MM-DD").add(1, 'day').format("YYYY-MM-DD[T]HH:mm:ss.SSS") + 'Z');
	// console.log("startDate>>>>>>>>>>>>>>>>>",Startdate)
	// console.log("enddate>>>>>>>>>>>>>>>>>>>",Enddate)
	order.aggregate([{
		$match:{
			status:"Picked Up"
		       }
	  },{
		$match: {
			created_date: {
				$lte: Enddate,
				$gte: Startdate
			}
		}
	}, {
		$lookup: {
			from: "items",
			localField: "item_id",
			foreignField: "_id",
			as: "item_detail"
		}
	}, {
		$lookup: {
			from: "vendor_details",
			localField: "vendor_id",
			foreignField: "_id",
			as: "vendorDetail"
		}
	}, {
		$unwind: "$vendorDetail"
	}, {
		$unwind: "$item_detail"
	}, {
		$group: {
			"_id": "$vendor_id",
			"tot_sales": {
				$sum: "$item_count"
			},
			"vendor_details": {
				$push: "$vendorDetail"
			},
			"item_detail": {
				$push: "$item_detail"
			}
		}
	}]).exec(function(err, result) {
		if (err) {
			cb(err, null);

		} else {
			cb(null, result)
				// console.log("database",result)
		}
	})
}


var getTotalSaleOnWeek = function(vendor_id, currentDayOfweek, lastDayOfweek, cb) {
	var vendorId = mongoose.Types.ObjectId(vendor_id);
	// console.log("vendor here",vendorId)
	var currentDayOfweek = new Date(moment(currentDayOfweek, "YYYY-MM-DD").format("YYYY-MM-DD[T]HH:mm:ss.SSS") + 'Z');
	var lastDayOfweek = new Date(moment(lastDayOfweek, "YYYY-MM-DD").add(1, 'day').format("YYYY-MM-DD[T]HH:mm:ss.SSS") + 'Z');
	// console.log("currentDayOfweek>>>>>>>>>>>>>>>>>",currentDayOfweek)
	// console.log("lastDayOfweek>>>>>>>>>>>>>>>>>>>",lastDayOfweek)
	order.aggregate([{
		$match: {
			created_date: {
				$lte: lastDayOfweek,
				$gte: currentDayOfweek
			}
		}
	}, {
		$lookup: {
			from: "items",
			localField: "item_id",
			foreignField: "_id",
			as: "item_detail"
		}
	}, {
		$lookup: {
			from: "vendor_details",
			localField: "vendor_id",
			foreignField: "_id",
			as: "vendorDetail"
		}
	}, {
		$unwind: "$vendorDetail"
	}, {
		$unwind: "$item_detail"
	}, {
		$group: {
			"_id": "$vendor_id",
			"tot_sales": {
				$sum: "$item_count"
			},
			"vendor_details": {
				$push: "$vendorDetail"
			},
			"item_detail": {
				$push: "$item_detail"
			}
		}
	}]).exec(function(err, result) {
		// console.log("here",result);
		if (err) {
			cb(err, null);

		} else {
			cb(null, result)
				// console.log("database",result)
		}
	})
}

var getTotalRevenueOnDates = function(vendor_id, startDate, endDate, cb) {
	console.log("here")
		var total = 0;
	var total_revenew=0;
    var vendorId = mongoose.Types.ObjectId(vendor_id);
    // console.log("vendor here",vendorId)
    var Startdate = new Date(moment(startDate, "YYYY-MM-DD").format("YYYY-MM-DD[T]HH:mm:ss.SSS") + 'Z');
    var Enddate = new Date(moment(endDate, "YYYY-MM-DD").add(1, 'day').format("YYYY-MM-DD[T]HH:mm:ss.SSS") + 'Z');
 		order.aggregate([{
		$match: {
			created_date: {
				$lte: Enddate,
				$gte: Startdate
			}
		}
	}, {
		$lookup: {
			from: "items",
			localField: "item_id",
			foreignField: "_id",
			as: "item_detail"
		}
	}, {
		$lookup: {
			from: "vendor_details",
			localField: "vendor_id",
			foreignField: "_id",
			as: "vendorDetail"
		}
	}, {
		$unwind: "$vendorDetail"
	}, {
		$unwind: "$item_detail"
	}, {
		$group: {
			"_id": "$vendor_id",
			"tot_sales": {
				$sum: "$item_count"
			},
			"vendor_details": {
				$push: "$vendorDetail"
			},
			"item_detail": {
				$push: "$item_detail"
			}
		}
	}]).exec(function(err, result) {
		let resultArray = [];
    // console.log("here",result);
        if (err) {
            cb(err, null);
            
        } else{
	  		console.log("result database",result)
	  		if (result[i].item_detail.length > 0) {
							for (var j = 0; j < result[i].item_detail.length; j++){
									var calculated_price = result[i].item_count[j] * result[i].item_detail[j].p_price;
									total = parseFloat(total) + parseFloat(calculated_price);
								}

								resultArray.push(total.toFixed(2))

	  			}

	  		console.log("total revenew is",resultArray)
	  		total_revenew=total.toFixed(2)
	  		for(var i=0;i<result.length;i++){
	  			for(var j=0;j<resultArray.length;j++)
	  			{
	  				result[j].rev = resultArray[j];
	  			}
	  	
	  		}
	  		console.log("final data",result)
	  		cb(null, result)

	  	}
    })
}


var getTotalRevenueOnWeek = function(vendor_id, currentDayOfweek, lastDayOfweek, cb) {
   var total=0;
	var total_revenew=0;
    var vendorId = mongoose.Types.ObjectId(vendor_id);
    // console.log("vendor here",vendorId)
    var currentDayOfweek = new Date(moment(currentDayOfweek, "YYYY-MM-DD").format("YYYY-MM-DD[T]HH:mm:ss.SSS") + 'Z');
    var lastDayOfweek = new Date(moment(lastDayOfweek, "YYYY-MM-DD").add(1, 'day').format("YYYY-MM-DD[T]HH:mm:ss.SSS") + 'Z');
   // console.log("currentDayOfweek>>>>>>>>>>>>>>>>>",currentDayOfweek)
   // console.log("lastDayOfweek>>>>>>>>>>>>>>>>>>>",lastDayOfweek)
   order.aggregate([{
		$match: {
			created_date: {
				$lte: lastDayOfweek,
				$gte: currentDayOfweek
			}
		}
	}, {
		$lookup: {
			from: "items",
			localField: "item_id",
			foreignField: "_id",
			as: "item_detail"
		}
	}, {
		$lookup: {
			from: "vendor_details",
			localField: "vendor_id",
			foreignField: "_id",
			as: "vendorDetail"
		}
	}, {
		$unwind: "$vendorDetail"
	}, {
		$unwind: "$item_detail"
	}, {
		$group: {
			"_id": "$vendor_id",
			"item_count":{$push:"$item_count"},
			"tot_sales": {
				$sum: "$item_count"
			},
			"vendor_details": {
				$push: "$vendorDetail"
			},
			"item_detail": {
				$push: "$item_detail"
			}
		}
	}]).exec(function(err, result) {
		let resultArray = [];
    // console.log("here",result);
        if (err) {
            cb(err, null);
            
        } else{
					//console.log("res",result.length)
					for (var i = 0; i<result.length; i++) {

						//console.log("result["+i+"].tot_sales",result[i].item_count[1])
						if (result[i].item_detail.length > 0) {
							for (var j = 0; j < result[i].item_detail.length; j++){
									var calculated_price = result[i].item_count[j] * result[i].item_detail[j].p_price;
									total = parseFloat(total) + parseFloat(calculated_price);
								}

								resultArray.push(total.toFixed(2))

	  			}
	  	
	  		}
	  		console.log("final data to weekly revenue",total)
	  		total_revenew=total.toFixed(2)
	  		cb(null, result)
	  	}
    })

}



		exports.add_device_info = function(req, res) {
			console.log("insode")
			if (req.body.device_token && req.body.device_type) {
				var deviceinfo = {};
				deviceinfo.device_token = req.body.device_token;
				deviceinfo.device_type = req.body.device_type;
				device.find({
					vendor_id: req.body.vendor_id
				}, function(err, vendorinfo) {
					if (err) {
						outputJSON = {
							'status': 'failure',
							'messageId': 400,
							'message': "err"
						}
						res.jsonp(outputJSON);
					} else {
						console.log("vendorinfo", vendorinfo)
						if (vendorinfo.length > 0) {
							console.log("insode update")
							device.update({
								vendor_id: req.body.vendor_id
							}, {
								$set: {
									device_token: req.body.device_token,
									device_type: req.body.device_type
								}
							}, function(err, deviceupdated) {
								if (err) {
									outputJSON = {
										'status': 'failure',
										'messageId': 400,
										'message': "err"
									}
									res.jsonp(outputJSON);
								} else {
									outputJSON = {
										'status': 'success',
										'messageId': 200,
										'message': "Device Info added successfully",
										'data': deviceupdated
									}
									res.jsonp(outputJSON);
								}
							})
						} else {
							console.log("save")
							device(deviceinfo).save(deviceinfo, function(err, savedevice) {
								if (err) {
									outputJSON = {
										'status': 'failure',
										'messageId': 400,
										'message': "err"
									}
									res.jsonp(outputJSON);
								} else {
									console.log("savedevice", savedevice)
									outputJSON = {
										'status': 'success',
										'messageId': 200,
										'message': "Device Info added successfully",
										'data': savedevice
									}
									res.jsonp(outputJSON);
								}
							})
						}
					}

				})
			} else {
				outputJSON = {
					'status': 'Failure',
					'messageId': 400,
					'message': "Please enter device details properly"
				}
				res.jsonp(outputJSON);
			}
		}
