var vendor = require('./../../models/admin/signup_vendor.js');
var itemsObj = require('./../../models/items/items.js');

var mongoose = require('mongoose');
var constantObj = require('./../../../constants.js');
var fs=require('fs');
var emailService = require('./../email/emailService.js');


exports.vendorList = function(req,res){
      var outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};

        vendorDbObj.find({},function(err,data){
                    if(err){
                        res.json("Error: "+err);
                        
                    }
                    else{
                        outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, "data":data }, 
                    res.json(outputJSON);
                    }
                });
    }
/*To view items added by a particular vendor*/

exports.items_added_by_vendor = function(req,res){	
	console.log("aaaaaa",req.body.vendor_id)
      var outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};

        itemsObj.find({vendor_id:req.body.vendor_id},function(err,data){
            console.log("dadtaa",data)
                    if(err){
                    	console.log("err",err)
                        res.json("Error: "+err);
                        
                    }
                    else{
              
                    	if(data.length==0)
                    	{
                    	console.log("inside null",data)
                    	outputJSON = {'status':'success', 'messageId':200, 'message':"You have not added any item" };
                    	res.json(outputJSON);

                    	}
                    	else
                    	{
                    	console.log("data",data)
                        outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, "data":data }, 
                    res.json(outputJSON);	
                    	}
                    	
                    }
                });
    }


    exports.orderlist_vendor = function(req,res){
    
    console.log("aaaaaa",req.body.vendor_id)
      var outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};

        itemsObj.find({vendor_id:req.body._id},function(err,data){
                    if(err){
                        console.log("err",err)
                        res.json("Error: "+err);
                        
                    }
                    else{
              
                        if(data.length==0)
                        {
                        console.log("inside null",data)
                        outputJSON = {'status':'success', 'messageId':200, 'message':"You have not added any item" };
                        res.json(outputJSON);

                        }
                        else
                        {
                        console.log("data",data)
                        outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, "data":data }, 
                    res.json(outputJSON);   
                        }
                        
                    }
                });
    }


