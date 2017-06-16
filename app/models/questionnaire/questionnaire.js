var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var questionnaireSchema = new mongoose.Schema({
	questionnaire_name : {type:String, unique: true, required : 'Please enter the questionnaire name.'},
  questions: [{
        category: {type: Schema.Types.ObjectId, ref: 'category'},
        questions: [{type: Schema.Types.ObjectId, ref: 'question'}]
    }],	
	is_deleted : {type : Boolean, default : false},
	enable : {type : Boolean},
	created_date : {type : Date, default : Date.now}
});

questionnaireSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    })
    .populate('questions.category')
    .populate('questions.questions')
    .exec(cb);
};
//custom validations

questionnaireSchema.path('questionnaire_name').validate(function(value) {
  var validateExpression = /^[a-zA-Z\.\- ]*$/;
  return validateExpression.test(value);
}, "Please enter valid questionnaire name.");
  

questionnaireSchema.plugin(uniqueValidator, {message:'Questionnaire already exists.'});

var questionnaireObj = mongoose.model('questionnaire' , questionnaireSchema);
module.exports = questionnaireObj;