var likeDislikeObj = require('./../../models/likeAndDislike/likeAndDislike.js');
var matchListObj = require('./../../models/matchList/matchList.js');
var userObj = require('./../../models/users/users.js');
var blockUserObj = require('./../../models/blockUser/blockUser.js');
var constantObj = require('./../../../constants.js');
var waterfall = require('async-waterfall');
var settingObj = require('./../../models/setting/setting.js');
var emailTemplate = require('./../../models/helpBlock/cms.js');
var moment = require('moment');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var pushNotify = require('./../../../common/common.js');
var in_array = require('in_array');


exports.leftRightSwipe = function(req, res) {
    console.log(req.body);
    req.headers.lat="-33.86339";
    req.headers.lng="151.211";
    if (req.body.to && req.body.from && req.body.reaction && req.headers.lat && req.headers.lng) {
        var saveData = req.body;
        likeDislikeObj.findOne({
            "to": req.body.from,
            "from": req.body.to
        }, function(err, result) {
            if (err) {
                var outputJSON = {
                    "status": 'faliure',
                    "messageId": 401,
                    "message": req.headers.lang=="ch" ? chConstantObj.messages.wrongInp : constantObj.messages.wrongInp

                }
                res.status(200).jsonp(outputJSON)
            } else {
                console.log("result", result);
                if (result == null) {
                    console.log("when result == null");
                    likeDislikeObj(saveData).save(saveData, function(err, data) {
                        if (err) {
                            var messages = '';
                            var errMessage = '';
                            var status = '';
                            for (var errName in err.errors) {
                                errMessage += err.errors[errName].message + "\n";
                            }
                            messages += errMessage;
                            var outputJSON = {
                                "status": 'faliure',
                                "messageId": 401,
                                "message": req.headers.lang=="ch" ? chConstantObj.messages.dataNotSaved : constantObj.messages.dataNotSaved
,
                                "err": messages
                            }
                            res.status(200).jsonp(outputJSON)
                        } else {
                            var outputJSON = {
                                "status": 'success',
                                "messageId": 200,
                                "message": "Data saved",
                                "data": data
                            }
                            res.status(200).jsonp(outputJSON)
                        }
                    })
                } else {
                    console.log("when result != null");
                    if ((result.reaction == "like") && (req.body.reaction == "like")) {
                        console.log("when both the reactions are like");
                        /*if reaction are same as example like==like then they are matched and they are matched users*/

                        likeDislikeObj(saveData).save(saveData, function(err, data) {
                            if (err) {
                                var messages = '';
                                var errMessage = '';
                                var status = '';
                                for (var errName in err.errors) {
                                    errMessage += err.errors[errName].message + "\n";
                                }
                                messages += errMessage;
                                var outputJSON = {
                                    "status": 'faliure',
                                    "messageId": 401,
                                    "message": req.headers.lang=="ch" ? chConstantObj.messages.dataNotSaved : constantObj.messages.dataNotSaved
,
                                    "err": messages
                                }
                                res.status(200).jsonp(outputJSON)
                            } else {
                                createFiendList(req, res);
                            }
                        })
                    } else {
                        console.log("when both rection are opposite");
                        likeDislikeObj(saveData).save(saveData, function(err, saveInfo) {
                            if (err) {
                                var messages = '';
                                var errMessage = '';
                                var status = '';
                                for (var errName in err.errors) {
                                    errMessage += err.errors[errName].message + "\n";
                                }
                                messages += errMessage;
                                var outputJSON = {
                                    "status": 'faliure',
                                    "messageId": 401,
                                    "message": req.headers.lang=="ch" ? chConstantObj.messages.dataNotSaved : constantObj.messages.dataNotSaved
,
                                    "err": messages
                                }
                                res.status(200).jsonp(outputJSON)
                            } else {
                                var outputJSON = {
                                    "status": 'success',
                                    "messageId": 200,
                                    "message": "Data saved successfully.",
                                    "data": saveInfo
                                }
                                res.status(200).jsonp(outputJSON);
                            }
                        })
                    }
                }
            }
        })
    } else {
        res.status(200).jsonp({
            "status": 'faliure',
            "messageId": 401,
            "message": req.headers.lang=="ch" ? chConstantObj.messages.requiredField : constantObj.messages.requiredField

        })
    }
}

