var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var itemsSubschema = new mongoose.Schema({
	item_count: {
		type: Number,
		require: 'item count is required.'
	},
	vendor_id: {
		type: Schema.Types.ObjectId,
		required: 'vendor id is required.'
	},
	item_id: {
		type: Schema.Types.ObjectId,
		required: 'item id is required'
	}
})
var cartSchema = new mongoose.Schema({

	item_id: {
		type: Schema.Types.ObjectId
	},
	customer_id: {
		type: Schema.Types.ObjectId
	},
	items: {
		type: [itemsSubschema]
	},
	vendor_id: {
		type: Schema.Types.ObjectId
	},
	item_count: {
		type: Number
	},
	created_date: {
		type: Date,
		default: Date.now
	},
	status: {
		type: String,
		default: "pending"
	},
	last_updated: {
		type: Date
	},

});



var addtocart = mongoose.model('addtocart', cartSchema);
module.exports = addtocart;