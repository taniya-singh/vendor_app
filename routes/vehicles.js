module.exports = function(app, express, passport) {

	var router = express.Router();

	var vehicleObj = require('./../app/controllers/vehicles/vehicles.js');

	router.get('/list', passport.authenticate('basic', {session:false}), vehicleObj.list);
	app.use('/vehicles', router);
}