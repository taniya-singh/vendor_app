module.exports = function(app, express,passport) {





	var router = express.Router();

	var vendor = require('./../app/controllers/admin/signup_vendor');
	router.post('/signupVendor', vendor.signupVendor);
	router.post('/update_vendor_info2',vendor.update_vendor_info2);
	router.post('/vendor_login',passport.authenticate('vendorLogin'), vendor.vendor_login);
	router.post('/bulkUpdate', vendor.bulkUpdate);
	router.post('/deleteVendor', vendor.deleteVendor);
    router.post('/vendorList', vendor.vendorList);
    router.post('/updateVendordata', vendor.updateVendordata);
    router.post('/getCurrentVendorData', vendor.getCurrentVendorData);
 	router.get('/totalSales', vendor.totalSales);
    router.get('/totalVendor', vendor.totalVendor);
    router.get('/totalRevenue', vendor.totalRevenue);
    router.post('/saleData', vendor.saleData);
    //router.post('/revenueData', vendor.revenueData);
    router.post('/add_device_info', vendor.add_device_info);

      

    

	app.use('/admin', router);

}


