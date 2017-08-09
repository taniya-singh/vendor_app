var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var cardSubschema = new mongoose.Schema({
  card_id:{type:String},
  default_status:{type:Boolean,default:false}
}) 


var userSchema = new mongoose.Schema({
  vendor_id: {type: mongoose.Schema.Types.ObjectId, ref: 'vendor'},
  first_name: {type:String},
  last_name: {type:String},
  email: { type: String},
  user_name: {type: String},
  password: { type: String},
  customer_stripe_id:{type:String},
  card_details:{type:Boolean,default:false},
  gender:{type:String,default:"Female"},
  enable: {type: Boolean, default:true},
  phone_no:{type:String},
  is_deleted:{type:Boolean, default:false},
  facebook_id:{type:String},
  google_id:{type:Number},
  loginType:{type: Number, default:1},// 1 simple,2 facebook, 3 google
  user_type:{type:String,default:"customer"},
  created_date:{type:Date, default: Date.now},
  stripe_card_ids:{type:[cardSubschema]},
  default_card_linked:{type:String,default:null},
  last4:{type:String,default:null}
 });

userSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    })
    .exec(cb);
};




//custom validations

// userSchema.path('first_name').validate(function(value) {
//   var validateExpression = /^[a-zA-Z ]*$/;
//   return validateExpression.test(value);
// }, "Please enter a valid first name.");


// userSchema.path("last_name").validate(function(value) {
//   var validateExpression = /^[a-zA-Z]*$/;
//   return validateExpression.test(value);
// }, "Please enter a valid last name.");

userSchema.path("email").validate(function(value) {
   var validateExpression = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
   return validateExpression.test(value);
}, "Please enter a valid email address.");



userSchema.plugin(uniqueValidator, {message: "Username already exists."});

var userObj = mongoose.model('users', userSchema);
module.exports = userObj;
