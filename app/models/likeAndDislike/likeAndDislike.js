var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var likeSchema = new Schema({
	/*this field means from which user this user like or dislike*/
	to:{
		type:Schema.Types.ObjectId,
		ref:'users',
		required: 'Please enter the like User.'
	},
	/*this field means which user is going like or dislike*/
	from:{
		type:Schema.Types.ObjectId,
		ref:'users'
	},
	reaction:{
		type:String,
		enum : ['unlike','like','block','report']
	},
	reasonOfReport:{
		type:String
	},
	lat:{
      type:Number
	},
	lng:{
	    type:Number
	},
	created:{
		 type: Date,
    	 default: Date.now()
	}
});

var adminlogin = mongoose.model('likeanddislikes', likeSchema);
module.exports = adminlogin;