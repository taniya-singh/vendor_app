var vendor = require('./../../models/admin/signup_vendor.js');
var itemsObj = require('./../../models/items/items.js');
var order = require('./../../models/order/order.js');
var mongoose = require('mongoose');
var constantObj = require('./../../../constants.js');
var fs=require('fs');
var emailService = require('./../email/emailService.js');

/**
 * Input:  -
 * Output: Role json object containing all vendors
 * This function lists all regsitered vendors
 * Developed by :
 */

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
    
    console.log("vendor_id",req.body.vendor_id)
      var outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
        order.aggregate([
                    {
                        $match:{vendor_id:mongoose.Types.ObjectId(req.body.vendor_id)}
                    },
                    {
                        $lookup: {
                            from: "items",
                            localField: "item_id",
                            foreignField: "_id",
                            as: "item_detail"
                        }
                    },
                    {
                        $unwind:"$item_detail"
                    },
                    {
                        $group:{
                                "_id":"$item_id",
                                "total":{$sum:"$item_count"},
                                "itemDetails":{$push:"$item_detail"}

                                }
                    }
                ]
                    ,function(err,orderdetails){
                        console.log("orderdetails",orderdetails)
                        if(err){
                            console.log(err)
                            outputJSON = {'status':'failure', 'messageId':400, 'message': "err"}, 
                            res.json(outputJSON);   
                        }else{
                            if(orderdetails.length>0){
                                outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, "data":orderdetails }, 
                                res.json(outputJSON);  
                            }else{
                                outputJSON = {'status':'success', 'messageId':200, 'message': "No orders were placed yet"}, 
                                res.json(outputJSON); 
                            }   
                        }
                    })

            }  
    


