module.exports = function(app, express, passport) {

	var router = express.Router();

	var settingObj = require('./../app/controllers/setting/setting.js');
	router.post('/findSetting',settingObj.findSetting);
    router.post('/updateSetting',  settingObj.updateSetting);
    router.get('/allEucationLevel',  settingObj.allEucationLevel);
	app.use('/setting', router);
}

