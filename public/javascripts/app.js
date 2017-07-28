"use strict";

angular.module("Authentication", []);
angular.module("Home", []);
angular.module("communicationModule", []);
angular.module("helpBlock",['oitozero.ngSweetAlert']);
angular.module("Users", ['oitozero.ngSweetAlert']);
angular.module("Vendor", ['oitozero.ngSweetAlert', 'moment-picker']);
angular.module("FAQ",[]);
angular.module("emailManagement",[]);
angular.module("myApp", ["ngTable"]);
//angular.module("Packages",['oitozero.ngSweetAlert']);




var munchapp = angular.module('munchapp', [
	'naif.base64',
	'ngMap',
	'ngMask',
	'ngRoute',
	'ngStorage',
	'ngTable',
	'ngResource',
	'ngMessages',
	'ui.grid',
	'ui.router',
	'Authentication',
	'Home',
	'communicationModule',
	'Users',
	'Vendor',
	'gm',
	'FAQ',
	'emailManagement',
	'ui.bootstrap',
	'satellizer',
	'ngFileUpload',
	'helpBlock',
    'oitozero.ngSweetAlert',
	'ngImgCrop',
	'uiSwitch'
	]);
function checkloggedIn($rootScope, $localStorage, $http) {
    
    if($localStorage.userLoggedIn) {
	    $rootScope.userLoggedIn 	= true;	   

    }
  

   else if($localStorage.vendorLoggedIn) {
	    $rootScope.vendorLoggedIn 	= true;	   

    }


     else {
	    $rootScope.userLoggedIn = false;
	    $rootScope.vendorLoggedIn = false;
	    $state.go('/login');
    }
}

munchapp.factory('basicAuthenticationInterceptor', ['$q','$localStorage','$location' , '$rootScope' , '$timeout', function($q , $localStorage , $location, $rootScope, $timeout) {
	
	var basicAuthenticationInterceptor = {
		request:function(config) {  
			if($localStorage.authorizationToken){  //console.log("here ",$localStorage.authorizationToken);
			config.headers['Authorization'] = 'Bearer ' + $localStorage.authorizationToken;
			}
			//config.headers['Authentication'] = 'Basic ' + appConstants.authorizationKey;
 			config.headers['Content-Type'] = headerConstants.json;			
			return config;
		}
	};

	return basicAuthenticationInterceptor;
	
}]).filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
})

