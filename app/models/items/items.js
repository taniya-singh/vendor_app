var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;


var mySchema = new Schema({
    p_name : String,
    p_price: Number,
    p_description: String,
    is_deleted:{type:Boolean, default:false},
    image:String
});

mySchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    })
    .exec(cb);
};

mySchema.plugin(uniqueValidator, {message: "item name already exists."});


var itemsObj=mongoose.model("items",mySchema);
module.exports = itemsObj;