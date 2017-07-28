module.exports = function(app, express, passport) {
var router = express.Router();
var userObj = require('./../app/controllers/users/users.js');
	


	var router = express.Router();
	 var userObj = require('./../app/controllers/users/users.js');
	 router.get('/list', userObj.list);
	 router.post('/add', userObj.add);
	 router.post('/bulkUpdate', userObj.bulkUpdate);
	 router.post('/userlogin', passport.authenticate('userLogin'),userObj.userlogin);
	 router.post('/update_vendor_info',userObj.update_vendor_info);
	 router.post('/deleteUser', userObj.deleteUser);
	 router.post('/update_user_info',userObj.update_user_info);
     router.post('/faceBookLogin',userObj.faceBookLogin);
     router.post('/forgetpassword',userObj.forgetpassword);
     router.post('/reset_password',userObj.reset_password);
	 router.get('/totalUser', userObj.totalUser);
	 router.post('/customer_orderlist', userObj.customer_orderlist);


  
	 app.use('/users', router);

}
