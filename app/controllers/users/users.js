var userObj = require('./../../models/users/users.js');
//var vendor = require('./../../models/vendordetails/vendordetails.js');
var Vendor = require('./../../models/admin/signup_vendor.js');
var order = require('./../../models/order/order.js');
var itemsObj = require('./../../models/items/items.js');
var device = require('./../../models/devices/devices.js')
var mongoose = require('mongoose');
var twilio = require('twilio');
var nodemailer = require('nodemailer');
var constantObj = require('./../../../constants.js');
var accountSid = 'ACf8246b33d4d1342704dee12500c7aba2'; // Your Account SID from www.twilio.com/console
var authToken = '53800350222c1f6974ce1617563aaaa5'; // Your Auth Token from www.twilio.com/console
var client = new twilio(accountSid, authToken);
/**
 * Find role by id
 * Input: roleId
 * Output: Role json object
 * This function gets called automatically whenever we have a roleId parameter in route. 
 * It uses load function which has been define in role model after that passes control to next calling function.
 */

exports.userlogin = function(req, res) {
    var data = res.req.user;
    if (req.body.loginType == 1) {
        if (data.message == 'Invalid username') {
            var outputJSON = {
                'status': 'failure',
                'messageId': 400,
                'message': "Invalid username"
            };
            res.jsonp(outputJSON)
        } else if (data.message == 'Invalid password') {
            var outputJSON = {
                'status': 'failure',
                'messageId': 400,
                'message': "Invalid password"
            };
            res.jsonp(outputJSON)
        } else if (data.message == "Error") {
            var outputJSON = {
                'status': 'failure',
                'messageId': 400,
                'message': "Error occured,try again later"
            };
            res.jsonp(outputJSON)
        } else {
            var outputJSON = {
                'status': 'success',
                'messageId': 200,
                'message': "login successfully",
                "data": data
            };
            res.jsonp(outputJSON)
        }


    }
}

//update vendor information

exports.update_vendor_info = function(req, res) {
    if (req.body) {
        vendor.findOne({
            _id: req.body._id
        }, function(err, data) {
            if (err) {
                outputJSON = {
                    'status': 'error',
                    'messageId': 400,
                    'message': "not a valid _id"
                };
                res.jsonp(outputJSON)
            } else {
                console.log("req.body", req.body)
                vendor.update({
                    _id: req.body._id
                }, {
                    $set: {
                        "pickup_time": req.body.pickup_time,
                        "email": req.body.email,
                        "password": req.body.password
                    }
                }, function(err, updatedresponse) {
                    if (err) {
                        outputJSON = {
                            'status': 'error',
                            'messageId': 400,
                            'message': "not Updated"
                        };
                        res.jsonp(outputJSON)
                    } else {
                        outputJSON = {
                            'status': 'success',
                            'messageId': 200,
                            'message': "updated successfully",
                            "data": updatedresponse
                        };
                        res.jsonp(outputJSON)
                    }
                })
            }
        })
    }
}

