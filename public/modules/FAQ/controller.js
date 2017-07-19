"use strict";


angular.module("FAQ");

munchapp.controller("faqController", ['$scope', '$rootScope', '$location', '$localStorage', '$stateParams','$state' ,'faqService',function($scope, $rootScope, $location, $localStorage, $stateParams,$state,faqService) {
console.log("ghjgjgjg")

	if ($localStorage.userLoggedIn) {
		$rootScope.userLoggedIn = true;
		$rootScope.loggedInUser = $localStorage.loggedInUsername;
	} else {
		$rootScope.userLoggedIn = false;
	}

	if ($rootScope.message != "") {

		$scope.message = $rootScope.message;
	}
	$scope.updateq = "false";
	$scope.modalData = {}
	$scope.oneAtATime = true;

	$scope.blackScope = function(){
		$scope.updateq = "false";
		$scope.modalData = {}
	}

	$scope.addQuestion = function(){
		console.log($scope.modalData);
		faqService.insertQuestionAnswer($scope.modalData,function(response){
			console.log(response);
			$scope.allQuestion();
		})
	}

	$scope.allQuestion =function(){
		faqService.allfaq(function(response){
			console.log(response.data);
			if (response.data.length == 0) {
				$scope.showStatus = true;
			} else {
				$scope.showStatus = false;
			}
			$scope.showQuestionAnswer = response.data;

		})
	}

	$scope.deleteItem = function(){
		var inputJson = {_id:$rootScope.idToDelete,"status":"delete"};
		faqService.deleteAndQues(inputJson,function(response){
			console.log(response);
			$scope.allQuestion();
		})
	}


	$scope.delete = function(id){
		$rootScope.idToDelete =id; 
		
	}

	$scope.edit = function(id){
		// e.stopPropagation();
		$scope.updateq = "true";
		$scope.modalData = id;
	}

	$scope.deactivate = function(id){
		var inputJson = {_id:id,"status":"deactivate"};
		faqService.deleteAndQues(inputJson,function(response){
			console.log(response);
			$scope.allQuestion();
		})
	}

	$scope.activate = function(id){
		var inputJson = {_id:id,"status":"activate"};
		faqService.deleteAndQues(inputJson,function(response){
			console.log(response);
			$scope.allQuestion();
		})
	}

	$scope.update = function(){
		
		console.log("$scope.modalData",$scope.modalData);
		console.log("why not running");
		$scope.modalData.status = "update";
		console.log("run running");
		faqService.deleteAndQues($scope.modalData,function(response){
			console.log(response);
			$scope.modalData = {}
			$scope.allQuestion();
		})
	}

}]);

