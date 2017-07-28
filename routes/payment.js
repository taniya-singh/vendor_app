module.exports = function(app, express) {

	var router = express.Router();

	var pay = require('./../app/controllers/payment/payment.js');
	 router.post('/addcustomer', pay.addcustomer);
	 router.post('/retreive_customer', pay.retreive_customer);
	 router.post('/list_all_customers', pay.list_all_customers);
	 router.post('/pay', pay.pay);
	 router.post('/retrieve_balance', pay.retrieve_balance);
	 router.post('/add_new_card', pay.add_new_card);
	 router.post('/list_all_cards', pay.list_all_cards);
	 router.post('/link_card', pay.link_card);
	 


	app.use('/payment', router);

}

