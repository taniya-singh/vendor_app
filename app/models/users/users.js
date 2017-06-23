var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
  first_name: {type:String},
  last_name: {type:String},
  email: { type: String ,required: 'Please enter the email.'},
  user_name: {type: String, required: 'Please enter the username.'},
  password: { type: String, required: 'Please enter the password.' },
  facebook: String,
  enable: {type: Boolean, default:false},
  phone_no:{type:String, required: 'Please enter the phone number.'},
  is_deleted:{type:Boolean, default:false},
  facebook_id:Number,
  faceBookFlag:{type: Boolean, default:false},
  user_type:{type:String,default:"vendor"},
  created_date:{type:Date, default: Date.now}  ,
  pickup_time:{type:String,default:"10:00-10:30am"}
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

userSchema.path("user_name").validate(function(value) {
  validateExpression = /^[a-zA-Z0-9]*$/;
  return validateExpression.test(value);
}, "Please enter a valid user name"); 


userSchema.plugin(uniqueValidator, {message: "Username already exists."});

var userObj = mongoose.model('users', userSchema);
module.exports = userObj;