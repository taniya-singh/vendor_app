module.exports = function(app, express, passport) {

	var router = express.Router();

	var faqObj = require('./../app/controllers/FAQ/faq.js');
	router.get('/allfaq',faqObj.allfaq);
	router.post('/insertQuestionAnswer',faqObj.insertQuestionAnswer);
	router.post('/deleteAndQues',faqObj.deleteAndQues);
	app.use('/faq', router);
}

