module.exports = function(app, express,passport) {

	var router = express.Router();

	var admin = require('./../app/controllers/admin/signup_vendor.js');
	router.post('/signupVendor', admin.signupVendor);
	router.post('/update_vendor_info2', admin.update_vendor_info2);
	router.post('/vendor_login',passport.authenticate('vendorLogin'), admin.vendor_login);
	router.post('/vendorList', admin.vendorList);

	app.use('/admin', router);

}


