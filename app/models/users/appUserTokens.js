var mongoose = require('mongoose');
var moment = require('moment');
var Schema = mongoose.Schema;

var tokenSchema = new mongoose.Schema({
  user: {
     type: Schema.Types.ObjectId,
     ref: 'users'
  },
  token: {
    type: String,
    required: true
  },
  expiredOn: {
    type: Date,
    default: Date.now
  }
});

tokenSchema.pre('save', function (next) {
        var token = this;
        var moment = require('moment');
        var date = new moment();
        date.add(60*60*24*7 ,'seconds' );
        token.expiredOn = date.toDate();
        next();
});
 
tokenSchema.statics.load = function(id, cb) {
  this.findOne({
      _id: id
    })
    .exec(cb);
};
//custom validations
var tokenSchemaObj = mongoose.model('appUserTokens', tokenSchema);
module.exports = tokenSchemaObj;
