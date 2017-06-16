var permissionObj = require('./../../models/permissions/permissions.js');
var constantObj = require('./../../../constants.js');
var mongoose = require('mongoose');


		/**
		 * Find permission by id
		 * Input: permissionId
		 * Output: Permission json object
		 * This function gets called automatically whenever we have a permsissionId parameter in route. 
		 * It uses load function which has been define in role model after that passes control to next calling function.
		 */
		 exports.permission = function(req, res, next, id) {
		 	console.log('GHGGHGZHG')
		 	permissionObj.load(id, function(err, permission) {
		 		if (err){
		 			res.jsonp(err);
		 		}
		 		else if (!permission){
		 			res.jsonp({err:'Failed to load permission ' + id});
		 		}
		 		else{
		 			req.permission = permission;
		 			next();
		 		}
		 	});
		 };


		/**
		 * Show permission by id
		 * Input: Permission json object
		 * Output: Permission json object
		 * This function gets permission json object from exports.role 
		 */
		 exports.findOne = function(req, res) {
		 	if(!req.permission) {
		 		outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
		 	}
		 	else {
		 		outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 
		 		'data': req.permission}
		 	}
		 	res.jsonp(outputJSON);
		 };

		/**
		 * List all permission object
		 * Input: 
		 * Output: Permission json object
		 */
		 exports.list = function(req, res) {
		 	var outputJSON = "";
		 	permissionObj.find({}, function(err, data) {
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
		 * Create new permission object
		 * Input: Permission object
		 * Output: Permission json object with success
		 */
		 exports.create = function(req, res) {
		 	var errorMessage = "";
		 	var outputJSON = "";
		 	var permissionModelObj = req.body;
		 	permissionObj(permissionModelObj).save(req.body, function(err, data) { 
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
					outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.permissionSuccess, 'data': data};
				}
				res.jsonp(outputJSON);

			});
		 }

		 /**
		 * Update permission object
		 * Input: Permission object
		 * Output: Permission json object with success
		 */
		 exports.update = function(req, res) {
		 	var errorMessage = "";
		 	var outputJSON = "";
		 	var permission = req.permission;
		 	permission.permission = req.body.permission;
		 	permission.enable = req.body.enable;
		 	permission.save(function(err, data) {
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
							outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.permisssionStatusUpdateSuccess};
						}
						res.jsonp(outputJSON);
					});
		 }

		 /**
		 * Update permission object(s) (Bulk update)
		 * Input: Permission object(s)
		 * Output: Success message
		 * This function is used to for bulk updation for permission object(s)
		 */
		 exports.bulkUpdate = function(req, res) {
		 	var outputJSON = "";
		 	var inputData = req.body;
		 	console.log(inputData)
		 	var roleLength = inputData.data.length;
		 	var bulk = permissionObj.collection.initializeUnorderedBulkOp();
		 	for(var i = 0; i< roleLength; i++){
		 		var permissionData = inputData.data[i];
		 		var id = mongoose.Types.ObjectId(permissionData.id);  
		 		bulk.find({_id: id}).update({$set: permissionData});
		 	}
		 	bulk.execute(function (data) {
		 		console.log(data);
		 		outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.permissionStatusUpdateSuccess};
		 	});
		 	res.jsonp(outputJSON);
		 }