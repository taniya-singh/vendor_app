"use strict"

angular.module("Questionnaire")

.factory('questionnaireService', ['$http', 'communicationService', function($http, communicationService) {

	var service = {};


		service.getQuestionnaireList = function(callback) {
				communicationService.resultViaGet(webservices.questionnaireList, appConstants.authorizationKey, headerConstants.json, function(response) {
				callback(response.data);
			});

		}

		service.saveQuestionnaire = function(inputJsonString, callback) {

				communicationService.resultViaPost(webservices.addquestionnaire, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
				callback(response.data);
			});
		}

		service.findOneQuestionnaire = function(questionnarieId , callback) {
			var webservice = webservices.findOneQuestionnaire + "/" + questionnarieId;
			communicationService.resultViaGet(webservice, appConstants.authorizationKey, headerConstants.json, function(response) {
				callback(response.data);
			});
		}

		service.updateQuestionnaire = function(inputJsonString, questionnarieId, callback) {
			var webservice = webservices.updateQuestionnaire + "/" + questionnarieId;
			console.log(webservice);
			communicationService.resultViaPost(webservice, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
				callback(response.data);
			});
		}

		
		service.updateQuestionnaireStatus = function(inputJsonString, callback) {
			communicationService.resultViaPost(webservices.bulkUpdateQuestionnaire, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
				callback(response.data);
			});
		}

		

		service.deleteQuestions = function(inputJsonString, callback) {
				communicationService.resultViaPost(webservices.deletequestion, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
				callback(response.data);
			});
		}

		service.statusUpdateQuestions = function(inputJsonString, callback) {
			communicationService.resultViaPost(webservices.updatestatusquestion, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
				callback(response.data);
			});
		}


	return service;

}]);