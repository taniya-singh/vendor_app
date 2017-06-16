var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var resultSchema = new mongoose.Schema({
	questions : {type : Schema.Types.ObjectId, ref : "questions"},
	rating: {type: Number},
	created_date : {type : Date, default : Date.now}
});

var resultObj = mongoose.model('results' , resultSchema);
module.exports = resultObj;