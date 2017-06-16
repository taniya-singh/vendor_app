var candidatepositionObj = require('./../../models/candidateposition/candidateposition.js');
var constantObj = require('./../../../constants.js');

//add candidateposition
exports.addcandidateposition = function(req, res) {
	var outputJSON = '';
	var errorMessage = "";

	var candidateposition = {};
	candidateposition.position = req.body.position;
	candidateposition.threshold = req.body.threshold;

	candidatepositionObj(candidateposition).save(req.body, function(err, data) {
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

			outputJSON = {'status' : 'success', 'messageId': 200, 'message' : constantObj.messages.candidatepositionSuccess};
		}

		res.jsonp(outputJSON);
	});

}