var createFiendList = function(req, res) {
    var bodyToPush = req.body;
    var headersToPush = req.headers;
    pushNotify.pushRequest(bodyToPush,headersToPush, function(pushErr, pushResult) {
        if (pushErr) {
            console.log("error in createFiendList", pushErr);
        } else {
            console.log("something may happen", pushResult);
            var outputJSON = {
                "status": 'success',
                "messageId": 200,
                "message": "Data saved successfully.",
                "data": pushResult
            }
            console.log(outputJSON);
            res.status(200).jsonp(outputJSON)
        }
    })

    console.log("req.body in createFiendList ", req.body);
    console.log("succes in createFiendList", result);
    var details = {};
    var secondFriend = {};
    details = req.body;
    details.reaction = "friend";
    details.friends = req.body.to
    details.user = req.body.from
    console.log("details in create friend list", details);
    secondFriend.reaction = "friend";
    secondFriend.friends = req.body.from;
    secondFriend.user = req.body.to;
    console.log("secondFriend in create friend list", secondFriend);
    matchListObj(details).save(details, function(err, data) {
        if (err) {
            var outputJSON = {
                "status": 'faliure',
                "messageId": 401,
                "message": req.headers.lang=="ch" ? chConstantObj.messages.dataNotFound : constantObj.messages.dataNotFound,
                "err": err
            }
            console.log(outputJSON);
            res.status(401).jsonp(outputJSON)
        } else {
            matchListObj(secondFriend).save(details, function(err, data) {
                if (err) {
                    var outputJSON = {
                        "status": 'faliure',
                        "messageId": 401,
                        "message": req.headers.lang=="ch" ? chConstantObj.messages.dataNotFound : constantObj.messages.dataNotFound,
                        "err": err
                    }
                    console.log(outputJSON);
                    // res.status(401).jsonp(outputJSON)
                } else {
                    // pushNotify.pushRequest(req, res, function(pushErr, pushResult) {
                    //     if (err) {
                    //         console.log("error in createFiendList", pushErr);
                    //     } else {
                    //         console.log("something may happen", pushResult);
                    //         var outputJSON = {
                    //             "status": 'success',
                    //             "messageId": 200,
                    //             "message": "Data saved successfully.",
                    //             "data": data
                    //         }
                    //         console.log(outputJSON);
                    //         res.status(200).jsonp(outputJSON)
                    //     }
                    // })
                }
            })
        }
    })
}


