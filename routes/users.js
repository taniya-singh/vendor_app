module.exports = function(app, express, passport) {
var router = express.Router();
var userObj = require('./../app/controllers/users/users.js');
	


	var router = express.Router();
	 var userObj = require('./../app/controllers/users/users.js');
	 router.get('/list',passport.authenticate('bearer', {session:true}), userObj.list);
	 router.post('/add', userObj.add);
	 router.post('/bulkUpdate', userObj.bulkUpdate);
<<<<<<< HEAD
	 router.post('/userlogin', passport.authenticate('userLogin'),userObj.userlogin);
	 router.post('/update_vendor_info',userObj.update_vendor_info);
	 router.post('/deleteUser', userObj.deleteUser);
	 router.post('/update_user_info',userObj.update_user_info);
     router.post('/faceBookLogin',userObj.faceBookLogin);
     router.post('/forgetpassword',userObj.forgetpassword);
     router.post('/reset_password',userObj.reset_password);
=======
	  router.post('/userlogin', passport.authenticate('userLogin'),userObj.userlogin);
	  router.post('/update_vendor_info',userObj.update_vendor_info);
	  router.post('/register', userObj.register);
	  router.post('/deleteUser', userObj.deleteUser);
	  router.get('/totalUser', userObj.totalUser);
	  

      router.post('/faceBookLogin',userObj.faceBookLogin);
      router.post('/forgetpassword',userObj.forgetpassword);
      router.post('/reset_password',userObj.reset_password);
      router.post('/place_order',order.place_order);

      //router.post('/userList',userObj.userList);

>>>>>>> fc3b5cafbcfe44e9c5a643e83bd70b65096e689d


	 app.use('/users', router);

}