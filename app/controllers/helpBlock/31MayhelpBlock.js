var constantObj = require('./../../../constants.js');
var commonjs = require('./../commonFunction/common.js');
var cmsObj = require('./../../models/helpBlock/cms.js');

exports.updateHelpBlock = function (req,res) {
    if(req.body._id && req.body.description && req.body.title && req.body.identifier){
        cmsObj.update({_id:req.body._id},{$set:{'description':req.body.description,'title':req.body.title,'identifier':req.body.identifier}},function(err,data){
            if(err){
                console.log(err);
                 outputJSON = {
                'status': 'failure',
                'messageId': 203,
                'message': constantObj.messages.errorRetreivingData
                };
                res.status(401).jsonp(outputJSON)
            }else{
                res.status(200).jsonp({
                'status': 'success',
                'messageId': 200,
                'message': 'Information is successfully saved'
            });
            }
        })
    }
    else{
        res.status(401).jsonp({"message":"Please pass the required fields."})
    }
}
exports.getHelpBlockListing = function(req,res){
    cmsObj.find({isDisabled:false},{title:1,identifier:1},function(err,data){
        if(err){
            onsole.log(err);
                 outputJSON = {
                'status': 'failure',
                'messageId': 203,
                'message': constantObj.messages.errorRetreivingData
                };
                res.status(401).jsonp(outputJSON)
        }else{
             res.status(200).jsonp({
                'status': 'success',
                'messageId': 200,
                'data': data
            });
        }
    })
}

exports.getHelpInformation = function(req,res){
    cmsObj.find({_id:req.body._id},{title:1,identifier:1,description:1},function(err,data){
        if(err){
            onsole.log(err);
                 outputJSON = {
                'status': 'failure',
                'messageId': 203,
                'message': constantObj.messages.errorRetreivingData
                };
                res.status(401).jsonp(outputJSON)
        }else{
             res.status(200).jsonp({
                'status': 'success',
                'messageId': 200,
                'data': data
            });
        }
    })
}

exports.insertHelpInformation = function(req,res){
        req.body.addedBy = req.session._id;
        cmsObj(req.body).save(req.body,function(err,data){
            if(err){
                console.log(err);
                 outputJSON = {
                'status': 'failure',
                'messageId': 203,
                'message': constantObj.messages.errorRetreivingData
                };
                 res.status(401).jsonp(outputJSON);
            }else{
                res.status(200).jsonp({
                'status': 'success',
                'messageId': 200,
                'message': 'Information is successfully saved'
            });
            }
        })
}

exports.deleteHelp = function (req,res) {
        cmsObj.update({_id:req.body._id},{$set:{'isDisabled':true}},function(err,data){
            if(err){
                console.log(err);
                 outputJSON = {
                'status': 'failure',
                'messageId': 203,
                'message': constantObj.messages.errorRetreivingData
                };
                res.status(200).jsonp(outputJSON);
            }else{
                res.status(200).jsonp({
                'status': 'success',
                'messageId': 200,
                'message': 'Information is successfully saved'
            });
            }
        })
}

exports.aboutUs = function(req,res){
    cmsObj.find({_id:"58a6b922abf8823e6c24f24e"},function(err,data){
         if(err){
                console.log(err);
                 outputJSON = {
                'status': 'failure',
                'messageId': 203,
                'message': constantObj.messages.errorRetreivingData
                };
                res.status(200).jsonp(outputJSON);
            }else{
                res.status(200).jsonp({
                'status': 'success',
                'messageId': 200,
                'message': 'Information is successfully retrieve',
                'data':data
            });
        }
    })
}

exports.termsCondition = function(req,res){
    cmsObj.find({_id:"592d722095f0061811b15e36"},function(err,data){
         if(err){
                console.log(err);
                 outputJSON = {
                'status': 'failure',
                'messageId': 203,
                'message': constantObj.messages.errorRetreivingData
                };
                res.status(200).jsonp(outputJSON);
            }else{
                res.status(200).jsonp({
                'status': 'success',
                'messageId': 200,
                'message': 'Information is successfully retrieve',
                'data':data
            });
        }
    })
}