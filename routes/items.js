module.exports = function(app, express) {

	var router = express.Router();

	var itemsObj = require('./../app/controllers/items/items.js');
	 router.post('/addit', itemsObj.additems);
	 router.post('/updateItem', itemsObj.updateItem);
	 router.get('/listItem', itemsObj.listItem);
	 router.get('/customerListItem',itemsObj.customerListItem);
	 router.post('/removeItem',itemsObj.removeItem);
	 router.post('/item_listing_for_user',itemsObj. item_listing_for_user);

	app.use('/items', router);

}