module.exports = function(app, express, passport) {
var router = express.Router();
var vendor = require('./../app/controllers/vendor/vendor.js');
	

	router.post('/vendorList', vendor.vendorList);
	router.post('/items_added_by_vendor', vendor.items_added_by_vendor);

app.use('/vendor', router);
}