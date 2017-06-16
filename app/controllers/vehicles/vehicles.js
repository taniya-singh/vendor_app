var vehicleModelObj = require('./../../models/vehicles/vehicles.js');
var constantObj = require('./../../../constants.js');

//list of vehicles
exports.list = function(req, res) {

	var outputJSON = "";
	vehicleModelObj.find(
			{is_deleted:false},
			{'_id':false, 'vehicle':true, 'vehicleType':true, 'vehicleModel':true, 'vehicleCapacity':true}
		)
		.skip((req.query.pageNumber -1)*req.query.pageSize)
		.limit(req.query.pageSize)
		.exec(function(err, data) {

		if(err) {
			outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
		}
		else {
			outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 'data': data}
			
		}

		vehicleModelObj.find(
			{is_deleted:false})
			.exec(function(err, dataCount){
				if(!err) {
					outputJSON.totalRecords = dataCount.length;
					res.jsonp(outputJSON);
				}
			});

			
	} );
}

