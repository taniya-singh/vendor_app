"use strict"

angular.module("Vehicletype")

.factory('VehicletypeService', ['$http', 'communicationService', function($http, communicationService) {

	var service = {};

	service.getVehicletypelist = function(callback) {

		communicationService.resultViaGet(webservices.listVehicleTypes, appConstants.authorizationKey, headerConstants.json, function(response) {

			callback(response.data);

		});

	};


	service.saveVehicleType = function(inputJsonString, callback) {

		communicationService.resultViaPost(webservices.addVehicleType, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	};

	service.editVehicleType = function(vehicleTypeID, callback) {

		var serviceURL = webservices.editVehicleType + "/" + vehicleTypeID;
		communicationService.resultViaGet(serviceURL, appConstants.authorizationKey, "", function(response) {
			callback(response.data);
		});
	}

	service.updateVehicleType = function(inputJsonString, callback) {

		communicationService.resultViaPost(webservices.updateVehicleType, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			
			callback(response.data);
		});
	}

	service.statusUpdateVehicleType = function(inputJsonString, callback) {

		communicationService.resultViaPost(webservices.statusUpdateVehicleType, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {

			callback(response.data);
		});
	}

	service.deleteVehicleType = function(inputJsonString, callback) {

		communicationService.resultViaPost(webservices.deleteVehicleType, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		} );
	}

	return service;

}]);