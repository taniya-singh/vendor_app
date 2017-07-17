module.exports = function(app, express) {

	var router = express.Router();

	var pay = require('./../app/controllers/payment/payment.js');
	 router.post('/addcustomer', pay.addcustomer);
	 router.post('/retreive_customer', pay.retreive_customer);
	 router.post('/list_all_customers', pay.list_all_customers);
	 router.post('/create_customer_on_stripe', pay.create_customer_on_stripe);
	 router.post('/retrieve_balance', pay.retrieve_balance);



	 

	app.use('/payment', router);

}

