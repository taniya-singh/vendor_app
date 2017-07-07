var itemsObj = require('./../../models/items/items.js');
var vendor = require('./../../models/admin/signup_vendor.js');
var userObj = require('./../../models/users/users.js');


var mongoose = require('mongoose');
var constantObj = require('./../../../constants.js');
var fs = require('fs');


 /*Add item along with the valid vendor ID*/
exports.additems = function(req,res){
      var outputJSON = {'status':'failure', 'messageId':400, 'message': constantObj.messages.errorAddingItems};
	 if (req.body.image != undefined){	
					reqdata={};
					reqdata.image=req.body.image;
					reqdata.p_name=req.body.p_name;
					reqdata.vendor_id=req.body.vendor_id;
					reqdata.p_price=req.body.p_price;
					reqdata.p_description=req.body.p_description;
					reqdata.p_count=req.body.p_count;
					uploadSkillImg(reqdata,function(response){
						vendor.find({_id:req.body.vendor_id},function(err,vendetail){
							if(err){
								console.log(err)
					 			outputJSON = {'status':'failure', 'messageId':400, 'message':"error in vendor_id"}, 
					 			res.json(outputJSON);
							}else
							{
								if(vendetail==""){
									outputJSON = {'status':'failure', 'messageId':400, 'message': "Vendor doesnot exists"}, 
					 				res.json(outputJSON);	
								}else{
									itemsObj.update({_id :response._id},{$set:{p_name:req.body.p_name,vendor_id:req.body.vendor_id,p_price:req.body.p_price,p_description:req.body.p_description,p_count:req.body.p_count}},{multi:true},function(err,data){
										if(err){
											res.json("Error: "+err);
										}
										else{
					 						outputJSON = {'status':'success', 'messageId':200, 'message':"item added successfully", "data":data }, 
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

uploadSkillImg= function(data,callback){
	console.log("inside function image");
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
					console.log("***********",data)
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
 * a middleware controller to get all products
 */

exports.updateItem = function(req, res) {
	var reqdata={};

	var outputJSON = {
		'status': 'failure',
		'messageId': 203,
		'message': constantObj.messages.errorUpdatingItems
	};
	console.log("insiodeee")	
					reqdata={};
					reqdata.image=req.body.image;
					reqdata.p_name=req.body.p_name;
					reqdata.p_price=req.body.p_price;
					reqdata.p_description=req.body.p_description;
					reqdata.p_count=req.body.p_count;
					console.log("sdrgsr",reqdata)
						itemsObj.find({_id:req.body.id},function(err,itemdetail){
							if(err){
								console.log(err)
					 			outputJSON = {'status':'failure', 'messageId':400, 'message':"error"}, 
					 			res.json(outputJSON);
							}else
							{
								console.log("itemdetail",itemdetail)
								if(itemdetail.length!=null)
								{
									console.log("ander aa")
									if(req.body.image != undefined){

									}else{
										console.log("sssss",req.body._id);
									itemsObj.update({_id :req.body._id},{$set:{p_name:req.body.p_name,vendor_id:req.body.vendor_id,p_price:req.body.p_price,p_description:req.body.p_description,p_count:req.body.p_count}},{multi:true},function(err,data){
										if(err){
											res.json(err)

										}else{
											outputJSON = {'status':'success', 'messageId':200, 'message':"updates successfully",data:data}, 
					 					res.json(outputJSON);


										}
									})		

									}

								
								
								}else{
										outputJSON = {'status':'failure', 'messageId':400, 'message':"Wrong id"}, 
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
	console.log("body", req.body)
	if (req.body != null) {
		console.log("inside",req.body)
		var lat=req.body.latitude;
		var long=req.body.longitude;
		console.log("lat and long",lat,long)
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
						coordinates: [lat,long]
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
				//console.log("count",);
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