exports.faceBookLogin = function(req, res) {

        if (req.body.loginType == 2) {
            if (!req.body.facebook_id) {
                res.jsonp({
                    'status': 'failure',
                    'messageId': 401,
                    'message': 'Facebook Authentication Failed.'
                });
            } else {
                var details = {};
                if (req.body.first_name) {
                    details.first_name = req.body.first_name;
                }
                if (req.body.last_name) {
                    details.last_name = req.body.last_name;
                }
                if (req.body.phone_no) {
                    details.phone_no = req.body.phone_no;
                }
                if (req.body.email) {
                    details.email = req.body.email;
                }
                if (req.body.password) {
                    details.password = req.body.password;
                }
                if(req.body.username){
                    details.user_name=req.body.username;
                }
                details.facebook_id = req.body.facebook_id;
                details.loginType = 2;
                userObj.findOne({
                    facebook_id: req.body.facebook_id
                }, function(err, user) {
                    if (err) {
                        console.log("err", err)
                        res.jsonp({
                            "status": 'faliure',
                            "messageId": "401",
                            "message": "Sorry, Problem to login with facebook."
                        });
                    } else {
                        if (user == null) {
                            userObj(details).save(req.body, function(err, adduser) {
                                if (err) {
                                    console.log("err", err)
                                    res.jsonp({
                                        'status': 'failure',
                                        'messageId': 401,
                                        'message': 'User is not found'
                                    });
                                } else {
                                    var data = {};
                                    data.user_id = adduser._id;
                                    data.device_id = req.body.device_id;
                                    data.device_type = req.body.device_type;

                                    device(device).save(data, function(err, devicedata) {
                                        if (err) {
                                            res.jsonp({
                                                'status': 'faliure',
                                                'messageId': 401,
                                                'message': 'Either device_id or device_type is not available!'
                                            });
                                        } else {
                                            res.jsonp({
                                                'status': 'success',
                                                'messageId': 200,
                                                'message': 'User logged in successfully',
                                                "data": adduser
                                            });
                                        }
                                    })
                                }
                            })
                        } else {
                            userObj.update({user,facebook_id:req.body.facebook_id},{$set:{details}},function(err,updatedata){
                                if(err){

                                }else{
                                    if(updatedata){
                                      var dev = {};
                                        dev.user_id = user._id;
                                        dev.device_id = req.body.device_id;
                                        dev.device_type = req.body.device_type;
                                        device(dev).save(dev, function(err, data) {
                                            if (err) {
                                                res.jsonp({
                                                    'status': 'faliure',
                                                    'messageId': 401,
                                                    'message': 'Either device_id or device_type is not available!'
                                                });
                                            } else {
                                                res.jsonp({
                                                    'status': 'success',
                                                    'messageId': 200,
                                                    'message': 'Facebook credentials already exists',
                                                    "data": user
                                                });
                                            }
                                        })  
                                    }
                                }
                            })

                            
                        }
                    }
                })
            }

        }
    }
    /* else if (req.body.loginType == 3) {  // loginType= 3  for google login
            if (!req.body.google_id) {
                res.jsonp({
                    'status': 'faliure',
                    'messageId': 401,
                    'message': 'Google Id required!'
                });
            } else {
                var details = {};
                if (req.body.first_name) {
                    details.first_name = req.body.first_name;
                }
                if (req.body.last_name) {
                    details.last_name = req.body.last_name;
                }
                if (req.body.phone_no) {
                    details.phone_no = req.body.phone_no;
                }
                if (req.body.email) {
                    details.email = req.body.email;
                }
                if (req.body.password) {
                    details.password = req.body.password;
                }
                
                details.google_id = req.body.google_id;
                details.email = req.body.email;
                details.gender = req.body.gender;
                details.loginType=req.body.loginType;
                userObj.findOne({"google_id":details.google_id,"email":details.email}, function(err, user) {
                    if (err) {
                        console.log(err);
                        var response = {
                            "status": 'faliure',
                            "messageId": "401",
                            "message": "Google Authentication Failed!"
                        };
                        res.status(401).json(response);
                    } else {
                        console.log("userssss",user)
                        if (user == null) {
                           userObj(details).save(req.body,function(err, googleuser) {
                          
                                    if (err) {
                                        console.log("err",err)
                                        return done(null, false);
                                    } else {
                                        var data = {};
                                        data.user_id=googleuser._id;
                                        data.device_id = req.body.device_id;
                                        data.device_type = req.body.device_type;
                                        device(data).save(req.body,function(err, data) {
                                                if (err) {
                                                    res.jsonp({
                                                        'status': 'faliure',
                                                        'messageId': 401,
                                                        'message': 'Something went wrong!'
                                                    });
                                                } else {
                                                    console.log("fffff")
                                                    res.jsonp({
                                                        'status': 'success',
                                                        'messageId': 200,
                                                        'message': 'User logged in successfully',
                                                        "userdata": googleuser
                                                    });
                                                }
                                            })
                                    }
                                })
                           
                        } else {
                            
                            var data = {};
                            data.user_id = user._id;
                            data.device_id = req.body.device_id;
                            data.device_type = req.body.device_type;
                            device(data).save(req.body, function(err, data) {
                                    if (err) {
                                        res.jsonp({
                                            'status': 'faliure',
                                            'messageId': 401,
                                            'message': 'Either device_id or device_type is not available!'
                                        });
                                    } else {
                                        res.jsonp({
                                            'status': 'success',
                                            'messageId': 200,
                                            'message': 'User details already logged in',
                                            "userdata": user
                                        });
                                    }
                                })
                                //res.jsonp({ 'status': 'success', 'messageId': 200, 'message': 'User logged in successfully', "userdata": user });
                                //}
                        }
                    }
                })
            }
        } else {
            res.jsonp({
                'status': 'faliure',
                'messageId': 401,
                'message': 'something wrong here'
            });
        }*/

