var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var adminloginSchema = new Schema({

	username: String,
	password: String,
	email:String
},  {collection:'admin'});

adminloginSchema.statics.serializeUser = function(user, done){
    done(null, user);
};

adminloginSchema.statics.deserializeUser = function(obj, done){
    done(null, obj);
};

var adminlogin = mongoose.model('adminlogin', adminloginSchema);
module.exports = adminlogin;