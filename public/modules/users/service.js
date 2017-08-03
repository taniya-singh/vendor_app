'use strict'

angular.module('Users')

.factory('UserService', ['$http', 'communicationService', function($http, communicationService) {

	var service = {};

	service.totalUser = function(callback) { 
			communicationService.resultViaGet(webservices.totalUser, appConstants.authorizationKey, headerConstants.json, function(response) {
			callback(response.data);
		});

	}

	
	service.latestUser = function(callback) { 
			communicationService.resultViaGet(webservices.latestUser, appConstants.authorizationKey, headerConstants.json, function(response) {
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
	service.getUserOne = function(userId, callback) {
		var serviceURL = webservices.findUser + "/" + userId;
		communicationService.resultViaGet(serviceURL, appConstants.authorizationKey, "", function(response) {
			callback(response.data);
		});
	}
	service.getUserInfo = function(userId, callback) {
		var serviceURL = webservices.userJobsCount + "/" + userId;
		communicationService.resultViaGet(serviceURL, appConstants.authorizationKey, "", function(response) {
			callback(response.data);
		});
	}
	service.userAllJobs = function(userId,status,limit, callback) {
		var serviceURL = webservices.userAllJobs + "/" + userId+ "/" + status+ "/"+limit;
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
	service.approveUserStatus = function(inputJsonString, callback) {
			communicationService.resultViaPost(webservices.approve, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}


	

	service.getUserList = function(inputJsonString,callback) {
		console.log("aaaaaaaaaaaaaaaa")
			communicationService.resultViaPost(webservices.userList, appConstants.authorizationKey, headerConstants.json,inputJsonString, function(response) {
			callback(response.data);
		
		});

	}

	service.getCurrentUserData = function(inputJsonString, callback) {
		communicationService.resultViaPost(webservices.getCurrentUserData, appConstants.authorizationKey, headerConstants.json,inputJsonString, function(response) {
			callback(response.data);
		});
	}

	service.updateUserStatus = function(inputJsonString, callback) {
			communicationService.resultViaPost(webservices.bulkUpdateUser, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}

	service.resetPassword = function(inputJsonString, callback) {
			communicationService.resultViaPost(webservices.resetPassword, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}

	service.registration = function(inputJsonString, callback) {

		//console.log("inputJsonString",inputJsonString);
			$http.post("/user/registration", inputJsonString, {
				//	transformRequest: angular.identity,
					headers: {'Content-Type': undefined}
				})
				.success(function(response){
						if(response){
							callback(response);
							//return { response:$q.defer().resolve(response)};
						}
						else{
							$q.reject(response);
							callback({ response:$q.defer().promise});
							//return { response:$q.defer().promise};
						}
					})
				.error(function(err){ 
					alert('There was some error uploading your files. Please try Uploading them again.');
				});
	}

	
	
    service.exportUserList = function(callback) {
		communicationService.resultViaGet(webservices.exportUserList, appConstants.authorizationKey, headerConstants.json, function(response) {
			callback(response.data);
		});
	}
     

    service.updateUserdata = function(inputJsonString, callback) {
			communicationService.resultViaPost("/user/updateUserdata", appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	} 

	service.updateUserInformation = function(inputJsonString, callback) {

		console.log("inputJsonString",inputJsonString);

	$http.post("/user/updateUserInformation", inputJsonString, {
					
					headers: {'Content-Type': undefined}
				})
				.success(function(response){
						if(response){
							console.log("m here in resposnne")
							callback(response);
							
						}
						else{
							$q.reject(response);
							callback({ response:$q.defer().promise});
							
						}
					})
				.error(function(err){ 
					alert('There was some error uploading your files. Please try Uploading them again.');
				});
	}

	service.unSubscribe = function(inputJsonString, callback) {
			communicationService.resultViaPost(webservices.unSubscribe, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}

	service.allUsersCount = function(callback) { 
			communicationService.resultViaGet(webservices.allUsersCount, appConstants.authorizationKey, headerConstants.json, function(response) {
			callback(response.data);
		});	
	};

	service.deleteUser = function(inputJsonString, callback) {
			communicationService.resultViaPost(webservices.deleteUser, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}

	return service;


}]);
