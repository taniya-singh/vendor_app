var itemsObj = require('./../../models/items/items.js');
var vendor = require('./../../models/admin/signup_vendor.js');
var userObj = require('./../../models/users/users.js');


var mongoose = require('mongoose');
var constantObj = require('./../../../constants.js');
var fs = require('fs');
var stripe = require("stripe")("sk_test_fypIdKmVYJJmsl7Kk1UWm2RH");



 /*Add item along with the valid vendor ID*/
exports.addcustomer = function(req,res){
	console.log("add customer wich")
	/*stripe.customers.create({
  	description: 'vendor@gmail.com'
 
	}, function(err, customer) {
		if(err){
			console.log(err)
			outputJSON = {'status':'failure', 'messageId':400, 'message':"Err"}, 
			res.json(err);

		}else{console.log(customer)
			outputJSON = {'status':'success', 'messageId':200, 'message':"item added successfully", "data":customer }, 
			res.json(outputJSON);
		}
  
});
*/
stripe.customers.create({
  email: 'vendor@example.com'
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
    amount: 1600,
    currency: 'usd',
    customer: source.customer
  });
}).then(function(charge) {
  outputJSON = {'status':'success', 'messageId':200, 'message':"item added successfully", "data":charge }, 
			res.json(outputJSON);
}).catch(function(err) {
	console.log("err",err)
outputJSON = {'status':'failure', 'messageId':400, 'message':"err" }, 
			res.json(outputJSON);
});
      
}		

