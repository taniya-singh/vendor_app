module.exports = function(app, express, passport) {

	var router = express.Router();

	var eManagementObj = require('./../app/controllers/eManagement/eManagement.js');
	router.get('/getEmail', passport.authenticate('bearer', {
		session: true
	}), eManagementObj.getEmail);
	router.post('/sentEmailNewsLetter',  passport.authenticate('bearer', {
		session: true
	}),eManagementObj.sentEmailNewsLetter);
	app.use('/eManagement', router);
}

