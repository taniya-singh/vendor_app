"use strict";

angular.module("Vendor",['oitozero.ngSweetAlert']);

munchapp.controller("vendorController", ['$http','$stateParams', '$state','$scope', '$rootScope', '$localStorage', 'VendorService', 'ngTableParams', '$route','$location','$timeout','SweetAlert','$filter',  function($http,$stateParams, $state,$scope, $rootScope, $localStorage, VendorService, ngTableParams, $route, $location,$timeout,SweetAlert,$filter){
        	$scope.settings = {};
  		$scope.timeSettings = {};
  		
	console.log ('controller loaded');
        if($localStorage.userLoggedIn) {
			$rootScope.userLoggedIn = true;
			$rootScope.loggedInUser = $localStorage.loggedInUsername;
			$rootScope.displayImage = $localStorage.displayImage;
		}
		else {
			$rootScope.userLoggedIn = false;
		}
  	
        $rootScope.sideBar="vendor";
        var currentDate = new Date();
	    var currentdate = new Date()
	    currentDate.setYear(currentDate.getFullYear() - 18);
	    currentdate.setYear(currentdate.getFullYear() - 100);
	    var dateMinusEithteen = new Date(currentDate);
	    var dateMinusHundred = new Date(currentdate)
        $scope.updateButton = false;
	    $scope.submitButton = true;
		$scope.showImage = false;
		$scope.message = "";
		$scope.activeTab = 0;
		$scope.confirm_password_error = false;
		$scope.addressValid = false;
		$scope.vendor = {}
        $scope.selection = [];
	    $scope.selectionAll;
	    $scope.checkAddressValid = function(){
	    	console.log("here in console")
	    	if(!$scope.vendor.vendor_address){
	    		$scope.addressValid = true;
	    	}
	    }
	    $scope.mytime = new Date();

  $scope.hstep = 1;
  $scope.mstep = 15;

  $scope.options = {
    hstep: [1, 2, 3],
    mstep: [1, 5, 10, 15, 25, 30]
  };

  $scope.ismeridian = true;
  $scope.toggleMode = function() {
    $scope.ismeridian = ! $scope.ismeridian;
  };

  $scope.update = function() {
    var d = new Date();
    d.setHours( 14 );
    d.setMinutes( 0 );
    $scope.mytime = d;
  };

  $scope.changed = function () {
    console.log('Time changed to: ' + $scope.mytime);
  };

  $scope.clear = function() {
    $scope.mytime = null;
  };
		$scope.$on('gmPlacesAutocomplete::placeChanged', function(){

			var location = $scope.vendor.vendor_address.getPlace().geometry.location;
			var zip = $scope.vendor.vendor_address.getPlace();
		    $scope.vendor.vendor_address = zip.formatted_address
		    var postal_code = 0;
		    for (var i=0;i<zip.address_components.length;i++){
		      	console.log(zip.address_components[i].types);
		      	if(zip.address_components[i].types == "postal_code"){
		      		// console.log("zip.address_components[i].types",zip.address_components[i].types);
		      		 postal_code = zip.address_components[i].short_name;
		      		console.log(postal_code);
		      		
		      	}
		    }

			if(postal_code){
					$scope.addressValid = false;
					$scope.vendor.zipCode = postal_code;
			}else{
					$scope.addressValid = true;
					$scope.vendor.zipCode = "";      	
				}
				      $scope.$apply();
  		});
			
		$scope.today = function() {
		    $scope.vendor.dob = dateMinusEithteen;
		  };
  		$scope.today();

		$scope.clear = function() {
		    $scope.vendor.dob = null;
		};

		$scope.inlineOptions = {
		    customClass: getDayClass,
		    minDate: new Date(),
		    showWeeks: true
		};

		$scope.dateOptions = {
		    formatYear: 'yy',
		    maxDate: dateMinusEithteen,
		    minDate: new Date(),
		    startingDay: 1
		};

        $scope.toggleMin = function() {
		    $scope.inlineOptions.minDate = dateMinusHundred;
		    $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
  		};

        $scope.toggleMin();

		$scope.open1 = function() {
		    $scope.popup1.opened = true;
		};

		$scope.setDate = function(year, month, day) {
		    $scope.vendor.dob = new Date(year, month, day);
		};

        $scope.altInputFormats = ['M!/d!/yyyy'];

		$scope.popup1 = {
		    opened: false
		};

		$scope.downloadCSV = function(){
			       VendorService.exportVendorList(function(response){
			            console.log(response)
			            $scope.showloader = false;
			            if(response.messageId == 200) {
			                window.open('/assets/files/vendorlist.csv');
			            }
			        });
		}

        $scope.emailval="test";



		$scope.applyGlobalSearch = function() {
			
			        var term = $scope.globalSearchTerm;
			        if(term != "") {
			        			if($scope.isInvertedSearch) {
			        				term = "!" + term;
			        			}
			        			$scope.simpleList = $filter('filter')($scope.simpleList2, term);
			        			$scope.tableParams.filter({$ : term});
			        			$scope.tableParams.reload();
			        			$scope.selection = [];
			        			$scope.checkboxes.items=[];
			        			var myEl = angular.element(document.getElementsByClassName("select-all"));
				                myEl.attr('checked',false); 
				                $scope.simpleList
				                			
			        		}
	    }
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
	         //  alert(myEl.attr('checked'))
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
 

  

		function getDayClass(data) {
		    var date = data.date,
		      mode = data.mode;
		    if (mode === 'day') {
		      var dayToCheck = new Date(date).setHours(0,0,0,0);

		      for (var i = 0; i < $scope.events.length; i++) {
		        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

		        if (dayToCheck === currentDay) {
		          return $scope.events[i].status;
		        }
		      }
		    }

		    return '';
		}

 

  		$scope.submit = function(){

  			console.log($settings.startingHour)
  			
				if(typeof $scope.vendor.profile_image=='object'){
                       $scope.vendor.profile_image=$scope.myCroppedIconImage;
                }
                console.log("aasdaas",$scope.settings)
               //$scope.vendor.phone="+1"+$scope.vendor.phone_no
                console.log($scope.vendor);
				VendorService.saveVendor($scope.vendor,function(response){
						console.log(response);
						if(response.messageId ==401){
							$scope.emailValid=response.message;
						}
						console.log("response.messageId",response.messageId);
						if(response.messageId == 200) {
							$scope.message = response.message;
							$scope.showmessage = true;
							$scope.alerttype = 'alert alert-success';
						//	$state.go("/vendor");
							$location.path('/vendor'); 
                      //       $timeout(function(argument) {
		                    //                       $scope.showmessage = false;
		                    //                       $state.go( "/vendor" );
		                    // }, 2000)									
						} else{
							$scope.message = response.message;
							$scope.showmessage = true;
							$scope.alerttype = 'alert alert-error';


						}
					})

  			}


  			$scope.resetPassword = function() {

			    $scope.reset.email = $stateParams.email;
                $scope.reset.randomcode = $stateParams.id;
                VendorService.resetPassword($scope.reset, function(response) {
            
                    if(response.messageId == 200) {
                           
                            $scope.messageSucess = response.message;
                            $timeout(function () {$scope.messageSucess = false; $route.reload();}, 2500);
                            
                    }
                    else {
                            $scope.messageError = response.message;
                            $timeout(function () {$scope.messageError = false; $route.reload();}, 2500);
                    }
            
                });                
	        }

            $scope.getAllVendors = function() {
            	console.log("insoide get all vendor ******)")
				var passingDate = {};
				// usSpinnerService.spin('spinner-1');
				passingDate.search = $scope.search;
				console.log(passingDate.search)
				$scope.tableParams = new ngTableParams({
					page: 1,
					count: 5,
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
						VendorService.getVendorList(passingDate, function(response) {
							// console.log(response.data);
							
							if(response.count==0){
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

		    if($stateParams.id){
				$scope.updateButton = true;
				$scope.submitButton = false;
				var inputJSon = {_id:$stateParams.id}
			VendorService.getCurrentVendorData(inputJSon,function (response) {

					$scope.vendor = response.data;
					
					$scope.vendor.phone = $scope.vendor.phone.replace("+1", "");
				
					$scope.vendor.dob = new Date(response.data.dob);
					
					if(response.data.vendorImages!=""){
						$scope.vendor.profile_image = response.data.vendorImages[0].name;
					
					}
					console.log(response,"response",$scope.vendor);
					if(response.data.vendorImages.length>0){
						console.log("display picture here",response.data.vendorImages[0].name);
						$scope.showImage = true;
					}
				})
			}
			
          
			$scope.delete = function(id){
				
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
				   	var inputJSon = {_id:id};
				 		VendorService.deleteVendor(inputJSon,function(response){
				 			//toastr.success('Deleted.');
				 			$scope.getAllVendor();
				 		})
				     SweetAlert.swal("Deleted!", "Your  file has been deleted.", "success");
				   } else {
				     SweetAlert.swal("Cancelled", "Your page  is safe :)", "error");
				  }
				});
		
 	        }

 
		$scope.performAction = function(id,action) {

			var actionsArr=["enable","disable" ,"delete"];
            $scope.selectedAction = selectedAction.value;
		    if(id!=undefined && action!=undefined){
			        $scope.selection.push(id);
			        $scope.selectedAction=action;
			       
			}
			if($scope.selection.length==0){
				SweetAlert.swal("Error!", "Please check atleast one vendor", "error"); 
		    	
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
				                   VendorService.updateVendorStatus(inputJson, function(response) {
				                      $scope.getAllVendor();
				                      selectedAction.value=0;
				                      $scope.selection=[];
				                      $scope.showmessage = true;
                                        $scope.alerttype = 'alert alert-success';
                                        $scope.message = "Vendor(s) "+actionsArr[$scope.selectedAction-1]+"d successfully." ;
                                        $timeout(function(argument) {
                                          $scope.showmessage = false;

                                        }, 2000)
				                    });
				                 }
				     });
		    }
		}

		$scope.performAction1 = function(id,action) {

			var actionsArr=["enable","disable" ,"delete","approve"];
            $scope.selectedAction = selectedAction.value;
		    $scope.selection=[id];
			$scope.selectedAction=action;
			if($scope.selection.length==0){
					SweetAlert.swal("Error!", "Please check atleast one vendor", "error"); 
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
				            var inputJson ={data: updatedData}
					        if($scope.selectedAction == 4) {
					            VendorService.approveVendorStatus(inputJson, function(response) {
							            $scope.getAllVendor();				                      
							            $scope.selection=[];
							            $scope.showmessage = true;
			                            $scope.alerttype = 'alert alert-success';
			                            $scope.message = "Vendor"+actionsArr[$scope.selectedAction-1]+"d successfully." ;
			                                $timeout(function(argument) {
			                                  $scope.showmessage = false;

			                                }, 2000)
						                });
					            }else{
					                    VendorService.updateVendorStatus(inputJson, function(response) {
					                      $scope.getAllVendor();				                      
					                      $scope.selection=[];
					                      $scope.showmessage = true;
	                                        $scope.alerttype = 'alert alert-success';
	                                        $scope.message = "Vendor "+actionsArr[$scope.selectedAction-1]+"d successfully." ;
	                                        $timeout(function(argument) {
	                                          $scope.showmessage = false;

	                                        }, 2000)
					                    });
					            }
					    }
		        });
		    }
		}
		$scope.myIconImage='';
        $scope.myCroppedIconImage='';

        var handleFileSelect2=function(evt) { 
          var file=evt.currentTarget.files[0];
          var reader = new FileReader();
          reader.onload = function (evt) { 
            $scope.$apply(function($scope){ 
              $scope.myIconImage=evt.target.result;
            });
          };
          reader.readAsDataURL(file);
           $scope.cropArea=false;
          $scope.cropArea2=true;
        };

		angular.element(document.querySelector('#fileInput2')).on('change',handleFileSelect2);
         
		$scope.imageIconError="";
		$scope.myCroppedIconImage='';
        $scope.onSelectIconImg = function() {
                
              var allowedext = ['jpg','jpeg','gif','png'];        
              var extn = $scope.vendor.profile_image.filename.split(".").pop();      
              if(allowedext.indexOf(extn)>-1  && $scope.vendor.profile_image.filesize<=2000000){
                $scope.vendor.profile_image = "data:image/jpeg;base64," + $scope.vendor.profile_image.base64;
                $scope.imageIconError="";
                }else{
                  if(allowedext.indexOf(extn)==-1){
	                  $scope.imageIconError='Please select valid file.';
	                  $scope.skill.icon_image="";
	                  $scope.skill.iconimage="";
	                  $scope.vendor.profile_image="";
	                  $scope.myIconImage="";

                   }else
	                if($scope.skill.profile_image.filesize>2000000){
		                $scope.imageIconError='Image size is too large.';
		                $scope.skill.icon_image="";
		                $scope.skill.iconimage="";
		                $scope.vendor.profile_image="";
		                $scope.myIconImage="";
	                }
                }
        };

        $scope.statusChange = function(){
				$scope.showImage = false;
	    }

		$scope.removeIconImg=function(){
                $scope.skill.icon="";
                $scope.picIconData="";
                $scope.myIconImage="";
        }


		$scope.update = function(invalid){

				if(typeof $scope.vendor.profile_image=='object'){
                    $scope.vendor.profile_image=$scope.myCroppedIconImage; 
                }
				if($scope.vendor.location == ""){
					$scope.showAddress = true;

				}else{
					console.log("else part");
				}	
				$scope.vendor.phone="+1"+$scope.vendor.phone
                console.log("asdasdas",$scope.vendor.phone)			
			   VendorService.updateVendordata($scope.vendor,function(response){
				
				    if(response.messageId==200) {
                            $scope.message = response.message;
							$scope.showmessage = true;
							$scope.alerttype = 'alert alert-success';

                            $timeout(function(argument) {
		                        $scope.showmessage = false;
		                        $state.go( "/vendor" );
		                    }, 2000)
									
									//$state.go('/vendor');
				    }else{
						    $scope.message = response.message;
							$scope.showmessage = true;
							$scope.alerttype = 'alert alert-error';
                            $timeout(function(argument) {
		                        $scope.showmessage = false;
		                        $state.go( "/vendor" );
		                    }, 2000)
				    }
						
						
				})

		}

		if($stateParams._id && $stateParams.id){
				var inputString = {"_id":$stateParams._id}
				VendorService.unSubscribe(inputString,function(response){
					
					if(response.messageId == 200) {
						$scope.message = response.message;
						$timeout(function(argument) {
		                        $scope.showmessage = false;
		                        $state.go( "/vendor" );
		                }, 2000)				
				    }
				})
		}

	    $scope.view = function(data){
			$scope.viewList = data;
	    }

	    $scope.onApplyTimePicker = function () {
    console.log('Time range applied.');
};
$scope.onClearTimePicker = function () {
    console.log('Time range current operation cancelled.');
}

