var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blockUser = new Schema({
	user:{
		type:Schema.Types.ObjectId,
		ref:'users'
	},
	blockUser:{
		type:Schema.Types.ObjectId,
		ref:'users'
	},
	reaction:{
		type:String,
		enum : ['block']
	},
	created:{
		 type: Date,
    	 default: Date.now()
	}
});
var blockUsr = mongoose.model('blockLists', blockUser);
module.exports = blockUsr;