		var roleObj = require('./../../models/roles/roles.js');
		var mongoose = require('mongoose');
		var constantObj = require('./../../../constants.js');

		/**
		 * Find role by id
		 * Input: roleId
		 * Output: Role json object
		 * This function gets called automatically whenever we have a roleId parameter in route. 
		 * It uses load function which has been define in role model after that passes control to next calling function.
		 */
		 exports.role = function(req, res, next, id) {
		 	roleObj.load(id, function(err, role) {
		 		if (err){
		 			res.jsonp(err);
		 		}
		 		else if (!role){
		 			res.jsonp({err:'Failed to load role ' + id});
		 		}
		 		else{
		 			req.role = role;
		 			next();
		 		}
		 	});
		 };


		/**
		 * Show role by id
		 * Input: Role json object
		 * Output: Role json object
		 * This function gets role json object from exports.role 
		 */
		 exports.findOne = function(req, res) {
		 	if(!req.role) {
		 		outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
		 	}
		 	else {
		 		outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 
		 		'data': req.role}
		 	}
		 	res.jsonp(outputJSON);
		 };

		/**
		 * List all role object
		 * Input: 
		 * Output: Role json object
		 */
		 exports.list = function(req, res) {
		 	var outputJSON = "";
		 	roleObj.find({}, function(err, data) {
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
		 * Create new role object
		 * Input: Role object
		 * Output: Role json object with success
		 */
		 exports.add = function(req, res) {
		 	var errorMessage = "";
		 	var outputJSON = "";
		 	var roleModelObj = {};
		 	console.log(req.body);
		 	roleModelObj.name = req.body.name;
		 	roleObj(roleModelObj).save(req.body, function(err, data) { 
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
					outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.roleSuccess, 'data': data};
				}
				res.jsonp(outputJSON);

			});
		 }

		/**
		 * Update role object
		 * Input: Role object
		 * Output: Role json object with success
		 */
		 exports.update = function(req, res) {
		 	var errorMessage = "";
		 	var outputJSON = "";
		 	var role = req.role;
		 	role.permission = req.body.permission;
		 	role.enable = req.body.enable;
		 	role.save(function(err, data) {
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
							outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.roleStatusUpdateSuccess};
						}
						res.jsonp(outputJSON);
					});
		 }


		/**
		 * Update role object(s) (Bulk update)
		 * Input: Role object(s)
		 * Output: Success message
		 * This function is used to for bulk updation for role object(s)
		 */
		 exports.bulkUpdate = function(req, res) {
		 	var outputJSON = "";
		 	var inputData = req.body;
		 	var roleLength = inputData.data.length;
		 	var bulk = roleObj.collection.initializeUnorderedBulkOp();
		 	for(var i = 0; i< roleLength; i++){
		 		var roleData = inputData.data[i];
		 		var id = mongoose.Types.ObjectId(roleData.id);  
		 		bulk.find({_id: id}).update({$set: roleData});
		 	}
		 	bulk.execute(function (data) {
		 		outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.roleStatusUpdateSuccess};
		 	});
		 	res.jsonp(outputJSON);
		 }




		 