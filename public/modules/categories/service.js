"use strict"

angular.module("Categories")

.factory('CategoryService', ['$http', 'communicationService', function($http, communicationService) {

	var service = {};

	service.listCategory = function(callback) {
			communicationService.resultViaGet(webservices.categoryList, appConstants.authorizationKey, headerConstants.json, function(response) {
			callback(response.data);
		});
	}

	service.allQuestion = function(callback) {
			communicationService.resultViaGet(webservices.allQuestions, appConstants.authorizationKey, headerConstants.json, function(response) {
			callback(response.data);
		});
	}

	
	service.addCategory = function(inputJsonString, callback) {
			communicationService.resultViaPost(webservices.addCategory, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}


	service.updateCategory = function(inputJsonString, categoryId, callback) {
		var serviceURL = webservices.updateCategory + "/" + categoryId;
		communicationService.resultViaPost(serviceURL, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}

	service.updateCategoryStatus = function(inputJsonString, callback) {
			communicationService.resultViaPost(webservices.bulkUpdateCategory, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);		
		});
	}


	service.findOne = function(categoryId, callback) {
			var webservice = webservices.findOne + "/" + categoryId;
			communicationService.resultViaGet(webservice, appConstants.authorizationKey, headerConstants.json, function(response) {
				callback(response.data);
			});
		}

	return service;

}]);