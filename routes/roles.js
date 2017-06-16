module.exports = function(app, express, passport) {
	var router = express.Router();
	var roleObj = require('./../app/controllers/roles/roles.js');
	router.get('/list', passport.authenticate('basic', {session:false}), roleObj.list);
	router.post('/add', passport.authenticate('basic', {session:false}), roleObj.add);
	router.param('roleId', roleObj.role);
	router.post('/update/:roleId', passport.authenticate('basic', {session:false}), roleObj.update);
	router.get('/role/:roleId', passport.authenticate('basic', {session:false}), roleObj.findOne);
	router.post('/bulkUpdate', passport.authenticate('basic', {session:false}), roleObj.bulkUpdate);

	app.use('/roles', router);

}