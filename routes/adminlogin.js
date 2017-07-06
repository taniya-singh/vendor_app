module.exports = function(app, express, passport) {

	var router = express.Router();

	var adminLoginObj = require('./../app/controllers/adminlogins/adminlogins.js');
	router.post('/authenticate', passport.authenticate('adminLogin', {session:false}), adminLoginObj.authenticate);
	router.post('/logout', adminLoginObj.logout);
	router.post('/forgot_password', adminLoginObj.forgotPassword);
	router.post('/resetPassword', adminLoginObj.resetPassword);	
	router.post('/changePassword', [passport.authenticate('bearer', {session:true})], adminLoginObj.changePassword);	
	router.post('/saveProfile',[passport.authenticate('bearer', {session:true})], adminLoginObj.saveProfile);	
	router.post('/commissionSetting',[passport.authenticate('bearer', {session:true})], adminLoginObj.commissionSetting);		
	router.get('/getCommission',[passport.authenticate('bearer', {session:true})], adminLoginObj.getCommission);	
	router.post('/uploadProImg',[passport.authenticate('bearer', {session:true})], adminLoginObj.uploadProImg);	
	router.param('adminId', adminLoginObj.admin);
	router.get('/adminInfo/:adminId',[passport.authenticate('bearer', {session:true})], adminLoginObj.findOne);
	app.use('/adminlogin', router);

}