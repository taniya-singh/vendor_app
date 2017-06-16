"use strict";

angular.module("Vehicle")

taxiapp.controller("vehicleController", ["$scope", "$rootScope", "$localStorage","VehicleService", function($scope, $rootScope, $localStorage, VehicleService) {

	if($localStorage.userLoggedIn) {
		$rootScope.userLoggedIn = true;
		$rootScope.loggedInUser = $localStorage.loggedInUsername;
	}
	else {
		$rootScope.userLoggedIn = false;
	}

	var getVehicleList = function(pageNumber, pageSize) {

			var vehicleList = VehicleService.get({pageSize:pageSize, pageNumber:pageNumber}, function() {
			$scope.vehicleData = vehicleList.data;
			$scope.pageNumber = pageNumber;
			$scope.getTotalPages = Math.ceil(vehicleList.totalRecords/pageSize);
		});

	}

	$scope.pageNumber = pagingConstants.defaultPageNumber;
	$scope.pageSize = pagingConstants.defaultPageSize;

	$scope.nextPage = function() {
		if($scope.pageNumber < $scope.getTotalPages) {
				$scope.pageNumber++;
				getVehicleList($scope.pageNumber, $scope.pageSize);
		
			}
	}

	$scope.previousPage = function() {

		if($scope.pageNumber > 1) {
			$scope.pageNumber--;
			getVehicleList($scope.pageNumber, $scope.pageSize);
			
		}
	}

	getVehicleList($scope.pageNumber , $scope.pageSize);


}]);