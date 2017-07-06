"use strict";


angular.module("Authentication");

munchapp.controller('loginController', ['$stateParams', '$state','$scope', '$rootScope', '$location', 'AuthenticationService', '$localStorage', '$auth','SweetAlert','UserService', '$timeout', function($stateParams, $state,$scope, $rootScope, $location, AuthenticationService, $localStorage, $auth,SweetAlert,UserService, $timeout){
	console.log($rootScope);
	var inputJSON = "";
	if($localStorage.userLoggedIn) {
		$rootScope.userLoggedIn = true;
		$rootScope.loggedInUser = $localStorage.loggedInUsername;
		$rootScope.displayName = $localStorage.displayName;
		$rootScope.displayImage = $localStorage.displayImage;
	}
	else {
		$rootScope.userLoggedIn = false;
	}
	$scope.myVar=true;	
	$scope.noHeader = function() {
			
		//$localStorage.userLoggedIn = false;
		//$rootScope.userLoggedIn = false;
		//$localStorage.authorizationToken = '';
		
		$state.go('/');

	}
	 $scope.myImage='';
        $scope.myCroppedImage='';
        $scope.imageError="";

        var handleFileSelect=function(evt) { 
        	$scope.imageError="";
        	 var file=evt.currentTarget.files[0];console.log(file.size)
          var allowedext = ['jpg','jpeg','gif','png'];        
              var extn = file.name.split(".").pop();      
              if(allowedext.indexOf(extn)>-1 && file.size<=2000000){
              		var reader = new FileReader();
          reader.onload = function (evt) { 
            $scope.$apply(function($scope){ 
              $scope.myImage=evt.target.result;
            });
          };
          reader.readAsDataURL(file);
          $scope.imageError="";

              }else {
              	if(allowedext.indexOf(extn)==-1){
                $scope.imageError='Please select valid file.';
                $scope.myImage='';
			         $scope.myCroppedImage='';
			         $scope.image="";
            	}else
                if(file.size>2000000){
                	$scope.imageError='Image size is too large.';
                	$scope.myImage='';
			         $scope.myCroppedImage='';
			         $scope.image="";
			         
                }

              }
          
        }
        angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
        
	$scope.editImage=function(image){

		 $('#myModal').modal('show');
		 $scope.myImage='';
         $scope.myCroppedImage='';
         $scope.image="";
         $scope.imageError='';
	}
	$scope.updateImage = function () {
		if($scope.admin!=undefined){
		inputJSON = '{"username":' + '"' + $localStorage.loggedInUsername+ '","prof_image":' + '"' + $scope.myCroppedImage+ '"}';

		AuthenticationService.uploadProImg(inputJSON, function(response) {

			if(response.messageId == 200) { 
				$rootScope.displayImage=response.image;
				$localStorage.displayImage=response.image;
				SweetAlert.swal("Success", "Profile image update successfully", "success");
				$('#myModal').modal('hide');
			}
			else {
				
				SweetAlert.swal("Error!", "Error occured while uploading image.", "error");
			}

		});
	}

	}
	if($location.path()=="/setting"){
		$rootScope.sideBar="setting";		
	}
	$scope.getAllDetail=function(){
		$scope.totalUser=0;
		$scope.totalJob=0;
		$scope.loader=true;

						UserService.totalUser(function(response) {
							$scope.loader=false;
							if(response.messageId == 200) {
							  
								$scope.totalUser=response.data;

							}
						});
						// JobService.totalJob(function(response) {
						// 	$scope.loader=false;
						// 	if(response.messageId == 200) {
							  
						// 		$scope.totalJob=response.data;

						// 	}
						// });
	}
	
	//login
	$scope.login = function() {
		console.log("lofin***********")
			
			inputJSON = '{"username":' + '"' + $scope.username + '", "password":' + '"' + $scope.password + '"}';
			$scope.loader=true;
			AuthenticationService.Login(inputJSON, function(response) {
				console.log("response",response)

			var errorMessage = '';
						
			if(response.messageId == 200) {
				console.log(response)
				$localStorage.displayImage = response.prof_image;
				$localStorage.userLoggedIn = true;
				$localStorage.loggedInUsername = $scope.username;
				$localStorage.displayName = response.username;
				$localStorage.authorizationToken = response.access_token;						
				$state.go('/');
			}
			else {	

				if(response == "Unauthorized") {
					errorMessage = "Username or password is incorrect.";
					//SweetAlert.swal("Error!", errorMessage, "error");
				}
							$scope.showmessage = true;
							$scope.alerttype = 'alert alert-danger';
							$scope.message = errorMessage;
							$timeout(function(argument) {
								$scope.showmessage = false;

							}, 2000)	
				//$scope.error = errorMessage;
			}
		});
	};


	//logout
	$scope.logout = function() {
		inputJSON = '{"access_token":' + '"' + $localStorage.authorizationToken + '"}';
		AuthenticationService.Logout(inputJSON, function(response) {

			if(response.messageId == 200) {
				console.log(response.message);
			}
		})
		$localStorage.userLoggedIn = false;
		$rootScope.userLoggedIn = false;
		$localStorage.authorizationToken = '';
		
		$state.go('/login');
	}


	//forgot password
	/*$scope.resendPassword = function() {

		inputJSON = '{"username":' + '"' + $scope.username + '"}';

		AuthenticationService.resendPassword(inputJSON, function(response) {

			if(response.messageId == 200) {
				console.log("@@@",response)
				
				//SweetAlert.swal("Success", response.message, "success");
				//$state.go('/login')
				$scope.showmessage = true;
							$scope.alerttype = 'alert alert-success';
							$scope.message = response.message;
							$timeout(function(argument) {
								$scope.showmessage = false;
								//$state.go('/login')
							}, 2000)

			}
			else {
				
				//SweetAlert.swal("Error!", response.message, "error");
				//$scope.error=response.message;
							$scope.showmessage = true;
							$scope.alerttype = 'alert alert-danger';
							$scope.message = response.message;
							$timeout(function(argument) {
								$scope.showmessage = false;
								
							}, 2000)
			}

		});
	}
	*/

	$scope.activeTab = 0;
$scope.findOne = function () { 
	console.log("$localStorage.loggedInUsername",$localStorage.loggedInUsername)
if ($localStorage.loggedInUsername) {
	AuthenticationService.getadminInfo($localStorage.loggedInUsername, function(response) {
		console.log("aaaaaaaaaa",response);
		if(response.messageId == 200) {
			$scope.admin = response.data;
			$scope.admin.preusername=response.data.username;
			
		}
	});
}

}
$scope.moveTabContents = function(tab){
$scope.activeTab = tab;
}





//console.log($localStorage.loggedInUsername);
	//change  password
	$scope.saveProfile = function() {
		console.log("inside save profiless")

		
		
		$scope.messageClass="alert-danger";
		if($scope.admin!=undefined){
		inputJSON = '{"preusername":' + '"' + $localStorage.loggedInUsername+ '","firstname":' + '"' + $scope.admin.firstname+ '","lastname":' + '"' + $scope.admin.lastname+ '","email":' + '"' + $scope.admin.email+ '"}';

		AuthenticationService.saveProfile(inputJSON, function(response) {

			if(response.messageId == 200) { 
				$localStorage.displayName=$scope.admin.firstname+" "+$scope.admin.lastname;
				$rootScope.displayName=$localStorage.displayName;
				//SweetAlert.swal("Success", "Profile updated  successfully", "success");
				$scope.showmessage1 = true;
				$scope.alerttype = 'alert alert-success';
				$scope.message = 'Profile updated  successfully.';
				$timeout(function(argument) {
						$scope.showmessage1 = false;
								
				}, 2000)
				/*$scope.admin.newpwd="";
				$scope.admin.cnfpwd="";*/
				//alert($scope.message);
			}
			else {
				
				//SweetAlert.swal("Error!", response.message, "error");
				$scope.showmessage1 = true;
				$scope.alerttype = 'alert alert-danger';
				$scope.message = response.message;
				$timeout(function(argument) {
						$scope.showmessage1 = false;
								
				}, 2000)
			}

		});
	}
	}
	//console.log($localStorage.loggedInUsername);
	//change  password
	$scope.changePwd = function() {

		
		
		$scope.messageClass="alert-danger";
		if($scope.admin!=undefined && $scope.admin.newpwd!="" && $scope.admin.newpwd==$scope.admin.cnfpwd){
		inputJSON = '{"username":' + '"' + $localStorage.loggedInUsername+ '","password":' + '"' + $scope.admin.newpwd+ '","oldpassword":' + '"' + $scope.admin.oldpwd+ '"}';

		AuthenticationService.changePassword(inputJSON, function(response) {

			if(response.messageId == 200) { 
				
				//SweetAlert.swal("Success", "Password change successfully", "success");
				//$state.go($state.current, {}, {reload: true});
				$scope.admin.newpwd="";
				$scope.admin.cnfpwd="";
				$scope.admin.oldpwd="";
				$scope.showmessage2 = true;
				$scope.alerttype = 'alert alert-success';
				$scope.message = "Password change successfully.";
				$timeout(function(argument) {
						$scope.showmessage2 = false;
								
				}, 2000)
			}
			else {
				
				//SweetAlert.swal("Error!", "Old password did not match.", "error");

				$scope.showmessage2 = true;
				$scope.alerttype = 'alert alert-danger';
				$scope.message = "Old password did not match.";
				$timeout(function(argument) {
						$scope.showmessage2 = false;
								
				}, 2000)
			}

		});
	}else{ 
			if($scope.admin==undefined  || $scope.admin.newpwd==""){
				
				SweetAlert.swal("Error!", "Password can not be empty.", "error");
			}else{
				
				SweetAlert.swal("Error!", "Confirm password did not match.", "error");
			}
		
	}
	}

	//authentication
	$scope.authenticate = function(provider) {
		$auth.authenticate(provider)
		.then(function(response) {
			//console.log(response);
			$localStorage.userLoggedIn = true;
			$localStorage.loggedInUsername = response.data.displayName;
			$state.go('/home');
		})
		.catch(function(response) {
			
			$scope.error = response.data.message;
			$state.go('/login');
		});
		
	}

	//Payment  Setting
	$scope.updateCommision = function() {
		
		$scope.messageClass="alert-danger";
		if($scope.admin.admin_commission.job_poster!="" && $scope.admin.admin_commission.job_finder!=""){  
		
		AuthenticationService.commissionSetting($scope.admin, function(response) {

			if(response.messageId == 200) { 
				
				
				$scope.showmessage3 = true;
				$scope.alerttype = 'alert alert-success';
				$scope.message = "Commision settings update successfully.";
				$timeout(function(argument) {
						$scope.showmessage3 = false;
								
				}, 2000)
			}
			else {
				
				//SweetAlert.swal("Error!", "Old password did not match.", "error");

				$scope.showmessage3 = true;
				$scope.alerttype = 'alert alert-danger';
				$scope.message = "Error occur while update commission setting.";
				$timeout(function(argument) {
						$scope.showmessage3 = false;
								
				}, 2000)
			}

		});
	}else{ 
			
				
				SweetAlert.swal("Error!", "Error occur while update payment setting.", "error");
			
		
	}
	}

	$scope.resetpassword=function(){	
		console.log("insisde resetpassword",$stateParams.id)
		var json={"_id":$stateParams.id,"password":$scope.register}
		AuthenticationService.resetpassword(json,function(res){
			$scope.register="";
			if(res){
				if(res.messageId==200){
					$scope.successmsg=res.message;
				}
				else{
					$scope.errormsg=res.message;
				}
			}
		})
		
	};

}]);