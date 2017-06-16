var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var answerTypeSchema = new mongoose.Schema({
	answer_type: {type:String},
	enable: {type: Boolean, default: true},
	is_deleted : {type : Boolean, default : false},
	created_date: {
        type: Date,
        default: Date.now
    },
});

var answerObj = mongoose.model('answer_type', answerTypeSchema,"answer_type");
module.exports = answerObj;