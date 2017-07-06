module.exports = function(app, express, passport) {
	var router = express.Router();
	var packageObj = require('./../app/controllers/packages/packages.js');

 	router.post('/add', packageObj.add);
 	router.post('/list', packageObj.list);
 	router.get('/getdetail/:id', packageObj.getdetail);
 	router.post('/updatePackage', packageObj.updatePackage);
 	router.get('/deletePackage/:id', packageObj.deletePackage);
 	router.post('/bulkUpdate',  [passport.authenticate('bearer', {session:true})], packageObj.bulkUpdate);
	
	
	app.use('/package', router);
}

