"use strict";

angular.module("Categories")

taxiapp.controller("categoryController", ['$scope', '$rootScope', '$localStorage', 'CategoryService', 'questionService', 'ngTableParams', '$routeParams', '$route',  '$window', '$timeout', '$location', function($scope, $rootScope, $localStorage, CategoryService, questionService, ngTableParams, $routeParams, $route, $window, $timeout, $location){
	
	if($localStorage.userLoggedIn) {
		$rootScope.userLoggedIn = true;
		$rootScope.loggedInUser = $localStorage.loggedInUsername;
	}
	else {
		$rootScope.userLoggedIn = false;
	}

	
	if($rootScope.message != "") {

		$scope.message = $rootScope.message;
	}

	$scope.category = {category_name: "", enable: false}
	//Toggle multilpe checkbox selection
	$scope.selection = [];
	$scope.selectionAll;
	$scope.toggleSelection = function toggleSelection(id) {
		//Check for single checkbox selection
		if(id){
			var idx = $scope.selection.indexOf(id);
            // is currently selected
            if (idx > -1) {
            	$scope.selection.splice(idx, 1);
            }
            // is newly selected
            else {
            	$scope.selection.push(id);
            }
        }
        //Check for all checkbox selection
        else{

        	//Check for all checked checkbox for uncheck
        	if($scope.selection.length > 0 && $scope.selectionAll){

        		$scope.selection = [];
        		$scope.checkboxes = {
        			checked: false,
        			items:{}
        		};	
        		$scope.selectionAll = false;
        	}
        	//Check for all un checked checkbox for check
        	else{
        		$scope.selectionAll = true
        		$scope.selection = [];
        		angular.forEach($scope.simpleList, function(item) {
        			$scope.checkboxes.items[item._id] = $scope.checkboxes.checked;
        			$scope.selection.push(item._id);
        		});
        	}
        }
        console.log($scope.selection)
    };

    	//apply global Search
			$scope.applyGlobalSearch = function() {
				var term = $scope.globalSearchTerm;

				if(term != "") {

					if($scope.isInvertedSearch) {
						term = "!" + term;
					}

					$scope.tableParams.filter({$ : term});
					$scope.tableParams.reload();			
				}
			}

	//empty the $scope.message so the field gets reset once the message is displayed.
	$scope.message = "";

	$scope.listAllCategory = function(){
	CategoryService.listCategory (function(response) {
		if(response.messageId == 200) {
			$scope.filter = {category_name: ''};
			$scope.tableParams = new ngTableParams({page:1, count:10, sorting:{category:"asc"}, filter:$scope.filter}, { total:response.data.length, counts:[], data: response.data});
			$scope.simpleList = response.data;
			$scope.checkboxes = {
				checked: false,
				items:{}
			};	
		}
	});
}

	
	$scope.showSearch = function() {
		if($scope.isFiltersVisible) {
			$scope.isFiltersVisible = false;	
		}
		else {
			$scope.isFiltersVisible = true;	
		}
	}

	//add category
	$scope.update = function() {
		var inputJsonString = "";
		if($scope.category_name == undefined) {
			$scope.category_name = "";
		}
		if($scope.enable == undefined) {
			$scope.enable = false;
		}
		if(!$scope.category._id) {
			inputJsonString = $scope.category;	
			CategoryService.addCategory(inputJsonString, function(response) {
					if(response.messageId == 200) {
						$scope.message = response.message;
						$timeout(function() {
			        	$location.path('/categories')
    			}, 3000);
					}
					else{
					$scope.message = response.message;
					}

			});
		}
		else {
			//edit
			inputJsonString = $scope.category;	
			CategoryService.updateCategory(inputJsonString, $scope.category._id, function(response) {
					if(response.messageId == 200) {
						$scope.message = response.message;
						$timeout(function() {
			        	$location.path('/categories')
    			}, 3000);
					}

			});
		}


	}

	$scope.findOne = function() {
		CategoryService.findOne($routeParams.categoryId, function(response) {
			if(response.messageId == 200) {
				$scope.category = response.data;
				$scope.categoryId = $routeParams.id;
			}
		});
	}


	$scope.performCategoryAction = function() {			
			var categoryLength =  $scope.selection.length;
			console.log(categoryLength);
			var updatedData = [];
			$scope.selectedAction = selectedAction.value;
			console.log($scope.selectedAction)
			if($scope.selectedAction == 0)
			$scope.message = messagesConstants.selectAction;
			else{	
			for(var i = 0; i< categoryLength; i++){
				var id =  $scope.selection[i];
				  if($scope.selectedAction == 3) {
				  updatedData.push({id: id, is_deleted: true});
				}
				else if($scope.selectedAction == 1) {
					updatedData.push({id: id, enable: true});
				}
				else if($scope.selectedAction == 2) {
					updatedData.push({id: id, enable: false});
				}
			}
			var inputJson = {data: updatedData}
				CategoryService.updateCategoryStatus(inputJson, function(response) {
					$rootScope.message = messagesConstants.updateStatus;
					$route.reload();
				});
			}
			}

	
			//perform action
			$scope.performAction = function() {			
			var questionLength =  $scope.selection.length;
			console.log(questionLength);
			var updatedData = [];
			$scope.selectedAction = selectedAction.value;
			console.log($scope.selectedAction)
			if($scope.selectedAction == 0)
			$scope.message = messagesConstants.selectAction;
			else{	
			for(var i = 0; i< questionLength; i++){
				var id =  $scope.selection[i];
				  if($scope.selectedAction == 3) {
				  updatedData.push({id: id, is_deleted: true});
				}
				else if($scope.selectedAction == 1) {
					updatedData.push({id: id, enable: true});
				}
				else if($scope.selectedAction == 2) {
					updatedData.push({id: id, enable: false});
				}
			}
			var inputJson = {data: updatedData}
				questionService.updateQuestionStatus(inputJson, function(response) {
					$rootScope.message = messagesConstants.updateStatus;
					$route.reload();
				});
			}
			}

	

	//list questions
	$scope.listQuestions = function() {
		var categoryId = $routeParams.categoryId;
		$scope.categoryId = categoryId;
		CategoryService.findOne(categoryId, function(response) {
			if(response.messageId == 200) {
				$scope.simpleList = []
				if(response.data.questions.length > 0) {
					$scope.filter = {question: ''};
					$scope.tableParams = new ngTableParams({page:1, count:10}, { total:response.data.questions.length, counts:[], data: response.data.questions});
					//multiple checkboxes
					$scope.simpleList = response.data.questions;
				}
				else {

					$window.location.href = "/#/questions/add/" + categoryId;
				}
			}
		});
		
	}

	
	

}]);
