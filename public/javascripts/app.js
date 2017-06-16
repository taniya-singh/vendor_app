"use strict";

angular.module("Authentication", []);
angular.module("Home", []);
angular.module("Vehicletype", []);
angular.module("Vehicle", []);
angular.module("communicationModule", []);
angular.module("Users", []);
angular.module("Roles", []);
angular.module("Permissions", []);
angular.module("Questionnaire", ['ui.bootstrap']);
angular.module("Question", []);
angular.module("Categories", []);

var taxiapp = angular.module('taxiapp', ['ngRoute', 'ngStorage', 'ngTable', 'ngResource', 'ui.grid', 'Authentication', 'Home', 'Vehicletype', 'Vehicle','communicationModule', 'Users', 'Roles','Permissions', 'satellizer', 'Questionnaire', 'Question', 'Categories'])

.factory('basicAuthenticationInterceptor', function() {
	
	var basicAuthenticationInterceptor = {
		request:function(config) {
			config.headers['Authorization'] = 'Basic ' + appConstants.authorizationKey;
 			config.headers['Content-Type'] = headerConstants.json;
	
			return config;
		}
	};

	return basicAuthenticationInterceptor;
	
})

.config(['$routeProvider', '$httpProvider', '$authProvider', '$locationProvider', function($routeProvider, $httpProvider, $authProvider, $locationProvider) {

	//$httpProvider.interceptors.push('basicAuthenticationInterceptor');

	$authProvider.facebook({
		clientId: facebookConstants.facebook_app_id,
		url: '/adminlogin/auth/facebook'		
	});

	$authProvider.twitter({
		url:'/adminlogin/auth/twitter'
	});

	$authProvider.google({
		clientId : googleConstants.google_client_id,
		url:'/adminlogin/auth/google'
	});

	$routeProvider
	.when('/', {
		controller:'homeController',
		templateUrl:'/modules/home/views/home.html'
	})

	.when('/home', {
		controller:'homeController',
		templateUrl:'/modules/home/views/home.html'
	})

	.when('/login', {
		controller:'loginController',
		templateUrl:'/modules/authentication/views/login.html'
	})

	.when('/forgot-password', {
		controller:'loginController',
		templateUrl:'/modules/authentication/views/forgot-password.html'
	})

	.when('/vehicletype', {
		controller:'vehicletypeController',
		templateUrl:'/modules/vehicletype/views/vehicletype.html'
	})

	.when('/vehicletype/add', {
		controller:'vehicletypeController',
		templateUrl:'/modules/vehicletype/views/addvehicletype.html'
	})

	.when('/vehicletype/edit/:id', {
		controller:'vehicletypeController',
		templateUrl:'/modules/vehicletype/views/addvehicletype.html'
	})

	.when('/vehicles', {
		controller:"vehicleController",
		templateUrl:'/modules/vehicle/views/vehicles.html'
	})

	.when('/users', {
		controller : "userController",
		templateUrl : "/modules/users/views/listuser.html"
	})

	.when('/users/add', {
		controller : "userController",
		templateUrl : "/modules/users/views/adduser.html"
	})

	.when('/users/signup', {
		controller : "userController",
		templateUrl : "/modules/users/views/signup.html"
	})

	.when('/users/edit/:id' , {
		controller: "userController",
		templateUrl : "/modules/users/views/adduser.html"
	})
  
  .when('/roles', {
		controller : "roleController",
		templateUrl : "/modules/roles/views/list_role.html"
	})
	.when('/roles/add', {
		controller : "roleController",
		templateUrl : "/modules/roles/views/add_role.html"
	})
	.when('/roles/edit/:roleId', {
		controller : "roleController",
		templateUrl : "/modules/roles/views/add_role.html"
	})
	.when('/permissions', {
		controller : "permissionController",
		templateUrl : "/modules/permissions/views/list_permission.html"
	})
	.when('/permissions/add', {
		controller : "permissionController",
		templateUrl : "/modules/permissions/views/add_permission.html"
	})
	.when('/permissions/edit/:permissionId', {
		controller : "permissionController",
		templateUrl : "/modules/permissions/views/add_permission.html"
	})

	.when('/categories' , {
		controller: "categoryController",
		templateUrl:"/modules/categories/views/listcategory.html"
	})

	.when('/categories/add' , {
		controller: "categoryController",
		templateUrl:"/modules/categories/views/addcategory.html"
	})

	.when('/categories/editcategory/:categoryId', {
		controller:"categoryController",
		templateUrl:"/modules/categories/views/addcategory.html"
	})

	.when('/categories/listquestions/:categoryId' , {
		controller : "categoryController",
		templateUrl : "/modules/categories/views/listquestions.html"
	})


	
	.when('/questionnaire', {
		controller : "questionnaireController",
		templateUrl : "/modules/questionnaire/views/listquestionnaire.html"
	})

	.when('/questionnaire/add', {
		controller : "questionnaireController",
		templateUrl : "/modules/questionnaire/views/addquestionnaire.html"
	})

	.when('/viewcategories/:questionnaireID', {
		controller: "questionnaireController",
		templateUrl: "/modules/questionnaire/views/listcategories.html"
	})

	.when('/viewcategoryquestions/:catquestionnaireID', {
		controller : "questionnaireController",
		templateUrl : "/modules/questionnaire/views/listquestions.html"
	})

	.when('/questionnaire/edit/:questionnarieId', {
		controller : "questionnaireController",
		templateUrl : "/modules/questionnaire/views/addquestionnaire.html"
	})	

	.when('/questions/add/:categoryId' , {
		controller : "questionController",
		templateUrl : "/modules/questions/views/addquestion.html"
	})

	.when('/questions/editquestion/:questionId', {
		controller : "questionController",
		templateUrl : "/modules/questions/views/addquestion.html"
	})

	.otherwise({
		redirectTo:'/modules/authentication/views/login.html'
	});

	//to remove the # from the URL
	//$locationProvider.html5Mode({enabled : true, requireBase : false});
}])

.run(['$rootScope', '$location', '$http', '$localStorage', function($rootScope, $location, $http, $localStorage) {

	if(!$localStorage.userLoggedIn) {
		$location.path('/login');
	}
}]);
