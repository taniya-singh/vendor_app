"use strict";


angular.module("eManagement");

munchapp.controller('emailManagementController', ['$scope', '$rootScope', '$location',  '$localStorage', '$auth', '$stateParams','toastr','$state','emailService' ,function($scope, $rootScope, $location,$localStorage, $auth, $stateParams,toastr,$state,emailService) {

	if ($localStorage.userLoggedIn) {
		$rootScope.userLoggedIn = true;
		$rootScope.loggedInUser = $localStorage.loggedInUsername;
	} else {
		$rootScope.userLoggedIn = false;
	}

	if ($rootScope.message != "") {

		$scope.message = $rootScope.message;
	}
	$scope.disabled = false;
	var myobj = {};
	$scope.titles = [];
	$scope.changeArray = [];
	CKEDITOR.instances['editor2'].setData("");
	var ckeditor = CKEDITOR.instances['editor2'];
	ckeditor.on('focus', function() {
		// console.log('on focus');
		$scope.errorObj.description_error = "";
	})

	$scope.emailNewsletter = function(req,res){
		emailService.getEmail(function(response){
			console.log("response",response);
			$scope.information = response.data[0];
			$scope.changeArray = response.data;
			console.log(response.data.length);
			for(var i=0;i<response.data.length;i++){
				myobj = {_id:response.data[i]._id,title:response.data[i].title}
				$scope.titles.push(myobj);
			}
			console.log($scope.titles)

			CKEDITOR.instances['editor2'].setData(response.data[0].description);
		})
	}

	$scope.changeDescription = function(id){
		console.log("changeDescription",id);
		console.log("$scope.changeArray",$scope.changeArray);
		for(var i=0;i<$scope.changeArray.length;i++){
			if(id == $scope.changeArray[i]._id){
				console.log("inside if block");
				$scope.information = $scope.changeArray[i];
				CKEDITOR.instances['editor2'].setData($scope.changeArray[i].description);
			}
		}
	}

	var aboutUsData = CKEDITOR.instances['editor2'].getData();

	$scope.sentNewsLetter = function(req,res){
		$scope.disabled = true;
		var aboutUsData = CKEDITOR.instances['editor2'].getData();
		console.log($scope.information);
		console.log("aboutUsData",aboutUsData);
		var inputData = {"description":aboutUsData,"title":$scope.information.title}

		emailService.sentEmailNewsLetter(inputData,function(response){
			console.log(response);
			toastr.success('Mails has been sent.');
			// toastr.success('Data Saved Successfully.');
			$scope.disabled = true;
		})
	}

	// $scope.sendEmailNewsLetter

	
}]);

