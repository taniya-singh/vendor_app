var itemsObj = require('./../../models/items/items.js');
var vendor = require('./../../models/admin/signup_vendor.js');
var userObj = require('./../../models/users/users.js');
var order = require('./../../models/order/order.js');
var device = require('./../../models/devices/devices.js')

var paymentObj = require('./../../models/payment/payment.js');
var mongoose = require('mongoose');
var constantObj = require('./../../../constants.js');
var fs = require('fs');
var common=require('./../common/common.js')
var stripe = require("stripe")("sk_test_PirOevMb5V4TmELqMjPZxTnJ");



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
var create_customer_on_stripe = function(custdetail, cb) {
  console.log("ffff", custdetail)
  userObj.find({
    _id: custdetail._id
  }, function(err, user) {
    if (err) {
      console.log("err", err)
      cb(err, {
        "message": "err"
      })
    } else {
      if (user[0] == null) { //customer does not exist
        cb(null, {
          "message": "Not a valid customer"
        })
      } else {
        userObj.find({
          _id: custdetail._id,
          customer_stripe_id: {
            $exists: true
          }
        }, function(err, existing_customer) {
          if (err) {
            console.log("err", err) // item detail != null
            cb(err, {
              "message": "Err"
            })
          } else {
            if (existing_customer == "") { //if customer is not created on skype
              console.log("inside create new customer")
              stripe.customers.create({
                email: user.email
              }, function(err, customer) {
                if (err) {
                  console.log("kkkkk", err);
                  cb(err, {
                    "message": "Err"
                  })
                } else {
                  userObj.update({
                    _id: custdetail._id
                  }, {
                    $set: {
                      customer_stripe_id: customer.id
                    }
                  }, function(err, added_stripe_id) {
                    if (err) {
                      cb(err, {
                        "message": "err"
                      })
                    } else {
                      console.log("asdf", added_stripe_id)
                      cb(null, {
                        customer
                      })
                    }
                  })
                }
              })
            } //end of if existing customer
            else {
              console.log("inide old customer") //if stripe id already exists
              var customerid = existing_customer[0].customer_stripe_id
              stripe.customers.retrieve(customerid, function(err, customer) {
                if (err) {
                  console.log("err", err)
                  cb(err, {
                    'message': "Err"
                  })
                } else {
                  cb(null, {
                    customer
                  })
                }
              })
            }
          }
        })
      }
    }
  })
}
exports.add_new_card = function(req, res) {
  var card_det = {};
  var card_info = [];
  var custdetail = {};
  custdetail = req.body;
  create_customer_on_stripe(custdetail, function(err, customers) {
    if (err) {
      console.log("idf err", err)

    } else {
      console.log("rrrrrrrrrrrrrrrrrrrrr", customers)
      var stripe_id = customers.customer.id;
      stripe.customers.createSource(stripe_id, {
        source: {
          object: 'card',
          exp_month: req.body.exp_month,
          exp_year: req.body.exp_year,
          number: req.body.account_no,
          cvc: req.body.cvc
        },
      }, function(err, card) {
        if (err) {
          console.log("err", err)
        } else {
          console.log("card", card)
          card_det = {
            card_id: card.id
          }
          console.log("card det", card_det)
          card_info.push(card_det)
          userObj.update({
            customer_stripe_id: stripe_id
          }, {
            $addToSet: {
              stripe_card_ids: {
                $each: card_info
              }
            },$set:{card_details:true}
          }, function(err, addcard) {
            console.log("ADD", addcard)
            if (err) {
              console.log(err)
              outputJSON = {
                  'status': 'err',
                  'messageId': 400,
                  'message': "err",
                },
                res.json(outputJSON);
            } else {
              console.log("updation", addcard);
              outputJSON = {

                  'status': 'success',
                  'messageId': 200,
                  'message': "card Added to your account",
                  'data': card
                },
                res.json(outputJSON);
            }
          })
        }
      });
    }
  });
}
exports.list_all_cards=function(req,res){
console.log("req bodu",req.body)
userObj.find({_id:req.body._id},function(err,userdetail){
  if(err){

  }else{
    if(userdetail.length>0){
      console.log("user detail",userdetail)
      var cust_stripe_id=userdetail[0].customer_stripe_id;
      stripe.customers.listCards(cust_stripe_id, function(err, cards) {
          if(err){
            console.log("err is",err)
            outputJSON = {
              'status': 'Failure',
              'messageId': 400,
              'message': "Error in retreiving cards"
            },
            res.json(outputJSON);

          }else{
            if(cards){
              outputJSON = {
              'status': 'success',
              'messageId': 200,
              'message': "Cards retreived successfully",
              'data':cards
            },
            res.json(outputJSON);
            }else{
              outputJSON = {
              'status': 'Failure',
              'messageId': 400,
              'message': "You have not added any card yet",
            }
            res.json(outputJSON);
            }
          }
      });
    }else{
      outputJSON = {
       'status': 'Failure',
       'messageId': 400,
        'message': "Invalid _id",
       }
     res.json(outputJSON);
    }
  }
})

}