exports.findFriends = function(req, res) {
    //console.log(req.body);
    req.headers.lat="-33.86339";
    req.headers.lng="151.211";
    var findObject = {};
    // var searchid = "5899b921d2303b1cb54f0ca0"
    if (req.headers.lat && req.headers.lng && req.body._id) {
        settingObj.findOne({
            user_id: req.body._id
        }).exec(function(settingErr, settingData) {
            if (settingErr) {
                console.log("err in finding setting", settingErr);
            } else {
                //console.log("settingData", settingData);
                var miles = 10;
                if (settingData) {
                    if (settingData.male == true) {
                        findObject.gender = settingData.male;
                    }

                    if (settingData.female == true) {
                        findObject.gender = settingData.male;
                    }

                    if (settingData.male == true && settingData.female == true) {
                        delete findObject.gender;
                    }

                    if (settingData._public == true || settingData._public == false) {
                        findObject._public = settingData._public;
                    }
                    if (settingData.distance) {
                        miles = settingData.distance
                    }
                    // if (settingData.education_level.length>0) {
                    //     findObject.education_level = {$in:settingData.education_level};
                    // }
                    // if (settingData.college_name) {
                    //     findObject.college_name = settingData.college_name
                    // }
                    if (settingData.min_age) {
                        var startdate = moment();
                        var maxAgeDate = moment().subtract(settingData.min_age, "years").format("YYYY-MM-DD");
                        var minAgeDate = moment().subtract(settingData.max_age, "years").format("YYYY-MM-DD");
                        console.log("minAgeDate", minAgeDate);
                        console.log("maxAgeDate", maxAgeDate);

                        //console.log(new Date(minAgeDate));

                        // return false;

                        findObject.dob = {
                            $gte: new Date(minAgeDate),
                            $lte: new Date(maxAgeDate)
                        };
                    }
                }
                console.log("findObject", findObject);
                 var query = {};

                    query.$or = [{
                         from:req.body._id
            
                    }, {
                        to: req.body._id
                    }]
              // console.log(query)

                likeDislikeObj.find(query).exec(function(err, data) {
                    if (err) {
                        var outputJSON = {
                            "status": 'faliure',
                            "messageId": 401,
                            "message": "Error !Please try again later.",
                            "err": err
                        }
                        res.status(200).jsonp(outputJSON)
                    } else {
                       // console.log("find _id ");
                       // console.log("data", data);
                        if (data.length != 0) {
                           // console.log("data", data);
                            var arrayForFilterSearchResults = [];
                            var toUsers=[];

                            for (var i = 0; i < data.length; i++) {
                                if(data[i].from==req.body._id){

                                    arrayForFilterSearchResults.push(data[i].to);
                                
                                }else{
                                    
                                    toUsers.push(data[i].from);


                                }
                                
                            }
                            toUsers.map(String);
                            arrayForFilterSearchResults.map(String);
                           // console.log("arrayForFilterSearchResults", arrayForFilterSearchResults);
                           console.log("toUsers", toUsers);

                            findObject._id = {
                                "$nin": arrayForFilterSearchResults
                            };
                            // findObject.latLong = {
                            //     $geoWithin: {
                            //         $centerSphere: [
                            //             [req.headers.lng, req.headers.lat], miles / 3963.2
                            //         ]
                            //     }
                            // }

                            // console.log(findObject);

                           // console.log(JSON.stringify(findObject));

                            //console.log(req.body.lng, req.body.lat);



                            userObj.find(findObject, function(err, data) {
                                if (err) {
                                    var outputJSON = {
                                        "status": 'faliure',
                                        "messageId": 401,
                                        "message": "Data not found.",
                                        "err": err
                                    }
                                    res.status(200).jsonp(outputJSON)
                                } else {
                                   // console.log("data before shuffle", data);
                                    var arr = [];
                                    for (var i = 0; i < data.length; i++) {
                                         console.log("before",data[i]._id)
                                     if (req.body._id != data[i]._id) {
                                        console.log("after",data[i]._id)
                                         data[i].isLike=in_array(String(data[i]._id),toUsers,false);
                                        arr.push(data[i]);
                                     }
       
                                    }

                                    //console.log("after shuffle", arr);
                                    var outputJSON = {
                                        "status": 'success',
                                        "messageId": 200,
                                        "message": "Data retrieve successfully.",
                                        "data": arr
                                    }
                                    res.status(200).jsonp(outputJSON);
                                }
                            })
                        } else {
                            console.log("else part shows data");
                            findObject.latLong = {
                                $geoWithin: {
                                    $centerSphere: [
                                        [req.headers.lng, req.headers.lat], miles / 3963.2
                                    ]
                                }
                            }

                            console.log("findObject", JSON.stringify(findObject));

                            userObj.find(findObject).exec(function(err, data) {
                                if (err) {
                                    var outputJSON = {
                                        "status": 'faliure',
                                        "messageId": 401,
                                        "message": "Data not found.",
                                        "err": err
                                    }
                                    res.status(200).jsonp(outputJSON)
                                } else {
                                    console.log("data before shuffle", data);
                                    var arr = [];
                                    for (var i = 0; i < data.length; i++) {
                                        if (req.body._id != data[i]._id) {
                                            arr.push(data[i]);
                                        }
                                    }
                                    // var arr = data;
                                    // arr = shuffle(arr);
                                    console.log("after shuffle", arr);

                                    var outputJSON = {
                                        "status": 'success',
                                        "messageId": 200,
                                        "message": "Data retrieve successfully.",
                                        "data": arr
                                    }
                                    res.status(200).jsonp(outputJSON);
                                }
                            })
                        }
                    }
                })
            }
        })
    } else {
        res.status(200).jsonp({
            "status": 'faliure',
            "messageId": 401,
            "message": "please pass the required fields"
        })
    }
}

// exports.findFriends = function(req, res) {
//    // console.log("header",req.headers.lat,"Long",req.headers.lat);
//     var findObject = {};
//     // var searchid = "5899b921d2303b1cb54f0ca0"
//     req.headers.lat="-33.86339";
//     req.headers.lng="151.211";
//     if (req.headers.lat && req.headers.lng) {
//         // settingObj.findOne({
//         //     user_id: req.body._id
//         // })
//         settingObj.findOne().exec(function(settingErr, settingData) {
//             if (settingErr) {
//                 console.log("err in finding setting", settingErr);
//             } else {
//                 console.log("settingData", settingData);
//                 var miles = 10;
//                 if (settingData) {
//                     if (settingData.male == true) {
//                         findObject.gender = settingData.male;
//                     }

