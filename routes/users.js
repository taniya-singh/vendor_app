module.exports = function(app, express, passport) {
var router = express.Router();
var userObj = require('./../app/controllers/users/users.js');
	


	var router = express.Router();
	var order = require('./../app/controllers/users/users.js');
	 var userObj = require('./../app/controllers/users/users.js');
	 router.post('/list', userObj.list);
	 router.post('/add', userObj.add);

	 
	 router.post('/bulkUpdate', userObj.bulkUpdate);
	  router.post('/userlogin', passport.authenticate('userLogin'),userObj.userlogin);
	  router.post('/update_vendor_info',userObj.update_vendor_info);
	  router.post('/register', userObj.register);
	  router.post('/deleteUser', userObj.deleteUser);
	  router.get('/totalUser', userObj.totalUser);
	  

      router.post('/faceBookLogin',userObj.faceBookLogin);
      router.post('/forgetpassword',userObj.forgetpassword);
      router.post('/reset_password',userObj.reset_password);
      router.post('/place_order',order.place_order);

      



	 app.use('/users', router);

}