"use strict";

angular.module("Home")

taxiapp.controller("homeController", ['$scope', '$rootScope', '$localStorage', function($scope, $rootScope, $localStorage) {
		
	if($localStorage.userLoggedIn) {
		$rootScope.userLoggedIn = true;
		$rootScope.loggedInUser = $localStorage.loggedInUsername;
	}
	else {
		$rootScope.userLoggedIn = false;
	}


}]);