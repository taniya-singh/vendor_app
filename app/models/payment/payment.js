var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var mySchema = new Schema({
    customer_stripe_id :String,
    amount_paid:Number,
    status:String,
    stripe_id:String,   
    paid_status: String,
    card_id:String,
    is_deleted:{type:Boolean, default:false},
   });


var paymentObj=mongoose.model("payments",mySchema);
module.exports = paymentObj;