munchapp.filter('typeof', function() {
  return function(obj) {
    return typeof obj
  };
});
}]);
// // Set initial time range to be 05:30 - 10:10 
// $scope.settings = {
//     dropdownToggleState: false,
//     time: {
//         fromHour: '05',
//         fromMinute: '30',
//         toHour: '10',
//         toMinute: '10'
//     },
//     theme: 'dark',
//     noRange: false,
//     format: 24,
//     noValidation: false
// };


munchapp.directive('timeFilter', function () {
  return {
		restrict: 'E',
			replace: true,
			template: 
			'<div class="startingHour">'+
  			'<div>'+
          'Start:'+
            '<select ng-model="startingHour">'+
              '<option ng-repeat="option in startingTimeHoursRange" ng-disabled="option.disabled" value="{{option.value}}">{{option.name}}</option>'+
            '</select>'+
            ':'+
            '<select ng-model="startingMinute">'+

              '<option ng-repeat="option in startingTimeHMinutesRange" ng-disabled="option.disabled" value="{{option.value}}">{{option.name}}</option>'+
            '</select>'+
          '</div>'+
          '<div class="endingHour">'+
            'End:'+
            '<select ng-model="endingHour">'+
              '<option ng-repeat="option in endingTimeHoursRange" ng-disabled="option.disabled" value="{{option.value}}">{{option.name}}</option>'+
            '</select>'+
            ':'+
            '<select ng-model="endingMinute">'+
              '<option ng-repeat="option in endingTimeHMinutesRange" ng-disabled="option.disabled" value="{{option.value}}">{{option.name}}</option>'+
            '</select>'+
        '</div>'+
      '</div>',
			scope: {
				timeSettings: '=',
				applyCallback: '&',
				clearCallback: '&'
			},
			link: function (scope) {
				var i;
				var timeHoursRange = [],
					timeMinutesRange = [];
				scope.startingTimeHoursRange = [];
				scope.endingTimeHoursRange = [];
				scope.startingTimeHMinutesRange = [];
				scope.endingTimeHMinutesRange = [];

				scope.timeDropDownToggleState = false;

				// For hours dropdown (0 - 23)
				for (i = 0; i < 24; i++) {
					timeHoursRange.push({
						name: (i < 10) ? ('0' + i) : i + '',
						value: (i < 10) ? ('0' + i) : i + ''
					});
				}

				// For minutes dropdown (0 - 59)
				for (i = 0; i < 60; i++) {
					timeMinutesRange.push({
						name: (i < 10) ? ('0' + i) : i + '',
						value: (i < 10) ? ('0' + i) : i + ''
					});
				}

				// making a copy so each dropdown for time filter works independently
				angular.copy(timeHoursRange, scope.startingTimeHoursRange);
				angular.copy(timeHoursRange, scope.endingTimeHoursRange);

				angular.copy(timeMinutesRange, scope.startingTimeHMinutesRange);
				angular.copy(timeMinutesRange, scope.endingTimeHMinutesRange);

				/**
				 * Update the time being shown in time filter once its being updated and the req is being sent
				 */
				scope.updateTimeRangeFilter = function () {
					scope.timeSettings.fromHour = scope.startingHour;
					scope.timeSettings.toHour = scope.endingHour;

					scope.timeSettings.fromMinute = scope.startingMinute;
					scope.timeSettings.toMinute = scope.endingMinute;
				};

				/**
				 * set (00:00 - 23:59) to be the default time which is the entire time duraion for a particular day
				 */
				scope.setInitialTimeRange = function () {
					scope.startingHour = scope.timeSettings.fromHour = scope.startingTimeHoursRange[0].value;
					scope.endingHour = scope.timeSettings.toHour = scope.startingTimeHoursRange[23].value;

					scope.startingMinute = scope.timeSettings.fromMinute = scope.endingTimeHMinutesRange[0].value;
					scope.endingMinute = scope.timeSettings.toMinute = scope.endingTimeHMinutesRange[59].value;
				};
				scope.setInitialTimeRange();

				scope.clearTimeRange = function () {
					scope.isCustomTimeFilter = false;
					scope.clearCallback({data: {
						isCustomTimeFilter: scope.isCustomTimeFilter
					}});
					scope.closeTimeFilterDropdown();
				};

				/**
				 * Set time filter flag, update the time shown in time filter and finally update the sessions list
				 */
				scope.applyTimeRangeFilter = function () {
					scope.isCustomTimeFilter = true;
					scope.updateTimeRangeFilter();
					scope.applyCallback({data: {
						isCustomTimeFilter: scope.isCustomTimeFilter
					}});
					scope.closeTimeFilterDropdown();
				};
				/**
				 * CLoses time filter and reset the dropdown values if time filter is not applied
				 */
				scope.closeTimeFilterDropdown = function () {
					scope.timeDropDownToggleState = false;

					scope.startingHour = scope.timeSettings.fromHour;
					scope.startingMinute = scope.timeSettings.fromMinute;
					scope.endingHour = scope.timeSettings.toHour;
					scope.endingMinute = scope.timeSettings.toMinute;
				};

				/**
				 * Whenever hours changed, need to validate the time (start time < end time)
				 * Also, make the items in dropdown disabled if not applicable
				 */
				scope.updateHour = function () {
					if (scope.startingHour !== scope.endingHour) {
						for (i = 0; i < timeMinutesRange.length; i++) {
							scope.startingTimeHMinutesRange[i].disabled = false;
							scope.endingTimeHMinutesRange[i].disabled = false;
						}
					} else if (scope.startingMinute > scope.endingMinute) {
						scope.startingMinute = scope.endingMinute - 1;
						if (scope.endingMinute === '00') {
							scope.endingMinute = '01';
						}
						else {
							scope.updateStartingMinuteTime();
						}
					} else if (scope.startingHour === scope.endingHour) {
						scope.updateStartingMinuteTime();
						scope.updateEndingMinuteTime();
					}
				};

				/**
				 * Whenever starting minutes changed, need to validate the time (start time < end time)
				 * Also, make the items in dropdown disabled if not applicable
				 */
				scope.updateStartingMinuteTime = function () {
					for (var i = 0; i < timeMinutesRange.length; i++) {
						if (i > (parseInt(scope.endingMinute, 10) - 1) && i < timeMinutesRange.length) {
							scope.startingTimeHMinutesRange[i].disabled = true;
						}
						else {
							scope.startingTimeHMinutesRange[i].disabled = false;
						}
					}
				};

				/**
				 * Whenever ending minutes changed, need to validate the time (start time < end time)
				 * Also, make the items in dropdown disabled if not applicable
				 */
				scope.updateEndingMinuteTime = function () {
					for (var i = 0; i < timeMinutesRange.length; i++) {
						if (i >= 0 && i < (parseInt(scope.startingMinute, 10) + 1)) {
							scope.endingTimeHMinutesRange[i].disabled = true;
						}
						else {
							scope.endingTimeHMinutesRange[i].disabled = false;
						}
					}
				};

				scope.$watch('startingHour', function (newValue, oldValue) {
					if (!newValue || newValue === oldValue) { return; }
					
					var i;
					for (i = 0; i < timeHoursRange.length; i++) {
						if (i >= 0 && i < parseInt(scope.startingHour, 10)) {
							scope.endingTimeHoursRange[i].disabled = true;
						}
						else {
							scope.endingTimeHoursRange[i].disabled = false;
						}
					}
					scope.updateHour(scope.startingHour, scope.endingTimeHoursRange);
				});

				scope.$watch('endingHour', function (newValue, oldValue) {
					if (!newValue || newValue === oldValue) { return; }

					var i;
					for (i = 0; i < timeHoursRange.length; i++) {
						if (i > parseInt(scope.endingHour, 10) && i < timeHoursRange.length) {
							scope.startingTimeHoursRange[i].disabled = true;
						}
						else {
							scope.startingTimeHoursRange[i].disabled = false;
						}
					}
					scope.updateHour(scope.endingHour, scope.startingTimeHoursRange);
				});

				scope.$watch('startingMinute', function (newValue, oldValue) {
					if (!newValue || newValue === oldValue || scope.startingHour !== scope.endingHour) { return; }
					scope.updateEndingMinuteTime();
				});

				scope.$watch('endingMinute', function (newValue, oldValue) {
					if (!newValue || newValue === oldValue || scope.startingHour !== scope.endingHour) { return; }
					scope.updateStartingMinuteTime();
				});

				// Whenevr custom time filter is reset, reset the time filter applied time and set the initial default values
				// (00:00 - 23:59)
				scope.$watch('isCustomTimeFilter', function (newValue) {
					// if time filter is not applied / reset
					if (!newValue) {
						scope.setInitialTimeRange();
					}
				});
			}
  };
});
