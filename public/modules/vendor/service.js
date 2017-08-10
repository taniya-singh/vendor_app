'use strict'

angular.module('Vendor')

.factory('VendorService', ['$http', 'communicationService', function($http, communicationService) {

	var service = {};

	service.totalVendor = function(callback) { 
			communicationService.resultViaGet(webservices.totalVendor, appConstants.authorizationKey, headerConstants.json, function(response) {
			callback(response.data);
		});

	}


	service.totalRevenue = function(callback) { 
			communicationService.resultViaGet(webservices.totalRevenue, appConstants.authorizationKey, headerConstants.json, function(response) {
			callback(response.data);
		});

	}

	service.totalSales = function(callback) { 
		console.log("inisdee vendor service")
			communicationService.resultViaGet(webservices.totalSales, appConstants.authorizationKey, headerConstants.json, function(response) {
			callback(response.data);
		});

	}

service.saleData = function(inputJsonString, callback) {
		console.log("inside saleData service")
			communicationService.resultViaPost(webservices.saleData, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}




	
	service.latestVendor = function(callback) { 
			communicationService.resultViaGet(webservices.latestVendor, appConstants.authorizationKey, headerConstants.json, function(response) {
			callback(response.data);
		});

	}
	service.saveVendor = function(inputJsonString, callback) {
		console.log("inside save vendor service")
			communicationService.resultViaPost(webservices.addVendor, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}


	


	service.getVendor= function(vendorId, callback) {
		var serviceURL = webservices.findOneVendor+ "/" + vendorId;
		communicationService.resultViaGet(serviceURL, appConstants.authorizationKey, "", function(response) {
			callback(response.data);
		});
	}
	service.getVendorOne = function(vendorId, callback) {
		var serviceURL = webservices.findVendor + "/" + vendorId;
		communicationService.resultViaGet(serviceURL, appConstants.authorizationKey, "", function(response) {
			callback(response.data);
		});
	}
	service.getVendorInfo = function(vendorId, callback) {
		var serviceURL = webservices.vendorJobsCount + "/" + vendorId;
		communicationService.resultViaGet(serviceURL, appConstants.authorizationKey, "", function(response) {
			callback(response.data);
		});
	}
	service.vendorAllJobs = function(vendorId,status,limit, callback) {
		var serviceURL = webservices.vendorAllJobs + "/" + vendorId+ "/" + status+ "/"+limit;
		communicationService.resultViaGet(serviceURL, appConstants.authorizationKey, "", function(response) {
			callback(response.data);
		});
	}
	service.updateVendor = function(inputJsonString, vendorId, callback) {
		var serviceURL = webservices.update + "/" + vendorId;
		communicationService.resultViaPost(serviceURL, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
		callback(response.data);
		});
	}


	service.updateVendorStatus = function(inputJsonString, callback) {
			communicationService.resultViaPost(webservices.bulkUpdateVendor, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}
	service.approveVendorStatus = function(inputJsonString, callback) {
			communicationService.resultViaPost(webservices.approve, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}


	service.getVendorList = function(inputJsonString,callback) {
			communicationService.resultViaPost(webservices.vendorList, appConstants.authorizationKey, headerConstants.json,inputJsonString, function(response) {
			callback(response.data);
		
		});

	}

	service.getCurrentVendorData = function(inputJsonString, callback) {
		communicationService.resultViaPost(webservices.getCurrentVendorData, appConstants.authorizationKey, headerConstants.json,inputJsonString, function(response) {
			callback(response.data);
		});
	}

	service.updateVendorStatus = function(inputJsonString, callback) {
			communicationService.resultViaPost(webservices.bulkUpdateVendor, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}

	service.resetpassword = function(inputJsonString, callback) {
		console.log("inside service",inputJsonString)
			communicationService.resultViaPost(webservices.resetpassword, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}

	service.registration = function(inputJsonString, callback) {

		
			$http.post("//registration", inputJsonString, {
				
					headers: {'Content-Type': undefined}
				})
				.success(function(response){
						if(response){
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

	
    service.exportVendorList = function(callback) {
		communicationService.resultViaGet(webservices.exportVendorList, appConstants.authorizationKey, headerConstants.json, function(response) {
			callback(response.data);
		});
	}
     

    service.updateVendordata = function(inputJsonString, callback) {
			communicationService.resultViaPost("/admin/update_vendor_info2", appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	} 

	service.updateVendorInformation = function(inputJsonString, callback) {

		console.log("inputJsonString",inputJsonString);

	$http.post("/vendor/updateVendorInformation", inputJsonString, {
					
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

	service.allVendorCount = function(callback) { 
			communicationService.resultViaGet(webservices.allVendorCount, appConstants.authorizationKey, headerConstants.json, function(response) {
			callback(response.data);
		});	
	};

	service.deleteVendor = function(inputJsonString, callback) {
			communicationService.resultViaPost(webservices.deleteVendor, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}

	return service;


}]);
