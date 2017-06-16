"use strict";

angular.module('Vehicle')

.factory('VehicleService', function($resource) {

	 return $resource(webservices.listVehicles);
});


/*
services.factory('Api', ['$resource',
 function($resource) {
  return {
    Recipe: $resource('/recipes/:id', {id: '@id'}),
    Users:  $resource('/users/:id', {id: '@id'}),
    Group:  $resource('/groups/:id', {id: '@id'})
  };
}]);

function myCtrl($scope, Api){
  $scope.recipe = Api.Recipe.get({id: 1});
  $scope.users = Api.Users.query();
  ...
*/