exports.user = function(req, res, next, id) {
    userObj.load(id, function(err, user) {
        if (err) {
            res.jsonp(err);
        } else if (!user) {
            res.jsonp({
                err: 'Failed to load role ' + id
            });
        } else {

            req.userData = user;
            //console.log(req.user);
            next();
        }
    });
};


/**
 * Show user by id
 * Input: User json object
 * Output: Role json object
 * This function gets role json object from exports.role 
 */
exports.findOne = function(req, res) {
    if (!req.userData) {
        outputJSON = {
            'status': 'failure',
            'messageId': 203,
            'message': constantObj.messages.errorRetreivingData
        };
    } else {
        outputJSON = {
            'status': 'success',
            'messageId': 200,
            'message': constantObj.messages.successRetreivingData,
            'data': req.userData
        }
    }
    res.jsonp(outputJSON);
};


/**
 * List all user object
 * Input: 
 * Output: User json object*/
exports.list = function(req,res){
      var outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
        userObj.find({is_deleted:false},function(err,data){

        var page = req.body.page || 1,
        count = req.body.count || 1;
    var skipNo = (page - 1) * count;

    var sortdata = {};
    var sortkey = null;
    for (key in req.body.sort) {
        sortkey = key;
    }
    if (sortkey) {
        var sortquery = {};
        sortquery[sortkey ? sortkey : '_id'] = req.body.sort ? (req.body.sort[sortkey] == 'desc' ? -1 : 1) : -1;
    }
     //console.log("-----------query-------", query);
    console.log("sortquery", sortquery);
    console.log("page", page);
    console.log("count", count);
    console.log("skipNo",skipNo)
    var query = {};
    var searchStr = req.body.search;
    if (req.body.search) {
        query.$or = [{
           first_name:new RegExp(searchStr, 'i')
            
        }, {
            email: new RegExp(searchStr, 'i')
        },{
            phone_no: new RegExp(searchStr, 'i')
        }]
    }
    query.is_deleted=false;
    console.log("-----------query-------", query);
    userObj.find(query).exec(function(err, data) {
        console.log("hahahahhahahhahahaha",data);
                    if(err){
                        res.json("Error: "+err);   
                    }
                    else{
                        //outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, "data":data }, 
                        //res.json(outputJSON);

                        var length = data.length;
                        userObj.find(
                             query
                        ).skip(skipNo).limit(count).sort(sortquery)
                        .exec(function(err, data1) {
                            //console.log(data)
                            if (err) {
                                console.log("tttte",err)
                                outputJSON = {
                                    'status': 'failure',
                                    'messageId': 203,
                                    'message': 'data not retrieved '
                                };
                            } else {
                                outputJSON = {
                                    'status': 'success',
                                    'messageId': 200,
                                    'message': 'data retrieve from products',
                                    'data': data1,
                                    'count': length
                                }
                            }
                            res.status(200).jsonp(outputJSON);
                        })
                    }
                });

    });

}


// exports.list = function(req, res) {
//             var outputJSON = "";
//             userObj.find({}, function(err, data) {
// var page = req.body.page || 1,
//         count = req.body.count || 1;
//     var skipNo = (page - 1) * count;

//     var sortdata = {};
//     var sortkey = null;
//     for (key in req.body.sort) {
//         sortkey = key;
//     }
//     if (sortkey) {
//         var sortquery = {};
//         sortquery[sortkey ? sortkey : '_id'] = req.body.sort ? (req.body.sort[sortkey] == 'desc' ? -1 : 1) : -1;
//     }
//      //console.log("-----------query-------", query);
//     console.log("sortquery", sortquery);
//     console.log("page", page);
//     console.log("count", count);
//     console.log("skipNo",skipNo)
//     var query = {};
//     var searchStr = req.body.search;
//     if (req.body.search) {
//         query.$or = [{
//             first_name:new RegExp(searchStr, 'i')

//         }, {
//             last_name: new RegExp(searchStr, 'i')
//         },{
//             email: new RegExp(searchStr, 'i')
//         },{
//             phone: new RegExp(searchStr, 'i')
//         }]
//     }
//     query.is_deleted=false;
//     console.log("-----------query-------", query);
//     userObj.find(query).exec(function(err, data) {


