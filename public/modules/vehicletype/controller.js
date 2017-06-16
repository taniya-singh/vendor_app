"use strict";

angular.module("Vehicletype")

taxiapp.controller("vehicletypeController", ['$scope', '$rootScope',  '$localStorage', 'VehicletypeService', 'ngTableParams', '$routeParams', '$route', function($scope,  $rootScope, $localStorage, VehicletypeService, ngTableParams, $routeParams, $route){


	//console.log("element=", $element);

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
	
	VehicletypeService.getVehicletypelist(function(response) {

				
		if(response.messageId == 200) {


			$scope.tableParams = new ngTableParams({page:1, count:10, sorting:{vehicleType:"asc"}}, { total:response.data.length, counts:[], data: response.data});
			
			//apply global Search
			$scope.applyGlobalSearch = function() {

				var term = $scope.globalSearchTerm;

				if(term != "") {

					if($scope.isInvertedSearch) {
						term = "!" + term;
					}

					$scope.tableParams.filter({ vehicleType: term });
				}

				
			}

			//multiple checkboxes
			var simpleList = response.data;
			$scope.checkboxes = {
				checked: false,
				items:{}
			};	

			// watch for check all checkbox
			    $scope.$watch(function() {
			      return $scope.checkboxes.checked;
			    }, function(value) {

			    	angular.forEach(simpleList, function(item) {

			       	$scope.checkboxes.items[item._id] = value;

			      });
			    });


			    // watch for data checkboxes
			    $scope.$watch(function() {
			      return $scope.checkboxes.items;
			    }, function(values) {
			    	//console.log("select one", values);

			      var checked = 0, unchecked = 0,
			          total = simpleList.length;
			      angular.forEach(simpleList, function(item) {
			        checked   +=  ($scope.checkboxes.items[item._id]) || 0;
			        unchecked += (!$scope.checkboxes.items[item._id]) || 0;
			      });
			      if ((unchecked == 0) || (checked == 0)) {
			        $scope.checkboxes.checked = (checked == total);
			      }


			      // grayed checkbox
			    // angular.element($element[0].getElementsByClassName("select-all")).prop("indeterminate", (checked != 0 && unchecked != 0));
			    var result = document.getElementsByClassName("select-all");

			   // console.log("result=" , result);

			    angular.element(result[0]).prop("indeterminate", (checked != 0 && unchecked != 0));

			  

			  
			    }, true);




		}//if

	});

	$scope.showSearch = function() {
		if($scope.isFiltersVisible) {
			$scope.isFiltersVisible = false;	
		}
		else {
			$scope.isFiltersVisible = true;	
		}
	}


	$scope.addVehicletype = function() {

		var inputJsonString = "";

		if($scope.vehicleType == undefined) {
			$scope.vehicleType = "";
		}

		if($scope.enable == undefined) {
			$scope.enable = false;
		}
		
		if($scope.vehicleTypeID == undefined) {

			inputJsonString = '{"vehicleType":"' + $scope.vehicleType + '", "enable":' + $scope.enable + '}';
			
		
			VehicletypeService.saveVehicleType(inputJsonString, function(err, response){

				if(err) {
					$scope.message = err.message;
				}
				else {
					if(response.data.messageId == 200) {
						$scope.message = "Vehicle type added successfully";
					}	
				}
				
			});
		}//if
		else {
			
			//edit
			inputJsonString = '{"_id":"' + $scope.vehicleTypeID+ '", "vehicleType":"' + $scope.vehicleType + '", "enable":' + $scope.enable + '}';	
			
			VehicletypeService.updateVehicleType(inputJsonString, function(err, response) {
				if(err) {
					$scope.message = err.message;
				}
				else {
					if(response.data.messageId == 200) {
						$scope.message = "Vehicle type updated successfully";
					}
				}

			});

		}
	}


	$scope.editVehicleType = function() {

		VehicletypeService.editVehicleType($routeParams.id, function(response) {

						
			if(response.messageId == 200) {
				$scope.vehicleType = response.data.vehicleType;
				$scope.enable = response.data.enable;
				$scope.vehicleTypeID = $routeParams.id;
			}
			
		});
	}

	if($routeParams.id) {
		$scope.editVehicleType();
	}


	//perform Action
	$scope.performAction = function() {	

		

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
			
			VehicletypeService.deleteVehicleType(inputJsonString, function(response) {
				$rootScope.message = "Vehicle type deleted successfully";
				$route.reload();	
			});
		}
		else {
			VehicletypeService.statusUpdateVehicleType(inputJsonString, function(response) {
				$rootScope.message = "Status updated successfully";
				$route.reload();
			});
		}	
		

	}
	
}]);