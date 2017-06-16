var techdomainObj = require('./../../models/techdomain/techdomain.js');
var constantObj = require('./../../../constants.js');

//add domain
exports.addtechdomain = function(req, res) {

	var outputJSON = '';
	var errorMessage = "";

	var techdomain = {};
	techdomain.domain_name = req.body.domain_name;
	techdomainObj(techdomain).save(req.body, function(err, data) {
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

			outputJSON = {'status' : 'success', 'messageId': 200, 'message' : constantObj.messages.techdomainSuccess};
		}

		res.jsonp(outputJSON);
	});
}
