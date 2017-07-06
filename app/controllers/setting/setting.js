var settingObj = require('./../../models/setting/setting.js');
var eduLevelObj = require('./../../models/education_level/education_level.js');
var userObj = require('./../../models/users/users.js');
var constantObj = require('./../../../constants.js');

// exports.saveSetting = function(req, res) {
// 	console.log(req.body);
// 	var saveObj = req.body;
// 	update(req.body.user_id,req.body._public);

// 	settingObj(saveObj).save(saveObj, function(err, data) {
// 		if (err) {
// 			outputJSON = {
// 				'status': 'failure',
// 				'messageId': 401,
// 				'message': "error in input"+err
// 			};
// 			res.status(200).jsonp(outputJSON)
// 		} else {
// 			outputJSON = {
// 				'status': 'success',
// 				'messageId': 200,
// 				'message': "Save successfully",
// 				'data': data
// 			};
// 			res.status(200).jsonp(outputJSON)
// 		}
// 	})
// }

function update(id,privacy){
	userObj.update({
		_id: id
	},{$set:{"_public":privacy}}, function(err, data) {
		if(err){
			console.log("at the time of updating privacy got error",err);
		}
		else{
			console.log("at the time of updating Success",data);
		}
	})
}

exports.findSetting = function(req, res) {
	if (req.body._id) {
		settingObj.findOne({
			user_id: req.body._id
		}).populate('education_level').exec(function(err, data) {
			if (err) {
				console.log(err);
				outputJSON = {
					'status': 'failure',
					'messageId': 203,
					'message': constantObj.messages.errorRetreivingData
				};
				res.status(200).jsonp(outputJSON);
			} else {
				var myarray = [];
				console.log("data",data);
				if(data!=null)
				{
					// eduLevelObj.find({}, function(eduerr, edudata) {
					// if (err) {
						
					// } else {
						// console.log("edudata.length",edudata.length);
						// console.log(edudata);
						// for(var i=0;i<edudata.length;i++){
						// 	var myobj = {};
						// 	myobj._id = edudata[i]._id;
						// 	myobj.name = edudata[i].name;
						// 	console.log("myobj",myobj);
						// 	myarray[i]= myobj
						//     console.log("myarray",myarray);
						// }
						// console.log("myarray",myarray);
						// data.education_type = myarray;
						// var obje = {};
						
						// obje.education_level = data.education_level;
						
						// obje._id = data._id;
						// obje.user_id = data.user_id;
						// obje.created = data.created;

						
						// obje.max_age = data.max_age;
						// obje.min_age = data.min_age;
						// obje.distance = data.distance;
						// obje._public = data._public;
						// obje.female = data.female;
						// obje.male = data.male;
						// obje.education_type = myarray;

						// console.log("obje",obje);
						res.status(200).jsonp({
							'status': 'success',
							'messageId': 200,
							'data': data
						});
				// 	}
				// })
				}
				else{
					res.status(200).jsonp({
							'status': 'success',
							'messageId': 200,
							'data': "No record Found"
						});
				}
				// var myobj = {};
				
				
			}
		})
	} else {
		res.status(200).jsonp({
			"status": 'faliure',
			"messageId": 401,
			"message": "please pass the required fields"
		})
	}
}

exports.updateSetting = function(req, res) {
	console.log(req.body);
	var _id = req.body.user_id;
	var details = {};
	details._id = _id;
	if(req.body._public == true || req.body._public==false){
		// console.log("privacy");
		update(req.body.user_id,req.body._public)
	}
	
	var detailsData = JSON.parse(JSON.stringify(req.body));
	// var allImages = {};
	delete detailsData.user_id;

	console.log("details._id",details._id);
	console.log("detailsData",detailsData);

	settingObj.update({
		user_id: details._id
	}, detailsData, function(err, data) {
		var messages = '';
		var errMessage = '';
		var status = '';
		console.log("data", data);
		console.log("err", err);
		if (err) {

			for (var errName in err.errors) {
				errMessage += err.errors[errName].message + "\n";
			}
			messages += errMessage;
			console.log(errMessage);
			status = '201';
			if (err.code == '11000') {
				messages += 'Something happen wrong';
			}
			var response = {
				"status": 'faliure',
				"messageId": 401,
				"message": "Please Enter valid information"
			};
			res.status(200).json(response);
		} else {
			if (data.nModified == 1) {
				var response = {
					"status": 'success',
					"messageId": 200,
					"message": "Data update successfully.",
					"data": data
				};
			} else {
				var response = {
					"status": 'faliure',
					"messageId": 200,
					"message": "Nothing is update .",
					"data": data
				};
			}

			res.status(200).jsonp(response);
		}
	})
}

exports.allEucationLevel = function(req,res){
	console.log("all education_level");
	eduLevelObj.find({}, function(err, data) {
		if (err) {
			outputJSON = {
				'status': 'failure',
				'messageId': 203,
				'message': constantObj.messages.errorRetreivingData
			};
			res.status(200).jsonp(outputJSON);
		} else {
			res.status(200).jsonp({
				'status': 'success',
				'messageId': 200,
				'data': data
			});
		}
	})
}
