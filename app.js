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
var app = express();
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json({limit: '100mb'}));

 passport.use('bearer', new BearerStrategy(function(token, done) {
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
      password = JSON.parse(JSON.stringify(password));
      password = md5(password);
      console.log("inside admin login")
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
         //generate a token here and return 
        var authToken = tokenService.issueToken({sid: adminuser});
        // save token to db  ; 
        var tokenObj = new userTokenObj({"admin":adminuser._id,"token": authToken});

        tokenObj.save(function(e,s){});
        // console.log("Type is " , adminuser.type);
        //return permission from here .
        return done(null, {id: adminuser._id,username:adminuser.username,firstname:adminuser.firstname,lastname:adminuser.lastname,token: authToken,image:adminuser.prof_image });

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
                    password:adminuser.password,
                    vendor_address: adminuser.vendor_address,
                    pickup_time:adminuser.pickup_time,
		                pickup_time1: adminuser.pickup_time1,
                    pickup_time2: adminuser.pickup_time2,      
                    user_type: adminuser.user_type,            
                    longitude: adminuser.longitude,
                    latitude: adminuser.latitude,
                    Country: adminuser.Country,
                    Currency: adminuser.Currency,
                    Routing_Number: adminuser.Routing_Number,
                    Account_Number: adminuser.Account_Number,
                    Account_Holder_Name: adminuser.Account_Holder_Name,
                    Account_Holder_Type: adminuser.Account_Holder_Type

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
                    password:user.password,
                    phone_no: user.phone_no,
                    user_type: user.user_type,            
                    facebook_id:user.facebook_id,
                    loginType:user.loginType,
                    card_details:user.card_details,
                    customer_stripe_id:user.customer_stripe_id,
                    default_card_linked:user.default_card_linked,
                    //stripe_card_ids:user.stripe_card_ids,
                    enable:user.enable,
                    user_name:user.user_name,
                    created_date:user.created_date,
                    last4:user.last4,
                    latitude:user.latitude,
                    longitude:user.longitude                  
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

require('./routes/adminlogin')(app, express, passport);
require('./routes/users')(app, express, passport);
require('./routes/items')(app, express, passport);
require('./routes/admin')(app, express, passport);
require('./routes/vendor')(app, express, passport);
require('./routes/payment')(app, express, passport);
require('./routes/order')(app, express, passport);
require('./routes/faq')(app, express, passport);
require('./routes/eManagement')(app, express,passport);
require('./routes/common')(app, express,passport);
require('./routes/adminlogin')(app, express, passport);
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


if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var decrypted = decipher.update('14a0f68f2312944a57fdd20704ad9f72', 'hex', 'binary');
          decrypted += decipher.final('binary');

        
module.exports = app;
