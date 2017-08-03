var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var matchSchema = new Schema({
	/*this field means from which user this user like or dislike*/
	// friends:[{friendId:{
	// 	type:Schema.Types.ObjectId,
	// 	ref:'users',
	// 	required: 'Please enter the like User.'
	// },creationDate:{
	// 	type:Date,
	// 	default: Date.now()
	// }
	// }],
	/*this field means which user is going like or dislike*/
	user:{
		type:Schema.Types.ObjectId,
		ref:'users'
	},
	friends:{
		type:Schema.Types.ObjectId,
		ref:'users'
	},
	reaction:{
		type:String,
		enum : ['friend','unfriend','block'],
		default:"friend"
	},
	created:{
		 type: Date,
    	 default: Date.now()
	}
});
var adminlogin = mongoose.model('matchLists', matchSchema);
module.exports = adminlogin;