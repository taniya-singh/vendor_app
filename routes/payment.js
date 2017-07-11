module.exports = function(app, express) {

	var router = express.Router();

	var pay = require('./../app/controllers/payment/payment.js');
	 router.post('/addcustomer', pay.addcustomer);
	 

	app.use('/payment', router);

}