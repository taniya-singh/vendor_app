var users = require('./../../models/signup/signup_model.js');
var mongoose = require('mongoose');
var constantObj = require('./../../../constants.js');
var fs=require('fs');



exports.addUser = function(req,res){
	var newuser = new users;
	var user_lastname=req.body.lastname;
	var user_firstname=req.body.firstname;
	var user_email=req.body.email;
	var user_password=req.body.password;
	newuser.firstname=user_firstname;
	newuser.lastname=user_lastname;
	newuser.email=user_email;
	newuser.password=user_password;
	users.find({email:req.body.email},function(err,invalid){
		if(err){
			res.json({message:"error occured"})
		}
		else{
			if(invalid!=""){
				console.log("invalid",invalid)
				res.json({message:"user already exists"});
			}
			else{

				newuser.save(function(err,users){
					if(err){
						res.json({message:"try again later"})
					}
					else{
						res.json({status:'success', message:"registered successfully", "data":users }); 
					}
				})
			}
		}
	})
}	
		
      
		
	
/*

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
		
     

 }*/



 