//                 if(err) {
//                     outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
//                 }
//                 else {

//                    var length = data.length;
//             userObj.find(
//                  query
//             ).skip(skipNo).limit(count).sort(sortquery)
//             .exec(function(err, data1) {
//                 console.log("asdasd",data1)

//                 if(err) {
//                     outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
//                 }
//                 else {
//                     outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, 
//                     'data': data}
//                 }
//                 res.jsonp(outputJSON);
//             })
//          }

//      });
// });
//         }
//      exports.list = function(req, res) {
//         var outputJSON = "";
//         userObj.find({is_deleted:false}, function(err, data) {


//         var page = req.body.page || 1,
//     count = req.body.count || 1;
// var skipNo = (page - 1) * count;

// var sortdata = {};
// var sortkey = null;
// for (key in req.body.sort) {
//     sortkey = key;
// }
// if (sortkey) {
//     var sortquery = {};
//     sortquery[sortkey ? sortkey : '_id'] = req.body.sort ? (req.body.sort[sortkey] == 'desc' ? -1 : 1) : -1;
// }
//  //console.log("-----------query-------", query);
// console.log("sortquery", sortquery);
// console.log("page", page);
// console.log("count", count);
// console.log("skipNo",skipNo)
// var query = {};
// var searchStr = req.body.search;
// if (req.body.search) {
//     query.$or = [{
//         first_name:new RegExp(searchStr, 'i')

//     }, {
//         last_name: new RegExp(searchStr, 'i')
//     },{
//         email: new RegExp(searchStr, 'i')
//     },{
//         phone: new RegExp(searchStr, 'i')
//     }]
// }
// query.is_deleted=false;
// console.log("-----------query-------", query);
// userObj.find(query).exec(function(err, data) {


//             if(err) {
//                 outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
//             }
//             else {

//                var length = data.length;
//         userObj.find(
//              query
//         ).skip(skipNo).limit(count).sort(sortquery)
//         .exec(function(err, data1) {
//             console.log("asdasd",data1)
//             if (err) {
//                 console.log("tttte",err)
//                 outputJSON = {
//                     'status': 'failure',
//                     'messageId': 203,
//                     'message': 'data not retrieved '
//                 };
//                 res.jsonp(outputJSON);
//             } else {
//                 outputJSON = {
//                     'status': 'success',
//                     'messageId': 200,
//                     'message': 'data retrieve from products',
//                     'data': data1,
//                     'count': length
//                 }
//             }
//             res.status(200).jsonp(outputJSON);
//         })
//             }

//         });
//      });
// }

// exports.list = function(req, res) {
//     console.log(req.body)
//     var page = req.body.page || 1,
//         count = req.body.count || 1;
//     var skipNo = (page - 1) * count;

//     var sortdata = {};
//     var sortkey = null;
//     for (key in req.body.sort) {
//         sortkey = key;
//     }
//     if (sortkey) {
//         var sortquery = {};
//         sortquery[sortkey ? sortkey : '_id'] = req.body.sort ? (req.body.sort[sortkey] == 'desc' ? -1 : 1) : -1;
//     }
//      //console.log("-----------query-------", query);
//     console.log("sortquery", sortquery);
//     console.log("page", page);
//     console.log("count", count);
//     console.log("skipNo",skipNo)
//     var query = {};
//     var searchStr = req.body.search;
//     if (req.body.search) {
//         query.$or = [{
//             first_name:new RegExp(searchStr, 'i')

//         }, {
//             last_name: new RegExp(searchStr, 'i')
//         },{
//             gender: new RegExp(searchStr, 'i')
//         },{
//             phone: new RegExp(searchStr, 'i')
//         }]
//     }
//     query.is_deleted=false;
//     console.log("-----------query-------", query);
//     userObj.find(query).exec(function(err, data) {
//         if (err) {
//             console.log(err)
//         } else {
//             var length = data.length;
//             userObj.find(
//                  query
//             ).skip(skipNo).limit(count).sort(sortquery)
//             .exec(function(err, data1) {
//                 //console.log(data)
//                 if (err) {
//                     console.log("tttte",err)
//                     outputJSON = {
//                         'status': 'failure',
//                         'messageId': 203,
//                         'message': 'data not retrieved '
//                     };
//                 } else {
//                     outputJSON = {
//                         'status': 'success',
//                         'messageId': 200,
//                         'message': 'data retrieve from products',
//                         'data': data1,
//                         'count': length
//                     }
//                 }
//                 res.status(200).jsonp(outputJSON);
//             })
//         }
//     })
// }