exports.link_card = function(req, res) {
  userObj.find({
    _id: req.body._id
  }, function(err, userdetail) {
    if (err) {
      outputJSON = {
        'status': 'Failure',
        'messageId': 400,
        'message': "Error in user info retreival"
      }
      res.json(outputJSON)
    } else {
      var card_id = req.body.stripe_card_id;
      if (userdetail) {
        stripe.customers.update(userdetail[0].customer_stripe_id, {
          default_source: card_id
        }, function(err, customer) {
          if (err) {
            console.log("err",err)
            outputJSON = {
              'status': 'Failure',
              'messageId': 400,
              'message': "Error in linking card"
            }
            res.json(outputJSON)
          } else {
            if (customer) {
              outputJSON = {
                'status': 'success',
                'messageId': 200,
                'message': "Card is successfully linked",
                'data': customer
              }
              res.json(outputJSON)
            }
          }
        });
      } else {
        outputJSON = {
          'status': 'Failure',
          'messageId': 400,
          'message': "user not found"

        }
        res.json(outputJSON)
      }
    }
  })
}
var procede_to_pay = function(custdetail, custdetails, paymentcb) {
  console.log("card is linked")
  stripe.customers.retrieveCard(
    custdetails.customer.id,
    custdetail.stripe_card_id,
    function(err, card) {
      if (err) {
        paymentcb(err, {
          'message': "Err"
        })
      } else {
        if (card.id != null) {
          itemsObj.find({
            _id: custdetail.item_id
          }, function(err, iteminfo) {
            if (err) {
              paymentcb(err, {
                'message': "Error in item info retreival"
              })
            } else {
              if (iteminfo.length > 0) {
                var no_of_items=custdetail.item_count
                //console.log("item info retreived", iteminfo)
                if (iteminfo[0].p_count >= custdetail.item_count) {
                  var amount = (iteminfo[0].p_price) * (custdetail.item_count);
                  var amount_to_pay = amount * 100;
                  var vendorid = iteminfo[0].vendor_id;
                  vendor.find({
                    _id: vendorid
                  }, function(err, vendordetails) {
                    if (err) {
                      paymentcb(err, {
                        'message': "Error in vendor info retreival"
                      })
                    } else {
                      if (vendordetails) {
                        accntid = vendordetails[0].stripe_account_id
                        stripe.charges.create({
                            amount: amount_to_pay,
                            currency: "usd",
                            customer: custdetails.customer.id,
                            source: card.id, // obtained with Stripe.js
                            destination: {
                              account: accntid
                            },
                            description: "Charge for Customer food",
                            //application_fee: 500, // amount in cents
                            capture: false
                          },
                          function(err, charge) {
                            if (err) {
                              paymentcb(err, {
                                'message': "err"
                              })
                            } else {
                              //console.log("***", charge)
                              var ordersave = {}
                              ordersave.item_id = iteminfo[0]._id;
                              ordersave.vendor_id = iteminfo[0].vendor_id;
                              ordersave.customer_id = custdetail._id;
                              ordersave.item_count = custdetail.item_count;
                              order(ordersave).save(ordersave, function(err, saveorder) {
                                if (err) {
                                  paymentcb(err, {
                                    'message': "Error in vendor info retreival"
                                  })
                                } else {
                                  var latest_count = (iteminfo[0].p_count) - (custdetail.item_count);
                                  itemsObj.update({
                                    _id: custdetail.item_id
                                  }, {
                                    $set: {
                                      p_count: latest_count
                                    }
                                  }, function(err, updatecount) {
                                    if (err) {
                                      paymentcb(err, {
                                        'message': "Error in update count"
                                      })
                                    } else {
                                      if (updatecount) {
                                        console.log("inside add new status")
                                        console.log("custdetail",custdetail._id,charge.source.id)
                                        var cid=charge.source.id
                                        console.log("cid",cid)

                                        userObj.update({_id:custdetail._id},{$set:{default_card_linked:cid}},function(err, defaultstatus_update) {
                                          if (err) {
                                            console.log("inisde err")
                                            paymentcb(err, {
                                              "message": "Error in updating default status"
                                            })
                                          } else {
                                            /* push notifications after payment
                                                made on:4th august
                                            */
                                            device.find({vendor_id:ordersave.vendor_id},function(err,pushnotify){
                                              if(err){

                                              }else{
                                                var device_token=pushnotify[0].device_token;
                                                common.notify(device_token,iteminfo,no_of_items,function(err,cbnotify){
                                                  if(err){
                                                    console.log("err",err);
                                                    paymentcb(err, {"message":"err in notification"
                                                    })
                                                  }else{
                                                    console.log("notification successfull",cbnotify)
                                                    paymentcb(null, {
                                                    charge
                                                    })

                                                  }
                                                })

                                              }
                                            })

                                            
                                          }
                                        })
                                      } else {
                                        paymentcb(err, {
                                          'message': " Item count not updated"
                                        })
                                      }
                                    }
                                  })
                                }
                              })
                            }
                          })
                      } else {
                        paymentcb(err, {
                          'message': "vendor details not found"
                        })
                      }
                    }
                  })
                } else {
                  paymentcb(err, {
                    'message': "Items out out stock"
                  })
                }

              } else {
                paymentcb(err, {
                  'message': "Item's info not available"
                })
              }
            }
          })
        } else {
          paymentcb(err, {
            'message': "card details not retreived"
          })
        }
      }
    }
  );

}
exports.pay = function(req, res) {
  var custdetail = {};
  var ordersave = {};
  var accntid;
  custdetail = req.body
  var amount_to_pay;
  if (req.body._id) {
    create_customer_on_stripe(custdetail, function(err, custdetails) {
      if (err) {
        outputJSON = {
            'status': 'Failure',
            'messageId': 400,
            'message': "Error"
          },
          res.json(outputJSON);
      } else {
        if (custdetails != null) {
          if (custdetails.customer.default_source == req.body.stripe_card_id) {
            procede_to_pay(custdetail, custdetails, function(err, paymentcb) {
                if (err) {
                  outputJSON = {
                  'status': 'Failure',
                  'messageId': 400,
                  'message': "Error in payment"
                }
                res.json(outputJSON)
                } else {
                  if(paymentcb){
                    outputJSON = {
                          'status': 'success',
                          'messageId': 200,
                          'message': "Payment successfull",
                          'data': paymentcb
                        },
                        res.json(outputJSON);
                  }else{
                    outputJSON = {
                          'status': 'failure',
                          'messageId': 400,
                          'message': "Something worng happen,try again later",
                        },
                        res.json(outputJSON);
                  }
                  
                }
              })
          } else {
            console.log("first linking then pay")
            var card_id = req.body.stripe_card_id;
            stripe.customers.update(custdetails.customer.id, {
              default_source: card_id
            }, function(err, customer) {
              if (err) {
                console.log("err", err)
                outputJSON = {
                  'status': 'Failure',
                  'messageId': 400,
                  'message': err.raw.message
                }
                res.json(outputJSON)
              } else {
                if (customer) {
                  procede_to_pay(custdetail, custdetails, function(err, paymentcb) {
                    if (err) {
                      outputJSON = {
                          'status': 'Failure',
                          'messageId': 400,
                          'message': "Something worng happen,try again later"
                          
                        },
                        res.json(outputJSON);
                    } else {

                      if(paymentcb){
                      outputJSON = {
                          'status': 'success',
                          'messageId': 200,
                          'message': "Payment successfull after linking card",
                          'data': paymentcb
                        },
                        res.json(outputJSON); 

                      }else{
                        outputJSON = {
                          'status': 'Failure',
                          'messageId': 400,
                          'message': "Something worng happen,try again later"
                          
                        },
                        res.json(outputJSON);
                      }
                      
                    }
                  })
                } else {
                  outputJSON = {
                      'status': 'Failure',
                      'messageId': 400,
                      'message': "Error in card linking"
                    },
                    res.json(outputJSON);
                }
              }
            })
          }
        } else {
          console.log(err)
          outputJSON = {
              'status': 'Failure',
              'messageId': 400,
              'message': "Error,custdetail not retreived successfully"
            },
            res.json(outputJSON);
        }
      }
    })
  }else{
   outputJSON = {
              'status': 'Failure',
              'messageId': 400,
              'message': "Error,customer _id is not defined"
            },
            res.json(outputJSON); 
  }
}
        /*itemsObj.find({ _id: req.body.item_id }, function(err, items) {
          if (err) {
            outputJSON = {
                'status': 'Failure',
                'messageId': 400,
                'message': "Error"
              },
              res.json(outputJSON);
          } else {
            console.log("inside items")
            if ((items[0].p_count) >= (req.body.item_count)) {
              var amount = (items[0].p_price) * (req.body.item_count);
              var amount_to_pay = amount * 100;
              vendor.find({
                _id: items[0].vendor_id
              }, function(err, vendetails) {
                if (err) {
                  console.log("errr", err)
                  outputJSON = {

                      'status': 'Failure',
                      'messageId': 400,
                      'message': "Error",
                      'data': err
                    },
                    res.json(outputJSON);
                } else {
                  stripe.customers.retrieveCard(
                    custdetails.customer.id,
                    custdetail.stripe_card_id,
                    function(err, card) {

                      if (err) {
                        console.log("errr", err)

                        outputJSON = {
                            'status': 'Failure',
                            'messageId': 400,
                            'message': "error",
                            'data': err
                          },
                          res.json(outputJSON);
                      } else {
                        if (card) {
                          console.log("inide card", card)
                          if (vendetails.length > 0) {
                            accntid = vendetails[0].stripe_account_id
                            console.log("**************", amount_to_pay)
                            console.log("RRRRRRRRRRRRR", custdetails.customer.id)
                            stripe.charges.create({
                                amount: amount_to_pay,
                                currency: "usd",
                                customer: custdetails.customer.id,
                                source: card.id, // obtained with Stripe.js
                                destination: {
                                  account: accntid
                                },
                                description: "Charge for Customer food",
                                //application_fee: 500, // amount in cents
                                capture: false
                              },
                              function(err, charge) {
                                if (err) {
                                  console.log("eeeee", err)
                                  res.json(err);
                                } else {

                                  ordersave.item_id = items[0]._id;
                                  ordersave.vendor_id = items[0].vendor_id;
                                  ordersave.customer_id = custdetail._id;
                                  ordersave.item_count = req.body.item_count;
                                  order(ordersave).save(ordersave, function(err, saveorder) {
                                    if (err) {
                                      outputJSON = {
                                          'status': 'failure',
                                          'messageId': 400,
                                          'message': "Err"

                                        },
                                        res.json(outputJSON);
                                    } else {
                                      var latest_count = (items[0].p_count) - (req.body.item_count);
                                      console.log("latest count is", latest_count);
                                      itemsObj.update({
                                        _id: req.body.item_id
                                      }, {
                                        $set: {
                                          p_count: latest_count
                                        }
                                      }, function(err, updatecount) {
                                        if (err) {

                                        } else {
                                          if (updatecount) {
                                            console.log("save order", updatecount)
                                            outputJSON = {
                                                'status': 'success',
                                                'messageId': 200,
                                                'message': "Payed successfully",
                                                'data': charge
                                              },
                                              res.json(outputJSON);
                                          } else {
                                            outputJSON = {
                                                'status': 'failure',
                                                'messageId': 400,
                                                'message': "something worng happened"
                                              },
                                              res.json(outputJSON);
                                          }
                                        }
                                      })
                                    }

                                  })
                                }
                              })
                          } else {
                            outputJSON = {
                                'status': 'Failure',
                                'messageId': 400,
                                'message': "vendor details does not exists"
                              },
                              res.json(outputJSON);
                          }
                        } else {
                          outputJSON = {
                              'status': 'Failure',
                              'messageId': 400,
                              'message': "card does not exist"
                            },
                            res.json(outputJSON);
                        }
                      }
                    })
                }
              })
            } else {
              outputJSON = {
                  'status': 'Failure',
                  'messageId': 400,
                  'message': "Item out of stock"
                },
                res.json(outputJSON);
            }
          }

          })
*/        
      
      

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