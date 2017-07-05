var itemsObj = require('./../../models/items/items.js');
var vendorDbObj = require('./../../models/vendor/vendor.js');
var userObj = require('./../../models/users/users.js');


var mongoose = require('mongoose');
var constantObj = require('./../../../constants.js');
var fs=require('fs');



exports.additems = function(req,res){

	console.log("inside add items",req.body);
      var outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorAddingItems};

	 if (req.body.image != undefined){	
					reqdata={};
					reqdata.image=req.body.image;
					reqdata.p_name=req.body.p_name;
					reqdata.vendor_id=req.body.vendor_id;
					reqdata.p_price=req.body.p_price;
					reqdata.p_description=req.body.p_description;
					reqdata.p_count=req.body.p_count;
					uploadSkillImg(reqdata,function(response){
						vendorDbObj.find({_id:req.body.vendor_id},function(err,vendetail){
							if(err){
								console.log(err)
					 			outputJSON = {'status':'failure', 'messageId':400, 'message':"vendor added successfully"}, 
					 			res.json(outputJSON);
							}
							else
							{
								console.log("vendetail",vendetail)
								if(vendetail==""){
									
									outputJSON = {'status':'failure', 'messageId':400, 'message': "Vendor doesnot exists"}, 
					 				res.json(outputJSON);
					 				
								}
								else{
console.log(response._id)
									//delete req.body.image;
									itemsObj.update({_id :response._id},{$set:{p_name:req.body.p_name,vendor_id:req.body.vendor_id,p_price:req.body.p_price,p_description:req.body.p_description,p_count:req.body.p_count}},{multi:true},function(err,data){
										if(err){
											res.json("Error: "+err);
										}
										else{
					 						outputJSON = {'status':'success', 'messageId':200, 'message':"vendor added successfully", "data":data }, 
					 						res.json(outputJSON);
										}
									});
								}
							}
						})
					});
			}
}	


/* ~~~~~~~~~~~~~UPloading image ~~~~~~~~~~~~~~~~~~~~~~~*/
	
         uploadSkillImg= function(data,callback){
       	console.log("data",data)

		      var photoname = Date.now() + ".png";
		      var imageName = __dirname+"/../../../public/images/upload/"+photoname;
		      
		      
		     if(data.image.indexOf("base64,")!=-1){	

		          var Data = data.image.split('base64,');
		          
		          var ext=Data[0].split('/');		          
		         var format= ext[1].replace(';','');
		          
		           var photoname = Date.now() + "."+format;
		           var imageName = __dirname+"/../../../public/images/upload/"+photoname;


		          var base64Data = Data[1];
		          var base64Data = base64Data;
		          
		          
		         // console.log("hgs",base64Data)
		     }else{
		     	var base64Data = data.image.base64;
		     }

		     //console.log("asdasd",base64Data)
		     if(base64Data!=undefined){

		     	 fs.writeFile(imageName, base64Data, 'base64', function(err) {

				      if (err) {
				        console.log(err);
				        callback("Failure Upload");


				      }
				        else{
				        		var updateField={};
				        	
				        			updateField={'image':photoname};
				        			        		
						


                       var item=new itemsObj({
					
					       image:photoname
				   });
                       item.save(function(err,data){
					   console.log(data)
					    if(data) {
						//console.log(err);
						callback(data);
					   }
					
				       });


					// itemsObj.insert(updateField,{w: 1},function(err,res){
					// 	console.log(err);
					// 	if(err){
					// 		console.log(err);
					// 		callback("Success Uploaded");
					// 	}
						
					// });
				        
				        
				        }
				      });
				  // }else{
				  // 	callback("Image  is too large.");
				  // }


		     }else{
		     	callback("wrongFormat");
		     }
				     //console.log("main data ",base64Data);
				    // var base64Data =data.image.base64; 
				    


				
				       
				    }


/**
 * a middleware controller to get all products
 */
exports.updateItem=function(req,res){

     var outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorUpdatingItems};
		itemsObj.update({_id :req.body.id},
			{$set:{p_name:req.body.p_name,p_price:req.body.p_price,p_count:req.body.p_count}},
			{multi:true},function(err,data){
						
	if(err){
						res.json("Error: "+err);
					}
					else{
					console.log("in uppdate",data)
				 	var outputJSON = {'status':'success',
					'messageId':200, 'message': constantObj.messages.successUpdatingItems, "data": data } 

					res.json(outputJSON);
					}
				});
		
     

 }
exports.removeItem=function(req,res){
     var outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorUpdatingItems};
		itemsObj.findOneAndRemove({_id :req.body._id},function(err,data){
						
					if(err){
						res.json("Error: "+err);
					}
					else{
						if(data==null)
						{
							var outputJSON = {'status':'failure',
							'messageId':400, 'message': "Invalid _id ,try again", "data": data } 
							res.json(outputJSON);		
						}
						else{
							var outputJSON = {'status':'success',
							'messageId':200, 'message': "Removed successfully", "data": data } 
							res.json(outputJSON);	
						}
				 	
					}
				});
		
     

 }


/**
 * a middleware controller to get all products
 */
      exports.listItem = function(req,res){
      var outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};

		itemsObj.find({},function(err,data){
					if(err){
						res.json("Error: "+err);
					}
					else{
				 		outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, "data":data }, 
					res.json(outputJSON);
					}
				});
		
     

 }
 /*List items to be viewed on customer screen */
exports.customerListItem = function(req,res){
      var outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
      console.log("inside customerListItem");
		itemsObj.find({},function(err,data){
					if(err){
						res.json("Error: "+err);
					}
					else{
				 		outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData, "data":data }, 
					res.json(outputJSON);
					}
				});
		
     

 }

 exports.item_listing_for_user=function(req,res)
 {
 	userObj.findOne({_id:req.body._id},function(err,user){
 		if(err){
	 		outputJSON = {'status':'failure', 'messageId':401, 'message': "Error occured"}, 
			res.json(outputJSON);
 		}
 		else{
	 		if(user==null){
	 			outputJSON = {'status':'failure', 'messageId':401, 'message': "user does not exists"}, 
				res.json(outputJSON);
	 		}
	 		else{
	 			itemsObj.aggregate([
		 			{
	        			$lookup:
	        				{
	            			from:"vendor_details",
	            			localField:"vendor_id",
	            			foreignField:"_id",
	            			as:"vendor_detail"
	        				}
	     			},{$unwind : "$vendor_detail" }
				],function(err,items){
					if(err){
	 					outputJSON = {'status':'failure', 'messageId':200, 'message': constantObj.messages.errorRetreivingData}, 
						res.json(outputJSON);
	 				}
	 				else{
	 					outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successRetreivingData,'data':items}, 
						res.json(outputJSON);
	 				}

				})
	 		}	
 		}	
 	})
 }


 
