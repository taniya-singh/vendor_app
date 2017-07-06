var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var settingSchema = new Schema({
	male: {
		type:Boolean,
		default:true
	},
	female:{
		type:Boolean,
		default:true
	},
	user_id:{
		type:Schema.Types.ObjectId,
		ref:'users'
	},
	_public:{
		type:Boolean,
		default:true
	},
	distance:{
		type:Number,
		default:100
	},
	min_age: {
		type: Number,
		default:18
	},
	max_age: {
		type: Number,
		default:100
	},
	push_notification:{
		type:Boolean,
		default:true
	},
	sound_vibration:{
		type:Boolean,
		default:true
	},
	// education_level:[{
	// 	type:Schema.Types.ObjectId,
	// 	ref:'educationlevels'
	// }],
	created:{
		 type: Date,
    	 default: Date.now()
	}
});
var adminlogin = mongoose.model('settings', settingSchema);
module.exports = adminlogin;