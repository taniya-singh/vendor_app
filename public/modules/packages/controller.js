"use strict";

	angular.module("Packages");

	munchapp.controller("packageController", ['$scope', '$rootScope', '$localStorage', 'PackageService','SweetAlert','ngTableParams', '$routeParams', '$route', '$location','$stateParams','$state','$timeout','$http','$window',function($scope, $rootScope, $localStorage, PackageService,SweetAlert,ngTableParams, $routeParams, $route, $location,$stateParams,$state,$timeout,$http,$window) {


	   if($localStorage.userLoggedIn) {
			$rootScope.userLoggedIn = true;
			$rootScope.loggedInUser = $localStorage.loggedInUsername;
			$rootScope.displayImage = $localStorage.displayImage;
		}
		else {
			$rootScope.userLoggedIn = false;
		}

		$rootScope.sideBar="packages";
			

			$scope.updateButton = false;
			$scope.submitButton = true;

			$scope.addPackage = function(){
				PackageService.addPackage($scope.package,function(response){
						console.log(response);
						 if(response.messageId ==200){
						 	$state.go('packages');
						}		
				})
			}


			$scope.packageList = function() {
				var passingDate = {};
				// usSpinnerService.spin('spinner-1');
				passingDate.search = $scope.search;
				console.log(passingDate.search)
				$scope.tableParams = new ngTableParams({
					page: 1,
					count: 10,

					sorting: {
						created: "desc"
					}
				}, {
					counts: [],
					getData: function($defer, params) {
						 // usSpinnerService.spin('spinner-1');
						// console.log("usSpinnerService",usSpinnerService);
						console.log("params url", params.url());
						console.log("params sorting", params.sorting());
						console.log("paramspage", params.page());
						passingDate.page = params.page();
						passingDate.count = params.count();
						passingDate.sort = params.sorting();
						// usSpinnerService.stop('spinner-1');
						PackageService.packages(passingDate, function(response) {
						 console.log(response.data.count);
							
							if(response.data.length==0){
								$scope.showStatus = true;
							}
							else{
								$scope.showStatus = false;	
							}
							params.total(response.count);
							// console.log(response.count)
							$scope.data = response.data;
							$scope.simpleList = response.data;
				$scope.simpleList2 = response.data;
							$defer.resolve($scope.data);
			    $scope.checkboxes = {
					checked: false,
					items:{}
				};
						})
					}
				})
			}

    //         $scope.packageList=function(){

	   //          PackageService.packages(function(response){
				// 			console.log(response.data.messageId);
				// 			if(response.data.messageId==200){
				// 				$scope.packages=response.data.data;
				// 			}
							
							
				// })

    //         }
			

			$scope.edit = function (id) {
				$state.go('editPackage',{_id: id});
			}
 
            

			if($stateParams._id){
				
				$scope.updateButton = true;
				$scope.submitButton = false;
				PackageService.getPackageDetail($stateParams._id,function (response) {
					//console.log(response)
					if(response.messageId==200){
				    	$scope.package=response.data[0];
				    	console.log($scope.packages)
				    }
					
				})
			}

			$scope.updatePackage = function(){
				PackageService.updatePackage($scope.package,function(response){
						console.log(response);
						 if(response.messageId ==200){
						 	$state.go('packages');
						}		
				})
			}

			// $scope.deletePackage = function(id){
			// 	//SweetAlert.swal("Updated!", "aaa", "success");
			// 	PackageService.deletePackage(id,function(response){
			// 			console.log(response);
			// 			 if(response.messageId==200){
			// 			 	toastr.success('Package has been deleted successfully.');
			//                 $scope.packageList();
			// 			}		
			// 	})
			// }

			$scope.selection = [];
	$scope.selectionAll;
	$scope.selectionSkillAll=false;

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
	            	$scope.selectionAll = true;
	            }
	             var myEl = angular.element(document.getElementsByClassName("select-all"));
	  
	   			var myEl1 = angular.element(document.getElementsByClassName("list"+$scope.tableParams.page()));	           
	            //alert(myEl1.length)
	            var ln = 0;
				for(var i=0; i< myEl1.length; i++) {
				    if(myEl1[i].checked)
				        ln++
				    if(ln==myEl1.length){
				    	myEl.attr('checked',true);
				    }else{
				    	myEl.attr('checked',false);	
				    }
				}

	        }
	        //Check for all checkbox selection
	        else{ 
	        	var myEl = angular.element(document.getElementsByClassName("select-all"));
	          // alert(myEl.attr('checked'))
	        	if(myEl.attr('checked')==undefined){ 
	        		
	        		var i=0;
	        		angular.forEach($scope.tableParams.data, function(item) { 
	        			var idx = $scope.selection.indexOf(item._id);
		            // is currently selected
		           
	        			$scope.checkboxes.items[item._id] = false;
	        			 if (idx > -1) { 
	        			$scope.selection.splice(idx,1);
	        			//alert(i)
	        			i++;
	        			}
	        		});

	        		$scope.selectionAll = false;
	        	}
	        	//Check for all un checked checkbox for check
	        	else{ 
	        		//alert("1"+$scope.tableParams.data)
	        		$scope.selectionAll = true
	        		if($scope.selection.length==0)
	        		$scope.selection = [];
                   
	        		console.log($scope.tableParams.data)
	        		var i=0;
	        		angular.forEach($scope.tableParams.data, function(item) { 
	        			var idx = $scope.selection.indexOf(item._id);
		            // is currently selected
		            	//alert(item._id)
	        			$scope.checkboxes.items[item._id] = $scope.checkboxes.checked;
	        			if (idx == -1) {
	        			$scope.selection.push(item._id);	        			
	        			i++;
	        			}
	        		});

	        	}
	       
	    }
	        console.log($scope.selection)
	    };
 

			$scope.performAction = function(id,action) {

			 var actionsArr=["enable","disable" ,"delete"];


			    $scope.selectedAction = selectedAction.value;
		
			    if(id!=undefined && action!=undefined){
			        $scope.selection.push(id);
			        $scope.selectedAction=action;
			       
			    }
				if($scope.selection.length==0){
					SweetAlert.swal("Error!", "Please check atleast one package", "error"); 
			    	
			    	 return false;
			    }
			    if($scope.selectedAction==0){
			    	
			    	SweetAlert.swal("Error!", "Please select action", "error"); 
			    	 return false;
			    }

			    

		var skillLength =  $scope.selection.length;
		var updatedData = [];
		
		if($scope.selectedAction == 0)
		$scope.message = messagesConstants.selectAction;
		else{	
		for(var i = 0; i< skillLength; i++){
			var id =  $scope.selection[i];
			  if($scope.selectedAction == 3) {
			  updatedData.push({id: id, isDeleted: true});
			}
			else if($scope.selectedAction == 1) {
				updatedData.push({id: id, enable: true});
			}
			else if($scope.selectedAction == 2) {
				updatedData.push({id: id, enable: false});
			}
		}


		//alert($scope.selectedAction);alert(actionsArr[$scope.selectedAction]);
		SweetAlert.swal({
				             title: "",
				             text: "Are you sure you want to "+actionsArr[$scope.selectedAction-1]+"?",
				             type: "warning",
				             showCancelButton: true,
				             confirmButtonColor: "#3c8dbc",confirmButtonText: actionsArr[$scope.selectedAction-1].charAt(0).toUpperCase()+actionsArr[$scope.selectedAction-1].substring(1),
				             cancelButtonText: "Cancel",
				             closeOnConfirm: true,
				             closeOnCancel: true, 
				             allowOutsideClick: false }, 
				             function(isConfirm){ 
				                 if (isConfirm) {
				                    
				                    var inputJson = {
				                        data: updatedData
				                    }
				                    PackageService.updatePackageStatus(inputJson, function(response) {
				                     

				                      $scope.packageList();
				                      selectedAction.value=0;
				                      $scope.selection=[];
				                      $scope.showmessage = true;
                                        $scope.alerttype = 'alert alert-success';
                                        $scope.message = "Package(s) "+actionsArr[$scope.selectedAction-1]+"d successfully." ;
                                        $timeout(function(argument) {
                                          $scope.showmessage = false;

                                        }, 2000)
				                    });
				                 }
				              });
		}
		}

		$scope.delete = function(id){
// 		//console.log("@@@@")
 	SweetAlert.swal({
   title: "Are you sure?",
   text: "You will not be able to see this page!",
   type: "warning",
   showCancelButton: true,
   confirmButtonColor: "#DD6B55",
  confirmButtonText: "Yes, delete it!",
   cancelButtonText: "No, cancel please!",
   closeOnConfirm: false,
   closeOnCancel: false
 },
 function(isConfirm){
   if (isConfirm) {
   	var inputJSon = id;
   	console.log(inputJSon)
 		PackageService.deletePackage(inputJSon,function(response){
 			//toastr.success('Deleted.');
 			$scope.packageList();
 		})
     SweetAlert.swal("Deleted!", "Your  file has been deleted.", "success");
   } else {
     SweetAlert.swal("Cancelled", "Your page  is safe :)", "error");
  }
})
	}
	$scope.performAction1 = function(id,action) {

			 var actionsArr=["enable","disable" ,"delete","approve"];


			    $scope.selectedAction = selectedAction.value;
		
			    
			        $scope.selection=[id];
			        $scope.selectedAction=action;
			       
			    
				if($scope.selection.length==0){
					SweetAlert.swal("Error!", "Please check atleast one package", "error"); 
			    	
			    	 return false;
			    }
			    if($scope.selectedAction==0){
			    	
			    	SweetAlert.swal("Error!", "Please select action", "error"); 
			    	 return false;
			    }

			    

		var skillLength =  $scope.selection.length;
		var updatedData = [];
		
		if($scope.selectedAction == 0)
		$scope.message = messagesConstants.selectAction;
		else{	
		for(var i = 0; i< skillLength; i++){
			var id =  $scope.selection[i];
			  if($scope.selectedAction == 3) {
			  updatedData.push({id: id, isDeleted: true});
			}
			else if($scope.selectedAction == 1) {
				updatedData.push({id: id, enable: true});
			}
			else if($scope.selectedAction == 2) {
				updatedData.push({id: id, enable: false});
			}else if($scope.selectedAction == 4) {
				updatedData.push({id: id, status: true});
			}
		}


		//alert($scope.selectedAction);alert(actionsArr[$scope.selectedAction]);
		SweetAlert.swal({
				             title: "",
				             text: "Are you sure you want to "+actionsArr[$scope.selectedAction-1]+"?",
				             type: "warning",
				             showCancelButton: true,
				             confirmButtonColor: "#3c8dbc",confirmButtonText: actionsArr[$scope.selectedAction-1].charAt(0).toUpperCase()+actionsArr[$scope.selectedAction-1].substring(1),
				             cancelButtonText: "Cancel",
				             closeOnConfirm: true,
				             closeOnCancel: true, 
				             allowOutsideClick: false }, 
				             function(isConfirm){ 
				                 if (isConfirm) {
				                    
				                    var inputJson = {
				                        data: updatedData
				                    }
				                    if($scope.selectedAction == 4) {
				                    	PackageService.updatePackageStatus(inputJson, function(response) {
				                     

				                      $scope.packageList();				                      
				                      $scope.selection=[];
				                      $scope.showmessage = true;
                                        $scope.alerttype = 'alert alert-success';
                                        $scope.message = "Package "+actionsArr[$scope.selectedAction-1]+"d successfully." ;
                                        $timeout(function(argument) {
                                          $scope.showmessage = false;

                                        }, 2000)
				                    });
				                    }else{
				                    PackageService.updatePackageStatus(inputJson, function(response) {
				                     

				                      $scope.packageList();				                      
				                      $scope.selection=[];
				                      $scope.showmessage = true;
                                        $scope.alerttype = 'alert alert-success';
                                        $scope.message = "Package "+actionsArr[$scope.selectedAction-1]+"d successfully." ;
                                        $timeout(function(argument) {
                                          $scope.showmessage = false;

                                        }, 2000)
				                    });
				                	}
				                 }
				              });
		}
		}
		}
	]);

