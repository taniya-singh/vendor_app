var answerTypeObj = require('./../../models/answer_type/answer_type.js');
var constantObj = require('./../../../constants.js');




 		/**
		 * List all answer type object
		 * Input: 
		 * Output: Answer type json object
		 */
		 exports.list = function(req, res) {
		 	var outputJSON = "";
		 	answerTypeObj.find({}, function(err, data) {
		 		console.log(err);
		 		if(err) {
		 			outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
		 		}
		 		else {
		 			console.log(data);
		 			outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 
		 			'data': data}
		 		}
		 		res.jsonp(outputJSON);
		 	});
		 }


//add answertype
exports.addanswertype = function(req, res) {

	var outputJson = "";
	var errorMessage = "";

	var answertype = {};

	answertype.answertype = req.body.answertype;

	answerTypeObj(answertype).save(req.body, function(err, data) {

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

			outputJson = {'status':'failure', 'statusCode' : 400, 'message' : errorMessage};
		}
		else {
			outputJson = {'status' : 'success', 'statusCode' : 200, 'message' : constantObj.messages.answertypeSuccess};
		}

		res.jsonp(outputJson);
	});
}