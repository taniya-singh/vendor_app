
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var db = require('./db.js');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var md5 = require('md5');
var session = require('express-session');
var tokenService = require ('./app/services/tokenAuth');
var userTokenObj = require('./app/models/users/userTokens.js');

//var tmpObj = require('./app/models/tempotp/tempotps.js');


var adminLoginObj = require('./app/models/adminlogins/adminlogin.js');
var userObj = require('./app/models/users/users.js');
var itemsObj = require('./app/models/items/items.js');
var constantObj = require('./constants.js');
var vendor = require('./app/models/admin/signup_vendor.js');
var NodeGeocoder = require('node-geocoder');

var crypto = require('crypto');
var connect = require('connect');
var key = 'MySecretKey12345';
var iv = '1234567890123456';
var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);

/*var routes = require('./routes/index');
var users = require('./routes/users');*/

var app = express();
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json({limit: '50mb'}));

 


//API Security - Browser Authentication/Basic Authentication
//var users = [{username:'taxi', password:'application'}];
/*passport.use('basic',new BasicStrategy({}, function (username, password, done) {
    console.log(username, password) ; 
    findByUsername(username, function(err, user) {
      if (err) { return done(err); }
          if (!user) { return done(null, false); }
          if (user.password != password) { return done(null, false); }
          return done(null, user);
      });
  }
));*/
/*var gcm = require('android-gcm');
var apn = require("apn"), options, notification;
var path = require('path'),
    os = require('os'),fs = require('fs')
  , exec = require('child_process').exec
  , util = require('util')
  , Files = {};
  
  apnError = function(err)
  {
      console.log("APN Error:", err);
  } 
  options =
   {
      certFile: path.resolve('cert.pem'),
      keyFile: path.resolve('key.pem'),
      gateway : 'gateway.push.apple.com',
      errorCallback:apnError,
       debug : true,
       passphrase:"123456",
    };

//connection1 = new apn.Connection(options);    
 
notification = new apn.Notification();

var gcmObject = new gcm.AndroidGcm('AIzaSyC_5mrHRfwNhN-xHNJ4_tv1hXpsmPbZnss');    
      
  // create new message     
  //var message = new gcm.Message({   
  //    registration_ids: ['fo9-1Zge1KM:APA91bEQtnakBBqkvHEGCUwaMS70yqvEfTJvoVnhBG-ZnxMEf4huVQw1vLSoHfS0tBwJm_wPfTYmqCnh2E-c-YFGB-XozDqWVipU0lsmu6Nfy3Ba8pYE3RjIAM2pgmiW2qhAUgwfI_08'],   
  //    data: {   
  //    message: 'Hi Test'    
  //    }   
 // });   
  var message = new gcm.Message({
    collapseKey: 'demo',
    priority: 'high',
    contentAvailable: true,
    delayWhileIdle: true,
    timeToLive: 3,
    restrictedPackageName: "somePackageName",
    dryRun: true,
    data: {
        key1: 'message1',
        key2: 'message2'
    },
    notification: {
        title: "Hello, World",
        icon: "ic_launcher",
        body: "This is a notification that will be displayed ASAP."
    },
    registration_ids: ['fo9-1Zge1KM:APA91bEQtnakBBqkvHEGCUwaMS70yqvEfTJvoVnhBG-ZnxMEf4huVQw1vLSoHfS0tBwJm_wPfTYmqCnh2E-c-YFGB-XozDqWVipU0lsmu6Nfy3Ba8pYE3RjIAM2pgmiW2qhAUgwfI_08']   
      
});   
  // send the message     
  gcmObject.send(message, function(err, response) {   
      if (err) {    
    console.log(err);   
      }   
      console.log("response");
      console.log(response);
           
      if (response.success==1) {    
    console.log(response.results[0].message_id);    
      }   
          
          
      });*/ 
