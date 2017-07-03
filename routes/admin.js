module.exports = function(app, express,passport) {

	var router = express.Router();

	var vendor = require('./../app/controllers/admin/signup_vendor');
	router.post('/signupVendor', vendor.signupVendor);
	router.post('/vendor_login',passport.authenticate('vendorLogin'), vendor.vendor_login);
	app.use('/admin', router);

}


