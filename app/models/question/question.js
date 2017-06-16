var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');


// var answersSchema = new mongoose.Schema({
// 	answeroption:{type:String, required:true},
// 	dependency_question:[{type : Schema.Types.ObjectId, ref : "questionSchema"}],
// 	enable:{type:Boolean, default:true},
// 	is_deleted:{type:Boolean, default:false},
//   	createdDate:{type:Date, default: Date.now}
// });


var questionSchema = new mongoose.Schema({
	question:{type:String, unique: true, required : 'Please enter the question name.'},
    category: {type: Schema.Types.ObjectId, ref: 'category'},
	dependency: {
        dependency_question: {type: Schema.Types.ObjectId, ref: 'Question'},
        dependency_answer: [{type: Schema.Types.ObjectId, ref: 'answer'}]
    },
    answers: [{type: Schema.Types.ObjectId, ref: 'answer'}],
    answer_type: {type: Schema.Types.ObjectId, ref: 'answerType', required : 'Please select the answer type.'},
    correct_answer: {type: Schema.Types.ObjectId, ref: 'answer'},
	enable:{type:Boolean, default:true},
    keyword:{type:String, required:true},
	is_deleted:{type:Boolean, default:false},
  	created_date: {
        type: Date,
        default: Date.now
    },
});



questionSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    })
    .populate('answers')
    .exec(cb);
};

questionSchema.plugin(uniqueValidator, {message:'Question already exists.'});

var questionsObj = mongoose.model('question', questionSchema);
module.exports = questionsObj;