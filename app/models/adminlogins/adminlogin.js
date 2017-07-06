var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var adminloginSchema = new Schema({
	firstname: String,
	lastname: String,
	image:String,
	username: String,
	password: String,
	email:String,
	verifyStr:String,
	prof_image:String,
	admin_commission: {
		job_poster: Number,
		job_finder: Number
	},
	stripe_credential:{
		payment_mode: {type : Boolean, default : false},		
		secret_test_key:{type:String},
		secret_live_key:{type:String}
	}
},  {collection:'admin'});

adminloginSchema.statics.load = function(id, cb) {
    this.findOne({
        username: id
    })
    .exec(cb);
};
adminloginSchema.statics.serializeUser = function(user, done){
    done(null, user);
};

adminloginSchema.statics.deserializeUser = function(obj, done){
    done(null, obj);
};

var adminlogin = mongoose.model('adminlogin', adminloginSchema);
module.exports = adminlogin;