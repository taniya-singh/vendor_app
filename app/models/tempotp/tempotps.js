var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var otpSchema = new Schema({
  otp:String,
  phone:String
}, {
  collection: 'tempotps'
});

var otpObj = mongoose.model('tempotps', otpSchema);
module.exports = otpObj;