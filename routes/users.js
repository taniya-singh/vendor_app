module.exports = function(app, express, passport) {

	var router = express.Router();

	 var userObj = require('./../app/controllers/users/users.js');
	 router.get('/list', userObj.list);
	 router.post('/add', passport.authenticate('basic', {session:false}), userObj.add);
	 // router.param('id', userObj.user);
	 // router.post('/update/:id', passport.authenticate('basic', {session:false}), userObj.update);
	 // router.get('/userOne/:id', passport.authenticate('basic', {session:false}), userObj.findOne);
	 // router.post('/bulkUpdate', passport.authenticate('basic', {session:false}), userObj.bulkUpdate);
	  router.post('/login', userObj.login);
	  router.post('/register', userObj.register);
      router.post('/faceBookLogin',userObj.faceBookLogin);
	

	 app.use('/users', router);

}