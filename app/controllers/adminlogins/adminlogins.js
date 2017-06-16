var adminLoginObj = require('./../../models/adminlogins/adminlogin.js');
var userObj = require('./../../models/users/users.js');
var constantObj = require('./../../../constants.js');
var nodemailer = require('nodemailer');
var qs = require('querystring');
var request = require('request');
var jwt = require('jwt-simple');
var moment = require('moment');

//authenticate
exports.authenticate = function(req, res) {
	res.jsonp({'status':'success', 'messageId':200, 'message':'User logged in successfully'});
}

//forgot password
exports.forgotPassword = function(req, res) {

	var outputJSON = "";


	adminLoginObj.findOne({username:req.body.username}, function(err, data) {

		if(err) {
			outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
		}
		else {
			
			if(data) {

				var transporter = nodemailer.createTransport({
				    service: constantObj.gmailSMTPCredentials.service,
				    auth: {
				        user: constantObj.gmailSMTPCredentials.username,
				        pass: constantObj.gmailSMTPCredentials.password
				    }
				});				

				transporter.sendMail({
				    from: 'anurags@smartdatainc.net',
				    to: data.email,
				    subject: 'Your Password',
				    text: data.password
				});

				outputJSON = {'status':'success', 'messageId':200, 'message': constantObj.messages.successSendingForgotPasswordEmail}
			}
			else {
				outputJSON = {'status':'failure', 'messageId':203, 'message': constantObj.messages.errorRetreivingData};
			}

		}

		res.jsonp(outputJSON);

	});
}

/*
 |--------------------------------------------------------------------------
 | Generate JSON Web Token
 |--------------------------------------------------------------------------
 */
function createJWT(user) {
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, constantObj.facebookCredentials.token_secret);
}

//facebook login
exports.facebookLogin = function(req, res) {
	var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
	var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
	var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
	var params = {
	    code: req.body.code,
	    client_id: req.body.clientId,
	    client_secret: constantObj.facebookCredentials.secret,
	    redirect_uri: req.body.redirectUri
  	};

  	// Step 1. Exchange authorization code for access token
  	request.get({url: accessTokenUrl, qs: params, json:true}, function(err , response , accessToken) {

  		
  		 if (response.statusCode !== 200) {
      			return res.status(500).send({ message: accessToken.error.message });
    		}

    		  // Step 2. Retrieve profile information about the current user.

    		  request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {

    		  	 if (response.statusCode !== 200) {
			        return res.status(500).send({ message: profile.error.message });
			}
			
			//Create new user account or return an existing one
			userObj.findOne({facebook: profile.id}, function(err, existingUser) {

				console.log("existing user =" , existingUser);

				if(existingUser) {
					var token = createJWT(existingUser);
					res.jsonp({token: token, displayName:existingUser.displayName});
				}
				else {
					//var user = new User();
					var user = {};

					user.facebook = profile.id;
					user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
					user.displayName = profile.name;
					userObj(user).save(function() {
						var token = createJWT(user);
						res.jsonp({token : token, displayName : profile.name});	
					});
				}
				
			});
    		  });

  	});

}

//Twitter Login

exports.twitterLogin = function(req, res) {
	var requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
  	var accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
  	var profileUrl = 'https://api.twitter.com/1.1/users/show.json?screen_name=';

  	 // Part 1 of 2: Initial request from Satellizer.
  	 if(!req.body.oauth_token || !req.body.oauth_verifier) {

  	 	var requestTokenOauth = {
  	 		consumer_key : constantObj.twitterCredentials.consumer_key,
  	 		consumer_secret : constantObj.twitterCredentials.consumer_secret,
  	 		callback : req.body.redirectUri
  	 	};

  	 	//Step1: Obtain request token for authorization popup
  	 	request.post({url : requestTokenUrl, oauth : requestTokenOauth}, function(err, response, body) {

  	 		var oauthToken = qs.parse(body);

  	 		//Step2: Send Oauth token back to open the authorization screen
  	 		res.send(oauthToken);
  	 	});
  	 }
  	 else {
  	 	//Part2 of 2: Second request after Authorize app is clicked
  	 	var accessTokenOauth = {
		      consumer_key: constantObj.twitterCredentials.consumer_key,
		      consumer_secret: constantObj.twitterCredentials.consumer_secret,
		      token: req.body.oauth_token,
		      verifier: req.body.oauth_verifier
		    };

		    //Step 3: exchange oauth token and oauth verifier for accessToken
		    request.post({url : accessTokenUrl, oauth : accessTokenOauth }, function(err, response, accessToken) {
		    	 accessToken = qs.parse(accessToken);

		      var profileOauth = {
		        consumer_key: constantObj.twitterCredentials.consumer_key,
		        consumer_secret: constantObj.twitterCredentials.consumer_secret,
		        oauth_token: accessToken.oauth_token
		      };

		      //Step 4: Retrieve profile information about the current user
		      request.get({
		      	url : profileUrl + accessToken.screen_name,
		      	oauth : profileOauth,
		      	json : true
		      }, function(err, response, profile) {


		      	//Step5: Create new user account or return existing one

		      	userObj.findOne({twitter: profile.id}, function(err, existingUser) {

		      		if(existingUser) {
		      			return res.jsonp({token : createJWT(existingUser), displayName : existingUser.displayName});
		      		}
		      		else {
		      			var twitterUser = {};
		      			twitterUser.twitter = profile.id,
		      			twitterUser.displayName = profile.name,
		      			twitterUser.picture = profile.profile_image_url.replace('_normal', '');
		      			userObj(twitterUser).save(function() {
		      				res.jsonp({ token: createJWT(twitterUser) , displayName : profile.name});
				            });
		      		}

		      	});

		      });

		    });

  	 }//else

}

//google login

exports.googeLogin = function(req, res) {
	var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
	var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
	var params = {
	    code: req.body.code,
	    client_id: req.body.clientId,
	    client_secret: constantObj.googleCredentials.client_secret_key,
	    redirect_uri: req.body.redirectUri,
	    grant_type: 'authorization_code'
	  };


	  //Step 1: Exchange authorization code for access token
	  request.post(accessTokenUrl, {json : true, form : params}, function(err, response, token) {
	  	var access_token = token.access_token;
	  	var headers = {Authorization : 'Bearer ' + access_token};

	  	//Step2 : Retreive profile information about current user
	  	request.get({url : peopleApiUrl, headers : headers, json : true}, function (err, response, profile) {

	  		if(profile.error) {
	  			return res.status(500).send({message : profile.error.message});
	  		}
	  		else {
	  			//Create a new user account or return an existing one.

	  			userObj.findOne({google : profile.sub}, function(err , existingUser) {
	  				if(existingUser) {
	  					return res.send({token : createJWT(existingUser), displayName: existingUser.name});
	  				}

	  				var googleUser = {};
	  				googleUser.google = profile.sub;
	  				googleUser.picture = profile.picture.replace('sz=50', 'sz=200');
          					googleUser.displayName = profile.name;
          					userObj(googleUser).save(function(err) {
				            var token = createJWT(googleUser);
				            res.send({ token: token, displayName : profile.name });
				          });


	  			});
	  		}


	  	});

	  });

}