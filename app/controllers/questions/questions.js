			var questionObj = require('./../../models/question/question.js');
			var categoryObj = require('./../../models/categories/categories.js');
			var answerObj = require('./../../models/answer/answer.js');
			var mongoose = require('mongoose');
			var constantObj = require('./../../../constants.js');



					/**
					 * Find question by id
					 * Input: questionId
					 * Output: Question json object
					 * This function gets called automatically whenever we have a questionId parameter in route. 
					 * It uses load function which has been define in role model after that passes control to next calling function.
					 */
					 exports.question = function(req, res, next, id) {
					 	questionObj.load(id, function(err, question) {
					 		if (err){
					 			res.jsonp(err);
					 		}
					 		else if (!question){
					 			res.jsonp({err:'Failed to load question ' + id});
					 		}
					 		else{
					 			
					 			req.questionData = question;
					 			//console.log(req.user);
					 			next();
					 		}
					 	});
					 };


					/**
					 * Show question by id
					 * Input: Question json object
					 * Output: Question json object
					 * This function gets question json object from exports.question 
					 */
					 exports.findOne = function(req, res) {
					 	if(!req.questionData) {
					 		outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
					 	}
					 	else {
					 		outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 
					 		'data': req.questionData}
					 	}
					 	res.jsonp(outputJSON);
					 };




				/**
				 * Create new question object
				 * Input: Question object
				 * Output: Question json object with success
				 */
			exports.add = function(req, res) {
				var outputJSON = "";
				var errorMessage = "";
				console.log(req.body);
				var answerLength = req.body.answers.length;
				var tempAnswerId = []
				if(answerLength){ 
					console.log('HELL');
					bulk = answerObj.collection.initializeOrderedBulkOp();
					for(var a = 0; a< answerLength; ++a){
						var answer = req.body.answers;
						var answerData = new answerObj({answer_text : answer[a].answer_text});
						if(req.body.correct_answer == a)
						var correctAnswer = answerData._id
						tempAnswerId.push(answerData._id)
						bulk.insert({"_id": answerData._id, "answer_text": answer[a].answer_text,created: new Date(), enable: true});
					}
					bulk.execute(function(err, result) {
						if(!err){
							var questionData = req.body;
							questionData.answers = tempAnswerId;
							questionData.correct_answer = correctAnswer;
							questionObj(questionData).save(function(err, data) {
								if(err) {
									outputJSON = {'status' : 'failure', 'messageId': 400, 'message' : constantObj.messages.questionnaireUpdateQuestionFailure};
								res.jsonp(outputJSON);
								}
								else {
									console.log(questionData.category);
									console.log(data._id)
									categoryObj.findByIdAndUpdate(
										questionData.category,
										{$push: {"questions": data._id}},
										function(err, model) {
											if(err){
												outputJSON = {'status' : 'failure', 'messageId': 400, 'message' : constantObj.messages.questionnaireUpdateQuestionFailure};
											}
											else{
												outputJSON = {'status' : 'success', 'messageId': 200, 'message' : constantObj.messages.questionSuccess};
											}
											res.jsonp(outputJSON);
										}

										);	
								}		    	
							});
						}
					});

		}
	}


		/**
		 * Update question object
		 * Input: Question object
		 * Output: Question json object with success
		 */
		 exports.update = function(req, res) {
		 	var errorMessage = "";
		 	var outputJSON = "";
		 	var question = req.questionData;
		 	var answerLength = req.body.answers.length;
		 	console.log(req.body)
		 	bulk = answerObj.collection.initializeOrderedBulkOp();
		 	var tempAnswerId = []
		 	for(var a = 0; a< answerLength; ++a){
		 		var answer = req.body.answers;
		 		if(!answer[a]._id){
		 			var answerData = new answerObj({answer_text : answer[a].answer_text});
		 			var insertedData = {"_id": answerData._id, "answer_text": answer[a].answer_text, created: new Date(), enable: true};
		 			if(req.body.correct_answer == a){
		 			var correctAnswer = answerData._id;
		 		}
		 			bulk.insert(insertedData);
		 			tempAnswerId.push(answerData._id)
		 		}
		 		else{
		 				if(req.body.correct_answer == a){
		 				var correctAnswer = answer[a]._id;
		 				}
		 			var insertedData = {answer_text: answer[a].answer_text}
		 			var id = mongoose.Types.ObjectId(answer[a]._id);
		 			bulk.find({_id: id}).update({$set: insertedData});
		 			tempAnswerId.push(answer[a]._id)
		 		}

		 		
		 	}
		 	bulk.execute(function(err, result) {
		 		if(!err){
		 			question.answers = tempAnswerId;
		 			question.enable = req.body.enable;
		 			question.question = req.body.question;
		 			question.keyword = req.body.keyword;
		 			question.answer_type = req.body.answer_type;
		 			question.dependancy = req.body.dependancy;
		 			question.correct_answer = correctAnswer;
		 			console.log(correctAnswer)
		 			console.log(question)
		 			question.save(function(err, data) {
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
							outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.questionSuccess};
						}
						res.jsonp(outputJSON);
					});

		 		}
		 	});
		 	
		 	
		 }

		 /**
		 * Update question object(s) (Bulk update)
		 * Input: Question object(s)
		 * Output: Success message
		 * This function is used to for bulk updation for question object(s)
		 */
		 exports.bulkUpdate = function(req, res) {
		 	var outputJSON = "";
		 	var inputData = req.body;
		 	var roleLength = inputData.data.length;
		 	var bulk = questionObj.collection.initializeUnorderedBulkOp();
		 	for(var i = 0; i< roleLength; i++){
		 		var questionData = inputData.data[i];
		 		var id = mongoose.Types.ObjectId(questionData.id);  
		 		bulk.find({_id: id}).update({$set: questionData});
		 	}
		 	bulk.execute(function (data) {
		 		outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.questionSuccess};
		 	});
		 	res.jsonp(outputJSON);
		 }


			
		/**
		 * Get Answer list
		 * Input: questionId
		 * Output: Success message and question object
		 * This function is used to for answer list for question object(s)
		 */
			exports.getanswerlist = function(req, res) {
				var outputJSON ="";
				var questionID = req.body._id;
				questionObj.findById(questionID, function(err, data) {
					if(err) {
						switch(err.name) {
							case 'ValidationError':
							for(field in err.errors) {
								if(errorMessage == "") {
									errorMessage = err.errors[field].message;
								}
								else {							
									errorMessage+="\r\n" . field.message;
								}
								}//for
								break;
						}//switch

						outputJSON = {'status': 'failure', 'messageId':401, 'message':errorMessage};
					}//if
					else {
						outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.questionAnswerSuccess, data: data.answers};
					}
					res.jsonp(outputJSON);
				})
			}