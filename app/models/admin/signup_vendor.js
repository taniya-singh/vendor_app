var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;


var mySchema = new Schema({
  vendor_name:{type:String,required: 'Please enter the password.' },
  vendor_email: { type: String ,required: 'Please enter the email.'},
  password: { type: String, required: 'Please enter the password.' },
  facebook: String,
  enable: {type: Boolean, default:false},
  phone_no:{type:String, required: 'Please enter the phone number.'},
  vendor_address:{type:String},
  city:{type:String},
  country:{type:String},
  zipcode:{type:String},
  latitude:{type:Number},
  longitude:{type:Number},
  geo:{type:[Number],index:'2dsphere'},
  is_deleted:{type:Boolean, default:false},
  facebook_id:Number,
  faceBookFlag:{type: Boolean, default:false},
  user_type:{type:String,default:"vendor"},
  created_date:{type:Date, default: Date.now}  ,
  pickup_time:{type:String,default:"10:00-10:30"}
    
});

mySchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    })
    .exec(cb);
};

mySchema.plugin(uniqueValidator, {message: "vendor name already exists."});


var vendor=mongoose.model("vendor_details",mySchema);
module.exports = vendor;


