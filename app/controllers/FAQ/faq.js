var faqObj = require('./../../models/FAQ/faq.js');
var commonjs = require('./../commonFunction/common.js');

exports.insertQuestionAnswer = function (req,res) {
	console.log(req.body);
	var saveData = req.body;
	saveData.addedBy = req.session._id;
	faqObj(saveData).save(saveData,function(err,data){
		if(err){
			 var outputJSON={
                        "status": 'faliure',
                        "messageId": 401,
                        "message": "faq not saved in database",
                        "err":err
                    }
                res.status(401).jsonp(outputJSON)
		}
		else{
			 var outputJSON={                
                        "status": 'success',
                        "messageId": 200,
                        "message": "faq saved successfully.",
                        "data": data
                    }
                res.status(200).jsonp(outputJSON);
		}
	})
}

exports.allfaq = function(req,res){
	faqObj.find({"isDeleted":false},{'isDeleted':0,'created':0})
        .exec(function (err,data) {
        if(err){
              var outputJSON={
                        "status": 'faliure',
                        "messageId": 401,
                        "message": "Error in finding Subadmin",
                        "err":err
                    }
                res.status(401).jsonp(outputJSON)
        }else{
             var outputJSON={                
                        "status": 'success',
                        "messageId": 200,
                        "message": "Data retrieve successfully.",
                        "data": data
                    }
                res.status(200).jsonp(outputJSON);
        }
    })
}

exports.deleteAndQues = function(req,res){

    if(req.body._id && req.body.status){
        if(req.body.status =="delete"){
            faqObj.update({_id:req.body._id},{$set:{isDeleted:true}},function(err,updateInfo){
                if(err){
                     var outputJSON={
                        "status": 'faliure',
                        "messageId": 401,
                        "message": "Error in Deleting",
                        "err":err
                    }
                res.status(401).jsonp(outputJSON)
                }else{
                    var outputJSON={
                        "status": 'success',
                        "messageId": 200,
                        "message": "Successfully deleted."
                    }
                res.status(200).jsonp(outputJSON)
                }
            })
        }
        else if(req.body.status =="deactivate"){
             faqObj.update({_id:req.body._id},{$set:{isDisabled:true}},function(err,updateInfo){
                if(err){
                     var outputJSON={
                        "status": 'faliure',
                        "messageId": 401,
                        "message": "Error in Deactivate.",
                        "err":err
                    }
                res.status(401).jsonp(outputJSON)
                }else{
                    var outputJSON={
                        "status": 'success',
                        "messageId": 200,
                        "message": "Successfully Deactivate."
                    }
                res.status(200).jsonp(outputJSON)
                }
            })
        }
        else if(req.body.status =="activate"){
             faqObj.update({_id:req.body._id},{$set:{isDisabled:false}},function(err,updateInfo){
                if(err){
                     var outputJSON={
                        "status": 'faliure',
                        "messageId": 401,
                        "message": "Error in activate.",
                        "err":err
                    }
                res.status(401).jsonp(outputJSON)
                }else{
                    var outputJSON={
                        "status": 'success',
                        "messageId": 200,
                        "message": "Successfully deleted."
                    }
                res.status(200).jsonp(outputJSON)
                }
            })
        }
        else if(req.body.status == "update"){
            faqObj.update({
                _id: req.body._id
            }, {
                $set: {
                    "answer": req.body.answer,
                    "question": req.body.question
                }
            }, function(err, updateInfo) {
                if (err) {
                    var outputJSON = {
                        "status": 'faliure',
                        "messageId": 401,
                        "message": "Error in activate.",
                        "err": err
                    }
                    res.status(401).jsonp(outputJSON)
                } else {
                    var outputJSON = {
                        "status": 'success',
                        "messageId": 200,
                        "message": "Successfully deleted."
                    }
                    res.status(200).jsonp(outputJSON)
                }
            })
        }
    }
    else{
        res.status(401).jsonp({
            "status": 'faliure',
            "messageId": 401,
            "message": "Please sent required fields."
        })
    }
}