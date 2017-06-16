module.exports = function(app, express, passport) {
	var router = express.Router();
	var permissionObj = require('./../app/controllers/permissions/permissions.js');
	router.get('/list', passport.authenticate('basic', {session:false}), permissionObj.list);
	router.post('/create', passport.authenticate('basic', {session:false}), permissionObj.create);
	router.param('permissionId', permissionObj.permission);
	router.post('/update/:permissionId', passport.authenticate('basic', {session:false}), permissionObj.update);
	router.get('/permission/:permissionId', passport.authenticate('basic', {session:false}), permissionObj.findOne);
	router.post('/bulkUpdate', passport.authenticate('basic', {session:false}), permissionObj.bulkUpdate);
	app.use('/permissions', router);

}