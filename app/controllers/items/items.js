var itemsObj = require('./../../models/items/items.js');
var vendor = require('./../../models/admin/signup_vendor.js');
var userObj = require('./../../models/users/users.js');


var mongoose = require('mongoose');
var constantObj = require('./../../../constants.js');
var fs = require('fs');


 /*Add item along with the valid vendor ID*/

 /**
 * Find role by _id
 * Input: Item details
 * Output: item added in json object
 * This function adds a new item corresponding to valid vendor_id  
 * It uses load function which has been define in role model after that passes control to next calling function.
 */
exports.additems = function(req, res) {
	var outputJSON = {
		'status': 'failure',
		'messageId': 400,
		'message': constantObj.messages.errorAddingItems
	};
	if (req.body.image != "") {
		var reqdata = {};
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
					console.log(err)
					outputJSON = {
							'status': 'failure',
							'messageId': 400,
							'message': "error in vendor_id"
						},
						res.json(outputJSON);
				} else {
					if (vendetail == "") {
						outputJSON = {
								'status': 'failure',
								'messageId': 400,
								'message': "Vendor doesnot exists"
							},
							res.json(outputJSON);
					} else {
						itemsObj.update({
							_id: response._id
						}, {
							$set: {
								p_name: req.body.p_name,
								vendor_id: req.body.vendor_id,
								p_price: req.body.p_price,
								p_description: req.body.p_description,
								p_count: req.body.p_count
							}
						}, {
							multi: true
						}, function(err, data) {
							if (err) {
								res.json("Error: " + err);
							} else {
								outputJSON = {
										'status': 'success',
										'messageId': 200,
										'message': "item added successfully",
										"data": data
									},
									res.json(outputJSON);
							}
						});
					}
				}
			})
		});
	} else {
		console.log("without image")
		var reqdata = {};
		reqdata.p_name = req.body.p_name;
		reqdata.vendor_id = req.body.vendor_id;
		reqdata.p_price = req.body.p_price;
		reqdata.p_description = req.body.p_description;
		reqdata.p_count = req.body.p_count;
		reqdata.image = req.body.image;
		vendor.find({
			_id: req.body.vendor_id
		}, function(err, vendetail) {
			if (err) {
				console.log(err)
				outputJSON = {
						'status': 'failure',
						'messageId': 400,
						'message': "error in vendor_id"
					},
					res.json(outputJSON);
			} else {
				if (vendetail == "") {
					outputJSON = {
							'status': 'failure',
							'messageId': 400,
							'message': "Vendor doesnot exists"
						},
						res.json(outputJSON);
				} else {
					itemsObj(reqdata).save(reqdata, function(err, vendors) {
						if (err) {
							outputJSON = {
								'status': 'failure',
								'messageId': 400,
								'message': "Err"
							}
							res.json(outputJSON);
						} else {
							outputJSON = {
									'status': 'success',
									'messageId': 200,
									'message': "item added successfully",
									"data": vendors
								},
								res.json(outputJSON);
						}
					})
				}
			}
		})
	}
}

/* ~~~~~~~~~~~~~UPloading image ~~~~~~~~~~~~~~~~~~~~~~~*/

uploadSkillImg= function(data,callback){
		      var photoname = Date.now() + ".png";
		      var imageName = __dirname+"/../../../public/images/upload/"+photoname;
	      
		     if(data.image.indexOf("base64,")!=-1){	
		         var Data = data.image.split('base64,'); 
		         var ext=Data[0].split('/');		          
		         var format= ext[1].replace(';','');        
		         var photoname = Date.now() + "."+format;
		         var imageName = __dirname+"/../../../public/images/upload/"+photoname;
		         var base64Data = Data[1];
		         var base64Data = base64Data;     
		     }else{
		     	var base64Data = data.image.base64;
		     }
		     if(base64Data!=undefined){
		     	 fs.writeFile(imageName, base64Data, 'base64', function(err) {
				        if (err) {
				         callback("Failure Upload");
				        }else{
				         var updateField={};
						 updateField={'image':photoname};	  
                       	 var item=new itemsObj({
					     image:photoname
				   		});
                 item.save(function(err,data){
					if(data) {
					callback(data);
					}
				 });  
				        }
				      });
		     }else{
		     	callback("wrongFormat");
		     }			       
}

 /**
 * Find role by _id
 * Input: Item details to be upadted
 * Output: item  json object
 * This function updates the item details corresponding to valid _id (item id).
   This function is divided into 2 parts,
   a) Update without image
   b) Update with image 
 * Devepoped by: 
 */ 

