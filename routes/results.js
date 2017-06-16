module.exports = function(app, express, passport) {

	var router = express.Router();

	var resultObj = require('./../app/controllers/results/results.js');
	router.post('/addresult', passport.authenticate('basic', {session:false}), resultObj.addresult);
	app.use('/results', router);

}