passport.use('bearer', new BearerStrategy(function(token, done) {
  //console.log("HERE IN THE CODE");
  tokenService.verifyToken(token, function(e, s) {
  if (e) {
  return done(e);
  }
  console.log(token)
  userTokenObj.findOne({
      token: token
    })
    .populate('admin')
    .populate('user')
    .exec(function(err, user) {
      //console.log("User is ", JSON.stringify(user));
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }

      if(user.admin==undefined){
        return done(null, user.user, {
          scope: 'all'
        });
      }
        return done(null, user.admin, {
          scope: 'all'
        });
  
     

    });
   });
}));





function findByUsername(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}




//admin login
var LocalStrategy = require('passport-local').Strategy;

  passport.use('adminLogin',new LocalStrategy(
    function(username, password, done) {
      
      adminLoginObj.findOne({username: username}, function(err, adminuser) {
       
        if(err) {
               return done(err);
        }
        
        if(!adminuser) {
           console.log("in adminuser");
          return done(null, false);
        }

        if(adminuser.password != password) {
              return done(null, false);
        }


        //returning specific data
        return done(null, {id: adminuser._id});

      });
    }
  ));

passport.serializeUser(adminLoginObj.serializeUser);
passport.deserializeUser(adminLoginObj.deserializeUser);

//vendor login
  passport.use('vendorLogin',new LocalStrategy(
    function(username, password, done) {

      vendor.findOne({vendor_email: username}, function(err, adminuser) {
        if(err) {

               return done(err,{"message":"Error"});
        }
        
        if(!adminuser) {
          return done(null, {"message":"Invalid username"});
        }

        if(adminuser.password != password) {
              return done(null, {"message":"Invalid password"});
        }
        //returning specific data
        return done(null, {id: adminuser._id,
                    vendor_name: adminuser.vendor_name,
                    vendor_email: adminuser.vendor_email,
                    phone_no: adminuser.phone_no,
                    password:adminuser,password,
                    vendor_address: adminuser.vendor_address,
                    pickup_time: adminuser.pickup_time,     
                    user_type: adminuser.user_type,            
                    longitude: adminuser.longitude,
                    latitude: adminuser.latitude
        });
      });
    }
  ));

passport.serializeUser(function(adminLoginObj,done){
  done(null,adminLoginObj)
})
passport.deserializeUser(function(adminLoginObj,done){ 
  done(null,adminLoginObj)
})


//userlogin
passport.use('userLogin',new LocalStrategy(
    function(username, password, done) {
      userObj.findOne({email: username}, function(err, user) {
        if(err) {
          console.log("errrr")
          return done(err,{"message":"Error"});
        }
        
        if(!user) {
          console.log("Invalid user")
          return done(null,{"message":"Invalid username"});
        }

        if(user.password != password) {
          console.log("invalid password")
          return done(null,{"message":"Invalid password"});
        }
        //returning specific data
        return done(null, {_id: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    phone_no: user.phone_no,
                    user_type: user.user_type,            
                    facebook_id:user.facebook_id,
                    loginType:user.loginType,
                    
        });
      });
    }
  ));

passport.serializeUser(function(userLoginObj,done){
  done(null,userLoginObj)
})
passport.deserializeUser(function(userLoginObj,done){ 
  done(null,userLoginObj)
})




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: 'keyboard-cat',
  cookie: { secure: true },
  proxy: true,
  resave: true,
  saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));


/*app.use('/', routes);
app.use('/users', users);*/


require('./routes/adminlogin')(app, express, passport);
require('./routes/users')(app, express, passport);
require('./routes/items')(app, express, passport);
require('./routes/admin')(app, express, passport);
require('./routes/vendor')(app, express, passport);
require('./routes/payment')(app, express, passport);




require('./routes/adminlogin')(app, express, passport);
require('./routes/likeAndDislike')(app, express,passport);
require('./routes/setting')(app, express,passport);
require('./routes/help')(app, express,passport);
require('./routes/packages')(app, express,passport);
//require('./routes/messages')(app, express, passport);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



// app.listen(4075,function(){
//   console.log("server is listening at port 4075");

// })

// var decrypted = decipher.update('14a0f68f2312944a57fdd20704ad9f72', 'hex', 'binary');
//           decrypted += decipher.final('binary');

        
module.exports = app;