exports.updateItem = function(req, res) {
	var reqdata = {};

	var outputJSON = {
		'status': 'failure',
		'messageId': 203,
		'message': constantObj.messages.errorUpdatingItems
	};
	reqdata = {};
	reqdata.id = req.body.id;
	reqdata.image = req.body.image;
	reqdata.p_name = req.body.p_name;
	reqdata.p_price = req.body.p_price;
	reqdata.p_description = req.body.p_description;
	reqdata.p_count = req.body.p_count;
	itemsObj.find({
		_id: req.body.id
	}, function(err, itemdetail) {
		if (err) {
			console.log(err)
			outputJSON = {
					'status': 'failure',
					'messageId': 400,
					'message': "error"
				},
				res.json(outputJSON);
		} else {
			if (itemdetail.length > 0) {
				if (req.body.image != "") {
					var photoname = Date.now() + ".png";
					var imageName = __dirname + "/../../../public/images/upload/" + photoname;
					if (reqdata.image.indexOf("base64,") != -1) {
						var Data = reqdata.image.split('base64,');
						var ext = Data[0].split('/');
						var format = ext[1].replace(';', '');
						var photoname = Date.now() + "." + format;
						var imageName = __dirname + "/../../../public/images/upload/" + photoname;
						var base64Data = Data[1];
						var base64Data = base64Data;
					} else {
						var base64Data = reqdata.image.base64;
					}
					if (base64Data != undefined) {
						fs.writeFile(imageName, base64Data, 'base64', function(err) {
							if (err) {
								outputJSON = {
										'status': 'failure',
										'messageId': 400,
										'message': "Failure upload"
									},
									res.json(outputJSON);
							} else {
								itemsObj.update({
									_id: reqdata.id
								}, {
									$set: {
										image: photoname,
										p_name: req.body.p_name,
										p_price: req.body.p_price,
										p_description: req.body.p_description,
										p_count: req.body.p_count
									}
								}, function(err, data) {

									if (err) {
										console.log("err", err)
										outputJSON = {
												'status': 'failure',
												'messageId': 400,
												'message': "Wrong id"
											},
											res.json(outputJSON);
									} else {

										outputJSON = {
												'status': 'success',
												'messageId': 200,
												'message': "updated successfully",
												data: data
											},
											res.json(outputJSON);
									}
								});
							}
						}); //file write
					} else {
						outputJSON = {
								'status': 'failure',
								'messageId': 400,
								'message': "Wrong format"
							},
							res.json(outputJSON);
					}
				} else {
					itemsObj.update({
						_id: req.body.id
					}, {
						$set: {
							p_name: req.body.p_name,
							p_price: req.body.p_price,
							p_description: req.body.p_description,
							p_count: req.body.p_count
						}
					}, {
						multi: true
					}, function(err, data) {
						if (err) {
							outputJSON = {
									'status': 'failure',
									'messageId': 400,
									'message': "Error"
								},
								res.json(outputJSON)
						} else {
							outputJSON = {
									'status': 'success',
									'messageId': 200,
									'message': "updates successfully",
									data: data
								},
								res.json(outputJSON);
						}
					})
				}
			} else {
				console.log("id soestnt exists", itemdetail) // item detail != null
				outputJSON = {
						'status': 'failure',
						'messageId': 400,
						'message': "Id does not exist"
					},
					res.json(outputJSON);
			}
		}
	})
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
	var available_items=[];
	if (req.body != null) {
		var lat=req.body.latitude;
		var long=req.body.longitude;
		vendor.aggregate([
		{
			$geoNear: {
				near: {
						type: "Point",
						coordinates: [lat,long]
					},
				distanceField: "dist.calculated",
				maxDistance: 25000,
				includeLocs: "dist.location",
				spherical: true
			}
		},{
			$lookup: {
				from: "items",
				localField: "_id",
				foreignField: "vendor_id",
				as: "item_detail"
			}
		}/*,{
			$unwind:"$item_detail"
		},

		{
			$match:{"item_detail.p_count":{$gt:0}}
		}*/], function(err, items) {
			if (err) {
				console.log("err",err)
				outputJSON = {
						'status': 'failure',
						'messageId': 400,
						'message': constantObj.messages.errorRetreivingData
					},
					res.json(outputJSON);
			} else {
				console.log("items",items)
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