munchapp.config(['$routeProvider','$stateProvider', '$urlRouterProvider' , '$httpProvider', '$authProvider', '$locationProvider', function($routeProvider,$stateProvider, $urlRouterProvider , $httpProvider, $authProvider, $locationProvider) {

	$httpProvider.interceptors.push('basicAuthenticationInterceptor');


	$stateProvider
		.state('/', {
			resolve: {
				mess: function($location, $localStorage) {

					if ($localStorage.userLoggedIn != true) {
						$state.go('/login');
					}
						
				}
			},
			url: "/",
			controller:'homeController',
			templateUrl:'/modules/home/views/home.html'
		})

		.state('/home', {
			resolve: {
				mess: function($location, $localStorage) {

					if ($localStorage.userLoggedIn != true) {
						$state.go('/login');
					}
					
						
				}
			},
			url: "/home",
			controller:'homeController',
			templateUrl:'/modules/home/views/home.html'
		})

		.state('/login', {			
			url: "/login",
			controller:'loginController',
			templateUrl:'/modules/authentication/views/login.html'
		})
	.state('/profile', {
		
		resolve: {
				mess: function($location, $localStorage) {

					if ($localStorage.userLoggedIn != true) {
						$state.go('/login');
					}
					
						
				}
			},
		url: "/profile",
		controller:'loginController',
		templateUrl:'/modules/authentication/views/profile.html'
	})
	// .state('/setting', {
		
	// 	resolve: {
	// 			mess: function($location, $localStorage) {

	// 				if ($localStorage.userLoggedIn != true) {
	// 					$state.go('/login');
	// 				}
					
						
	// 			}
	// 		},
	// 	url: "/setting",
	// 	controller:'loginController',
	// 	templateUrl:'/modules/authentication/views/setting.html'
	// })
	.state('/forgot-password', {
		
		url: "/forgot-password",
		controller:'loginController',
		templateUrl:'/modules/authentication/views/forgot-password.html'
	})
	/*.state('/reset-password/:vStr', {		
		url: "/reset-password/:vStr",
		controller:'loginController',
		templateUrl:'/modules/authentication/views/reset-password.html'
	})*/
	.state('/resetpassword/:id', {
		url:"/resetpassword/:id",
			controller:'loginController',
		templateUrl:'/modules/authentication/views/resetpassword.html'
		// resolve: {
		// 		mess: function($location, $localStorage) {

		// 			console.log ($localStorage);
		// 			if ($localStorage.userLoggedIn != true) {
		// 				$state.go('/resetpassword');
		// 			}
					
						
		// 		}
		// 	},
	
	})
	.state('/users/list', {
		// resolve: {
		// 		mess: function($location, $localStorage) {

		// 			console.log ($localStorage);
		// 			if ($localStorage.userLoggedIn != true) {
		// 				$state.go('/login');
		// 			}
					
						
		// 		}
		// 	},
		resolve: {
                    mess: function($localStorage,$q,$state) {
                        var deferred = $q.defer();
                        if ($localStorage.userLoggedIn!= true) {
                             setTimeout(function() {
                                deferred.resolve()
                                $state.go('/login');
                            }, 0);
                            return deferred.promise;
                        }
                    }
                },
		url: "/users",
		controller : "userController",
		templateUrl : "/modules/users/views/listuser.html"
	})

	.state('/users/add', {

		resolve: {
                    mess: function($localStorage,$q,$state) {
                        var deferred = $q.defer();
                        if ($localStorage.userLoggedIn!= true) {
                             setTimeout(function() {
                                deferred.resolve()
                                $state.go('/login');
                            }, 0);
                            return deferred.promise;
                        }
                    }
                },
		url: "/users/add",
		controller : "userController",
		templateUrl : "/modules/users/views/adduser.html"
	})

	.state('/users/edit/:id' , {

		resolve: {
                    mess: function($localStorage,$q,$state) {
                        var deferred = $q.defer();
                        if ($localStorage.userLoggedIn!= true) {
                             setTimeout(function() {
                                deferred.resolve()
                                $state.go('/login');
                            }, 0);
                            return deferred.promise;
                        }
                    }
                },
		url: "/users/edit/:id",
		controller: "userController",
		templateUrl : "/modules/users/views/adduser.html"
	})
  .state('/users/profile/:id' , {

		resolve: {
                    mess: function($localStorage,$q,$state) {
                        var deferred = $q.defer();
                        if ($localStorage.userLoggedIn!= true) {
                             setTimeout(function() {
                                deferred.resolve()
                                $state.go('/login');
                            }, 0);
                            return deferred.promise;
                        }
                    }
                },
		url: "/users/profile/:id",
		controller: "userController",
		templateUrl : "/modules/users/views/userprofile.html"
	})





	.state('/admin/vendorList', {
		resolve: {
                    mess: function($localStorage,$q,$state) {
                        var deferred = $q.defer();
                        if ($localStorage.userLoggedIn!= true) {
                             setTimeout(function() {
                                deferred.resolve()
                                $state.go('/login');
                            }, 0);
                            return deferred.promise;
                        }
                    }
                },
		url: "/vendor",
		controller : "vendorController",
		templateUrl : "/modules/vendor/views/listvendor.html"
	})

	.state('/FAQ', {
		resolve: {
                    mess: function($localStorage,$q,$state) {
                        var deferred = $q.defer();
                        if ($localStorage.userLoggedIn!= true) {
                             setTimeout(function() {
                                deferred.resolve()
                                $state.go('/login');
                            }, 0);
                            return deferred.promise;
                        }
                    }
                },
		url: "/FAQ",
		controller : "faqController",	
		templateUrl : "/modules/FAQ/views/faq.html"
	})

	.state('/admin/signupVendor', {

		resolve: {
                    mess: function($localStorage,$q,$state) {
                        var deferred = $q.defer();
                        if ($localStorage.userLoggedIn!= true) {
                             setTimeout(function() {
                                deferred.resolve()
                                $state.go('/login');
                            }, 0);
                            return deferred.promise;
                        }
                    }
                },
		url: "/vendor/add",
		controller : "vendorController",
		templateUrl : "/modules/vendor/views/addvendor.html"
	})

	.state('/admin/edit/:id' , {

		resolve: {
                    mess: function($localStorage,$q,$state) {
                        var deferred = $q.defer();
                        if ($localStorage.userLoggedIn!= true) {
                             setTimeout(function() {
                                deferred.resolve()
                                $state.go('/login');
                            }, 0);
                            return deferred.promise;
                        }
                    }
                },
		url: "/vendor/edit/:id",
		controller: "vendorController",
		templateUrl : "/modules/vendor/views/addvendor.html"
	})
  .state('/admin/profile/:id' , {

		resolve: {
                    mess: function($localStorage,$q,$state) {
                        var deferred = $q.defer();
                        if ($localStorage.userLoggedIn!= true) {
                             setTimeout(function() {
                                deferred.resolve()
                                $state.go('/login');
                            }, 0);
                            return deferred.promise;
                        }
                    }
                },
		url: "/vendor/profile/:id",
		controller: "vendorController",
		templateUrl : "/modules/vendor/views/vendorprofile.html"
	})
  





  //   .state('cmsManagement', {
		// 	url: '/help/cmsManagement',
		// 	controller: "cmsController",
		// 	templateUrl: "/modules/helpBlock/views/cmsManagement.html"
		// 	// resolve: {
		// 	// 		checklogin: cmsCheck
		// 	// 	}
		// })

		// .state('cmsPageEdit', {
		// 	url: '/help/:_id',
		// 	params:{
		// 		_id:null
		// 	},
		// 	controller: "cmsController",
		// 	templateUrl: "/modules/helpBlock/views/cmsManagement.html"
		// 	// resolve: {
		// 	// 		checklogin: cmsCheck
		// 	// 	}
		// })

		// .state('cmslisting', {
		// 	url: '/cmslisting',
		// 	controller: "cmsListingController",
		// 	templateUrl: "/modules/helpBlock/views/cmsListing.html"
		// 	// resolve: {
		// 	// 		checklogin: cmsCheck
		// 	// 	}
		// })

		// .state('addpackage', {
		// 	url: '/addpackage',
		// 	controller: "packageController",
		// 	templateUrl: "/modules/packages/views/addpackage.html"		
		// })

		// .state('packages', {
		// 	url: '/packages',
		// 	controller: "packageController",
		// 	templateUrl: "/modules/packages/views/packages.html"
			
		// })

		// .state('editPackage', {
		// 	url: '/editPackage/:_id',
		// 	params:{
		// 		_id:null
		// 	},
		// 	controller: "packageController",
		// 	templateUrl: "/modules/packages/views/addpackage.html"	
		// })

		.state('reset_password',{
			url:'/admin/:email/:id',
			params:{
				email:null,
				id:null
			},
			controller:"loginController",
			templateUrl:"/modules/authentication/views/reset-password.html"
		})
  
  
	 
	
	
	
	
	
	
	
	
	$urlRouterProvider.otherwise("/login");
	

	//to remove the # from the URL
	//$locationProvider.html5Mode({enabled : true, requireBase : false});
}])