//                     if (settingData.female == true) {
//                         findObject.gender = settingData.male;
//                     }

//                     if (settingData.male == true && settingData.female == true) {
//                         delete findObject.gender;
//                     }

//                     if (settingData._public == true || settingData._public == false) {
//                         findObject._public = settingData._public;
//                     }
//                     if (settingData.distance) {
//                         miles = settingData.distance
//                     }
//                     // if (settingData.education_level.length>0) {
//                     //     findObject.education_level = {$in:settingData.education_level};
//                     // }
//                     // if (settingData.college_name) {
//                     //     findObject.college_name = settingData.college_name
//                     // }
//                     if (settingData.min_age) {
//                         var startdate = moment();
//                         var maxAgeDate = moment().subtract(settingData.min_age, "years").format("YYYY-MM-DD");
//                         var minAgeDate = moment().subtract(settingData.max_age, "years").format("YYYY-MM-DD");
//                         console.log("minAgeDate", minAgeDate);
//                         console.log("maxAgeDate", maxAgeDate);

//                         console.log(new Date(minAgeDate));

//                         // return false;

//                         findObject.dob = {
//                             $gte: new Date(minAgeDate),
//                             $lte: new Date(maxAgeDate)
//                         };
//                     }
//                 }
//                 console.log("findObject", findObject);

//                 likeDislikeObj.find().exec(function(err, data) {
//                     if (err) {
//                         var outputJSON = {
//                             "status": 'faliure',
//                             "messageId": 401,
//                             "message": req.headers.lang=="ch" ? chConstantObj.messages.errorTryAgain : constantObj.messages.errorTryAgain
// ,
//                             "err": err
//                         }
//                         res.status(200).jsonp(outputJSON)
//                     } else {
//                         console.log("find _id ");
//                         console.log("data", data);
//                         if (data.length != 0) {
//                             console.log("data", data);
//                             var arrayForFilterSearchResults = [];
//                             for (var i = 0; i < data.length; i++) {
//                                 arrayForFilterSearchResults.push(data[i].to);
//                             }
//                             arrayForFilterSearchResults.map(String);
//                             console.log("arrayForFilterSearchResults", arrayForFilterSearchResults);

//                             findObject._id = {
//                                 "$nin": arrayForFilterSearchResults
//                             };
//                             findObject.latLong = {
//                                 $geoWithin: {
//                                     $centerSphere: [
//                                         [req.headers.lng, req.headers.lat], miles / 3963.2
//                                     ]
//                                 }
//                             }

//                             // console.log(findObject);

//                             console.log(JSON.stringify(findObject));

//                             console.log(req.headers.lng, req.headers.lat);
//                             userObj.find({}, function(err, data) {
//                                 if (err) {
//                                     var outputJSON = {
//                                         "status": 'faliure',
//                                         "messageId": 401,
//                                         "message": req.headers.lang=="ch" ? chConstantObj.messages.dataNotFound : constantObj.messages.dataNotFound
// ,
//                                         "err": err
//                                     }
//                                     res.status(200).jsonp(outputJSON)
//                                 } else {
//                                     console.log("data before shuffle", data);
//                                     var arr = [];
//                                     for (var i = 0; i < data.length; i++) {
//                                         if (req.body._id != data[i]._id) {
//                                             arr.push(data[i]);
//                                         }
//                                     }
//                                     console.log("after shuffle", arr);
//                                     var outputJSON = {
//                                         "status": 'success',
//                                         "messageId": 200,
//                                         "message": "Data retrieve successfully.",
//                                         "data": arr
//                                     }
//                                     res.status(200).jsonp(outputJSON);
//                                 }
//                             })
//                         } else {
//                             console.log("else part shows data");
//                             findObject.latLong = {
//                                 $geoWithin: {
//                                     $centerSphere: [
//                                         [req.headers.lng, req.headers.lat], miles / 3963.2
//                                     ]
//                                 }
//                             }

//                             console.log("findObject", JSON.stringify(findObject));

