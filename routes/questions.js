module.exports = function(app, express, passport) {

	var router = express.Router();

	var questionObj = require('./../app/controllers/questions/questions.js');

	router.post('/add', passport.authenticate('basic', {session : false}), questionObj.add);
	router.param('questionId', questionObj.question);
	router.post('/update/:questionId', passport.authenticate('basic', {session:false}), questionObj.update);
	router.get('/question/:questionId', passport.authenticate('basic', {session:false}), questionObj.findOne);
	router.post('/bulkUpdate', passport.authenticate('basic', {session:false}), questionObj.bulkUpdate);
	router.post('/getanswerlist', passport.authenticate('basic', {session: false}), questionObj.getanswerlist);
	app.use('/questions', router);
}