module.exports = function(app, express, passport) {
var router = express.Router();
var vendorDbObj = require('./../app/controllers/vendor/vendor.js');
	router.post('/vendorList', vendorDbObj.vendorList);
	router.post('/add', vendorDbObj.add);

app.use('/vendor', router);
}