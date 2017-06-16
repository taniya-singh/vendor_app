"use strict";

angular.module("Permissions")

taxiapp.controller("permissionController", ['$scope', '$rootScope', '$localStorage', 'PermissionService', 'ngTableParams', '$routeParams', '$route', '$location',  function($scope, $rootScope, $localStorage, PermissionService, ngTableParams, $routeParams, $route, $location){

	
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

	//empty the $scope.message so the field gets reset once the message is displayed.
	$scope.message = "";
	$scope.permission = {permission: "", enable: false}
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


        	$scope.getAllPermission = function(){
        		PermissionService.getPermissionList (function(response) {
        			if(response.messageId == 200) {
        				$scope.filter = {permission: '', enable: true};
        				$scope.tableParams = new ngTableParams({page:1, count:10, sorting:{permission:"asc"}, filter:$scope.filter},
        					{ total:response.data.length, counts:[], data: response.data});

			//multiple checkboxes
			console.log(response.data)
			$scope.simpleList = response.data;
			$scope.permissionData = response.data;;
			$scope.checkboxes = {
				checked: false,
				items:{}
					};	
				}
			});
        	}
        	$scope.activeTab = 0;
        	$scope.findOne = function () {
        		console.log($routeParams.permissionId)
        		if ($routeParams.permissionId) {
        			PermissionService.getPermission ($routeParams.permissionId, function(response) {
        				console.log(response);
        				if(response.messageId == 200) {
        					$scope.permission = response.data;
        				}
        			});
        		}
        	}

        	

        	$scope.updateData = function () {
        		if ($scope.permission._id) {
        			console.log($scope.permission);
        			var inputJsonString = $scope.permission;
        			PermissionService.updatePermission(inputJsonString, $scope.permission._id, function(response) {
        				if(response.messageId == 200) {
        					$location.path( "/permissions" );
        				}	
        				else{
        					$scope.message = err.message;
        				} 
        			});
        		}
        		else{
        			var inputJsonString = $scope.permission;
        			PermissionService.savePermission(inputJsonString, function(response) {
        				if(response.messageId == 200) {
        					$scope.message = '';
        					$routeParams.permissionId = response.data
        					$scope.permission = response.data;
        					$location.path( "/permissions" );
        				}	
        				else{
        					$scope.message = response.message;
        				} 


        			});
        		}
        	}

//perform action
$scope.performAction = function() {						
	var roleLength =  $scope.selection.length;

	var updatedData = [];
	$scope.selectedAction = selectedAction.value;
	console.log($scope.selectedAction )
	if($scope.selectedAction == 0)
		$scope.message = messagesConstants.selectAction;
	else{	
		for(var i = 0; i< roleLength; i++){
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
		PermissionService.updatePermissionStatus(inputJson, function(response) {
			$rootScope.message = messagesConstants.updateStatus;
			$route.reload();
		});
	}
}


}]);