var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var faq = new Schema({
  question:{
    type:String
  },
  answer:{
    type:String
  },
  addedBy:{
    type:Schema.Types.ObjectId,
    ref:'adminlogin'
  },
  isDisabled:{
    type:Boolean,
    default:false
  },
  isDeleted:{
    type:Boolean,
    default:false
  },
  created: {
    type: Date,
    default: Date.now()
  },
  modified: {
    type: Date,
    default: Date.now()
  }
});

var faqObj = mongoose.model('faq', faq);
module.exports = faqObj;