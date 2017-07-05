var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var feedbackSchema = new mongoose.Schema({
  user_id  :{type: Schema.Types.ObjectId, ref: 'users'},
	type : {type:String,  required : 'Please enter the type.'},
  description : {type:String,  required : 'Please enter the description.'},
  attachment : {type:String},
	is_deleted : {type : Boolean, default : false},
	created_date : {type : Date, default : Date.now}
});


//custom validations


feedbackSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    })
    .exec(cb);
};



var feedbackObj = mongoose.model('feedbacks' , feedbackSchema);
module.exports = feedbackObj;