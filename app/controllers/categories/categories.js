var categoryObj = require('./../../models/categories/categories.js');
var questionObj = require('./../../models/question/question.js');
var mongoose = require('mongoose');
var constantObj = require('./../../../constants.js');


        /**
         * Find category by id
         * Input: categoryId
         * Output: category json object
         * This function gets called automatically whenever we have a categoryId parameter in route. 
         * It uses load function which has been define in category model after that passes control to next calling function.
         */
         exports.category = function(req, res, next, id) {
            categoryObj.load(id, function(err, category) {
                if (err){
                    res.jsonp(err);
                }
                else if (!category){
                    res.jsonp({err:'Failed to load category ' + id});
                }
                else{
                    req.category = category;
                    next();
                }
            });
         };


        /**
         * Show category by id
         * Input: category json object
         * Output: category json object
         * This function gets category json object from exports.role 
         */
         exports.findOne = function(req, res) {
            if(!req.category) {
                outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
            }
            else {
                outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 
                'data': req.category}
            }
            res.jsonp(outputJSON);
         };

        /**
         * List all category object
         * Input: 
         * Output: category json object
         */
         exports.list = function(req, res) {
            var outputJSON = "";
            var condition = {};
            var questionnaireId = req.params.questionnaireId;
            if(questionnaireId) {
                condition = {is_deleted:false};
            }
            else {
                condition = {$and: [{is_deleted:false}, {enable:true}]};
            }
            console.log(req.body);
            categoryObj.find(condition, function(err, data) {
                if(err) {
                    outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
                }
                else {
                    outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 'data': data}    
                }
                res.jsonp(outputJSON);
            });
         }



        /**
         * Create new category object
         * Input: category object
         * Output: category json object with success
         */
                exports.add = function(req, res) {
                	var outputJSON = '';
                	var errorMessage = "";
                	var category = {};
                	category.category_name = req.body.category_name;
                	categoryObj(category).save(req.body, function(err, data) {
                		if(err) {
                			switch(err.name) {
                				case 'ValidationError':
                					for(field in err.errors) {
                						if(errorMessage == "") {
                							errorMessage = err.errors[field].message;
                						}
                						else {							
                							errorMessage+="\r\n"  +  err.errors[field].message;
                						}
                					}//for
                				break;
                			}//switch
                			outputJSON = {'status' : 'failure', 'messageId' : 400, 'message' : errorMessage};
                		}
                		else {
                			outputJSON = {'status' : 'success', 'messageId': 200, 'message' : constantObj.messages.categorySuccess};
                		}

                		res.jsonp(outputJSON);
                	});
                }




         exports.category_structure = function(need, lang, callback) {
            //console.log("Categories.category_structure " + need + " " + lang);
            var limitConcurrent = 10; // Don't steal the show!
            var data = [];
            function buildQuestions(category, subcats, cat_id, cbq) {
            function get_Q(toDo, sub_item, cbget) {
            questionObj.find({ 'dependency.dependency_question':sub_item._id }).exec(function(err, innerQs) {
                cbget(toDo, sub_item, innerQs);
            });
        }        
        function sub_launch(level, sentQs, cb) {
            var retQs = [];
            var thisQs = sentQs;
            var toDo = sentQs.length;
            while(thisQs.length > 0) {
                var sub_item = thisQs.shift();

                get_Q(toDo, sub_item, function(gotDo, obj, innerQs) {
                    var thisObj = {
                        _id: obj._id,
                         en:  obj.question,
                        deleted: obj.deleted,                        
                    };
                    //if(obj.country.length > 0) {
                    //    console.log(thisObj);
                    //}
                    if(innerQs.length == 0) {
                        retQs.push(thisObj);
                        if(retQs.length == gotDo) {
                            var temp;
                            for(var write=0; write < retQs.length; ++write) {
                                for(var sort=0; sort < retQs.length-1; ++sort) {
                                    if(retQs[sort].en > retQs[sort+1].en) {
                                        temp = retQs[sort+1];
                                        retQs[sort+1] = retQs[sort];
                                        retQs[sort] = temp;
                                    }
                                }
                            }
                            cb(retQs);
                        }
                    } else {
                        sub_launch(level+1, innerQs, function(rtQs) {
                            thisObj.questions = rtQs;
                            retQs.push(thisObj);
                            if(retQs.length == gotDo) {
                                var temp;
                                for(var write=0; write < retQs.length; ++write) {
                                    for(var sort=0; sort < retQs.length-1; ++sort) {
                                        if(retQs[sort].en > retQs[sort+1].en) {
                                            temp = retQs[sort+1];
                                            retQs[sort+1] = retQs[sort];
                                            retQs[sort] = temp;
                                        }
                                    }
                                }
                                cb(retQs);
                            }
                        });
                    }
                });
            }
        }

        questionObj.find({ category:cat_id, 'dependency.dependency_question':null }).exec(function(err, questions) {

            if(questions.length == 0) {
                // leave immediately
                cbq(category, subcats, []);
                return;
            }
            sub_launch(0, questions, function(fullList) {
                cbq(category, subcats, fullList);
            });
        });
    }


    // Set up the array to pull each from and do the count on (asynchronously)...
    var workTable = [];
    var numRunning = 0;

    // This function is performed on each category and then returned (doctored)...
    function getSubs(category, cb) {
        // Get all this Category's Sub-Categories....
        categoryObj.find({ parent: category._id }, { _id:true, name:true, deleted:true, disease:true, friend_of_Q:true, healthplan:true, color:true, question_color:true, icon:true } ).populate('name', 'en trans').exec(function(err, gotSubs) {

            if(err) {
                callback(-1, err.message, []);
            }

            // But to make matters more complex, now go and get all the Questions under this Sub-Category (top level - no dependencies)...

            var subs = [];
            // We need to do similar again to "launcher" but for each subcategory's questions...
            var sub_workTable = gotSubs;
            var sub_numRunning = 0;

            if(gotSubs.length > 0) {
                // need to get the sub-categories' Questions
                if(need) {
                    sub_launcher();
                } else {
                    // Populate Subs as required, without any Questions Objects
                    for(var a = 0; a < gotSubs.length; ++a) {
                        subs.push({
                            _id: gotSubs[a]._id,
                            name: gotSubs[a].name,
                        });
                    }
                    doneSub();
                }
            } else {
                // No sub-categories go stright to return callback...
                doneSub();
            }

            // Does all in workTable (limited to limitConcurrent at a time)...
            function sub_launcher() {
                while(sub_numRunning < limitConcurrent && sub_workTable.length > 0) {
                    // Items still to do on the list and 
                    var sub_item = sub_workTable.shift();
                    //console.log("Do " + category.name.en + " : " + sub_item.name.en + " " + sub_workTable.length);
                    
                    buildQuestions(category, sub_item, sub_item._id, function(ret, retsubs, questions) {
                        var newItem = {
                            _id: retsubs._id,
                            name:  retsubs.category_name,
                            questions: questions
                        };
                        subs.push(newItem);
                        //console.log("Done " + ret.name.en + " : " + newItem.name + " " + newItem._id);
                        sub_numRunning--;
                        if(sub_workTable.length > 0) {
                            // more to do...
                            //console.log("go again...");
                            sub_launcher();
                        } else 
                        if(sub_numRunning == 0) {
                            // The break-out - we're done!
                            //console.log("ALL DONE - " + ret.name.en + " " + newItem.name);
                            doneSub();
                        }
                    });
                    sub_numRunning++;
                }
            }

            function doneSub() {
                // Bubble Sort Sub_Categories
                var temp;
                for(var write=0; write < subs.length; ++write) {
                    for(var sort=0; sort < subs.length-1; ++sort) {
                        if(subs[sort].name > subs[sort+1].name) {
                            temp = subs[sort+1];
                            subs[sort+1] = subs[sort];
                            subs[sort] = temp;
                        }
                    }
                }
                if(need) {
                    buildQuestions(category, subs, category._id, function(ret, retsubs, questions) {
                        cb(ret, retsubs, questions);
                    });
                } else {
                    cb(category, subs, null);
                }
            }
        });
    }

    // Does all in workTable (limited to limitConcurrent at a time)...
    var numToDo = 0;
    function launcher() {
        while(numRunning < limitConcurrent && workTable.length > 0) {
            // Items still to do on the list and 
            var item = workTable.shift();
            item.subcategories = [];
            getSubs(item, function(ret, retsubs, questions) {
                var newItem = {
                    _id: ret._id,
                    name: ret.category_name,
                }
                if(questions != null) {
                    newItem.questions = questions;
                }
                data.push(newItem);
                numRunning--;
                if(workTable.length > 0) {
                    // more to do...
                    launcher();
                } else
                if(data.length == numToDo) {
                    // The break-out - we're done!
                    // Bubble Sort Main Categories
                    var temp;
                    for(var write=0; write < data.length; ++write) {
                        for(var sort=0; sort < data.length-1; ++sort) {
                            if(data[sort].name > data[sort+1].name) {
                                temp = data[sort+1];
                                data[sort+1] = data[sort];
                                data[sort] = temp;
                            }
                        }
                    }
                    callback(0, "", data);
                }
            });
            numRunning++;
        }
    }

    categoryObj.find({}).exec(function(err, categories) {
        if (err) {
            callback(-1, err, []);
        } else {
            // Now get a count of times it's been used (this will be used for if we can delete it from the front-end)
            workTable = categories;
            numToDo = categories.length;
            if(numToDo > 0) {
                launcher();
            } else {
                // No categories
                callback(0, "", []);
            }
        }
    });
};

        /**
         * List all question by category object
         * Input: 
         * Output: category question json object with success
         */
        exports.allQuestions = function(req, res){
            var result = {
                status: 0,
                message: '',
                data: []
            };
            module.exports.category_structure(true, 'en', function(status, message, data) {
                result.status = status;
                result.message = message;
                result.data = data;
                res.jsonp(result);
            });
        }


        /**
         * Update category object
         * Input: category object
         * Output: category json object with success
         */
         exports.update = function(req, res) {
            var errorMessage = "";
            var outputJSON = "";
            var category = req.category;
            category.category_name = req.body.category_name;
            category.enable = req.body.enable;
            category.save(function(err, data) {
                console.log(err);
                console.log(data);
                if(err) {
                    switch(err.name) {
                        case 'ValidationError':
                        for(field in err.errors) {
                            if(errorMessage == "") {
                                errorMessage = err.errors[field].message;
                            }
                            else {                          
                                errorMessage+="\r\n" + err.errors[field].message;
                            }
                                    }//for
                                    break;
                            }//switch
                            outputJSON = {'status': 'failure', 'messageId':401, 'message':errorMessage};
                        }//if
                        else {
                            outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.categoryUpdateSuccess};
                        }
                        res.jsonp(outputJSON);
                    });
         }


        /**
         * Update category object(s) (Bulk update)
         * Input: category object(s)
         * Output: Success message
         * This function is used to for bulk updation for role object(s)
         */
         exports.bulkUpdate = function(req, res) {
            var outputJSON = "";
            var inputData = req.body;
            var categoryLength = inputData.data.length;
            var bulk = categoryObj.collection.initializeUnorderedBulkOp();
            for(var i = 0; i< categoryLength; i++){
                var categoryData = inputData.data[i];
                var id = mongoose.Types.ObjectId(categoryData.id);  
                bulk.find({_id: id}).update({$set: categoryData});
            }
            bulk.execute(function (data) {
                outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.categoryStatusUpdateSuccess};
            });
            res.jsonp(outputJSON);
         }


       
