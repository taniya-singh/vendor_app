var userObj = require('./../../models/users/users.js');
var vendor = require('./../../models/vendordetails/vendordetails.js');
var order = require('./../../models/order/order.js');
var itemsObj = require('./../../models/items/items.js');
var addtocart = require('./../../models/order/addtocart.js');

exports.place_order = function(req, res) {
	console.log("order")
	if (req.body) {
		itemsObj.find({
			_id: req.body.item_id,
			is_deleted: false
		}, function(err, item) {
			if (err) {
				console.log("err", err)
				outputJSON = {
					'status': 'failure',
					'messageId': 400,
					'message': "Err"
				};
				res.jsonp(outputJSON)
			} else {
				if (item == null) {

				} else {
					console.log("item", item)
					var vendorid = item[0].vendor_id;
					var orderdetail = {};
					orderdetail.customer_id = req.body.customer_id;
					orderdetail.item_id = req.body.item_id;
					orderdetail.vendor_id = vendorid;
					order(orderdetail).save(orderdetail, function(err, orders) {
						if (err) {
							res.jsonp(err);
						} else {
							outputJSON = {
								'status': 'success',
								'messageId': 200,
								'message': "Order placed successfully",
								data: orders
							};
							res.jsonp(outputJSON);
						}
					})
				}
			}

		})

	}
}

exports.list_order_for_customer = function(req, res) {
	console.log("insideeeeeeee")
	order.find({
		customer_id: req.body._id
	}, function(err, orderlist) {
		if (err) {
			outputJSON = {
				'status': 'failure',
				'messageId': 400,
				'message': "Err"
			};
			res.jsonp(outputJSON);

		} else {
			if (orderlist == "") {
				outputJSON = {
					'status': 'success',
					'messageId': 200,
					'message': "you have not placed any order yet"
				};
				res.jsonp(outputJSON);

			} else {
				for (var i = 0; i < 6; i++) {
					console.log("orderlist", orderlist[i].item_id)

				}
				outputJSON = {
					'status': 'success',
					'messageId': 200,
					'message': "Order retreived successfully",
					data: orderlist
				};
				res.jsonp(outputJSON);
			}
		}
	})
}



exports.add_to_cart = function(req, res) {
	var vendorid;
	var items = [];
	try {
		if (req.body) {
			itemsObj.find({
				_id: req.body.item_id,
				is_deleted: false
			}, function(err, itemdetails) {
				if (err) {

				} else {
					vendorid = itemdetails[0].vendor_id

					if (itemdetails == "") {

					} else {
						addtocart.find({
							customer_id: req.body.customer_id
						}, function(err, exists) {
							if (err) {
								outputJSON = {
									'status': 'failure',
									'messageId': 400,
									'message': err
								};
								res.jsonp(outputJSON);

							} else {
								if (exists != "") {
									var cartdata = {};
									var value = {};
									value.item_id = req.body.item_id;
									value.vendor_id = vendorid;
									value.item_count = req.body.item_count;
									items.push(value);
									cartdata.items = items;
									addtocart.update({
										customer_id: req.body.customer_id
									}, {
										$addToSet: {
											items: {
												$each: items
											}
										}
									}, function(err, additems) {
										console.log("inside add data")
										if (err) {
											outputJSON = {
												'status': 'failure',
												'messageId': 400,
												'message': err
											};
											res.jsonp(outputJSON);
										} else {
											outputJSON = {
												'status': 'success',
												'messageId': 200,
												'message': "items added",
												data: additems
											};
											res.jsonp(outputJSON);
										}
									})

								} else {
									var cartdata = {};
									var value = {};
									value.item_id = req.body.item_id;
									value.vendor_id = vendorid;
									value.item_count = req.body.item_count;
									items.push(value);
									cartdata.customer_id = req.body.customer_id;
									cartdata.items = items
									last_updated = Date.now;
									addtocart(cartdata).save(cartdata, function(err, createcart) {
										if (err) {
											outputJSON = {
												'status': 'failure',
												'messageId': 400,
												'message': err
											};
											res.jsonp(outputJSON);
										} else {
											outputJSON = {
												'status': 'success',
												'messageId': 200,
												'message': "Added to cart successfully",
												data: createcart
											};
											res.jsonp(outputJSON);
										}
									})
								}
							}
						})
					}
				}
			})
		}
	} catch (e) {
		console.log("error:", e)
	}

}
exports.view_cart_details=function(req,res){
	try{
		addtocart.find({customer_id:req.body.customer_id},function(err,viewcartdetails){
			if(err){

			}else{
				if(viewcartdetails=="")
				{
					outputJSON = {
							'status': 'success',
							'messageId': 200,
							'message': "Nothing is Added to cart",
							};
				res.jsonp(outputJSON);

				}else{
				outputJSON = {
							'status': 'success',
							'messageId': 200,
							'message': "Retreived successfully",
							data: viewcartdetails
							};
				res.jsonp(outputJSON);
				}
			}

		})

	}
	catch(e){
		console.log("error is",e)
	}
}
exports.update_pickup_status=function(req,res){
	console.log("insode");
	if(req.body.order_id){
		order.update({_id:req.body.order_id},{$set:{status:"Picked Up"}},function(err,update){
			if(err){
				outputJSON = {
							'status': 'success',
							'messageId': 200,
							'message': "Err",
						
							};
				res.jsonp(outputJSON);

			}else{
				outputJSON = {
							'status': 'success',
							'messageId': 200,
							'message': "Updated successfully",
							data: update
							};
				res.jsonp(outputJSON);
			}
		})
	}
}

exports.total_sales=function(req,res){
	console.log("AAAAA")
}
