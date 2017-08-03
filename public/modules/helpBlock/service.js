'use strict'

angular.module('helpBlock')

.factory('helpService', ['communicationService', '$rootScope', function(communicationService, $rootScope) {
	var service = {};
	service.updateHelpBlock = function(inputJsonString, callback) { 
			communicationService.resultViaPost(webservices.updateHelpBlock, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});	
	};

	service.getHelpBlockListing = function(callback) {
			communicationService.resultViaGet(webservices.getHelpBlockListing, appConstants.authorizationKey, headerConstants.json, function(response) {
			callback(response.data);
		});
	}

	service.getHelpInformation = function(inputJsonString, callback) { 
			communicationService.resultViaPost(webservices.getHelpInformation, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});	
	};

	service.insertHelpInformation = function(inputJsonString, callback) { 
			communicationService.resultViaPost(webservices.insertHelpInformation, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});	
	};

	service.deleteHelp = function(inputJsonString, callback) { 
			communicationService.resultViaPost(webservices.deleteHelp, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});	
	};

     return service;
}])