//                             userObj.find(findObject).exec(function(err, data) {
//                                 if (err) {
//                                     var outputJSON = {
//                                         "status": 'faliure',
//                                         "messageId": 401,
//                                         "message": req.headers.lang=="ch" ? chConstantObj.messages.dataNotFound : constantObj.messages.dataNotFound
// ,
//                                         "err": err
//                                     }
//                                     res.status(200).jsonp(outputJSON)
//                                 } else {
//                                     console.log("data before shuffle", data);
//                                     var arr = [];
//                                     for (var i = 0; i < data.length; i++) {
//                                         if (req.body._id != data[i]._id) {
//                                             arr.push(data[i]);
//                                         }
//                                     }
//                                     // var arr = data;
//                                     // arr = shuffle(arr);
//                                     console.log("after shuffle", arr);

//                                     var outputJSON = {
//                                         "status": 'success',
//                                         "messageId": 200,
//                                         "message": "Data retrieve successfully.",
//                                         "data": arr
//                                     }
//                                     res.status(200).jsonp(outputJSON);
//                                 }
//                             })
//                         }
//                     }
//                 })
//             }
//         })
//     } else {
//         res.status(200).jsonp({
//             "status": 'faliure',
//             "messageId": 401,
//             "message":req.headers.lang=="ch" ? chConstantObj.messages.requiredField : constantObj.messages.requiredField

//         })
//     }
// }

// function shuffle(array) {
//     var currentIndex = array.length,
//         temporaryValue, randomIndex;
//     console.log("temporaryValue, randomIndex", temporaryValue, randomIndex);

//     // While there remain elements to shuffle...
//     while (0 !== currentIndex) {

//         // Pick a remaining element...
//         randomIndex = Math.floor(Math.random() * currentIndex);
//         currentIndex -= 1;

//         // And swap it with the current element.
//         temporaryValue = array[currentIndex];
//         array[currentIndex] = array[randomIndex];
//         array[randomIndex] = temporaryValue;
//     }

//     return array;
// }


exports.matchListing = function(req, res) {
//    console.log("dasdas",req.body._id)
    if (req.body._id) {
        matchListObj.find({
            user: req.body._id
        }).populate('friends').exec(function(err, data) {
            if (err) {
                var outputJSON = {
                    "status": 'faliure',
                    "messageId": 401,
                    "message": req.headers.lang=="ch" ? chConstantObj.messages.dataNotFound : constantObj.messages.dataNotFound,
                    "err": err
                }
                res.status(200).jsonp(outputJSON)
            } else {
                console.log("daada",data);
                if (data.length > 0) {
                    var today = new Date();
                    console.log("new date is ", today);
                    var newDate = new Date(today.getTime() - (2 * 24 * 60 * 60 * 1000));
                    console.log("today,ago", today, newDate);
                    var dateTo = new Date(); // current date
                    var dateFrom = newDate // minus 2 days from date
                    dateFrom = convertDate(dateFrom);
                    dateTo = convertDate(dateTo);
                    var newMatch = [];
                    var oldMatch = [];
                    for (var i = 0; i < data.length; i++) {
                        console.log(data[i].created)
                        var dateCheck = data[i].created;
                        console.log("dateCheck", dateCheck);
                        dateCheck = convertDate(dateCheck);

                        var d1 = dateFrom.split("/");
                        var d2 = dateTo.split("/");
                        var c = dateCheck.split("/");

                        var from = new Date(d1[2], parseInt(d1[1]) - 1, d1[0]); // -1 because months are from 0 to 11
                        var to = new Date(d2[2], parseInt(d2[1]) - 1, d2[0]);
                        var check = new Date(c[2], parseInt(c[1]) - 1, c[0]);

                        console.log("from,to,check        ", from, to, check)

                        var fDate, lDate, cDate;
                        fDate = Date.parse(from);
                        lDate = Date.parse(to);
                        cDate = Date.parse(check);

                        if ((cDate <= lDate && cDate >= fDate)) {
                            console.log("helo");
                            newMatch.push(data[i].friends)
                        } else {
                            oldMatch.push(data[i].friends);
                        }
                    }
                    var outputJSON = {
                        "status": 'success',
                        "messageId": 200,
                        "message": "Data retrieve successfully.",
                        "newMatch": newMatch,
                        "oldMatch": oldMatch
                    }
                    res.status(200).jsonp(outputJSON);
                } else {
                    var outputJSON = {
                        "status": 'success',
                        "messageId": 200,
                        "message": "Data retrieve successfully.",
                        "newMatch": [],
                        "oldMatch": []
                    }
                    res.status(200).jsonp(outputJSON);
                }
            }
        })
    } else {
        res.status(200).jsonp({
            "status": 'faliure',
            "messageId": 401,
            "message": req.headers.lang=="ch" ? chConstantObj.messages.requiredField : constantObj.messages.requiredField
        })
    }
}

