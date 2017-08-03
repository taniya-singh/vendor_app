var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var edu_level = new Schema({
  name: {
    type: String
  },
  isDeleted:{
		type:Boolean,
		default:false
  }
}, {
  collection: 'educationlevels'
});

var educationlevels = mongoose.model('educationlevels', edu_level);
module.exports = educationlevels;