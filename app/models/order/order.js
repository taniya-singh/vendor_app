var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var orderSchema = new mongoose.Schema({
  
  item_id:{type:Schema.Types.ObjectId},
  customer_id:{type:Schema.Types.ObjectId},
  vendor_id:{type:Schema.Types.ObjectId}, 
  status: {type:String,default:"pending"},
  created_date:{type:Date, default: Date.now}
 });







var order = mongoose.model('orders', orderSchema);
module.exports = order;