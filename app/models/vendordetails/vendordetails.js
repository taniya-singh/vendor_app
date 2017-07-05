var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;


var mySchema = new Schema({
    vendor_id:{type:Schema.Types.ObjectId},
    pickup_time:{type:Date,default: Date.now},
    vendor_email: {type:String},
    vendor_password:{type:String},
    
});

mySchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    })
    .exec(cb);
};

//mySchema.plugin(uniqueValidator, {message: "item name already exists."});


var vendor=mongoose.model("vendordetails",mySchema);
module.exports = vendor;