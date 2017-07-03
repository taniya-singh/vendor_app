var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;


var mySchema = new Schema({
    device_id : {type:String},
    device_type: {type:String},
    user_id:{type:Schema.Types.ObjectId}
    });

mySchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    })
    .exec(cb);
};

mySchema.plugin(uniqueValidator, {message: "item name already exists."});


var device=mongoose.model("devices",mySchema);
module.exports = device;