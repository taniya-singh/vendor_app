"use strict"

angular.module("Permissions")

.factory('PermissionService', ['$http', 'communicationService', function($http, communicationService) {

	var service = {};


	service.getPermissionList = function(callback) {
			communicationService.resultViaGet(webservices.permissionList, appConstants.authorizationKey, headerConstants.json, function(response) {
			callback(response.data);
		});

	}

	service.savePermission = function(inputJsonString, callback) {
			communicationService.resultViaPost(webservices.createPermission, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}

	service.updatePermission = function(inputJsonString, permissionId, callback) {
		    var serviceURL = webservices.updatePermission + "/" + permissionId;
		    console.log(serviceURL);
			communicationService.resultViaPost(serviceURL, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});

	}
	service.getPermission = function(permissionId, callback) {
			var serviceURL = webservices.findOnePermission + "/" + permissionId;
			communicationService.resultViaGet(serviceURL, appConstants.authorizationKey, headerConstants.json, function(response) {
			callback(response.data);
		});

	}

	service.updatePermissionStatus = function(inputJsonString, callback) {
			communicationService.resultViaPost(webservices.bulkUpdatePermission, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}


	return service;


}]);
