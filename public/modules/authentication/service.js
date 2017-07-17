'use strict'

angular.module('Authentication')

.factory('AuthenticationService', ['communicationService', '$rootScope', 
	function(communicationService, $rootScope) {

	var service = {};

	service.Login = function(inputJsonString, callback) {
                
			communicationService.resultViaPost(webservices.authenticate, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {

			callback(response.data);

		});	
	};
	service.Logout = function(inputJsonString, callback) {
                
			communicationService.resultViaPost(webservices.logout, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {

			callback(response.data);

		});	
	};
	service.getadminInfo = function(adminId, callback) {
			var serviceURL = webservices.findOneAdminInfo + "/" + adminId;
			communicationService.resultViaGet(serviceURL, appConstants.authorizationKey, headerConstants.json, function(response) {
			callback(response.data);
		});

	}
	service.saveProfile = function(inputJsonString, callback) { 
		communicationService.resultViaPost(webservices.saveProfile, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}
	service.commissionSetting = function(inputJsonString, callback) { 
		communicationService.resultViaPost(webservices.commissionSetting, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}
	service.uploadProImg = function(inputJsonString, callback) { 
		communicationService.resultViaPost(webservices.uploadProImg, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}
	service.resendPassword = function(inputJsonString, callback) {
		communicationService.resultViaPost(webservices.forgot_password, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}
	service.resetPassword = function(inputJsonString, callback) {
		communicationService.resultViaPost(webservices.adminResetPassword, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}
	service.changePassword = function(inputJsonString, callback) {
		communicationService.resultViaPost(webservices.changePassword, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	} 

     return service;
}])