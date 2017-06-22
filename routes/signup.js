module.exports = function(app, express) {

	var router = express.Router();

	var User = require('./../app/controllers/signup/signup_controller.js');
	router.post('/addUser',User.addUser);
	app.use('/signup', router);

}