/**
 * Create new user object
 * Input: User object
 * Output: User json object with success
 */
exports.add = function(req, res) {
    var errorMessage = "";
    var outputJSON = "";
    var userModelObj = {};
    userModelObj = req.body;
    userObj.findOne({
        email: req.body.email
    }, function(err, user) {
        if (err) {
            outputJSON = {
                'status': 'failure',
                'messageId': 401,
                'message': errorMessage
            };
        } else {
            if (user == null) {
                userObj(userModelObj).save(req.body, function(err, data) {
                    if (err) {
                        switch (err.name) {
                            case 'ValidationError':

                                for (field in err.errors) {
                                    if (errorMessage == "") {
                                        errorMessage = err.errors[field].message;
                                    } else {
                                        errorMessage += ", " + err.errors[field].message;
                                    }
                                } //for
                                break;
                        } //switch

                        outputJSON = {
                            'status': 'failure',
                            'messageId': 401,
                            'message': errorMessage
                        };
                    } //if
                    else {
                        outputJSON = {
                            'status': 'success',
                            'messageId': 200,
                            'message': constantObj.messages.userSuccess,
                            'data': data
                        };
                    }
                    res.jsonp(outputJSON);
                });
            } else {
                console.log("inside else")
                outputJSON = {
                    'status': 'failure',
                    'messageId': 401,
                    'message': "user already exists"
                };
                res.jsonp(outputJSON);
            }
        }
    })
}


/**
 * Update user object
 * Input: User object
 * Output: User json object with success
 */
exports.update_user_info = function(req, res) {
    userObj.find({
        _id: req.body._id
    }, function(err, user_found) {
        if (err) {
            console.log(err);
            outputJSON = {
                'status': 'Failure',
                'messageId': 400,
                'message': "Error"
            };
            res.jsonp(outputJSON)
        } else {
            if (user_found == "") {
                outputJSON = {
                    'status': 'success',
                    'messageId': 200,
                    'message': "Not a valid _id"
                };
                res.jsonp(outputJSON)
            } else {
                var logintype = user_found[0].loginType
                if (req.body.email == "") {
                    console.log("email not updated")
                    userObj.update({
                        _id: req.body._id
                    }, {
                        $set: {
                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                            phone_no: req.body.phone_no,
                            password: req.body.password
                        }
                    }, function(err, data) {
                        if (err) {
                            console.log("err", err);
                            outputJSON = {
                                'status': 'failure',
                                'messageId': 401,
                                'message': errorMessage
                            };
                            res.jsonp(outputJSON);
                        } else {
                            outputJSON = {
                                'status': 'success',
                                'messageId': 200,
                                'message': "updated successfully",
                                'data': data
                            };
                            res.jsonp(outputJSON);
                        }
                    });
                } else {
                    if (logintype == 1) {
                        userObj.find({
                            email: req.body.email
                        }, function(err, useremail) {
                            if (err) {
                                console.log(err);
                                outputJSON = {
                                    'status': 'Failure',
                                    'messageId': 400,
                                    'message': "Error"
                                };
                                res.jsonp(outputJSON)
                            } else {
                                if (useremail == "") {
                                    userObj.update({
                                        _id: req.body._id
                                    }, {
                                        $set: {
                                            first_name: req.body.first_name,
                                            last_name: req.body.last_name,
                                            email: req.body.email,
                                            password: req.body.password,
                                            phone_no: req.body.phone_no
                                        }
                                    }, function(err, updateddata) {
                                        if (err) {
                                            outputJSON = {
                                                'status': 'failure',
                                                'messageId': 401,
                                                'message': errorMessage
                                            };
                                            res.jsonp(outputJSON);
                                        } else {
                                            outputJSON = {
                                                'status': 'success',
                                                'messageId': 200,
                                                'message': "updated successfully",
                                                'data': updateddata
                                            };
                                            res.jsonp(outputJSON);
                                        }
                                    });
                                } // end of if email is unique
                                else {
                                    outputJSON = {
                                        'status': 'failure',
                                        'messageId': 400,
                                        'message': "Email already exist in database, please enter another email id"

                                    };
                                    res.jsonp(outputJSON);
                                }
                            }
                        })
                    } // end of if loginType==1
                    if (logintype == 2) {
                        userObj.update({
                            _id: req.body._id
                        }, {
                            $set: {
                                first_name: req.body.first_name,
                                last_name: req.body.last_name,
                                email: req.body.email,
                                phone_no: req.body.phone_no
                            }
                        }, function(err, data) {
                            if (err) {
                                outputJSON = {
                                    'status': 'failure',
                                    'messageId': 401,
                                    'message': errorMessage
                                };
                                res.jsonp(outputJSON);
                            } else {
                                outputJSON = {
                                    'status': 'success',
                                    'messageId': 200,
                                    'message': "updated successfully",
                                    'data': data
                                };
                                res.jsonp(outputJSON);
                            }

                        });
                    } //if login ==2
                } //end of else    
            }
        }
    })
}

