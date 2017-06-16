	"use strict";

	angular.module("Users")

	taxiapp.controller("userController", ['$scope', '$rootScope', '$localStorage', 'UserService','RoleService', 'ngTableParams', '$routeParams', '$route','$location',  function($scope, $rootScope, $localStorage, UserService, RoleService, ngTableParams, $routeParams, $route, $location){

		
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
		$scope.activeTab = 0;
		$scope.user = {first_name: "", last_name: "", user_name: "", password: "", email: "", display_name: "", role: []}

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


	        	$scope.getAllUsers = function(){
	        		UserService.getUserList (function(response) {
	        			if(response.messageId == 200) {
	        				$scope.filter = {firstname: '', lastname : '', email : ''};

	        				$scope.tableParams = new ngTableParams({page:1, count:2, sorting:{firstname:"asc"}, filter:$scope.filter}, { total:response.data.length, counts:[], data: response.data});
				//multiple checkboxes
				
				$scope.simpleList = response.data;
				$scope.roleData = response.data;;
				$scope.checkboxes = {
					checked: false,
					items:{}
				};	
			}
		});
	        	}


	        	$scope.getAllRoles = function(){
						RoleService.getRoleList (function(response) {
							if(response.messageId == 200) {
								var len =  response.data.length;
								var rolePermissionlen = $scope.user.role.length;
								for( var i =0 ; i< len ; i++){
									if(($scope.user.role.indexOf(response.data[i]._id)) == -1)
										response.data[i].used = false;
									else
										response.data[i].used = true;
								}
								$scope.roleData = response.data;
								console.log('permission', $scope.roleData);
							}
						});
						}
	        	$scope.activeTab = 0;
	        	$scope.findOne = function () {
	        		if ($routeParams.id) {
	        			console.log('HELL')
	        			UserService.getUser ($routeParams.id, function(response) {
	        				console.log(response);
	        				if(response.messageId == 200) {
	        					console.log(response.data)
	        					$scope.user = response.data;
	        				}
	        			});
	        		}
	        		$scope.getAllRoles()
	        	}


	        	$scope.checkStatus = function (yesNo) {
					if (yesNo)
						return "pickedEven";
					else
						return "";
					}

				$scope.moveTabContents = function(tab){
				$scope.activeTab = tab;
				}

				$scope.selectRole = function (id) {
				var index = $scope.user.role.indexOf(id);
				if(index == -1)	
					$scope.user.role.push(id)
				else
					$scope.user.role.splice(index, 1)

				var roleLen = $scope.roleData.length;
				for (var a = 0; a < roleLen; ++a) {
					if ($scope.roleData[a]._id == id) {
						if ($scope.roleData[a].used) {
							$scope.roleData[a].used = false;
						} else {
							$scope.roleData[a].used = true;
						}
						break;
					}
				}
				
				console.log($scope.user.role);
				}


				$scope.updateData = function (type) {
				if ($scope.user._id) {
					console.log($scope.user);
					var inputJsonString = $scope.user;
					UserService.updateUser(inputJsonString, $scope.user._id, function(response) {
						if(response.messageId == 200) {
							if(type)
							$location.path( "/users" );
						else{
							++$scope.activeTab
						}
							
						}	
						else{
							$scope.message = err.message;
						} 
					});
				}
				else{
					var inputJsonString = $scope.user;
					console.log(inputJsonString)
					UserService.saveUser(inputJsonString, function(response) {
						if(response.messageId == 200) {
							$scope.message = '';
							$routeParams.id = response.data
							$scope.user = response.data;
							$scope.activeTab = 1;
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
		console.log($scope.selectedAction);
		console.log($scope.selection);
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
			UserService.updateUserStatus(inputJson, function(response) {
				$rootScope.message = messagesConstants.updateStatus;
				$route.reload();
			});
		}
		}
		


		//perform action
		
		$scope.performAction1 = function() {
			var data = $scope.checkboxes.items;	
			var records = [];
			var inputJsonString = "";
			var jsonString = "";

			var actionToPerform = "";
			
			$scope.selectAction = selectAction.value;

			if($scope.selectAction == "disable") {
				actionToPerform = false;
			}
			else if($scope.selectAction == "enable") {
				actionToPerform = true;
			}
			else if($scope.selectAction == "delete") {

				actionToPerform = "delete";
			}

			//console.log("data=", data);

			for(var id in data) {
				if(data[id]) {
					if(actionToPerform == "delete") {
						if(jsonString == "") {

							jsonString = '{"_id": "' + id + '", "is_deleted":"true"}';	
						}
						else {
							jsonString = jsonString + "," + '{"_id": "' + id + '", "is_deleted":"true"}';
						}
					}
					else {
						if(jsonString == "") {

							jsonString = '{"_id": "' + id + '", "enable":"' + actionToPerform + '"}';	
						}
						else {
							jsonString = jsonString + "," + '{"_id": "' + id + '", "enable":"' + actionToPerform + '"}';
						}
					}
				}
				
			}

			inputJsonString = "[" + jsonString + "]";

			if(actionToPerform == "delete") {
				
				UserService.deleteUser(inputJsonString, function(response) {
					$rootScope.message = messagesConstants.deleteUser;
					$route.reload();	
				});
			}
			else {
				UserService.statusUpdateUser(inputJsonString, function(response) {
					$rootScope.message = messagesConstants.updateStatus;
					$route.reload();
				});
			}

		}


	}

	]);