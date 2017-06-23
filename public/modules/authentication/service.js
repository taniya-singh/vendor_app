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

	service.resendPassword = function(inputJsonString, callback) {
		communicationService.resultViaPost(webservices.forgot_password, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	} 
service.resetpassword = function(inputJsonString, callback) {
	console.log("json data",inputJsonString)
		communicationService.resultViaPost(webservices.resetpassword, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	} 

     return service;
}])