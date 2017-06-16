var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var answerSchema = new mongoose.Schema({
	answer_text: {type:String},
    answer_value: {type: Number, default: 0},
    answer_label: {type:String},
	enable: {type: Boolean, default: true},
	is_deleted : {type : Boolean, default : false},
	created_date: {
        type: Date,
        default: Date.now
    },
});

var answerObj = mongoose.model('answer', answerSchema, 'answer');
module.exports = answerObj;