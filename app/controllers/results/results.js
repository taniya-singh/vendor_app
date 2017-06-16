var resultObj = require('./../../models/results/results.js');
var constantObj = require('./../../../constants.js');

//adding result
exports.addresult = function(req, res) {

	var outputJSON = "";
	var errorMessage = "";

	var result = {};

	resultObj.create(req.body, function(err, data) {
		if(err) {

			switch(err.name) {
				case 'ValidationError':
					for(field in err.errors) {
						if(errorMessage == "") {
							errorMessage = err.errors[field].message;
						}
						else {							
							errorMessage+="\r\n"  +  err.errors[field].message;
						}
					}//for
				break;
			}//switch

			outputJSON = {'status' : 'failure', 'messageId' : 400, 'message' : errorMessage};
		}
		else {

			var enteredResult = JSON.stringify(req.body);
			var results = JSON.parse(enteredResult);

			var questionCount = results.length;
			console.log("questionCount=" , questionCount);

			var sumRating = 0;

			for(var i = 0; i < questionCount; i++) {
			     sumRating = sumRating + results[i].rating;
			}

			var avgscore = parseFloat(sumRating / questionCount);
								
			outputJSON = {'status' : 'success', 'messageId': 200, 'message' : constantObj.messages.resultSuccess, 'avgscore': avgscore.toFixed(2)};
			res.jsonp(outputJSON);
		}


	});

	/*console.log(req.body);
	console.log(req.body[0].questions);

	var dataLength = req.body.length;
	
	for(var i = 0; i < dataLength; i++) {

		result.questions = req.body[i].questionID;
		result.rating = req.body[i].rating;

		//resultObj(result).save(req.body)
	}
*/
/*	result.questions = req.body.questionID;
	result.rating = req.body.rating;

	resultObj(result).save(req.body, function(err, data) {
		if(err) {

			switch(err.name) {
				case 'ValidationError':
					for(field in err.errors) {
						if(errorMessage == "") {
							errorMessage = err.errors[field].message;
						}
						else {							
							errorMessage+="\r\n"  +  err.errors[field].message;
						}
					}//for
				break;
			}//switch

			outputJSON = {'status' : 'failure', 'messageId' : 400, 'message' : errorMessage};
		}
		else {


			data.save(function(err, data) {
				if(err) {
					outputJSON = {'status' : 'failure', 'messageId': 400, 'message' : constantObj.messages.resultFailure};
				}
				else {
					outputJSON = {'status' : 'success', 'messageId': 200, 'message' : constantObj.messages.resultSuccess};
				}

				res.jsonp(outputJSON);

			});
		}

	});*/
}