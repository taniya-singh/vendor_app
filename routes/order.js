module.exports = function(app, express) {

	var router = express.Router();

	var order = require('./../app/controllers/order/order.js');
	  router.post('/place_order',order.place_order);
	  router.post('/list_order_for_customer',order.list_order_for_customer);
	  router.post('/add_to_cart',order.add_to_cart);
	  router.post('/view_cart_details',order.view_cart_details);
	  router.post('/update_pickup_status',order.update_pickup_status);





	app.use('/order', router);

}