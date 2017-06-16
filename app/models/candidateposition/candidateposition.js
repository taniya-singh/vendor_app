var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema();

var candidatepositionSchema = new mongoose.Schema({
	position:{type:String, unique:true, required:'Please enter the position'},
	threshold:{type:Number, required:'Please enter the threshold score'},
	enable:{type:Boolean, default:true},
	created_date:{type:Date, default:Date.now}
});

//custom validations

candidatepositionSchema.path('position').validate(function(value) {
  var validateExpression = /^[a-zA-Z\. ]*$/;
  return validateExpression.test(value);
}, "Please enter valid position name");

candidatepositionSchema.path('threshold').validate(function(value) {
  var validateExpression = /^[0-9]*$/;
  return validateExpression.test(value);
}, "Please enter valid threshold");

candidatepositionSchema.plugin(uniqueValidator, {message:'Position already exists'});

var candidatepositionObj = mongoose.model('candidateposition' , candidatepositionSchema);
module.exports = candidatepositionObj;