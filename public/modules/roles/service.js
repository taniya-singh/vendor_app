"use strict"

angular.module("Roles")

.factory('RoleService', ['$http', 'communicationService', function($http, communicationService) {

	var service = {};


	

	service.getRoleList = function(callback) {
			communicationService.resultViaGet(webservices.roleList, appConstants.authorizationKey, headerConstants.json, function(response) {
			callback(response.data);
		});

	}

	service.saveRole = function(inputJsonString, callback) {
			communicationService.resultViaPost(webservices.addRole, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}

	service.updateRole = function(inputJsonString, roleId, callback) {
		    var serviceURL = webservices.updateRole + "/" + roleId;
		    console.log(serviceURL);
			communicationService.resultViaPost(serviceURL, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});

	}
	service.getRole = function(roleId, callback) {
			var serviceURL = webservices.findOneRole + "/" + roleId;
			communicationService.resultViaGet(serviceURL, appConstants.authorizationKey, headerConstants.json, function(response) {
			callback(response.data);
		});

	}

	service.updateRoleStatus = function(inputJsonString, callback) {
			communicationService.resultViaPost(webservices.bulkUpdateRole, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}


	return service;


}]);
