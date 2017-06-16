"use strict"

angular.module("Question")

taxiapp.controller('questionController', ['$scope', '$rootScope', '$routeParams', '$localStorage', 'questionService', 'CategoryService', 'questionnaireService','$timeout', '$location', function($scope, $rootScope, $routeParams, $localStorage, questionService, CategoryService, questionnaireService, $timeout, $location) {
	if($localStorage.userLoggedIn) {
		$rootScope.userLoggedIn = true;
		$rootScope.loggedInUser = $localStorage.loggedInUsername;
	}
	else {
		$rootScope.userLoggedIn = false;
	}

	if($rootScope.message != "") {

		$scope.message = $rootScope.message;
	}

	//empty the $scope.message so the field gets reset once the message is displayed.
	$scope.message = "";

	//show the dependency question and answer fields
	$scope.showDependents = false;
					$scope.questionOptionData = [];
					$scope.answerRadio = {
					 		correct: ""
					 	}

	//setting the questionnaireId
	$scope.questionnaireId = $routeParams.questionnaireId;	
	questionService.getAnswerTypesList(function(response) {
		console.log(response);
		$scope.data = response.data;
		$scope.answer = $scope.data;

	});
	$scope.category = {question: "", dependency: {
            dependency_question: null, 
            dependency_answer: null
        }, answer_type: "", answers: [], enable: "", keyword: ""}
        $scope.category.category = $routeParams.categoryId

	
 				$scope.validateForm = function() {
                if($scope.category.category) {
                    // Questionnaire
                    console.log($scope.category);
                    console.log($scope.answerRadio.correct);
                     if($scope.category.question == ""){
						$scope.message =  messagesConstants.enterQuestion;
                        return false;
                    }  
                    else if($scope.category.answer_type == null || $scope.category.answer_type == "") {
                    	$scope.message =  messagesConstants.selectAnswerType;
                        return false;
                    }
                     else if($scope.category.keyword == "") {
                    	$scope.message =  messagesConstants.enterKeyword
                        return false;
                    }
                    else if($scope.category.answers == undefined || $scope.category.answers.length == 0 || $scope.category.answers[0].answer_text == undefined) {
                    	$scope.message =  messagesConstants.enterAnswer
                        return false;
                    }
                    else if($scope.answerRadio.correct === "") {
                    	$scope.message =  messagesConstants.selectAnswerCorrect
                        return false;
                    }
                    else{
                    	var answerLen = $scope.category.answers.length;
                    	if(answerLen){
                    		for(var i =0; i<answerLen; ++i){
                    			if($scope.category.answers[i].answer_text == undefined){
                    				$scope.message =  messagesConstants.enterAnswer
	                        			return false;
                    			}
                    		}
                    	}
                    	else{
        				$scope.message =  messagesConstants.enterAnswer
            			return false;
                    	}
                    }
                   
                } 
                return true;
            }
		//add question
	$scope.addQuestion = function() {
  $scope.category.correct_answer = $scope.answerRadio.correct;
		if(!$scope.validateForm()) {
                    return;
                }

		var inputJsonString = "";
		if($routeParams.categoryId) {
			var inputJsonString = $scope.category;
			questionService.saveQuestion(inputJsonString, function(response) {
					if(response.messageId == 200) {
						$scope.message = messagesConstants.saveQuestion;
						$timeout(function() {
					        $location.path('/categories');
					    }, 2000);
					}
			});
		}
		else {
			var inputJsonString = $scope.category;
			questionService.updateQuestion(inputJsonString, $routeParams.questionId, function(response) {
					if(response.messageId == 200) {
						$scope.message = messagesConstants.updateQuestion;
						$timeout(function() {
					        $location.path('/categories');
					    }, 2000);
					}

			});
		}
	}

	$scope.options = [{answer_text:""}];
	$scope.dependentType = 0;
	$scope.isDependent = [{_id: 0, value: "Primary"}, {_id: 1, value: "Dependent"}]
	$scope.findOne = function() {
		$scope.showOptionFields = false;
		if($routeParams.questionId){
		questionService.findOneQuestion($routeParams.questionId, function(response) {
			if(response.messageId == 200) {
				$scope.category = response.data;
				var ansLen = $scope.category.answers.length;
				for(var i = 0; i< ansLen; ++i){
					if($scope.category.answers[i]._id == $scope.category.correct_answer){
						$scope.category.answers[i].correct = i;
						$scope.answerRadio.correct = i;
					}
					
				}
				$scope.categoryId = response.data.category;
				if($scope.category.dependency.dependency_question != null){
					 $scope.dependentType = 1;
					 $scope.showDependents = true
				}
				CategoryService.findOne($scope.categoryId, function(response) {
					if(response.messageId == 200){
				    $scope.questionOptionData = response.data.questions;
				    if($scope.category.dependency.dependency_question != null)
					$scope.fetchAnswer()
				}
			});
			}
		});
	}
	else{
		 $scope.categoryId = $routeParams.categoryId
		 CategoryService.findOne($scope.categoryId, function(response) {
					if(response.messageId == 200){
				    $scope.questionOptionData = response.data.questions;
				}
			});
	}
		
	}


	$scope.showOptions = function() {
		var selectedOption = $scope.category.answer_type;
		//not text option is selected
			$scope.category.answers.push({});
		
	}
	$scope.removeOption = function(selectIndex) {
		$scope.category.answers.splice(selectIndex, 1);
	}

	$scope.showAnswerOptions = function() {
		var selectedOption = $scope.dependentType;
		if(selectedOption == 1) {
			$scope.showDependents = true;
		}
		else {
			$scope.showDependents = false;
		}
	}

	$scope.fetchAnswer = function() {
		var selectedQuestion = $scope.category.dependency.dependency_question;
		questionService.findOneQuestion(selectedQuestion, function(response) {
			$scope.ansOptionData = response.data.answers
			});
		
	}




}]);