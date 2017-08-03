"use strict";


angular.module("helpBlock");

munchapp.controller('cmsController', ['$scope', '$rootScope', '$location', 'helpService', '$localStorage', '$auth', '$stateParams','$state','$timeout',function($scope, $rootScope, $location, helpService, $localStorage, $auth, $stateParams,$state,$timeout) {


    var head = document.getElementsByTagName("head")[0];
    var js = document.createElement("script");
    js.type = "text/javascript";
    js.src = "javascripts/jquery.min.js";
   // alert(js)
    head.appendChild(js);

    CKEDITOR.replace( 'editor2' );
    CKEDITOR.editorConfig = function( config ) {
    config.language = 'es';
    config.uiColor = '#F7B42C';
    config.height = 300;
    config.toolbarCanCollapse = true;
   };


	if ($localStorage.userLoggedIn) {
		$rootScope.userLoggedIn = true;
		$rootScope.loggedInUser = $localStorage.loggedInUsername;
	} else {
		$rootScope.userLoggedIn = false;
	}

	if ($rootScope.message != "") {

		$scope.message = $rootScope.message;
	}

    
    
	$scope.abc="xyz"
	$scope.updateButton = false;
	$scope.submitButton = true;
	$scope.information = {};
	$scope.errorObj={};

	CKEDITOR.instances['editor2'].setData("");
	
	var ckeditor = CKEDITOR.instances['editor2'];
	
	ckeditor.on('focus', function() {
		// console.log('on focus');
		$scope.errorObj.description_error = "";
	})
	$scope.submit = function() {
		var aboutUsData = CKEDITOR.instances['editor2'].getData();
		console.log("$scope.information",$scope.information);
		var inputJSon = {'description':aboutUsData,'title':$scope.information.title,'identifier':$scope.information.identifier}
		helpService.insertHelpInformation(inputJSon,function(response){
			console.log(response);
			// toastr.success('Data Saved Successfully.');
			 $state.go('cmslisting');
		})
	}

	$scope.update = function(req,res){
		console.log($scope.information);
		var info = CKEDITOR.instances['editor2'].getData();
		console.log(info)
		var inputJSon = {_id:$stateParams._id,'description':info,'title':$scope.information.title,'identifier':$scope.information.identifier}
		helpService.updateHelpBlock(inputJSon,function(response){
			//toastr.success('Data Updated Successfully.');
			 $state.go('cmslisting');
		})
	}

	$scope.getHelpBlock = function(){
		helpService.getHelpBlockListing(function(response){
			console.log(response);
		})
	}

	if($stateParams._id){
		$scope.updateButton = true;
		$scope.submitButton = false;
		console.log($stateParams._id);
		var inputJSon = {_id:$stateParams._id}
		helpService.getHelpInformation(inputJSon,function(response){
			console.log(response.data[0].title,response.data[0].identifier)
			$scope.information.title = response.data[0].title;
			$scope.information.identifier = response.data[0].identifier;
			$scope.information.description = response.data[0].description;
			CKEDITOR.instances['editor2'].setData(response.data[0].description);
		
			setTimeout(function(){
				CKEDITOR.instances['editor2'].setData(response.data[0].description);
			},100)
			console.log($scope.information);
		})
	}

}]);

munchapp.controller('cmsListingController', ['$scope', '$rootScope', '$location', 'helpService', '$localStorage', '$auth', '$routeParams','$state','SweetAlert', function($scope, $rootScope, $location, helpService, $localStorage, $auth, $routeParams,$state,SweetAlert) {

  if ($localStorage.userLoggedIn) {
		$rootScope.userLoggedIn = true;
		$rootScope.loggedInUser = $localStorage.loggedInUsername;
	} else {
		$rootScope.userLoggedIn = false;
	}

	if ($rootScope.message != "") {

		$scope.message = $rootScope.message;
	}
 
	$scope.getHelpBlock = function(){
		helpService.getHelpBlockListing(function(response){
			console.log(response);
			$scope.showCmsPages = response.data;
		})
	}
	$scope.edit = function(id){
		console.log("edit",id);
		$state.go('cmsPageEdit',{_id: id});

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
   	var inputJSon = {_id:id};
 		helpService.deleteHelp(inputJSon,function(response){
 			//toastr.success('Deleted.');
 			$scope.getHelpBlock();
 		})
     SweetAlert.swal("Deleted!", "Your  file has been deleted.", "success");
   } else {
     SweetAlert.swal("Cancelled", "Your page  is safe :)", "error");
  }
});
		
 	}
}]);