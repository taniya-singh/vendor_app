'use strict'

angular.module('FAQ')

.factory('faqService', ['$http', 'communicationService', function($http, communicationService) {

	var service = {};

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


}]);
