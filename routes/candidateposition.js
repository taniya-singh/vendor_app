module.exports = function(app, express, passport) {

	var router = express.Router();

	var candidatepositionObj = require('./../app/controllers/candidateposition/candidateposition.js');
	router.post('/addcandidateposition', passport.authenticate('basic', {session: true}), candidatepositionObj.addcandidateposition);
	app.use('/candidateposition', router);
}