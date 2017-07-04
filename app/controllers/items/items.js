var itemsObj = require('./../../models/items/items.js');
var vendor = require('./../../models/admin/signup_vendor.js');
var userObj = require('./../../models/users/users.js');


var mongoose = require('mongoose');
var constantObj = require('./../../../constants.js');
var fs = require('fs');



exports.additems = function(req, res) {

	console.log("inside add items", req.body);
	var outputJSON = {
		'status': 'failure',
		'messageId': 203,
		'message': constantObj.messages.errorAddingItems
	};

	if (req.body.image != undefined) {
		reqdata = {};
		reqdata.image = req.body.image;
		reqdata.p_name = req.body.p_name;
		reqdata.vendor_id = req.body.vendor_id;
		reqdata.p_price = req.body.p_price;
		reqdata.p_description = req.body.p_description;
		reqdata.p_count = req.body.p_count;
		uploadSkillImg(reqdata, function(response) {
			vendor.find({
				_id: req.body.vendor_id
			}, function(err, vendetail) {
				if (err) {
					outputJSON = {
							'status': 'failure',
							'messageId': 400,
							'message': "vendor added successfully"
						},
						res.json(outputJSON);
				} else {
					console.log("vendetail", vendetail)
					if (vendetail == "") {

						outputJSON = {
								'status': 'failure',
								'messageId': 400,
								'message': "Vendor doesnot exists"
							},
							res.json(outputJSON);

					} else {
						itemsObj(reqdata).save(req.body, function(err, data) {
							if (err) {
								res.json("Error: " + err);
							} else {
								outputJSON = {
										'status': 'success',
										'messageId': 200,
										'message': "vendor added successfully",
										"data": data
									},
									res.json(outputJSON);
							}
						});
					}
				}
			})
		});
	}
}


/* ~~~~~~~~~~~~~UPloading image ~~~~~~~~~~~~~~~~~~~~~~~*/

uploadSkillImg = function(data, callback) {
	console.log("data", data)

	var photoname = Date.now() + ".png";
	var imageName = __dirname + "/../../../public/images/upload/" + photoname;


	if (data.image.indexOf("base64,") != -1) {

		var Data = data.image.split('base64,');

		var ext = Data[0].split('/');
		var format = ext[1].replace(';', '');

		var photoname = Date.now() + "." + format;
		var imageName = __dirname + "/../../../public/images/upload/" + photoname;


		var base64Data = Data[1];
		var base64Data = base64Data;


		// console.log("hgs",base64Data)
	} else {
		var base64Data = data.image.base64;
	}

	//console.log("asdasd",base64Data)
	if (base64Data != undefined) {

		fs.writeFile(imageName, base64Data, 'base64', function(err) {

			if (err) {
				console.log(err);
				callback("Failure Upload");


			} else {
				var updateField = {};

				updateField = {
					'image': photoname
				};



				var item = new itemsObj({

					image: photoname
				});
				item.save(function(err, data) {
					console.log(data)
					if (data) {
						//console.log(err);
						callback(data);
					}

				});


				// itemsObj.insert(updateField,{w: 1},function(err,res){
				// 	console.log(err);
				// 	if(err){
				// 		console.log(err);
				// 		callback("Success Uploaded");
				// 	}

				// });


			}
		});
		// }else{
		// 	callback("Image  is too large.");
		// }


	} else {
		callback("wrongFormat");
	}
	//console.log("main data ",base64Data);
	// var base64Data =data.image.base64; 



}


/**
 * a middleware controller to get all products
 */

exports.updateItem = function(req, res) {

	var outputJSON = {
		'status': 'failure',
		'messageId': 203,
		'message': constantObj.messages.errorUpdatingItems
	};
	itemsObj.update({
		_id: req.body.id
	}, {
		$set: {
			p_name: req.body.p_name,
			p_price: req.body.p_price,
			p_count: req.body.p_count,
			p_description :req.body.p_description
		}
	}, {
		multi: true
	}, function(err, data) {

		if (err) {
			res.json("Error: " + err);
		} else {
			console.log("in uppdate", data)
			var outputJSON = {
				'status': 'success',
				'messageId': 200,
				'message': constantObj.messages.successUpdatingItems,
				"data": data
			}

			res.json(outputJSON);
		}
	});



}
exports.removeItem = function(req, res) {
	var outputJSON = {
		'status': 'failure',
		'messageId': 203,
		'message': constantObj.messages.errorUpdatingItems
	};
	itemsObj.findOneAndRemove({
		_id: req.body._id
	}, function(err, data) {

		if (err) {
			res.json("Error: " + err);
		} else {
			if (data == null) {
				var outputJSON = {
					'status': 'failure',
					'messageId': 400,
					'message': "Invalid _id ,try again",
					"data": data
				}
				res.json(outputJSON);
			} else {
				var outputJSON = {
					'status': 'success',
					'messageId': 200,
					'message': "Removed successfully",
					"data": data
				}
				res.json(outputJSON);
			}

		}
	});



}


/**
 * a middleware controller to get all products
 */
exports.listItem = function(req, res) {
		var outputJSON = {
			'status': 'failure',
			'messageId': 203,
			'message': constantObj.messages.errorRetreivingData
		};

		itemsObj.find({}, function(err, data) {
			if (err) {
				res.json("Error: " + err);
			} else {
				outputJSON = {
						'status': 'success',
						'messageId': 200,
						'message': constantObj.messages.successRetreivingData,
						"data": data
					},
					res.json(outputJSON);
			}
		});



	}
	/*List items to be viewed on customer screen */
exports.customerListItem = function(req, res) {
	var outputJSON = {
		'status': 'failure',
		'messageId': 203,
		'message': constantObj.messages.errorRetreivingData
	};
	console.log("inside customerListItem");
	itemsObj.find({}, function(err, data) {
		if (err) {
			res.json("Error: " + err);
		} else {
			outputJSON = {
					'status': 'success',
					'messageId': 200,
					'message': constantObj.messages.successRetreivingData,
					"data": data
				},
				res.json(outputJSON);
		}
	});



}

exports.item_listing_for_user = function(req, res) {
	console.log("body", req.body)
	if (req.body != null) {
		console.log("inside")
			/*var  details =[req.body.latitute,req.body.longitude]
	console.log("details",details)
	 	
	 	vendor.find({'geo': {$near: details,$maxDistance: .6411}},function(err,places){
	 		if(err){
	 			console.log("err",err)
	 		}
	 		else{
	 			console.log("places",places)
	 		}
	 	})

	 	}
*/
		vendor.aggregate([{
			$geoNear: {
				near: {
						type: "Point",
						coordinates: [req.body.latitute, req.body.longitude]
					},
				distanceField: "dist.calculated",
				maxDistance: 250000,
				includeLocs: "dist.location",
				spherical: true
			}
		}, {
			$lookup: {
				from: "items",
				localField: "_id",
				foreignField: "vendor_id",
				as: "item_detail"
			}
		}], function(err, items) {
			//console.log("sdrgrsdfr", err)
			if (err) {
				console.log("err",err)
				outputJSON = {
						'status': 'failure',
						'messageId': 400,
						'message': constantObj.messages.errorRetreivingData
					},
					res.json(outputJSON);
			} else {
				console.log("item_detail", items)
				outputJSON = {
						'status': 'success',
						'messageId': 200,
						'message': constantObj.messages.successRetreivingData,
						'data': items
					},
					res.json(outputJSON);
			}
		})

	} else {
		outputJSON = {
				'status': 'failure',
				'messageId': 400,
				'message': "Required latitude and longitute"
			},
			res.json(outputJSON);
	}


}