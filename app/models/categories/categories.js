var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var categorySchema = new mongoose.Schema({
	category_name : {type:String, unique: true, required : 'Please enter the category name.'},
	questions : [{type : Schema.Types.ObjectId, ref : "question"}],
	is_deleted : {type : Boolean, default : false},
	parent: {type: Schema.Types.ObjectId, ref: 'category'},
	enable : {type : Boolean, default: true},
	created_date : {type : Date, default : Date.now}
});

//custom validations
categorySchema.path('category_name').validate(function(value) {
  var validateExpression = /^[a-zA-Z\.\-\/ ]*$/;
  return validateExpression.test(value);
}, "Please enter valid category name.");

categorySchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    })
    .populate({
    		path:'questions',
    		match: {"is_deleted": false}
    	})
    .exec(cb);
};


categorySchema.plugin(uniqueValidator, {message:'Category already exists.'});

var categoryObj = mongoose.model('category' , categorySchema);
module.exports = categoryObj;