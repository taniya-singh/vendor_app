module.exports = function(app , express, passport) {

	var router = express.Router();

	var answerObj = require('./../app/controllers/answer_type/answer_type.js');
	router.get('/list', passport.authenticate('basic', {session : true}), answerObj.list);
	// router.post('/addanswertype', passport.authenticate('basic', {session: true}), answerObj.addanswertype);
	app.use('/answer_type', router);	
}