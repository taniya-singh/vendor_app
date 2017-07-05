var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var cms = new Schema({
  title:{
    type:String
  },
  identifier:{
    type:String
  },
  addedBy:{
    type:Schema.Types.ObjectId,
    ref:'adminlogin'
  },
  description:{
    type:String
  },
  isDisabled:{
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

var userObj = mongoose.model('cms', cms);
module.exports = userObj;