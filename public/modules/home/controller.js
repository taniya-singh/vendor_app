"use strict";

angular.module("Home");

munchapp.controller("homeController", ['$stateParams', '$state','$scope', '$rootScope', '$localStorage','UserService','VendorService', function($stateParams, $state,$scope, $rootScope, $localStorage,UserService,VendorService) {
		
	if($localStorage.userLoggedIn) {
		$rootScope.userLoggedIn = true;
		$rootScope.loggedInUser = $localStorage.loggedInUsername;
		$rootScope.displayImage = $localStorage.displayImage;
	}
	else {
		$rootScope.userLoggedIn = false;
	}

	$rootScope.sideBar="home";
	$scope.totalUser=0;
		$scope.totalVendor=0;
		$scope.totalJob=0;
		$scope.loader=true;
			

						UserService.totalUser(function(response) {

							$scope.loader=false;
							if(response.messageId == 200) {
							  
								$scope.totalUser=response.data;
								console.log("The value is>>>>>>>>>>>>>>>>>>>>>>> : ",$scope.totalUser)

							}
						});

						VendorService.totalVendor(function(response) {

							$scope.loader=false;
							if(response.messageId == 200) {
							  
								$scope.totalVendor=response.data;
								console.log("The value is>>>>>>>>>>>>>>>>>>>>>>> : ",$scope.totalVendor)

							}
						});



						VendorService.totalSales(function(response) {

							$scope.loader=false;
							if(response.messageId == 200) {
							  
								$scope.totalSales=response.data;
								console.log("The value is>>>>>>>>>>>>>>>>>>>>>>> : ",$scope.totalSales)

							}
						});

						VendorService.totalRevenue(function(response) {

							$scope.loader=false;
							if(response.messageId == 200) {
							  
								$scope.totalRevenue=response.data;
								console.log("The value is>>>>>>>>>>>>>>>>>>>>>>> : ",$scope.totalRevenue)

							}
						});
						
						UserService.userAllJobs(1,0,5,function(response) {
	        			if(response.messageId == 200) {
	        				$scope.latestJob=response.data;
	        			}
	        			});
	        			UserService.latestUser(function(response) {
	        			if(response.messageId == 200) {

	        				
	        				$scope.latestUser=response.data;
	        				for(var i=0;i<$scope.latestUser.length;i++){
	        					if($scope.latestUser[i].userImages.length>0){
                                    
                                    $scope.latestUser[i].profile_image=$scope.latestUser[i].userImages[0].name;
	        			

	        					}
                            	}

	        				//console.log($scope.latestUser[0].userImages)

	

	        			}
	        			});
	        			$scope.date = new Date();   
					    $scope.yesterday = new Date();
					    $scope.yesterday.setDate($scope.yesterday.getDate() - 1);

					 //    	Highcharts.chart('container', {
						// 	title: {
						// 		text: 'Users',
						// 		style: {"color": '#000000',"fontName": 'Verdana,Arial,Helvetica,sans-serif',"fontSize": "14px","fontWeight": "bold"},
			   //  				x: -10 //cente
						// 	},
						// 	//type: 'line'
						// 	xAxis: {
						// 		labels: {
						// 			style: {"fontName": 'Verdana,Arial,Helvetica,sans-serif',"fontWeight": "bold"
						// 			}
						// 		    },
						// 		    title: {
						// 			text: 'Months',
						// 			style: {"color": '#109618',"fontName": 'Verdana,Arial,Helvetica,sans-serif',"fontSize": "14px","fontWeight": "bold"
						// 			}
						// 		    },
						// 		categories:['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
						// 			'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
						// 		]
						// 	},
						// 	yAxis: { //max: 100,
						// 		labels: {
						// 		formatter: function() {
						// 		    return this.value;
						// 		},
						// 		style: {"fontName": 'Verdana,Arial,Helvetica,sans-serif',"fontWeight": "bold"
						// 		}
						// 	    },
						// 	    title: {
						// 		text: 'Counts',
						// 		style: {"color": '#109618',"fontName": 'Verdana,Arial,Helvetica,sans-serif',"fontSize": "14px","fontWeight": "bold"
						// 		}
						// 	    },
						// 	    plotLines: [{
						// 		value: 0,
						// 		width: 1,
						// 		color: '#808080'
						// 	    }]
						// 	},
						// 	 tooltip: {
						// 	            valuePrefix: '',
						// 	 },
						// 	colors: [ '#F39C12', '#00A65A'],
						// 	credits: {text: ''},
							
						// 	series: [{
						// 		type: 'column',name:'Male',
						// 		data: [29, 71, 106, 129, 144, 176, 135, 148, 216, 194, 95, 54]
						// 	}, {
						// 		type: 'column',name:'Female',
						// 		data: [39, 81, 206, 229, 344, 76, 35, 248, 116, 294, 195, 154]
						// 	}]
						// });

						
}]);