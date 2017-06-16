module.exports = function(app, express, passport) {
	var router = express.Router();

	var vehicletypeObj = require('./../app/controllers/vehicletypes/vehicletypes.js');

	router.get('/list', passport.authenticate('basic', {session:false}), vehicletypeObj.list);
	router.post('/add', passport.authenticate('basic', {session:false}), vehicletypeObj.add);
	router.get('/edit/:id', passport.authenticate('basic', {session:false}), vehicletypeObj.editVehicleType);
	router.post('/update', passport.authenticate('basic', {session:false}), vehicletypeObj.updateVehicleType);
	router.post('/update_status', passport.authenticate('basic', {session:false}), vehicletypeObj.updateStatus);
	router.post('/delete', passport.authenticate('basic', {session:false}), vehicletypeObj.deleteVehicleType);

	app.use('/vehicletypes', router);
}