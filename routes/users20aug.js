module.exports = function(app, express, passport) {

	var router = express.Router();

	var userObj = require('./../app/controllers/users/users.js');
	router.post('/authenticate', passport.authenticate('users', {session:false}), userObj.authenticate);
	router.post('/forgot_password', userObj.forgotPassword);
	router.get('/list', passport.authenticate('basic', {session:false}), userObj.list);
	router.post('/add', userObj.add);
	router.param('id', userObj.user);
	router.post('/update/:id', userObj.update);
	router.get('/userOne/:id', passport.authenticate('basic', {session:false}), userObj.findOne);
	 router.post('/bulkUpdate', passport.authenticate('basic', {session:false}), userObj.bulkUpdate);

	app.use('/users', router);

}
