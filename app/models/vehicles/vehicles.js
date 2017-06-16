var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var vehicleSchema = new Schema({
	vehicle: {
		type:String,
		required: 'Please enter Vehicle Name',
		unique:true
	},
	vehicleModel: {
		type:String,
		required:'Please enter Vehicle Model'
	},
	vehicleMake: {
		type:String,
		required:'Please enter Vehicle Make'
	},
	vehicleCapacity:{
		type:Number,
		required:'Please enter Vehicle Capacity'
	},
	enable:{type:Boolean},
	is_deleted:{type:Boolean, default:false},
	createdDate:{type:Date, default:Date.now}
});

//custom validations of fields
vehicleSchema.path('vehicle').validate(function(value) {
	var validateExpression = /^[a-zA-Z ]*$/;
	return validateExpression.test(value);
}, 'Invalid Vehicle Name');

vehicleSchema.path('vehicleModel').validate(function(value) {
	var validateExpression = /^[0-9]*$/;
	return validateExpression.test(value);
}, 'Invalid Vehicle Model');

vehicleSchema.path('vehicleMake').validate(function(value) {
	var validateExpression = /^[a-zA-Z]*$/;
	return validateExpression.test(value);
}, 'Invalid Vehicle Make');

vehicleSchema.path('vehicleCapacity').validate(function(value) {
	var validateExpression = /^[0-9]*$/;
	return validateExpression.test(value);
}, 'Invalid Vehicle Capacity');


vehicleSchema.plugin(uniqueValidator, {message:'Vehicle already exists'});

var vehicleObj = mongoose.model('vehicles', vehicleSchema);
module.exports = vehicleObj;