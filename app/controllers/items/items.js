var itemsObj = require('./../../models/items/items.js');
var mongoose = require('mongoose');
var constantObj = require('./../../../constants.js');
var fs=require('fs');



exports.additems = function(req,res){

	//console.log(req.files[0].filename);
      var outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorAddingItems};

	 if (req.body.image != undefined)
				    {
				    	
					reqdata={};
					//reqdata._id=req.body._id;
					reqdata.image=req.body.image;
					
					//console.log("herereee uploadImg",reqdata);
					uploadSkillImg(reqdata,function(response){
					
						console.log("datga",req.body)
		    itemsObj.update({_id :response._id},{$set:{p_name:req.body.p_name,p_price:req.body.p_price}},{multi:true},function(err,data){
					if(err){
						res.json("Error: "+err);
					}
					else{
				 		outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successAddingData, "data":data }, 
				 		res.json(outputJSON);
					}
				});
		
					 	});
	}

      
		
}	


/* ~~~~~~~~~~~~~UPloading image ~~~~~~~~~~~~~~~~~~~~~~~*/
	
       uploadSkillImg= function(data,callback){

		      var photoname = Date.now() + ".png";
		      var imageName = __dirname+"/../../../public/images/upload/"+photoname;
		      
		      
		     if(data.image.indexOf("base64,")!=-1){	
		          var Data = data.image.split('base64,');
		          var base64Data = Data[1];
		          var base64Data =base64Data;
		     }else{
		     	var base64Data =data.image.base64;
		     }
				     //console.log("main data ",base64Data);
				    // var base64Data =data.image.base64; 
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
				    }




/**
 * a middleware controller to get all products
 */
exports.updateItem=function(req,res){
	console.log(req.body)
      var outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorUpdatingItems};
		itemsObj.update({_id :req.body.id},{$set:{p_name:req.body.name,p_price:req.body.price}},{multi:true},function(err,data){
					if(err){
						res.json("Error: "+err);
					}
					else{
				 		outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successUpdatingItems, "data": data }, 

					res.json(outputJSON);
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



 