module.exports = function(app, express, passport) {

	var router = express.Router();

	var helpBlock = require('./../app/controllers/helpBlock/helpBlock.js');
	router.post('/updateHelpBlock', passport.authenticate('bearer', {
		session: true
	}), helpBlock.updateHelpBlock);
	router.get('/getHelpBlockListing',helpBlock.getHelpBlockListing);
	router.post('/getHelpInformation',helpBlock.getHelpInformation);
	router.post('/insertHelpInformation',helpBlock.insertHelpInformation);
	router.post('/deleteHelp',helpBlock.deleteHelp);
	router.get('/page/:indentifier',helpBlock.page);
	app.use('/help', router);
}