/**
 * Update user object(s) (Bulk update)
 * Input: user object(s)
 * Output: Success message
 * This function is used to for bulk updation for user object(s)
 */
 exports.bulkUpdate = function(req, res) {
            var outputJSON = "";
            var inputData = req.body;
            var roleLength = inputData.data.length;
            var bulk = userObj.collection.initializeUnorderedBulkOp();
            for(var i = 0; i< roleLength; i++){
                var userData = inputData.data[i];
                var id = mongoose.Types.ObjectId(userData.id);  
                bulk.find({_id: id}).update({$set: userData});
            }
            bulk.execute(function (data) {
                outputJSON = {'status': 'success', 'messageId':200, 'message':constantObj.messages.userStatusUpdateSuccess};
            });
            res.jsonp(outputJSON);
         }

exports.reset_password = function(req, res) {
    console.log("TTTAAAANIIYAA")
    console.log("new passsssss", req.body.password.newpassword)
    if (req.body._id != null) {
        if (req.body.type == 1) {
            console.log("insode 1");
            userObj.update({
                _id: req.body._id
            }, {
                $set: {
                    "password": req.body.password.newpassword
                }
            }, function(err, updatedresponse) {
                if (err) {
                    outputJSON = {
                        'status': 'error',
                        'messageId': 400,
                        'message': "Password not updated, Try again later"
                    };
                    res.jsonp(outputJSON)
                } else {
                    console.log("updated responseeeeee", updatedresponse)
                    if (updatedresponse) {
                        outputJSON = {
                            'status': 'success',
                            'messageId': 200,
                            'message': "password updated successfully",
                            "data": updatedresponse
                        };
                        res.jsonp(outputJSON)
                    } else {
                        outputJSON = {
                            'status': 'failure',
                            'messageId': 400,
                            'message': "password not updated,try again later"
                        };
                        res.jsonp(outputJSON)
                    }

                }
            })

        } else if (req.body.type == 2) {
            console.log("insode 2");
            Vendor.update({
                    _id: req.body._id
                }, {
                    $set: {
                        "password": req.body.password.newpassword
                    }
                }, function(err, updatedresponse) {
                    if (err) {
                        outputJSON = {
                            'status': 'error',
                            'messageId': 400,
                            'message': "Password not updated, Try again later"
                        };
                        res.jsonp(outputJSON)
                    } else {
                        console.log(updatedresponse)
                        console.log("updatedresponse")
                        if (updatedresponse.nModified == 1) {
                            outputJSON = {
                                'status': 'success',
                                'messageId': 200,
                                'message': "password updated successfully",
                                "data": updatedresponse
                            };
                            res.jsonp(outputJSON)
                        } else {
                            outputJSON = {
                                'status': 'failure',
                                'messageId': 400,
                                'message': "password not updated"
                            };
                            res.jsonp(outputJSON)
                        }
                    }
                })
            }
    }
     else {
        outputJSON = {
            'status': 'failure',
            'messageId': 400,
            'message': "please enter a reset password type",

        };
        res.jsonp(outputJSON)
    }


/*} else {
    outputJSON = {
        'status': 'failure',
        'messageId': 400,
        'message': "session expired"
    };
    res.jsonp(outputJSON)
}*/
}

