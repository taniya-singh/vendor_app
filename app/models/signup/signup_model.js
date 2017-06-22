var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;


var mySchema = new Schema({
    firstname : String,
    lastname: String,
    email: String,
    password:String,
    is_deleted:{type:Boolean, default:false},
});

mySchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    })
    .exec(cb);
};

//mySchema.plugin(uniqueValidator, {message: "item name already exists."});


var Users=mongoose.model("user",mySchema);
module.exports = Users;