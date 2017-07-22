module.exports = function(app, express) {

	var router = express.Router();

	var common = require('./../app/controllers/common/common.js');
	 router.post('/notify', common.notify);
	

	app.use('/common', router);

}