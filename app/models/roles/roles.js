var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var roleSchema = new Schema({
	name : {type:String, unique: true, required : 'Please enter the role name.'},
	permission: [{type: Schema.Types.ObjectId, ref: 'Permissions'}],
	is_deleted : {type : Boolean, default : false},
	enable : {type : Boolean, default : false},
	created_date : {type : Date, default : Date.now}
});


//custom validations

roleSchema.path('name').validate(function(value) {
  var validateExpression = /^[a-zA-Z ]*$/;
  return validateExpression.test(value);
}, "Please enter valid role name");



roleSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    })
    .exec(cb);
};

roleSchema.plugin(uniqueValidator, {message:'Role already exists'});

var roleObj = mongoose.model('roles' , roleSchema);
module.exports = roleObj;