exports.forgetpassword = function(req, res) {
    if (req.body.phone_no) {
        userObj.findOne({
            phone_no: req.body.phone_no
        }, function(err, data) {
            if (err) {
                outputJSON = {
                    'status': 'failure',
                    'messageId': 401,
                    'message': "Error Occured"
                };
                res.jsonp(outputJSON);
            } else {
                if (data == null) {
                    outputJSON = {
                        'status': 'failure',
                        'messageId': 401,
                        'message': "Please enter a vali phone no"
                    };
                    res.jsonp(outputJSON)
                } else {
                    var url = "http://" + req.headers.host + "/#" + "/resetpassword/" + data._id;
                    console.log("url", url)
                    client.messages.create({
                        body: 'Click on link to reset password ' + url,
                        to: req.body.phone_no, // Text this number
                        from: '(480) 526-9615' // From a valid Twilio number
                    }, function(err, response) {
                        if (err) {
                            outputJSON = {
                                'status': 'failure',
                                'messageId': 401,
                                'message': "error"
                            };
                            res.jsonp(outputJSON)
                        } else {
                            outputJSON = {
                                'status': 'success',
                                'messageId': 200,
                                'message': "Reset password link has been send to your phone. Kindly reset."
                            };
                            res.jsonp(outputJSON)
                        }
                    })
                }
            }
        })
    }
    if (req.body.email) {
        console.log("reb.bosy", req.body)
        var type = req.body.resetpassword_type;
        if (type == 1) {
            console.log("inside user")
            userObj.findOne({
                email: req.body.email
            }, function(err, data) {
                if (err) {
                    outputJSON = {
                        'status': 'failure',
                        'messageId': 401,
                        'message': "Error Occured"
                    };
                    res.jsonp(outputJSON);
                } else {
                    if (data == null) {
                        outputJSON = {
                            'status': 'failure',
                            'messageId': 401,
                            'message': "Please enter a valid Email ID"
                        };
                        res.jsonp(outputJSON)
                    } else {
                        console.log("req.headers", req.headers.host)

                        var mailDetail = "smtps://osgroup.sdei@gmail.com:mohali2378@smtp.gmail.com";
                        var resetUrl = "http://" + req.headers.host + "/#" + "/resetpassword/" + data._id + "/resetpassword_type/" + type;
                        var transporter = nodemailer.createTransport(mailDetail);

                        var mailOptions = {
                            from: "abc",
                            to: req.body.email,
                            subject: 'Reset password',
                            html: 'Welcome to Bridgit!Your request for reset password is  being proccessed .Please Follow the link to reset your password for customer   \n  ' + resetUrl
                        };
                        transporter.sendMail(mailOptions, function(error, response) {
                            if (error) {
                                console.log("err", error)
                                outputJSON = {
                                    'status': 'failure',
                                    'messageId': 401,
                                    'message': "error"
                                };
                                res.jsonp(outputJSON)
                            } else {
                                var response = {
                                    "status": 'success',
                                    "messageId": 200,
                                    "message": "Reset password link has been send to your Mail. Kindly reset.",
                                    "Sent on": Date(),
                                    "From": "Taniya Singh"
                                }
                                res.jsonp(response)
                            }
                        })
                    }
                }
            })

        } else if (type == 2) {
            console.log("inside vendor")
            var vendor_email = req.body.email
            console.log("vendor email", vendor_email)

            Vendor.findOne({
                vendor_email: vendor_email
            }, function(err, data) {
                if (err) {
                    outputJSON = {
                        'status': 'failure',
                        'messageId': 401,
                        'message': "Error Occured"
                    };
                    res.jsonp(outputJSON);
                } else {
                    if (data == null) {
                        outputJSON = {
                            'status': 'failure',
                            'messageId': 401,
                            'message': "Please enter a valid Email ID"
                        };
                        res.jsonp(outputJSON)
                    } else {
                        console.log("req.headers", req.headers.host)

                        var mailDetail = "smtps://osgroup.sdei@gmail.com:mohali2378@smtp.gmail.com";
                        var resetUrl = "http://" + req.headers.host + "/#" + "/resetpassword/" + data._id + "/resetpassword_type/" + type;
                        var transporter = nodemailer.createTransport(mailDetail);

                        var mailOptions = {
                            from: "abc",
                            to: vendor_email,
                            subject: 'Reset password',
                            html: 'Welcome to Bridgit!Your request for reset password is being proccessed .Please Follow the link to reset your password for vendor   \n  ' + resetUrl
                        };
                        console.log("mail options", mailOptions)
                        transporter.sendMail(mailOptions, function(error, response) {
                            if (error) {
                                console.log("err", error)
                                outputJSON = {
                                    'status': 'failure',
                                    'messageId': 401,
                                    'message': "error"
                                };
                                res.jsonp(outputJSON)
                            } else {
                                console.log("url", resetUrl)
                                var response = {
                                    "status": 'success',
                                    "messageId": 200,
                                    "message": "Reset password link has been send to your Mail. Kindly reset.",
                                    "Sent on": Date(),
                                    "From": "Taniya Singh"
                                }
                                res.jsonp(response)
                            }
                        })
                    }
                }
            })

        }

    }
}
exports.deleteUser = function(req,res){


        



console.log("asdasdas",req.body._id)
    if(req.body._id){
        userObj.update({
                _id: req.body._id
            }, {
                $set: {
                    is_deleted:true
                }
            }, function(err, updRes) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("device id updated", updRes);
                    outputJSON = {
                    'status': 'failure',
                    'messageId': 203,
                    'data': updRes,
                    'message': "Customer has been deleted successfully"
                     };
                res.jsonp(outputJSON);


                }

            })
    }
    
}




    exports.totalUser = function(req, res) {

    var outputJSON = "";
    userObj.count({
        is_deleted: false
    }, function(err, data) {
        if (err) {
            outputJSON = {
                'status': 'failure',
                'messageId': 203,
                'message': constantObj.messages.errorRetreivingData
            };
        } else {
            outputJSON = {
                'status': 'success',
                'messageId': 200,
                'message': constantObj.messages.successRetreivingData,
                'data': data
            }
        }
        res.jsonp(outputJSON);
    });
}
exports.customer_orderlist = function(req, res) {
    var date = [];
    order.find({
        customer_id: req.body._id
    }, function(err, orders) {
        if (err) {
            outputJSON = {
                'status': 'failure',
                'messageId': 400,
                'message': "err"

            }
            res.jsonp(outputJSON);
        } else {
            if (orders.length > 0) {
                order.aggregate([{
                    $match: {
                        customer_id: mongoose.Types.ObjectId(req.body._id)
                    }
                }, {
                    $lookup: {
                        from: "items",
                        localField: "item_id",
                        foreignField: "_id",
                        as: "item"
                    }
                }, {
                    $lookup: {
                        from: "vendor_details",
                        localField: "vendor_id",
                        foreignField: "_id",
                        as: "vendordetails"
                    }
                }, {
                    $unwind: "$item"
                }, {
                    $unwind: "$vendordetails"
                }], function(err, orderlist) {
                    if (err) {
                        outputJSON = {
                            'status': 'failure',
                            'messageId': 400,
                            'message': "err"

                        }
                        res.jsonp(outputJSON);
                    } else {
                        if (orderlist.length > 0) {

                            for (var i = 0; i < orderlist.length; i++) {
                                var d = orderlist[i].created_date;
                                var dd = d.getDate();
                                var mm = d.getMonth() + 1;
                                var yy = d.getFullYear();
                                var hh = d.getHours();
                                var min = d.getMinutes();
                                var ss = d.getSeconds();
                                var ampm = hh >= 12 ? 'pm' : 'am';
                                hh = hh % 12;
                                hh = hh ? hh : 12; // the hour '0' should be '12'
                                min = min < 10 ? '0' + min : min;
                                var strTime = hh + ':' + min + ' ' + ampm;

                                orderlist[i].created_date = dd + "/" + mm + "/" + yy + ", " + strTime;
                                console.log("new date is", orderlist[i].created_date)
                            }
                            //console.log("date array is",date)                
                            outputJSON = {
                                'status': 'success',
                                'messageId': 200,
                                'message': "Order list retreived successsfully",
                                'data': orderlist
                            }
                            res.jsonp(outputJSON);

                        } else {
                            outputJSON = {
                                'status': 'failure',
                                'messageId': 200,
                                'message': "No information found"

                            }
                            res.jsonp(outputJSON);
                        }
                    }
                })
            } else {
                outputJSON = {
                    'status': 'failure',
                    'messageId': 200,
                    'message': "No order placed yet"

                }
                res.jsonp(outputJSON);
            }
        }
    })
}