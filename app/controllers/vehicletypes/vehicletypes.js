var vehicletypeObj = require('./../../models/vehicletypes/vehicletypes.js');
var constantObj = require('./../../../constants.js');

//list of vehicle types
exports.list = function(req, res) {
	var outputJSON = "";

	vehicletypeObj.find({is_deleted:false}, function(err, data) {

		if(err) {
			outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
		}
		else {
			outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 'data': data}
			
		}
		res.jsonp(outputJSON);	
	});
}

//save vehicle type
exports.add = function(req, res) {

	var errorMessage = "";
	var outputJSON = "";
	var vehicleTypeModel = {};

	vehicleTypeModel.vehicleType = req.body.vehicleType;
	vehicleTypeModel.enable = req.body.enable;
	
	vehicletypeObj(vehicleTypeModel).save(req.body, function(err, data) {

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

			outputJSON = {'status': 'failure', 'messageId':401, 'message':errorMessage};
		}//if
		else {
			outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.vehicleTypeSuccess};
		}


		res.jsonp(outputJSON);
	});
	
	
}

//edit vehicle type - find the saved data based on the selection
exports.editVehicleType = function(req, res) {

	var outputJSON = "";
	
	vehicletypeObj.findById(req.params.id, function(err, data) {

		if(err) {
			outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
		}
		else {
			outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 'data': data}
		}

		res.jsonp(outputJSON);
	});
}

//update vehicle type
exports.updateVehicleType = function(req, res) {
	var errorMessage = "";
	var outputJSON = "";
	
	

	//update vehicle type here
	var id = req.body._id;

	vehicletypeObj.findById(id, function(err, data) {
		if(!err) {
			data.vehicleType = req.body.vehicleType;
			data.enable = req.body.enable;
			data.save(function(err, data) {
				
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
					outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.vehicleTypeUpdateSuccess};
				}


				res.jsonp(outputJSON);
			});
		}
	});

}

//update the status
exports.updateStatus = function(req, res) {

	var outputJSON = "";
	var errorCount =0;
	var inputData = req.body;

	
	for(var attributename in inputData){
  		 
  		  id = inputData[attributename]._id;
  		   		  
  		  vehicletypeObj.findById(id, function(err, data) {

  		  	if(err) {
  		  		errorCount++;
  		  	}
  		  	else {
  		  		data.enable = inputData[attributename].enable;
  		  		data.save(function(err, data) {

  		  			if(err) {
  		  				errorCount++;
  		  			}
  		  			
  		  		});
  		  	}

  		  	
  		  });

	}

	if(errorCount > 0) {
		outputJSON = {'status': 'success', 'messageId':402, 'message':constantObj.messages.vehicleTypeStatusUpdateFailure};
	}
	else {
		outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.vehicleTypeStatusUpdateSuccess};
	}

	res.jsonp(outputJSON);
}

exports.deleteVehicleType = function(req, res) {
	var outputJSON = "";
	var errorCount =0;
	var inputData = req.body;

	
	for(var attributename in inputData){
  		 
  		  id = inputData[attributename]._id;
  		   		  
  		  vehicletypeObj.findById(id, function(err, data) {

  		  	if(err) {
  		  		errorCount++;
  		  	}
  		  	else {
  		  		data.is_deleted = inputData[attributename].is_deleted;
  		  		data.save(function(err, data) {

  		  			if(err) {
  		  				errorCount++;
  		  			}
  		  			
  		  		});
  		  	}

  		  	
  		  });

	}

	if(errorCount > 0) {
		outputJSON = {'status': 'success', 'messageId':403, 'message':constantObj.messages.vehicleTypeStatusDeleteFailure};
	}
	else {
		outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.vehicleTypeDeleteSuccess};
	}

	res.jsonp(outputJSON);
}
