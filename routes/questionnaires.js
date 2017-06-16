module.exports = function(app, express, passport) {

	var router = express.Router();

	var questionnaireObj = require('./../app/controllers/questionnaires/questionnaire.js');
	// router.get('/listquestionnaire', passport.authenticate('basic', {session:false}), questionnaireObj.listquestionnaire);
	// router.post('/addquestionnaire', passport.authenticate('basic', {session:false}), questionnaireObj.addquestionnaire);
	// router.get('/editquestionnaire/:id', passport.authenticate('basic', {session:false}), questionnaireObj.editquestionnaire);
	// router.post('/updatequestionnaire', passport.authenticate('basic', {session: false}), questionnaireObj.updatequestionnaire);
	// router.post('/removequestionnaire', passport.authenticate('basic', {session:false}), questionnaireObj.removequestionnaire);
	// router.post('/updateStatus', passport.authenticate('basic', {session:false}), questionnaireObj.updateStatus);

	router.get('/list', passport.authenticate('basic', {session:false}), questionnaireObj.list);
	router.post('/add', passport.authenticate('basic', {session:false}), questionnaireObj.add);
	router.param('questionnarieId', questionnaireObj.questionnaire);
	router.post('/update/:questionnarieId', passport.authenticate('basic', {session:false}), questionnaireObj.update);
	router.get('/questionnaireOne/:questionnarieId', passport.authenticate('basic', {session:false}), questionnaireObj.findOne);
	router.post('/bulkUpdate', passport.authenticate('basic', {session:false}), questionnaireObj.bulkUpdate);	
	app.use('/questionnaire', router);

}