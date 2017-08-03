var QB = require('quickblox');
exports.registerUserFromWeb = function(data, cb) {
	console.log("inside quickblox");
	var CREDENTIALS = {
		appId: 52750,
		authKey: 'YgW6L7nBnKPDX7q',
		authSecret: 'xykEbOyrTQwSffK'
	};

	QB.init(CREDENTIALS.appId, CREDENTIALS.authKey, CREDENTIALS.authSecret);

	var sessionToken = '1b785b603a9ae88d9dfbd1fc0cca0335086927f1';
	var appId = 52750;

	QB.init(sessionToken, appId);

	QB.createSession(function(err, result) {
		console.log('Session create callback', err, result);
		if (err) {

		} else {
			if (data.first_name && data.last_name) {
				var fullName = data.first_name + " " + data.last_name;
			} else {
				var fullName = data.first_name;
			}
			if (data.facebook_id) {
				var params = {
					'login': data.facebook_id,
					'password': "11111111",
					full_name: fullName
				};
			} else {
				var params = {
					'login': data.email,
					'password': "11111111",
					full_name: fullName
				};
			}
			console.log("params", params);

			QB.users.create(params, function(err, user) {
				var response = {};
				if (user) {
					console.log("user at the time of signup", user);
					// response = user;
					cb(null, user);
				} else {
					console.log("err at the time of signup", err);
					response = err;
					cb(err, null);
				}
			});
		}
	});
}


exports.signInQuickBlox = function(email, password, cb) {
	console.log("inside quickblox");
	var CREDENTIALS = {
		appId: 52750,
		authKey: 'YgW6L7nBnKPDX7q',
		authSecret: 'xykEbOyrTQwSffK'
	};

	QB.init(CREDENTIALS.appId, CREDENTIALS.authKey, CREDENTIALS.authSecret);

	var sessionToken = '1b785b603a9ae88d9dfbd1fc0cca0335086927f1';
	var appId = 52750;

	QB.init(sessionToken, appId);

	QB.createSession(function(err, result) {
		console.log('Session create callback', err, result);
		if (err) {

		} else {
			var params = {
				'login': email,
				'password': "11111111"
			};

			QB.login(params, function(err, user) {
				if (user) {
					console.log("success", user);
					// var response = user;
					cb(null, user);
				} else {
					console.log("err", err);
					// var response = err;
					cb(err, null);
				}
			});
		}
	});
}

exports.deleteUser = function(email, quickBloxId, callbackReturn) {

	console.log("inside quickblox");
	var CREDENTIALS = {
		appId: 52750,
		authKey: 'YgW6L7nBnKPDX7q',
		authSecret: 'xykEbOyrTQwSffK'
	};

	QB.init(CREDENTIALS.appId, CREDENTIALS.authKey, CREDENTIALS.authSecret);

	var sessionToken = '1b785b603a9ae88d9dfbd1fc0cca0335086927f1';
	var appId = 52750;

	QB.init(sessionToken, appId);


	QB.createSession(function(err, result) {
		console.log('Session create callback', err, result);
		if (err) {

		} else {
			var token = result.token;
			console.log("token", token);

			console.log("quickBloxId", quickBloxId);
			var user_id = parseInt(quickBloxId);
			console.log("email", email);

			var params = {
				'login': email,
				'password': "11111111"
			};

			QB.login(params, function(err, user) {
				if (user) {
					console.log("success", user);
					QB.users.delete(user_id, function(errDel, userDel) {
						if (errDel) {
							console.log('delError: ' + JSON.stringify(errDel));
							callbackReturn(errDel, null);
						} else {
							console.log('user: ' + JSON.stringify(userDel));
							callbackReturn(null, userDel);
						}
					});
				} else {
					console.log("err", err);
				}
			});
		}
	})
}