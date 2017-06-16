var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var vehicletypeSchema = new Schema({
	vehicleType:{
		type:String, 
		required:'Please enter Vehicle Type',
		unique:true

	},
	enable:{type:Boolean},
	is_deleted:{type:Boolean, default:false},
	createdDate:{type:Date, default: Date.now}

});

//custom validations
vehicletypeSchema.path('vehicleType').validate(function(value) {
	var validateExpression = /^[a-zA-Z ]*$/;
	return validateExpression.test(value);
}, 'Invalid Vehicle Type')

vehicletypeSchema.plugin(uniqueValidator, {message:'Vehicle type already exists'});

var vehicletypeObj = mongoose.model('vehicletypes', vehicletypeSchema);
module.exports = vehicletypeObj;