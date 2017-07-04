
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

var adminLoginObj = require('./app/models/adminlogins/adminlogin.js');
var constantObj = require('./constants.js');
var vendor = require('./app/models/admin/signup_vendor.js');
var userObj = require('./app/models/users/users.js');
var NodeGeocoder = require('node-geocoder');
/*var routes = require('./routes/index');
var users = require('./routes/users');*/

var app = express();
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());


//API Security - Browser Authentication/Basic Authentication
var users = [{username:'taxi', password:'application'}];
passport.use('basic',new BasicStrategy({}, function (username, password, done) {

    findByUsername(username, function(err, user) {
      if (err) { return done(err); }
          if (!user) { return done(null, false); }
          if (user.password != password) { return done(null, false); }
          return done(null, user);
      });
  }
));


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
      console.log("inside user passport");    
      userObj.findOne({email: username}, function(err, user) {
        if(err) {
          console.log("errrr")
               return done(err,{"message":"Error"});
        }
        
        if(!user) {
console.log("ggg")

          return done(null, {"message":"Invalid username"});
        }

        if(user.password != password) {
          console.log("t6tt")
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
                    loginType:user.loginType
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

 app.use(bodyParser.json({limit: '50mb'}));



app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/*app.use('/', routes);
app.use('/users', users);*/

require('./routes/adminlogin')(app, express, passport);
require('./routes/users')(app, express, passport);
require('./routes/items')(app, express, passport);
require('./routes/admin')(app, express, passport);


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

module.exports = app;
