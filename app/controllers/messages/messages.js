		var messageObj = require('./../../models/messages/messages.js');
		var jobObj = require('./../../models/jobs/jobs.js');
		var mongoose = require('mongoose');
		var constantObj = require('./../../../constants.js');

		/**
		 * Find messages by id
		 * Input: messagetId
		 * Output: message json object
		 * This function gets called automatically whenever we have a messageId parameter in route. 
		 * It uses load function which has been define in role model after that passes control to next calling function.
		 */
		 exports.message = function(req, res, next, id) {
		 	messageObj.load(id, function(err, message) {
		 		if (err){
		 			res.jsonp(err);
		 		}
		 		else if (!message){
		 			res.jsonp({err:'Failed to load offer ' + id});
		 		}
		 		else{
		 			req.message = message;
		 			next();
		 		}
		 	});
		 };

		


		
		/**
		 * Show comment by id
		 * Input: message json object
		 * Output: message json object
		 * This function gets role json object from exports.role 
		 */
		 exports.findOne = function(req, res) {
		 	if(!req.message) {
		 		outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
		 	}
		 	else {
		 		outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 
		 		'data': req.message}
		 	}
		 	res.jsonp(outputJSON);
		 };

		 



		 /**
		 * Show message thred by jobid,userid
		 * Input: message json object
		 * Output: message with all messages json object
		 * This function gets role json object from exports.role 
		 */
		 exports.findThread = function(req, res) {
		 	
		 	var outputJSON = "";
		 	//console.log("reqdata ",req.params);
		 	messageObj.find({_id:req.params.threadId,is_deleted:false,message:{$elemMatch:{is_read:false,recieverid:req.params.userId}}}).exec(function(err, data) {console.log("err ",err);

		 		console.log("data ",JSON.stringify(data))
		 		if(data.length>0){
		 		data[0].message.forEach(function (commentContainer) {
            // Check if this comment contains banned phrases
            if (commentContainer.is_read== false && commentContainer.recieverid==req.params.userId) {
                commentContainer.is_read = true;
            }
        });

        return data[0].save();
    }else{
    	return true;
    }
		 	}).then(function () {
    console.log("Done saving") 
});
		 	
		 	messageObj.find({_id:req.params.threadId,is_deleted:false}).populate({
								path:'recieverid',select: 'first_name last_name email prof_image'
								
							}).populate({
								path:'senderid',select: 'first_name last_name email prof_image'
								
							}).populate({
								path: 'message.senderid',
								select: 'first_name last_name email prof_image'

							}).exec(function(err, data) {
		 		if(err) {
		 			outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
		 		}
		 		else {
		 			outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 
		 			'data': data}
		 		}
		 		res.jsonp(outputJSON);
		 	});
		 };
		 /**
		 * Show message thred by userId,contactId
		 * Input: message json object
		 * Output: message with all messages json object
		 * This function gets role json object from exports.role 
		 */
		 exports.findUserThread = function(req, res) {
		 	
		 	var outputJSON = "";
		 	//console.log("reqdata ",req.params);
		 	messageObj.find({recieverid:req.params.userId,$or: [{senderid:req.params.userId }, {recieverid:req.params.userId}],$or: [{senderid:req.params.contactId }, {recieverid:req.params.contactId}],is_deleted:false,message:{$elemMatch:{is_read:false,recieverid:req.params.userId}}}).exec(function(err, data) {console.log("err ",err);

		 		console.log("data ",JSON.stringify(data))
		 		if(data.length>0){
		 		data[0].message.forEach(function (commentContainer) {
            // Check if this comment contains banned phrases
            if (commentContainer.is_read== false && commentContainer.recieverid==req.params.userId) {
                commentContainer.is_read = true;
            }
        });

        return data[0].save();
    }else{
    	return true;
    }
		 	}).then(function () {
    console.log("Done saving") 
});
		 	
		 	messageObj.find({$or: [{senderid:req.params.userId }, {recieverid:req.params.userId}],$or: [{senderid:req.params.contactId }, {recieverid:req.params.contactId}],is_deleted:false}).populate({
								path:'recieverid',select: 'first_name last_name email prof_image'
								
							}).populate({
								path:'senderid',select: 'first_name last_name email prof_image'
								
							})
							.populate({
								path: 'message.senderid',
								select: 'first_name last_name email prof_image'

							})
							.exec(function(err, data) {
		 		if(err) {
		 			outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
		 		}
		 		else {
		 			outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 
		 			'data': data}
		 		}
		 		res.jsonp(outputJSON);
		 	});
			
		 };
		/**
		 * List all message object
		 * Input: 
		 * Output: message json object
		 */
		 exports.list = function(req, res) { 
		 	var outputJSON = "";
		 	messageObj.find({is_deleted:false,$or: [{senderid:req.params.userId }, {recieverid:req.params.userId}]})
		 	.populate({
								path:'senderid',select: 'first_name last_name email prof_image'
								
							}).populate({
								path:'recieverid',select: 'first_name last_name email prof_image'
								
							}).sort({created_date : -1 }).exec(function(err, data) { 
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
		 * List all contact object
		 * Input: userId
		 * Output: contact json object
		 */
		 exports.allContacts = function(req, res) { 
		 	var outputJSON = "";
		 	//console.log(req.params);
		 	var user_id = mongoose.Types.ObjectId(req.params.userId);
		 	
		 	jobObj.aggregate([                        
                     { $match: { creator:user_id}},
                     { $group: { _id: "$winner"} },
                     {$lookup: {from: 'users',localField: '_id',foreignField: '_id',as: 'userData'}},
                     {
				        $project: {
				        	first_name :"$userData.first_name",
				            last_name :"$userData.last_name",				            
				        	email :"$userData.email",
				            prof_image :"$userData.prof_image",
				            
				        }
   					 }

                   ]).exec(function(err, data) { 
		 		if(err) {
		 			outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData,error:err};
		 		}
		 		else { 
		 			outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 
		 			'data': data}
		 			jobObj.aggregate([                        
                     { $match: { winner:user_id } },
                     {$unwind:{path:'$creator'}},
                     { $group: { _id: "$creator"} },
                     {$lookup: {from: 'users',localField: '_id',foreignField: '_id',as: 'userData'}},
                     {
				        $project: {
				        	first_name :"$userData.first_name",				           
				            last_name :"$userData.last_name",				            
				        	email :"$userData.email",
				            prof_image :"$userData.prof_image",
				            
				        }
   					 }
                   ]).exec(function(err, data1) { 

		 		if(err) {
		 			outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData,error:err};
		 		}
		 		else {
		 			//outputJSON.winner=data1;
		 			 var finaldata=data.concat(data1)
		 			 
		 			 outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData,'data': finaldata}
		 		}
		 		res.jsonp(outputJSON);
		 	})




		 		}
		 		
		 	});
		 }


		/**
		 * Create new message object
		 * Input: message object
		 * Output: message json object with success
		 */
		 exports.add = function(req, res) {
		 	var errorMessage = "";
		 	var outputJSON = "";
		 	var commentModelObj = {};
		 	console.log(req.body);
		 	messageModelObj = req.body;
		 	//console.log(commentModelObj);
		 	//res.jsonp(outputJSON);
		 	messageObj(messageModelObj).save(req.body, function(err, data) {
		 		console.log(err); 
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
					res.jsonp(outputJSON);
				}//if
				else {
						outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.messageSuccess,data:data};
							res.jsonp(outputJSON);
					

					}
				

			});
		 }

		/**
		 * Update message object
		 * Input: message object
		 * Output: message json object with success
		 */
		 exports.update = function(req, res) {
		 	var errorMessage = "";
		 	var outputJSON = "";
		 	console.log("herer",req.body);
		 	
		 	messageObj.update({ _id:req.params.messageId },{$push:{message:req.body}},function(err, data) {
		 		console.log(err);
		 		console.log("updated ",data);
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
							res.jsonp(outputJSON);
						}//if
						else {


							
							messageObj.load(req.params.messageId, function(err, message) {
					 		if (err){
					 			res.jsonp(err);
					 		}
					 		else if (!message){
					 			res.jsonp({err:'Failed to load comment ' + id});
					 		}
					 		else{
					 			//req.comment = comment;
					 			outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.messageStatusUpdateSuccess,message:message};
								res.jsonp(outputJSON);
					 		}

					 	});


							


						}
						
					});
		 }


		/**
		 * Update comment object(s) (Bulk update)
		 * Input: comment object(s)
		 * Output: Success message
		 * This function is used to for bulk updation for comment object(s)
		 */
		 exports.bulkUpdate = function(req, res) {
		 	var outputJSON = "";
		 	var inputData = req.body;
		 	var messageLength = inputData.data.length;
		 	var bulk = messageObj.collection.initializeUnorderedBulkOp();
		 	for(var i = 0; i< messageLength; i++){
		 		var messageData = inputData.data[i];
		 		if(messageData.message_id==undefined){
		 		var id = mongoose.Types.ObjectId(messageData.id);  
		 		bulk.find({_id: id}).update({$set: messageData});
		 		}else{
		 		//console.log(commentData);
		 		var id = mongoose.Types.ObjectId(messageData.id);
		 		var messageId = mongoose.Types.ObjectId(messageData.message_id);

		 		bulk.find({_id:id,message:{$elemMatch:{_id:messageId}}}).update({$set:{'message.$.is_deleted':true}});
		 		}
		 	}
		 	
		 	bulk.execute(function (data) {
		 		outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.messageStatusUpdateSuccess};
		 	});
		 	res.jsonp(outputJSON);
		 }




		 