var itemsObj = require('./../../models/items/items.js');
var vendor = require('./../../models/admin/signup_vendor.js');
var userObj = require('./../../models/users/users.js');
var paymentObj = require('./../../models/payment/payment.js');
var mongoose = require('mongoose');
var constantObj = require('./../../../constants.js');
var fs = require('fs');
var stripe = require("stripe")("sk_test_fypIdKmVYJJmsl7Kk1UWm2RH");



 /*Add item along with the valid vendor ID*/
exports.addcustomer = function(req,res){
  	console.log("add customer wich")
    stripe.customers.create({
      description: 'customer2@gmail.com',
      //source: "tok_1AYrIOACYsLTDfEYddWiuFxu" // obtained with Stripe.js
    }, function(err, customer) {
        if(err){
          console.log("err",err) // item detail != null
          outputJSON = {'status':'failure', 'messageId':400, 'message':"err"}, 
          res.json(outputJSON);  
        }else{
          console.log("err",customer) // item detail != null
          outputJSON = {'status':'success', 'messageId':200, 'message':"Customer created successfully",data:customer}, 
          res.json(outputJSON);
        }  
    });      
}

/*Retreive customer information alogn with valid email id*/		
exports.retreive_customer = function(req,res){
console.log("insode retrieve")
  stripe.customers.retrieve(
    "cus_B0ikES5y4pYsVd",
    function(err, customer) {
      if(err){
      console.log("err",err) // item detail != null
      outputJSON = {'status':'failure', 'messageId':400, 'message':"err"}, 
      res.json(outputJSON);  
    }else{
      console.log("err",customer) // item detail != null
      outputJSON = {'status':'success', 'messageId':200, 'message':"Information retreived successsfully",data:customer}, 
      res.json(outputJSON);
    }
    })
}


exports.list_all_customers=function(req,res){
  var i=0;
  stripe.customers.list(
  { limit: 10 },
  function(err, customers) {
   if(err){
      console.log("err",err) // item detail != null
      outputJSON = {'status':'failure', 'messageId':400, 'message':"err"}, 
      res.json(outputJSON);  
    }else{
      console.log("data",customers.data)
       // item detail != null
      outputJSON = {'status':'success', 'messageId':200, 'message':"All customers retreived successfully",data:customers}, 
      res.json(outputJSON);
    }
  }
);
}

var create_customer_on_stripe=function(custdetail,cb){
  userObj.find({_id:custdetail._id},function(err,user){
   if(err){
      console.log("err",err) // item detail != null
       cb(err,{"message":"err"})
   }else{
      if(user==""){    //customer does not exist
         cb(null,{"message":"Not a valid customer"})
      }else{
        userObj.find({_id:custdetail._id,customer_stripe_id: { $exists: true } },function(err,existing_customer){
            if(err){
              console.log("err",err) // item detail != null
               cb(err,{"message":"Err"}) 
            }else{
              if(existing_customer==""){    //if customer is not created on skype
                console.log("inside create new customer")
                  stripe.customers.create({description: custdetail.email},function(err, customer){
                    if(err){
                      console.log("err",err) // item detail != null
                       cb(err,{"message":"Err"})  
                    }else{
 /*update user table */userObj.update({_id:custdetail._id},{$set:{customer_stripe_id:customer.id}},function(err,updation){
                        if(err){
                          cb(err,{'message':"err"})
                        }else{
                          if(updation!=null){
                            console.log("res is ",updation)
                             cb(null,{customer})
                          }
                        }
                      })             
                    }   //end of if
                  });
              }else{   //if stripe id already exists
                var customerid=existing_customer[0].customer_stripe_id
                stripe.customers.retrieve(customerid,function(err, customer) {
                  if(err){
                    console.log("err",err) // item detail != null
                     cb(err,{'message':"Err"})
                  }else{
                     cb(null,customer)
                  }
                })
              }
            }
        })   
      }
   }
 })
}

exports.pay = function(req, res) {
  var custdetail={}
  custdetail=req.body
  console.log("inside pay");
  if (req.body._id) {
   create_customer_on_stripe(custdetail,function(err,custdetails){
    if(err){

    }
    else{
      //console.log("dhan dhana",custdetails)
      vendor.find({_id:req.body.vendor_id},function(err,vendetails){
        if(err){
               outputJSON = {
            'status': 'Failure',
            'messageId': 400,
            'message': "Error"
            },
            res.json(outputJSON);
       }else{
          if(vendetails){
            console.log("customer details",custdetails.id)
            stripe.charges.create({
                amount: req.body.amount,
                currency: "usd",
                //customer: custdetails.id,
                source: custdetails.id, // obtained with Stripe.js
                destination: vendetails.bank_account_id,
                description: "Charge for Customer food",
                //application_fee: 500, // amount in cents
                capture : false
              },
               function(err, charge) {
                    if (err) {
                      console.log("eeeee",err)
                        res.json(err);
                    }
                    else
                    {
                      outputJSON = {
                        'status': 'success',
                        'messageId': 200,
                        'message': "Payed successfully",
                        'data':charge
                      },
                    res.json(charge);
                    }
            });

          }else{
               outputJSON = {
            'status': 'Failure',
            'messageId': 400,
            'message': "Please enter a valid vendor"
            },
            res.json(outputJSON);
          }
        }
      })     
    }
   });
    
  } else {
    outputJSON = {
        'status': 'faliure',
        'messageId': 400,
        'message': "Make sure you entered correct details",
        
      },
      res.json(outputJSON);
  }
}


/* stripe.customers.create({
    email: 'req.body.customer_email'

  }).then(function(customer){
    return stripe.customers.createSource(customer.id, {
      source: {
         object: 'card',
         exp_month: 10,
         exp_year: 2018,
         number: '4242 4242 4242 4242',
         cvc: 100
      }
  });
}).then(function(source) {
    return stripe.charges.create({
      amount: 16000,
      currency: 'usd',
      customer: source.customer
    });
}).then(function(charge) {
  var reqdata={};
  reqdata.stripe_id=charge.id;
  reqdata.status=charge.status;
  reqdata.customer_stripe_id=charge.source.customer;
  reqdata.paid_status=charge.paid;
  reqdata.card_id=charge.source.id;
    console.log("charge",reqdata);
    paymentObj(reqdata).save(reqdata,function(err,paymentdetails){
      console.log("inside payment schema")
      if(err){
        console.log("err",err)
      }else{
        console.log("paymentdetails",paymentdetails)
      }

    })
    outputJSON = {'status':'success', 'messageId':200, 'message':"data retreived successfully",data:charge}, 
    res.json(outputJSON);
}).catch(function(err) {
    console.log("err",err)
    outputJSON = {'status':'failure', 'messageId':400, 'message':"Error"}, 
    res.json(outputJSON);
 });
stripe.setTimeout(20000)

}*/

exports.retrieve_balance=function(err,res){
console.log("inside balance");
stripe.balance.retrieve({
  stripe_account: 'card_1Af0L3ACYsLTDfEYy4iGBYkg'
}).then(function(balance) {
  outputJSON = {'status':'success', 'messageId':200, 'message':"data retreived successfully",data:balance}, 
    res.json(outputJSON);// The balance object for the connected account
}).catch(function(err) {
  outputJSON = {'status':'failure', 'messageId':400, 'message':err}, 
    res.json(outputJSON);
});

}