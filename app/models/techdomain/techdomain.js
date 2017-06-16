var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var techdomainSchema = new mongoose.Schema({
	domain_name :{type: String, unique: true, required : 'Please enter the domain name'},
	is_deleted : {type : Boolean, default : false},
	enable : {type : Boolean},
	createdDate : {type : Date, default : Date.now}
});

//custom validations

techdomainSchema.path('domain_name').validate(function(value) {
  var validateExpression = /^[a-zA-Z ]*$/;
  return validateExpression.test(value);
}, "Please enter valid domain name");


techdomainSchema.plugin(uniqueValidator, {message:'Domain already exists'});

var techdomainObj = mongoose.model('techdomain' , techdomainSchema);
module.exports = techdomainObj;