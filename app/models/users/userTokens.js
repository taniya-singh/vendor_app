var mongoose = require('mongoose');
var moment = require('moment');
var Schema = mongoose.Schema;

var userTokenSchema = new mongoose.Schema({
  user: {
     type: Schema.Types.ObjectId,
     ref: 'users'
  },
  admin: {
     type: Schema.Types.ObjectId,
     ref: 'adminlogin'
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

userTokenSchema.pre('save', function (next) {
        var token = this;
        var moment = require('moment');
        var date = new moment();
        date.add(60*60*24*7 ,'seconds' );
        token.expiredOn = date.toDate();
        next();
});
 
userTokenSchema.statics.load = function(id, cb) {
  this.findOne({
      _id: id
    })
    .exec(cb);
};
//custom validations
var userTokenObj = mongoose.model('usertokens', userTokenSchema);
module.exports = userTokenObj;