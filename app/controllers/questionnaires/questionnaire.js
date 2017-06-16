		var questionnaireObj = require('./../../models/questionnaire/questionnaire.js');
		var questionObj = require('./../../models/question/question.js');
		var mongoose = require('mongoose');
		var categoryObj = require('./../../models/categories/categories.js');
		var constantObj = require('./../../../constants.js');


		/**
				 * Find questionnaire by id
				 * Input: questionnaireId
				 * Output: Questionnaire json object
				 * This function gets called automatically whenever we have a questionnaireId parameter in route. 
				 * It uses load function which has been define in questionnaire model after that passes control to next calling function.
				 */
				 exports.questionnaire = function(req, res, next, id) {
				 	questionnaireObj.load(id, function(err, questionnaire) {
				 		if (err){
				 			res.jsonp(err);
				 		}
				 		else if (!questionnaire){
				 			res.jsonp({err:'Failed to load role ' + id});
				 		}
				 		else{
				 			
				 			req.questionnaireData = questionnaire;
				 			next();
				 		}
				 	});
				 };


				/**
				 * Show questionnaire by id
				 * Input: Questionnaire json object
				 * Output: Questionnaire json object
				 * This function gets questionnaire json object from exports.questionnaire 
				 */
				 exports.findOne = function(req, res) {
				 	if(!req.questionnaireData) {
				 		var outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
				 		res.jsonp(outputJSON);
				 	}
				 	else {
				 		console.log(req.params.questionnarieId )
				 		questionnaireObj.findOne({ _id: req.params.questionnarieId }, { questions: true }).exec(function (err, quest) {
        				req.questionnaireData.questions = quest.questions;
        				var len = req.questionnaireData.questions.length;
        				for(var i = 0; i< len; ++i){
        						if(req.questionnaireData.questions[i].questions.length == 0){
        							req.questionnaireData.questions[i].questions = null;
        						}
        				}
				 		outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 'data': req.questionnaireData}, 
				 		res.send(outputJSON);
				 	});
				 	}

				 };


				 /**
				 * List all questionnaire object
				 * Input: 
				 * Output: Questionnaire json object
				 */
				 exports.list = function(req, res) {
				 	var outputJSON = "";
				 	questionnaireObj.find({}, function(err, data) {
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
				 * Create new questionnaire object
				 * Input: Questionnaire object
				 * Output: Questionnaire json object with success
				 */
				 exports.add = function(req, res) {
				 	var errorMessage = "";
				 	var outputJSON = "";
				 	var userModelObj = {};
				 	questionnaireModelObj = req.body;
				 	questionnaireObj(questionnaireModelObj).save(req.body, function(err, data) { 
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
						outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.userSuccess, 'data': data};
					}

					res.jsonp(outputJSON);

				});

				 }


				 /**
				 * Update questionnaire object
				 * Input: Questionnaire object
				 * Output: Questionnaire json object with success
				 */
				 exports.update = function(req, res) {
				 	var errorMessage = "";
				 	var outputJSON = "";
				 	function flattenQuestions(lvl, list) {
				 		var arr = [];
				 		for (var a = 0; a < list.length; a++) {
				 			arr.push(list[a]._id);
				 			if (list[a].questions) {
				 				var worker = flattenQuestions(lvl + 1, list[a].questions);
				 				for (var b = 0; b < worker.length; b++) {
				 					arr.push(worker[b]);
				 				}
				 			}
				 		}
				 		return arr;
				 	}
				 	var worker;
				 	var questionsLength = req.body.questions.length;
				 	for (var i = 0; i < questionsLength; ++i) {
				 		worker = flattenQuestions(1, req.body.questions[i].questions);
				 		req.body.questions[i].questions = worker;

				 	}
				 	var questionnaire = req.questionnaireData;
				 	questionnaire.questionnaire_name = req.body.questionnaire_name;
				 	questionnaire.questions = req.body.questions;
				 	questionnaire.enable = req.body.enable;
				 	questionnaire.save(function(err, data) {
				 		console.log(err);
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
									outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.userStatusUpdateSuccess};
								}
								res.jsonp(outputJSON);
							});
				 }


				 /**
				 * Update questionnaire object(s) (Bulk update)
				 * Input: questionnaire object(s)
				 * Output: Success message
				 * This function is used to for bulk updation for questionnaire object(s)
				 */
				 exports.bulkUpdate = function(req, res) {
				 	var outputJSON = "";
				 	var inputData = req.body;
				 	console.log(inputData)
				 	var questionnaireLength = inputData.data.length;
				 	var bulk = questionnaireObj.collection.initializeUnorderedBulkOp();
				 	for(var i = 0; i< questionnaireLength; i++){
				 		var questionnaireData = inputData.data[i];
				 		var id = mongoose.Types.ObjectId(questionnaireData.id);  
				 		bulk.find({_id: id}).update({$set: questionnaireData});
				 	}
				 	bulk.execute(function (data) {
				 		outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.questionnaireUpdateSuccess};
				 	});
				 	res.jsonp(outputJSON);
				 }



		//list questionnaire
		exports.listquestionnaire = function(req , res) {
			var outputJSON = "";
			questionnaireObj.find({'is_deleted' : false}, function(err , data) {
				if(err) {
					outputJSON = {'status' : 'failure', 'messageId' : 401, 'message' : "Error retreiving the questionnaire data"};
				}
				else {
					outputJSON = {'status' : 'success', 'messageId' : 200, 'message' : "questionnaire retreived successfully" , 'data' : data};
				}
				res.jsonp(outputJSON);
			});

		}

		