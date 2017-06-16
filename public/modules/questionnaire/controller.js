'use strict'

angular.module("Questionnaire")

taxiapp.controller('questionnaireController', ['$scope', '$rootScope', '$localStorage', '$routeParams', '$route', '$window', 'ngTableParams', 'questionnaireService', '$location', 'CategoryService','$timeout', function($scope, $rootScope, $localStorage, $routeParams, $route, $window, ngTableParams, questionnaireService, $location, CategoryService, $timeout) {

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
    $scope.activeTab = 0;
    $scope.sorted_categories = [];
    $scope.categories = [];
    $scope.questionnaire = {questionnaire_name: "", enable: false}
    $scope.isCategorySelected = 0;
			$scope.applyGlobalSearch = function() {
				var term = $scope.globalSearchTerm;
				if(term != "") {
					if($scope.isInvertedSearch) {
						term = "!" + term;
					}
					$scope.tableParams.filter({$ : term});
					$scope.tableParams.reload();			
				}
			}

			$scope.selection = [];
			$scope.selectionAll;
			$scope.selectionCategory = [];
			$scope.selectionAllCategory;
			$scope.selectedCategoryOnly = [];

			$scope.toggleSelection = function(selectedID) {
				//Check for single checkbox selection
				if(selectedID){
					var idx = $scope.selectionCategory.indexOf(selectedID);
					var categoryLength = $scope.sorted_categories.length;
					for(var j = 0; j< categoryLength; ++j){
						 // is currently selected
			                    if (idx > -1) {
			                    	if($scope.sorted_categories[j]._id ==  selectedID){
			                    	$scope.selectionCategory.splice(idx, 1);
			                    	var updatedCatLength = $scope.updatedSortedCategory.length;
			                    	for(var a =0; a < updatedCatLength; ++a){
			                    		if($scope.updatedSortedCategory[a]._id == selectedID){
			                    			$scope.updatedSortedCategory.splice(a, 1);
			                    			$scope.selectedCategoryOnly.splice(a,1);
			                    			break;
			                    		}
			                    	}
			                    	var questionLength = $scope.questionnaire.questions.length;
			                    	for(var x =0; x < questionLength; ++x){
			                    		if($scope.questionnaire.questions[x].category == selectedID){
			                    			$scope.questionnaire.questions.splice(x, 1);
			                    			break;
			                    		}
			                    	}
			                    	
			                  	 }
			                    }
			                    // is newly selected
			                    else {
			                    	if($scope.sorted_categories[j]._id ==  selectedID){
			                    	$scope.selectionCategory.push(selectedID);
			                    	$scope.updatedSortedCategory.push($scope.sorted_categories[j]);
			                    	$scope.selectedCategoryOnly.push({category: $scope.sorted_categories[j]._id, name: $scope.sorted_categories[j].name, questions: []})
			                    	break;
			                    }
			                   }
					}
					console.log($scope.updatedSortedCategory);
			                   
				}
				else {
					//Check for all checked checkbox for uncheck
			                	if($scope.selectionCategory.length > 0 && $scope.selectionAllCategory){
			                		$scope.selectionCategory = [];
			                		$scope.checkboxes = {
			                			checked: false,
			                			items:{}
			                		};	
			                		$scope.selectionAllCategory = false;
			                	}
			                	//Check for all unchecked checkbox for check
			                	else{
			                		$scope.selectionAllCategory = true;
			                		$scope.selectionCategory = [];
			                		angular.forEach($scope.simpleList, function(item) {
			                			$scope.checkboxes.items[item._id] = $scope.checkboxes.checked;
			                			$scope.selectionCategory.push(item._id);
			                		});
			                		console.log($scope.selectionCategory);
			                	}
				}//else
			}

				$scope.toggleSelectionForQuestionarie = function toggleSelection(id) {
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
			            }
			        }
			        //Check for all checkbox selection
			        else{
			        	//Check for all checked checkbox for uncheck
			        	if($scope.selection.length > 0 && $scope.selectionAll){
			        		$scope.selection = [];
			        		$scope.checkboxes = {
			        			checked: false,
			        			items:{}
			        		};	
			        		$scope.selectionAll = false;
			        	}
			        	//Check for all un checked checkbox for check
			        	else{
			        		$scope.selectionAll = true
			        		$scope.selection = [];
			        		angular.forEach($scope.simpleList, function(item) {
			        			$scope.checkboxes.items[item._id] = $scope.checkboxes.checked;
			        			$scope.selection.push(item._id);
			        		});
			        	}
			        }
			        console.log($scope.selection)
			    };

				//getQuestionnaireList
				$scope.getAllQuestionnarire = function(){
					questionnaireService.getQuestionnaireList (function(response) {
					if(response.messageId == 200) {
						$scope.filter = {questionnaire_name: ''};
						$scope.tableParams = new ngTableParams({page:1, count:10, sorting:{questionnaire_name:"asc"}, filter:$scope.filter}, { total:response.data.length, counts:[], data: response.data});
					$scope.simpleList = response.data;
					$scope.checkboxes = {
							checked: false,
							items:{}
						};		
					}
				});
				}
				
				
				$scope.showSearch = function() {
					if($scope.isFiltersVisible) {
						$scope.isFiltersVisible = false;	
					}
					else {
						$scope.isFiltersVisible = true;	
					}
				}

				$scope.selectQuestions = function(){
					if($scope.selectionCategory.length == 0 && $scope.activeTab == 1){
						$scope.message= 'Please select the category.';
						return false;
					}
					$scope.message= "";
					$scope.activeTab = ++$scope.activeTab;
				}


				//adding questionnaire
				$scope.addQuestionnaire = function() {
					var inputJsonString = "";
					if($scope.questionnaire_name == undefined) {
						$scope.questionnaire_name = "";
					}
					if($scope.enable == undefined) {
						$scope.enable = false;
					}

					if($scope.questionnaireID == undefined) {
						inputJsonString = $scope.questionnaire;
						questionnaireService.saveQuestionnaire(inputJsonString, function(response) {
							if(response.messageId == 200) {
								$scope.message = messagesConstants.saveQuestionnaire;
								$location.path('/viewcategories/' + response.data._id);
							}
						});

					}
					else {
						//edit
						inputJsonString = $scope.questionnaire;
						questionnaireService.updateQuestionnaire(inputJsonString, function(err, response) {
							if(err) {
								$scope.message = err.message;
							}
							else {
								if(response.data.messageId == 200) {
									$scope.message = messagesConstants.updateQuestionnaire;
								}
							}

						});
					}
				}


		//perform action
		$scope.performAction = function() {						
		var questionnaireLength =  $scope.selection.length;
		var updatedData = [];
		$scope.selectedAction = selectedAction.value;
		if($scope.selectedAction == 0)
		$scope.message = messagesConstants.selectAction;
		else{	
			console.log(questionnaireLength);
		for(var i = 0; i< questionnaireLength; i++){
			var id =  $scope.selection[i];
			  if($scope.selectedAction == 3) {
			  updatedData.push({id: id, is_deleted: true});
			}
			else if($scope.selectedAction == 1) {
				updatedData.push({id: id, enable: true});
			}
			else if($scope.selectedAction == 2) {
				updatedData.push({id: id, enable: false});
			}
		}
		var inputJson = {data: updatedData}
		console.log(inputJson);
			questionnaireService.updateQuestionnaireStatus(inputJson, function(response) {
				$rootScope.message = messagesConstants.updateStatus;
				$route.reload();
			});
		}
		}

	//perform action
	

	$scope.getCategories = function() {
		CategoryService.listCategory(function(response) {			
			if(response.messageId == 200) {
			$scope.filter = {};
			$scope.tableParams = new ngTableParams({page:1, count:10, sorting:{category:"asc"}, filter:$scope.filter}, { total:response.data.length, counts:[], data: response.data});
			var simpleList = response.data;
		}
		});
	}
	 $scope.getAllCategoryQuestions = function(){
	 	CategoryService.allQuestion(function(response) {	
	 	console.log('Allcategory', response);		
			if(response.status == 0) {
			$scope.sorted_categories = response.data;
                var added;
                var len = $scope.sorted_categories.length
                for(var a = 0; a < len; a++) {
                    $scope.categories.push({ _id: $scope.sorted_categories[a]._id, name: $scope.sorted_categories[a].name });
                    added = false;
                    // for(var b = 0; b < $scope.sorted_categories[a].subcategories.length; b++) {
                    //     $scope.categories.push({ _id: $scope.sorted_categories[a].subcategories[b]._id, name: '.....' + $scope.sorted_categories[a].subcategories[b].name });
                    //     if($scope.sorted_categories[a].subcategories[b].disease) {
                    //         if(!added) {
                    //             $scope.diseases.push({
                    //                 _id: $scope.sorted_categories[a]._id,
                    //                 disease: $scope.sorted_categories[a].name,
                    //                 color: $scope.sorted_categories[a].color
                    //             });
                    //             added = true;
                    //         }
                    //         $scope.diseases.push({
                    //             _id: $scope.sorted_categories[a].subcategories[b]._id,
                    //             disease: '.....' + $scope.sorted_categories[a].subcategories[b].name,
                    //             color: $scope.sorted_categories[a].subcategories[b].color
                    //         });
                    //         added = true;
                    //     }
                    // }
                }
		}
		});
	 }

    			$scope.updatedSortedCategory = []
				$scope.findOne = function () {
					$scope.loading = true;
									$scope.getCategories();
	        						
					        		if ($routeParams.questionnarieId) {
					        	    CategoryService.allQuestion(function(response) {	
									if(response.status == 0) {
									$scope.sorted_categories = response.data;
						                var added;
						                var len = $scope.sorted_categories.length
						                for(var a = 0; a < len; a++) {
						                    $scope.categories.push({ _id: $scope.sorted_categories[a]._id, name: $scope.sorted_categories[a].name });
						                    added = false;
						                }
						                questionnaireService.findOneQuestionnaire ($routeParams.questionnarieId, function(responseData) {		
										console.log('questionR', responseData);
										if(responseData.messageId == 200) {
												$scope.questionnaire = responseData.data;
												 
												$scope.checkboxes = {
													checked: false,
													items:{}
												};		
												var questionLength = $scope.questionnaire.questions.length;
												var categoryLength = $scope.sorted_categories.length;
												console.log('sorted Cat', $scope.sorted_categories);
												
												for(var j = 0; j< categoryLength; ++j){
												for(var i = 0; i< questionLength; ++i){
													if( $scope.questionnaire.questions[i].questions == null)
														$scope.questionnaire.questions[i].questions = [];
													if($scope.sorted_categories[j]._id ==  $scope.questionnaire.questions[i].category){
													  $scope.updatedSortedCategory.push($scope.sorted_categories[j]);
													  $scope.selectionCategory.push($scope.questionnaire.questions[i].category);
													}
													$scope.checkboxes.items[$scope.questionnaire.questions[i].category] = true;
													
												}
											}
												 $scope.verifyQuestionsStructure();
						        				 $scope.buildQuestionValues();
										}
								});
								}
								});	        			 
	}
	else{
		$scope.getAllCategoryQuestions();
	}
        $scope.loading = false;
	        		
	        		
	        	}

			$scope.moveTabContents = function(tab){
				$scope.activeTab = tab;
				}

	        	$scope.updateData = function (type) {
				if ($scope.questionnaire._id) {
					if($scope.selectionCategory.length == 0 && $scope.activeTab == 1){
						$scope.message= 'Please select the category.';
						return false;
					}
					else{
					$scope.message= "";
							 var selectedCatLen = $scope.selectedCategoryOnly.length;
							 var questionLen = $scope.questionnaire.questions.length;
							 for(var i = 0; i< selectedCatLen; ++i){
							 	var flag = 0
							 	for(var a = 0; a< questionLen; ++a){
							 		if($scope.selectedCategoryOnly[i].category == $scope.questionnaire.questions[a].category){
							 			flag = 1;
							 			break;
							 		}
							 }
							 if(!flag)
							 	$scope.questionnaire.questions.push($scope.selectedCategoryOnly[i])
						}
					var inputJsonString = $scope.questionnaire;
					console.log(inputJsonString);
					questionnaireService.updateQuestionnaire(inputJsonString, $scope.questionnaire._id, function(response) {
						if(response.messageId == 200) {
							if(type)
							$location.path( "/questionnaire" );
						else{
							++$scope.activeTab
						}
						}	
						else{
							$scope.message = err.message;
						} 
					});
				 }
				}
				else{
					var inputJsonString = $scope.questionnaire;
					questionnaireService.saveQuestionnaire(inputJsonString, function(response) {
						if(response.messageId == 200) {
							$scope.message = '';
							$routeParams.questionnaireId = response.data
							$scope.questionnaire = response.data;
							$scope.activeTab = 1;
						}	
						else{
							$scope.message = response.message;
						} 
					});
				}
				}


	$scope.addCategoryToQuestionnaire = function() {
		$scope.selectedData = $scope.selection;
		$localStorage.selectedCategories = $scope.selection;


		var questionnaireID = $routeParams.questionnaireID;
		console.log("questionnaireID=", questionnaireID);

		$location.path('/viewcategoryquestions/' + questionnaireID);

	}


	$scope.viewcategoryquestions = function() {

		var questionnaireID = $routeParams.catquestionnaireID;
		console.log("questionnaireID=" , questionnaireID);

		console.log("selectedCategories=" , $localStorage.selectedCategories);

		var selectedCategoriesLength = $localStorage.selectedCategories.length;

		for(var i = 0; i < selectedCategoriesLength; i++) {


		}
	}

	


	 $scope.addQuestion = function(question) {
    	// Adds a new question to the correct location in the structure...
    	var cat = -1, sub = -1, a, b;
    	var which_cat = -1, which_q = -1, new_q = -1;
    	var where = $scope.fetchQuestionCategory(question);

    	// Now look for the relevant category in the current selected list
    	var questionLen = $scope.questionnaire.questions.length
    	for(a = 0; a < questionLen; a++) {
    		if($scope.questionnaire.questions[a].category == where._id) {
    			cat = a;
    			break;
    		}
    	}

    	if(cat == -1) {
    		// Top level category doesn't exist, so insert it
    		cat = $scope.questionnaire.questions.length;
    		$scope.questionnaire.questions.push({
    			category: where._id,
    			name: where.name,
    			questions: [],
    		});
    	}

    	// Now see if the question is on the parent list, bear in mind we only need to test the top level _ids without having to dig into the hiearchy seeing as we only offer the top level items for the user to select from ;-) [AF]...
    	var whereLen = where.questions.length;
    	for(a = 0; a < whereLen; a++) {
    		if(where.questions[a]._id == question) {
    			which_q = a;
    			break;
    		}
    	}
    	if(which_q == -1) {
    		// Must be a Sub-categpory Question, so we're going to have to trawl the subcategories now as well
    		var whereSubCatLen = where.subcategories.length;
    		for(a = 0; a < where.subcategories.length; a++) {
    			for(b = 0; b < where.subcategories[a].questions.length; b++) {
		    		if(where.subcategories[a].questions[b]._id == question) {
		    			which_cat = a;
		    			which_q = b;
		    			break;
		    		}
		    	}
		    	if(which_q != -1) break;
	    	}
    		// Now make sure the Sub-Category exists on the actual questionnaire.questions list
    		for(a = 0; a < $scope.questionnaire.questions[cat].subcategories.length; a++) {
    			if($scope.questionnaire.questions[cat].subcategories[a].subcategory == where.subcategories[which_cat]._id) {
    				sub = a;
    				break;
    			}
    		}
			if(sub == -1) {
				// We need to insert thre subcategory also
				sub = $scope.questionnaire.questions[cat].subcategories.length;
				$scope.questionnaire.questions[cat].subcategories.push({
					subcategory: where.subcategories[which_cat]._id,
					color: where.subcategories[which_cat].color,
					name: where.subcategories[which_cat].name,
					questions: []
				});
			}

			// Now see if the question _id already exists...
			for(var a = 0; a < $scope.questionnaire.questions[cat].subcategories[sub].questions.length; a++) {
				if($scope.questionnaire.questions[cat].subcategories[sub].questions[a]._id == question) {
					// Just do a straight replace on the whole thing (assume they wanted to re-instate it)
					// I know stringifying and then parsing JSON isn't ideal, but I need to completely break the association with the sorted_categories object and this seems to be the only reliable way of doing that - albeit not particularly efficiently. [AF]
					$scope.questionnaire.questions[cat].subcategories[sub].questions[a] = JSON.parse(JSON.stringify(where.subcategories[which_cat].questions[which_q]));
					new_q = a;
					break;
				}
			}
			if(new_q == -1) {
				// I know stringifying and then parsing JSON isn't ideal, but I need to completely break the association with the sorted_categories object and this seems to be the only reliable way of doing that. [AF]
				$scope.questionnaire.questions[cat].subcategories[sub].questions.push(JSON.parse(JSON.stringify(where.subcategories[which_cat].questions[which_q])));
			}
    		$scope.questionnaire.questions[cat].subcategories[sub].isopen = true;
    	} else {
    		// Question is in Top Level Set
			// See if the question _id already exists...
			for(var a = 0; a < $scope.questionnaire.questions[cat].questions.length; a++) {
				if($scope.questionnaire.questions[cat].questions[a]._id == question) {
					// Just do a straight replace on the whole thing (assume they wanted to re-instate it)
					// I know stringifying and then parsing JSON isn't ideal, but I need to completely break the association with the sorted_categories object and this seems to be the only reliable way of doing that - albeit not particularly efficiently. [AF]
					$scope.questionnaire.questions[cat].questions[a] = JSON.parse(JSON.stringify(where.questions[which_q]));
					new_q = a;
					break;
				}
			}
			if(new_q == -1) {
				// I know stringifying and then parsing JSON isn't ideal, but I need to completely break the association with the sorted_categories object and this seems to be the only reliable way of doing that. [AF]
				$scope.questionnaire.questions[cat].questions.push(JSON.parse(JSON.stringify(where.questions[which_q])));
			}
    	}
    	$scope.questionnaire.questions[cat].isopen = true;
    }

    $scope.findCategoryParent = function(id) {
	    //console.log("Find {" + id + "}'s parent...");
    	for(var a = 0; a < $scope.sorted_categories.length; a++) {
    		if(id == $scope.sorted_categories[a]._id) {
    			// Is required at the top level...
    			return null;
    		}
    		// Not at top level, so trawl subcategories
    		// for(var b = 0; b < $scope.sorted_categories[a].subcategories.length; b++) {
	    	// 	if(id == $scope.sorted_categories[a].subcategories[b]._id) {
	    	// 		// is required under this parent...
	    	// 		return $scope.sorted_categories[a]._id;
	    	// 	}
    		// }
    	}
    	// To get to here, the category could not be found...
    	return -9999;
    }
    $scope.recurseQuestions = function(dependent, id, questions) {
    	var c, got;
		for(c = 0; c < questions.length; c++) {
			questions[c].dependent = dependent;
    		if(id == questions[c]._id) {
    			return questions[c];
    		}
    		if(questions[c].questions) {
    			got = $scope.recurseQuestions(questions[c]._id, id, questions[c].questions);
    			if(got != null) {
    				return got;
    			}
    		}
		}
		return null;
    }
    $scope.fetchQuestionCategory = function(id) {
	    //console.log("Find {" + id + "}'s category...");
	    var a, b, c, found;
    	for(a = 0; a < $scope.sorted_categories.length; a++) {
    		if($scope.recurseQuestions(null, id, $scope.sorted_categories[a].questions) != null) {
	    		return $scope.sorted_categories[a];
    		}
    		// Not at top level, so trawl subcategories
    		// for(b = 0; b < $scope.sorted_categories[a].subcategories.length; b++) {
    		// 	if($scope.recurseQuestions(null, id, $scope.sorted_categories[a].subcategories[b].questions) != null) {
		    // 		return $scope.sorted_categories[a];
    		// 	}
    		// }
    	}
    	// To get to here, the question could not be found...
    	return -9999;
    }
    $scope.findQuestionCategory = function(id) {
	    //console.log("Find {" + id + "}'s category...");
	    var a, b, c, found;
    	for(a = 0; a < $scope.sorted_categories.length; a++) {
    		if($scope.recurseQuestions(null, id, $scope.sorted_categories[a].questions) != null) {
	    		return { category: $scope.sorted_categories[a]._id, subcategory: null };
    		}
    		// Not at top level, so trawl subcategories
    		// for(b = 0; b < $scope.sorted_categories[a].subcategories.length; b++) {
    		// 	if($scope.recurseQuestions(null, id, $scope.sorted_categories[a].subcategories[b].questions) != null) {
		    // 		return { category: $scope.sorted_categories[a]._id, subcategory: $scope.sorted_categories[a].subcategories[b]._id };
    		// 	}
    		// }
    	}
    	// To get to here, the question could not be found...
    	return -9999;
    }
    $scope.insertQuestion = function(question, structure) {
    	var a, b, foundCat = -1, foundSub = -1;
    	for(a = 0; a < $scope.questionnaire.questions.length; a++) {
    		if($scope.questionnaire.questions[a].category == structure.category) {
    			foundCat = a;
    			if(structure.subcategory != null) {
    				for(b = 0; b < $scope.questionnaire.questions[a].subcategories.length; b++) {
			    		if($scope.questionnaire.questions[a].subcategories[b].subcategory == structure.subcategory) {
			    			foundSub = b;
			    			break;
			    		}
    				}
    			}
    		}
    		if(foundCat > -1) break;
    	}
    	if(foundCat == -1) {
    		// Need to insert category
    		foundCat = $scope.questionnaire.questions.length;
    		$scope.questionnaire.questions.push({
    			category: structure.category,
    			questions: [],
    			subcategories: []
    		});
    	}
    	if(structure.subcategory != null) {
    		// Insert into Subcategory
    		if(foundSub == -1) {
	    		// Need to insert subcategory
	    		foundSub = $scope.questionnaire.questions[foundCat].subcategories.length;
	    		$scope.questionnaire.questions[foundCat].subcategories.push({
	    			subcategory: structure.subcategory,
	    			questions: []
	    		});
	    	}
	    	$scope.questionnaire.questions[foundCat].subcategories[foundSub].questions.push(question);
    	} else {
    		// Insert into Category
	    	$scope.questionnaire.questions[foundCat].questions.push(question);
    	}
    }
    $scope.verifyQuestionsStructure = function() {
    	var parent, qCat, a, b, c, d;
    	// This is an opportunity to mend certain structural changes (although this should be suprfluous once mended)...
    	for(a = 0; a < $scope.questionnaire.questions.length; a++) {
    		// Do sub-categories first due to the fact that if we have to move the parent category, we don't want to lose the subcategories...
	    	// for(b = 0; b < $scope.questionnaire.questions[a].subcategories.length; b++) {
	    	// 	// Reposition Questions first
	    	// 	for(c = 0; c < $scope.questionnaire.questions[a].subcategories[b].questions.length; c++) {
	    	// 		qCat = $scope.findQuestionCategory($scope.questionnaire.questions[a].subcategories[b].questions[c]);
	    	// 		if(qCat == -9999) {
	    	// 			$scope.questionnaire.questions[a].subcategories[b].questions.splice(c, 1);
	    	// 			c--;
	    	// 		} else
	    	// 		if(qCat.category != $scope.questionnaire.questions[a].category || qCat.subcategory != $scope.questionnaire.questions[a].subcategories[b].subcategory) {
	    	// 			// Insert into other Cat/Sub
	    	// 			$scope.insertQuestion($scope.questionnaire.questions[a].subcategories[b].questions[c], qCat);
	    	// 			// Remove from here
	    	// 			$scope.questionnaire.questions[a].subcategories[b].questions.splice(c, 1);
	    	// 			c--;
	    	// 		}
	    	// 	}

	    	// 	// Then see if this category needs moving/removing
	    	// 	if($scope.questionnaire.questions[a].subcategories[b].questions.length == 0) {
	    	// 		// Cleared out above, so force a delete
	    	// 		parent = -9999;
	    	// 	} else {
	    	// 		parent = $scope.findCategoryParent($scope.questionnaire.questions[a].subcategories[b].subcategory);
	    	// 	}
    		// 	if(parent == -9999) {
    		// 		$scope.questionnaire.questions[a].subcategories.splice(b, 1);
    		// 		b--;
    		// 	}
	    	// }
	    	// Now do the actual parent category...
    		// Reposition Questions first
    		for(c = 0; c < $scope.questionnaire.questions[a].questions.length; c++) {
    			qCat = $scope.findQuestionCategory($scope.questionnaire.questions[a].questions[c]);
    			if(qCat == -9999) {
    				$scope.questionnaire.questions[a].questions.splice(c, 1);
    				c--;
    			} else
    			if(qCat.category != $scope.questionnaire.questions[a].category || qCat.subcategory != null) {
    				// Insert into other Cat/Sub
    				$scope.insertQuestion($scope.questionnaire.questions[a].questions[c], qCat);
    				// Remove from here
    				$scope.questionnaire.questions[a].questions.splice(c, 1);
    				c--;
    			}
    		}

			if($scope.questionnaire.questions[a].questions.length == 0 ) {
				// Already emptied by moving Questions and SubCategories, so just force a delete...
				parent = -9999;
			} else {
    			parent = $scope.findCategoryParent($scope.questionnaire.questions[a].category);
			}
			if(parent == -9999) {
				$scope.questionnaire.questions.splice(a, 1);
				a--;
			}
    	}
    }
    $scope.findCategory = function(id) {
    	var a;
    	for(a = 0; a < $scope.sorted_categories.length; a++) {
    		if(id == $scope.sorted_categories[a]._id) {
    			return a;
    		}
    	}
    	return null;
    }
    $scope.findSubCategory = function(id, a) {
    	var b;
    	for(b = 0; b < $scope.sorted_categories[a].subcategories.length; b++) {
    		if(id == $scope.sorted_categories[a].subcategories[b]._id) {
    			return b;
    		}
    	}
    	return null;
    }
    $scope.buildQuestionHierarchy = function(dependent, list) {
    	var new_list = [], work_list = list;
    	for(var a = 0; a < work_list.length; a++) {
    		if(work_list[a].dependent == dependent) {
    			// acquire its dependents
    			new_list.push(work_list[a]);
    			var dependents = $scope.buildQuestionHierarchy(work_list[a]._id, work_list);
    			if(dependents.length > 0) {
    				new_list[new_list.length-1].questions = dependents;
    			}
    		}
    	}
    	return new_list;
    }
    $scope.buildQuestionValues = function() {
    	//console.log($scope.sorted_categories);
		var a, b, c, cat, sub, quest;
    	for(a = 0; a < $scope.questionnaire.questions.length; a++) {
    		cat = $scope.findCategory($scope.questionnaire.questions[a].category);
    		if(cat != null) {
    			$scope.questionnaire.questions[a].name = $scope.sorted_categories[cat].name;
    			$scope.questionnaire.questions[a].color = $scope.sorted_categories[cat].color;
		    	// for(b = 0; b < $scope.questionnaire.questions[a].subcategories.length; b++) {
	    		// 	sub = $scope.findSubCategory($scope.questionnaire.questions[a].subcategories[b].subcategory, cat);
	    		// 	if(sub != null) {
	    		// 		$scope.questionnaire.questions[a].subcategories[b].name = $scope.sorted_categories[cat].subcategories[sub].name;
	    		// 		$scope.questionnaire.questions[a].subcategories[b].color = $scope.sorted_categories[cat].subcategories[sub].color;
			    // 		for(c = 0; c < $scope.questionnaire.questions[a].subcategories[b].questions.length; c++) {
		    	// 			quest = $scope.recurseQuestions(null, $scope.questionnaire.questions[a].subcategories[b].questions[c], $scope.sorted_categories[cat].subcategories[sub].questions);
		    	// 			if(quest != null) {
			    // 				$scope.questionnaire.questions[a].subcategories[b].questions[c] = {
			    // 					_id: quest._id,
			    // 					en: quest.en,
			    // 					dependent: quest.dependent
			    // 				};
		    	// 			}
			    // 		}

			    // 		// The Questions are actually flat and I want to be able to delete whole groups at once and also ensure we don't order questions that are dependent prior to the actual question it is dependent upon...  it just makes sense! [AF]
			    // 		// Erm...
			    // 		$scope.questionnaire.questions[a].subcategories[b].questions = $scope.buildQuestionHierarchy(null, $scope.questionnaire.questions[a].subcategories[b].questions);
	    		// 	}
		    	// }
	    		for(c = 0; c < $scope.questionnaire.questions[a].questions.length; c++) {
    				quest = $scope.recurseQuestions(null, $scope.questionnaire.questions[a].questions[c], $scope.sorted_categories[cat].questions);
    				if(quest != null) {
	    				$scope.questionnaire.questions[a].questions[c] = {
	    					_id: quest._id,
	    					en: quest.en,
			    			dependent: quest.dependent
	    				};
    				}
	    		}
			    $scope.questionnaire.questions[a].questions = $scope.buildQuestionHierarchy(null, $scope.questionnaire.questions[a].questions);
    		}
    	}
        //console.log($scope.questionnaire.questions);
    }

    $scope.recurseRemoveQuestions = function(id, questions) {
    	var c, got;
		for(c = 0; c < questions.length; c++) {
    		if(id == questions[c]._id) {
    			questions.splice(c, 1);
    			return true;
    		}
    		if(questions[c].questions) {
    			if($scope.recurseRemoveQuestions(id, questions[c].questions)) {
    				return true;
    			}
    		}
		}
		return false;
    }

  $scope.oneAtATime = true;

  
    $scope.removeSelectedQuestion = function(id) {
	    var a, b;
    	for(a = 0; a < $scope.questionnaire.questions.length; a++) {
    		if($scope.recurseRemoveQuestions(id, $scope.questionnaire.questions[a].questions)) {
    			if($scope.questionnaire.questions[a].questions.length == 0) {
    				$scope.questionnaire.questions.splice(a, 1);
    			}
	    		return;
    		}
    		// Not at top level, so trawl subcategories
    		// for(b = 0; b < $scope.questionnaire.questions[a].subcategories.length; b++) {
    		// 	if($scope.recurseRemoveQuestions(id, $scope.questionnaire.questions[a].subcategories[b].questions)) {
	    	// 		if($scope.questionnaire.questions[a].subcategories[b].questions.length == 0) {
	    	// 			$scope.questionnaire.questions[a].subcategories.splice(b, 1);
		    // 			if($scope.questionnaire.questions[a].subcategories.length == 0 && $scope.questionnaire.questions[a].questions.length == 0) {
		    // 				$scope.questionnaire.questions.splice(a, 1);
		    // 			}
	    	// 		}
		    // 		return;
    		// 	}
    		// }
    	}
    }
}]);