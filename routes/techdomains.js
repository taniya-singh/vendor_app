module.exports = function(app, express, passport) {

	var router = express.Router();

	var techdomainObj = require('./../app/controllers/techdomain/techdomain.js');
	router.post('/addtechdomain', passport.authenticate('basic', {session: true}), techdomainObj.addtechdomain);

	app.use('/techdomains', router);

}