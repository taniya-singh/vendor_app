'use strict'

angular.module('Packages')

.factory('PackageService', ['$http', 'communicationService', function($http, communicationService) {

	var service = {};

	service.addPackage = function(inputJsonString,callback) {
			communicationService.resultViaPost(webservices.addPackage, appConstants.authorizationKey, headerConstants.json,inputJsonString, function(response) {
			callback(response.data);
		});

	}

	service.packages = function(inputJsonString,callback) {
			communicationService.resultViaPost(webservices.packages, appConstants.authorizationKey, headerConstants.json,inputJsonString, function(response) {
			callback(response.data);
		});

	}

	service.getPackageDetail = function(inputJsonString,callback) {
		    var serviceURL = webservices.getPackageDetail + "/" + inputJsonString;
			communicationService.resultViaGet(serviceURL, appConstants.authorizationKey,"", function(response) {
			callback(response.data);
		});

	}

	service.updatePackageStatus = function(inputJsonString, callback) {
			communicationService.resultViaPost(webservices.bulkUpdatePackage, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}

	service.updatePackage = function(inputJsonString,callback) {
			communicationService.resultViaPost(webservices.updatePackage, appConstants.authorizationKey, headerConstants.json,inputJsonString, function(response) {
			callback(response.data);
		});

	}

	service.deletePackage = function(inputJsonString,callback) {
		    var serviceURL = webservices.deletePackage + "/" + inputJsonString;
			communicationService.resultViaGet(serviceURL, appConstants.authorizationKey, "", function(response) {
			callback(response.data);
		});

	}


   return service;


}]);
