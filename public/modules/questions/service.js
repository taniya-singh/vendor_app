"use strict"

angular.module("Question")

.factory('questionService', ['communicationService', function(communicationService) {

	var service = {};

	service.getAnswerTypesList = function(callback) {

			communicationService.resultViaGet(webservices.answerTypeList, appConstants.authorizationKey, headerConstants.json, function(response) {
			callback(response.data);
		});
	}

	service.saveQuestion = function(inputJsonString, callback) {

			communicationService.resultViaPost(webservices.addQuestion, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);	
		});	
	}

	service.findOneQuestion =  function(questionId, callback) {
			var webservice = webservices.findOneQuestion + "/" + questionId;
			communicationService.resultViaGet(webservice, appConstants.authorizationKey, headerConstants.json, function(response) {
			callback(response.data);
		});
	}

	service.updateQuestion = function(inputJsonString, questionId, callback) {
			var webservice = webservices.updateQuestion + "/" + questionId;
			communicationService.resultViaPost(webservice, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}

	service.getAnswerList = function(inputJsonString, callback) {
			communicationService.resultViaPost(webservices.getAnswerList, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}

	service.updateQuestionStatus = function(inputJsonString, callback) {
			communicationService.resultViaPost(webservices.bulkUpdateQuestion, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}

	return service;

}]);