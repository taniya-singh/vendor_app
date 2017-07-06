var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var packageSchema = new Schema({
  title: {type: String,unique:true},
  like:{type:Number},
  price:{type:Number},
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
  },
  user:{type: Schema.Types.ObjectId, ref: 'users'},  
   enable: {type: Boolean, default:true},
  status: {type: Boolean, default:false},
});


var packObj = mongoose.model('packages', packageSchema);
module.exports = packObj;