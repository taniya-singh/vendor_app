'use strict'

angular.module('eManagement')

.factory('emailService', ['communicationService', '$rootScope', 
	function(communicationService, $rootScope) {
	var service = {};
	

	service.getEmail = function(callback) { 
			communicationService.resultViaGet(webservices.getEmail, appConstants.authorizationKey, headerConstants.json, function(response) {
			callback(response.data);
		});	
	};

	service.sentEmailNewsLetter = function(inputJsonString, callback) { 
			communicationService.resultViaPost(webservices.sentEmailNewsLetter, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});	
	};

	
	service.insertQuestionAnswer = function(inputJsonString, callback) { 
			communicationService.resultViaPost(webservices.insertQuestionAnswer, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});	
	};

	service.allfaq = function(callback) { 
			communicationService.resultViaGet(webservices.allfaq, appConstants.authorizationKey, headerConstants.json, function(response) {
			callback(response.data);
		});	
	};

	service.deleteAndQues = function(inputJsonString, callback) { 
			communicationService.resultViaPost(webservices.deleteAndQues, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});	
	};

     return service;
}])