munchapp.run(['$state','$rootScope', '$location', '$http', '$localStorage','$route','$routeParams','$stateParams', function($state,$rootScope, $location, $http, $localStorage,$route,$routeParams,$stateParams) {


// console.log("-------------",$localStorage.userLoggedIn)
	// if(!$localStorage.userLoggedIn) { 
	// 	$state.go('/login');
	// }
	$rootScope.nav=nav;

	$rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams; 
 //   console.log("asdfdasf",$state.current.name)
	
	
}]);


munchapp.directive('compareTo', [function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
}]);
munchapp.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});
munchapp.filter('dateCompare', function () {
	//alert(dueDate)
  return function (dueDate) {

    var onlydate = new Date(dueDate);
    //console.log("job due ",onlydate)
    var month = onlydate.getMonth()+1;
    var day   = onlydate.getDate();
    var year  = onlydate.getFullYear();







    var end_date2 = new Date();

    var month1 = end_date2.getMonth()+1;
    var day1   = end_date2.getDate();
    var year1  = end_date2.getFullYear();

    //console.log(month+' day ' +day+' year '+year1)
     // console.log(month1+' day1 ' +day1+' year1 '+year1)

    if((month1 >= month  && day1>day && year1>=year) || (month1 > month  && year1>=year) || (year1>year)){
      return true;
    }else{
        return false;
    }

  };
});
munchapp.directive('capitalizeFirst', function($parse) {
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, modelCtrl) {
			var capitalize = function(inputValue) {
				if (inputValue === undefined) {
					inputValue = '';
				}
				var capitalized = inputValue.charAt(0).toUpperCase() +
					inputValue.substring(1);
				if (capitalized !== inputValue) {
					modelCtrl.$setViewValue(capitalized);
					modelCtrl.$render();
				}
				return capitalized;
			}
			modelCtrl.$parsers.push(capitalize);
			capitalize($parse(attrs.ngModel)(scope)); // capitalize initial value
		}
	};
});