function convertDate(inputFormat) {
    function pad(s) {
        return (s < 10) ? '0' + s : s;
    }
    var d = new Date(inputFormat);
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
}

exports.deleteUser = function(req, res) {
    console.log("inside deleteUser");
    if (req.body.from && req.body.to && req.body.flag) {
        if (req.body.flag == "unFriend") {
            console.log("inside unFriend ");
            waterfall([
                function(callback) {
                    matchListObj.remove({
                        "user": req.body.from,
                        "friends": req.body.to
                    }, function(err, data) {
                        if (err) {
                            console.log("err in remove matchlist", err);
                        } else {
                            console.log("successfully remove matchListing", data)
                        }
                    })
                    callback(null, 'one');
                },
                function(arg1, callback) {
                    likeDislikeObj.update({
                        "from": req.body.from,
                        "to": req.body.to
                    }, {
                        $set: {
                            "reaction": "unlike"
                        }
                    }, function(err, data) {
                        if (err) {
                            var outputJSON = {
                                "status": 'faliure',
                                "messageId": 401,
                                "message": "User not deleted.Please try again later.",
                                "err": err
                            }
                            res.status(200).jsonp(outputJSON)
                        } else {
                            console.log("data", data);
                            var outputJSON = {
                                "status": 'success',
                                "messageId": 200,
                                "message": "User successfully deleted.",
                                "data": data
                            }
                            res.status(200).jsonp(outputJSON)
                        }
                    })
                    callback(null, 'done');
                }
            ], function(err, result) {
                // result now equals 'done' 
            });
        } else if (req.body.flag == "block") {
            console.log("inside block ");
            waterfall([
                function(callback) {
                    matchListObj.remove({
                        "user": req.body.from,
                        "friends": req.body.to
                    }, function(err, data) {
                        if (err) {
                            console.log("err in remove matchlist", err);
                        } else {
                            console.log("successfully remove matchListing", data)
                        }
                    })
                    callback(null, 'one');
                },
                function(arg1, callback) {
                    likeDislikeObj.update({
                        "from": req.body.from,
                        "to": req.body.to
                    }, {
                        $set: {
                            "reaction": "block"
                        }
                    }, function(err, data) {
                        if (err) {
                            var outputJSON = {
                                "status": 'faliure',
                                "messageId": 401,
                                "message": "User not deleted.Please try again later.",
                                "err": err
                            }
                            res.status(200).jsonp(outputJSON)
                        } else {
                            console.log("User successfully deleted.", data);
                            // var outputJSON = {
                            //     "status": 'success',
                            //     "messageId": 200,
                            //     "message": "User successfully deleted.",
                            //     "data": data
                            // }
                            // res.status(200).jsonp(outputJSON)
                        }
                    })

                    callback(null, 'three');
                },
                function(arg1, callback) {
                    var saveObj = {};
                    saveObj.user = req.body.from;
                    saveObj.blockUser = req.body.to;
                    blockUserObj(saveObj).save(saveObj, function(err, data) {
                        if (err) {
                            var outputJSON = {
                                "status": 'faliure',
                                "messageId": 401,
                                "message": "User not Blocked.Please try again later.",
                                "err": err
                            }
                            res.status(200).jsonp(outputJSON)
                        } else {
                            var outputJSON = {
                                "status": 'success',
                                "messageId": 200,
                                "message": "User successfully deleted.",
                                "data": data
                            }
                            res.status(200).jsonp(outputJSON)
                        }
                    })
                    callback(null, 'done');
                }
            ], function(err, result) {
                // result now equals 'done' 
            });
        } else if (req.body.flag == 'report' && req.body.toUserEmail && req.body.toUserName && req.body.fromUserName && req.body.reasonOfReport) {
            // in case of user do report regarding a particulat user.
            waterfall([
                function(callback) {
                    matchListObj.remove({
                        "user": req.body.from,
                        "friends": req.body.to
                    }, function(err, data) {
                        if (err) {
                            console.log("err in remove matchlist", err);
                        } else {
                            console.log("successfully remove matchListing", data)
                        }
                    })
                    callback(null, 'one');
                },
                function(arg1, callback) {
                    likeDislikeObj.update({
                        "from": req.body.from,
                        "to": req.body.to
                    }, {
                        $set: {
                            "reaction": "report",
                            "reasonOfReport": req.body.reasonOfReport
                        }
                    }, function(err, data) {
                        if (err) {
                            var outputJSON = {
                                "status": 'faliure',
                                "messageId": 401,
                                "message": "User not deleted.Please try again later.",
                                "err": err
                            }
                            res.status(200).jsonp(outputJSON)
                        } else {
                            console.log("data", data);

                            emailTemplate.findOne({
                                identifier: "registerUserMail"
                            }, function(emailError, eamilResult) {
                                if (emailError) {
                                    console.log(err)
                                } else {
                                    console.log("email", eamilResult);
                                    var mailBody = eamilResult.description;
                                    mailBody = mailBody.replace("{{fullName}}", req.body.toUserName);
                                    mailBody = mailBody.replace("{{firstUser}}", req.body.fromUserName);
                                    mailBody = mailBody.replace("{{issue}}", req.body.reasonOfReport);
                                    console.log("mailBOdy", mailBody);

                                    var transporter = nodemailer.createTransport(smtpTransport({
                                        service: 'gmail',
                                        auth: {
                                            user: 'osgroup.sdei@gmail.com',
                                            pass: 'mohali2378'
                                        }
                                    }));
                                    var message = mailBody;
                                    console.log(req.body.toUserEmail);
                                    transporter.sendMail({
                                        from: 'squadApp',
                                        to: req.body.toUserEmail,
                                        subject: 'Welcome to squadApp',
                                        html: message
                                    }, function(err, info) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            console.log(info);
                                        }
                                    });

                                    var outputJSON = {
                                        "status": 'success',
                                        "messageId": 200,
                                        "message": "User successfully register report.",
                                        "data": data
                                    }
                                    res.status(200).jsonp(outputJSON)

                                }

                            })


                        }
                    })
                    callback(null, 'done');
                }
            ], function(err, result) {
                // result now equals 'done' 
            });
        } else if (req.body.flag == "unblock") {
            console.log("inside unblock");
            waterfall([
                function(callback) {
                    blockUserObj.remove({
                        "user": req.body.from,
                        "blockUser": req.body.to
                    }, function(err, data) {
                        if (err) {
                            console.log("err in remove block user", err);
                        } else {
                            console.log("successfully remove block user", data)
                        }
                    })
                    callback(null, 'one');
                },
                function(arg1, callback) {
                    likeDislikeObj.remove({
                        "from": req.body.from,
                        "to": req.body.to
                    }, function(err, data) {
                        if (err) {
                            var outputJSON = {
                                "status": 'faliure',
                                "messageId": 401,
                                "message": "User not unblock.Please try again later.",
                                "err": err
                            }
                            res.status(200).jsonp(outputJSON)
                        } else {
                            console.log("data", data);
                            var outputJSON = {
                                "status": 'success',
                                "messageId": 200,
                                "message": "User unblock ."
                            }
                            res.status(200).jsonp(outputJSON)
                        }
                    })
                    callback(null, 'done');
                }
            ], function(err, result) {
                // result now equals 'done' 
            });
        } else {
            res.status(200).jsonp({
                "status": 'faliure',
                "messageId": 401,
                "message": "please pass the required fields"
            })
        }
    } else {
        res.status(200).jsonp({
            "status": 'faliure',
            "messageId": 401,
            "message": "please pass the required fields"
        })

    }
}

exports.listBlockUser = function(req, res) {
    if (req.body._id) {
        blockUserObj.find({
            "user": req.body._id
        }).populate('blockUser').exec(function(err, data) {
            if (err) {
                var outputJSON = {
                    "status": 'faliure',
                    "messageId": 401,
                    "message": req.headers.lang=="ch" ? chConstantObj.messages.notFound : constantObj.messages.notFound,
                    "err": err
                }
                res.status(200).jsonp(outputJSON)
            } else {
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    arr.push(data[i].blockUser)
                }
                console.log(arr);
                var outputJSON = {
                    "status": 'success',
                    "messageId": 200,
                    "message": "Information successfully retrieve.",
                    "data": arr
                }
                res.status(200).jsonp(outputJSON)
            }
        })
    } else {
        res.status(200).jsonp({
            "status": 'faliure',
            "messageId": 401,
            "message": req.headers.lang=="ch" ? chConstantObj.messages.requiredField : constantObj.messages.requiredField
        })
    }
}
