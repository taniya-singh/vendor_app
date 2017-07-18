module.exports = function(app, express, passport) {

	var router = express.Router();

	var adminLoginObj = require('./../app/controllers/adminlogins/adminlogins.js');
	router.post('/authenticate', passport.authenticate('adminLogin', {session:false}), adminLoginObj.authenticate);
	router.post('/logout', adminLoginObj.logout);
	//router.post('/forgot_password', adminLoginObj.forgotPassword);
	//router.post('/resetPassword', adminLoginObj.resetPassword);	
	router.post('/changePassword', adminLoginObj.changePassword);	
	router.post('/saveProfile', adminLoginObj.saveProfile);	
//	router.post('/commissionSetting',[passport.authenticate('bearer', {session:true})], adminLoginObj.commissionSetting);		
//	router.get('/getCommission',[passport.authenticate('bearer', {session:true})], adminLoginObj.getCommission);	
	router.post('/uploadProImg', adminLoginObj.uploadProImg);	
	router.param('adminId', adminLoginObj.admin);
	router.get('/adminInfo/:adminId', adminLoginObj.findOne);
	app.use('/adminlogin', router);

}
