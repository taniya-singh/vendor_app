module.exports = function(app, express, passport) {
	var router = express.Router();

	var categoryObj = require('./../app/controllers/categories/categories.js');

	router.post('/add', passport.authenticate('basic', {session:true}), categoryObj.add);
	router.param('categoryId', categoryObj.category);
	router.get('/allQuestions', categoryObj.allQuestions);
	router.get('/list', passport.authenticate('basic', {session:true}), categoryObj.list);
	router.get('/list/:questionnaireId', passport.authenticate('basic', {session:true}), categoryObj.list)
	router.post('/update/:categoryId', passport.authenticate('basic', {session:false}), categoryObj.update);
	router.get('/categories/:categoryId', passport.authenticate('basic', {session:false}), categoryObj.findOne);
	router.post('/bulkUpdate', passport.authenticate('basic', {session:false}), categoryObj.bulkUpdate);
	router.get('/findOne/:categoryId', passport.authenticate('basic', {session:false}), categoryObj.findOne);
	app.use('/categories', router);
}