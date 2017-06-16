"use strict"

angular.module("Users")

.factory('UserService', ['$http', 'communicationService', function($http, communicationService) {

	var service = {};


	service.getUserList = function(callback) {
			communicationService.resultViaGet(webservices.userList, appConstants.authorizationKey, headerConstants.json, function(response) {
			callback(response.data);
		});

	}

	service.saveUser = function(inputJsonString, callback) {
			communicationService.resultViaPost(webservices.addUser, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}


	service.getUser = function(userId, callback) {
		var serviceURL = webservices.findOneUser + "/" + userId;
		communicationService.resultViaGet(serviceURL, appConstants.authorizationKey, "", function(response) {
			callback(response.data);
		});
	}

	service.updateUser = function(inputJsonString, userId, callback) {
		var serviceURL = webservices.update + "/" + userId;
		communicationService.resultViaPost(serviceURL, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
		callback(response.data);
		});
	}

	service.updateUserStatus = function(inputJsonString, callback) {
			communicationService.resultViaPost(webservices.bulkUpdateUser, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}

	return service;


}]);
