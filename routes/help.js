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
	// router.get('/aboutUs',helpBlock.aboutUs);
	// router.get('/termsCondition',helpBlock.termsCondition);
	router.get('/page/:indentifier',helpBlock.page);
	// router.post('/forgot_password', adminLoginObj.forgot_password);
	// router.post('/updateInformation', passport.authenticate('bearer', {
	// 	session: true
	// }), adminLoginObj.updateInformation);
	// router.get('/loginUserDetails', passport.authenticate('bearer', {
	// 	session: true
	// }), adminLoginObj.loginUserDetails);
	// router.post('/registration', UserLogin.registration);
	// router.post('/resetPasswordAdmin', adminLoginObj.resetPasswordAdmin);
	app.use('/help', router);
}


