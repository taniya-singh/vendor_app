var express    = require('express');
var router     = express.Router();
var bodyParser = require('body-parser');
var passport   = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var multer     = require('multer');
var mailer     = require("nodemailer");
var crypto     = require('crypto');
var fs         = require('fs');
var cors         = require('cors');

router.use('*',cors());

var pathprofilephoto = process.cwd()+'/public/images/profile/';

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd()+'/public/images/profile/')
  },
  filename: function (req, file, cb) {
    cb(null,  Date.now() + '.png')
  }
})
 
var upload = multer({ storage: storage });
  
var users = require('./../app/models/users/users');
var adminpanel = require('./../app/models/adminlogins/adminlogin');
//var nodeemail = require('./../common_modules/nodeemail');
//var hauth = require('./../common_modules/hauth');

//app.use(cors());

function supportCrossOriginScript(req, res, next) {
    console.log(req.method);
    console.log(req.body);
   console.log(req.headers);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", true);
    next();
}


/* To Login and Passport authentication Module*/
// Note : passReqToCallback: true for taking request parameters 
passport.use(new LocalStrategy({passReqToCallback: true},function(req,username,password,done)
  {
    var passinfo = new users(req.body);
    users.findOne({ email: req.body.username }, function (err, docs)
    {
       
        var validpassword = false;
        if (!err && docs != null) {
        var validpassword = passinfo.validatePassword(req.body.password,docs.password); 
        }
        
        if (err || docs == "" || docs == null || !validpassword) {
            var flag = 0;
            var userid = "";
            var username1 = "";
            var usertype = "";
            var userdata = "";
            var userstatus = "";
            var usertrash = "";
            var roles = "";
            console.log("No");
        }
        else
        {
            var flag = 1;
            var userid = docs._id;
            var username1 = docs.first_name;
            var usertype = docs.role;
            var userdata = docs;
            var userstatus = docs.status;
            var usertrash = docs.trash;
            var roles = docs.assign_role;
            console.log("Yes");
        }
        
        return done(null, { username:username1, userid:userid, flag:flag, usertype:usertype, userdata:userdata, userstatus:userstatus,roles:roles });
      
    });
      
  }
));


router.get('/islogin',supportCrossOriginScript,function(req,res,next)
{
     console.log(req.session);
    if (!req.session.userid) {
        res.json({code:101,slogan:"Session expired! Login Again",status:0});
    }
    else
    {
        res.json({slogan:"Success",code:200,status:1}); 
    }
    
});

router.get('/login/:username/:password',supportCrossOriginScript,function(req,res,next)
{
    console.log(req.body);
    res.json({code:101,errmsg:"Incorrect Username/Password"});
    
});

router.post('/login',supportCrossOriginScript, passport.authenticate('local'),function(req,res)
{
  console.log("herer");
  console.log(req.method);
  //console.log(req.headers);
  console.log(req.body);
    if (req.user.flag == 0) {
        res.json({code:101,errmsg:"Incorrect Username/Password"});
    }
    else
    {
      if (req.user.userstatus == 0) {
      res.json({code:102,errmsg:"Inactive User"});   
      }
      else
      {
        var locationupdater = new nodeemail();
        locationupdater.updateLocation(req,req.user.userid,function(result)
        {
            req.session.username = req.user.username;
            req.session.userid   = req.user.userid;
            req.session.usertype = req.user.usertype;
            res.json({code:200,'username':req.session.username,'session_id':req.session.userid,'usertype':req.session.usertype,profiledata:req.user.userdata});   
                                  
        });
      }
    }
});

router.post('/loginbus',supportCrossOriginScript,passport.authenticate('local'),function(req,res,next)
{
    if (req.user.flag == 0) {
        res.json({code:101,errmsg:"Incorrect Username/Password"});
    }
    else
    {
      if (req.user.userstatus == 0) {
      res.json({code:102,errmsg:"Inactive User"});   
      }
      else
      {
      req.session.username = req.user.username;
      req.session.userid   = req.user.userid;
      req.session.usertype = req.user.usertype;
      res.json({code:200,'username':req.session.username,'session_id':req.session.userid,'usertype':req.session.usertype,role:req.user.roles});
      }
    }
});

router.post('/rolelogin',supportCrossOriginScript,passport.authenticate('local'),function(req,res,next)
{
    if (req.user.flag == 0) {
        res.json({code:101,errmsg:"Incorrect Username/Password"});
    }
    else
    {
      if (req.user.userstatus == 0) {
      res.json({code:102,errmsg:"Inactive User"});   
      }
      else
      {
        var locationupdater = new nodeemail();
        locationupdater.updateLocation(req,req.user.userid,function(result)
        {
          req.session.username = req.user.username;
          req.session.userid   = req.user.userid;
          req.session.usertype = 5;
          res.json({code:200,'username':req.session.username,'session_id':req.session.userid,'usertype':req.session.usertype,role:req.user.roles});
        });
      }
    }
});

router.get('/logout',function(req,res,next)
{ 
    //console.log("LogOut");
    console.log(req.session);
    req.session.destroy(function(err)
    {
        if (err) {
        res.send({status:0,code:101,msg:"failure"});
        }
        else
        {
        res.send({status:1,code:200,msg:"success"});
        }
    });
    
});


/* To Register on App Business Member / Customer */
router.post('/register', supportCrossOriginScript, function(req, res){
    var photoname = "";
    var emailpass = req.body.password; 
    var passinfo = new users(req.body);
    req.body.password = passinfo.createHash(req.body.password);
    req.body.status   = 1;
    req.body.verify   = 1;
    req.body.trash    = 0;
    // To create verification code
    crypto.randomBytes(48, function (ex, buf) {
    // make the string url safe
    var token = buf.toString('base64').replace(/\//g, '_').replace(/\+/g, '-');
    // embed the userId in the token, and shorten it
    req.body.token = token.toString().slice(1, 24);
    console.log(req.body.token);
    
    });
    var usersinfo = new users(req.body);
    usersinfo.save(function(err, data)
    {
      if (err)
      {
        console.log(err);
        return res.send({status:0,code:101,error:err});
      }
      else
      {
        /* Case To Send Mail Start*/
        var mail = {
            from: "123deals4u Team" ,
            to: req.body.email,
            subject: "Thankyou For Sign Up 123deals4u",
            text: "Sign Up Activation Link",
            html: "Hi " +req.body.first_name+ ",<br><br><b>Thank you for registration with 123deals4u.</b><br><br> Login Username: " +req.body.email+ "<br><br>Login Password : "+emailpass
        }
        // Photo upload code  start
        if (req.body.profilePic != "")
        {
          var photoname = data._id+'_'+Date.now() + '.jpg';
          var imagename = pathprofilephoto+'/'+photoname;
          var base64Data = req.body.profilePic.replace(/^data:image\/jpeg;base64,/, "");
          fs.writeFile(imagename, base64Data, 'base64', function(err) {
          if (err) {
            console.log(err);
            console.log("Failure Upload");
            
          }
          else{
            console.log("Success Uploaded");
            
          }
          });
          
        }
        req.body.photo = photoname;
        // Photo code code end
        var newlocation = '';
        if(req.body.latitude && req.body.latitude != "" && req.body.latitude != 'undefined')
        {
        var location  = {
                            "type" : "Point",
                            "coordinates" : [ req.body.latitude, req.body.longitude ]
                        };
                        
            newlocation = location;            
        }
             
        users.update({ _id: data._id },{$set:{token: req.body.token,photo: req.body.photo,location:newlocation}},{upsert:true}, function (err7, docsup)
        {
          if(err7)
          {
           return res.send({status:0,code:101,message:"Token Creation problem"}); 
          }
          else
          {
              var emailsend = new nodeemail();
              emailsend.email(mail,res,function (err2,data2){
                      if (err2) {
                        return res.send({status:0,code:101,message:"Email send problem"});
                      }
                      else
                      {
                        ////////////////////////////////////////////////////////
                        if (req.body.role == 1)
                        {
                          emailsend.freePackage(data._id,res,function (err31,data31)
                          {
                            if (err31) {
                              return res.send({status:0,code:101,message:"Package Creation Problem"});
                            }
                            else {
                             return res.send({status:1,code:200,message:'success'});  
                            }
                          });  
                        }
                        else
                        {
                          return res.send({status:1,code:200,message:'success'});   
                        }
                        ///////////////////////////////////////////////////////
                      }
              });
          }
        });
      /* Case To Send Mail End*/
      }
    });
        
});

/// register through web
/* To Register on App Business Member / Customer */
router.post('/registerweb', supportCrossOriginScript , upload.single('file'), function(req, res){
    
    var emailpass = req.body.password; 
    var passinfo = new users(req.body);
    req.body.password = passinfo.createHash(req.body.password);
    req.body.status   = 1;
    req.body.verify   = 1;
    req.body.trash    = 0;
    // To create verification code
    crypto.randomBytes(48, function (ex, buf) {
    // make the string url safe
    var token = buf.toString('base64').replace(/\//g, '_').replace(/\+/g, '-');
    // embed the userId in the token, and shorten it
    req.body.token = token.toString().slice(1, 24);
    
    });
    
    if (!req.file){ }
    else
    {
      req.body.photo = req.file.filename;
     
    }
    
    var usersinfo = new users(req.body);
    usersinfo.save(function(err, data)
    {
      if (err)
      {
        console.log(err);
        return res.send({status:0,code:101,error:err});
      }
      else
      {
        // Case To Send Mail Start
        var mail = {
            from: "123deals4u Team" ,
            to: req.body.email,
            subject: "Thankyou For Sign Up 123deals4u",
            text: "Sign Up Activation Link",
            html: "Hi " +req.body.first_name+ ",<br><br><b>Thank you for registration with 123deals4u.</b><br><br> Login Username: " +req.body.email+ "<br><br>Login Password : "+emailpass
        }
        var newlocation = '';
        if(req.body.latitude && req.body.latitude != "" && req.body.latitude != 'undefined')
        {
        var location  = {
                            "type" : "Point",
                            "coordinates" : [ req.body.latitude, req.body.longitude ]
                        };
                        
            newlocation = req.body.location;            
        }
                     
        users.update({ _id: data._id },{$set:{token: req.body.token,location:newlocation}},{upsert:true}, function (err7, docsup)
        {
          if(err7)
          {
           return res.send({status:0,code:101,error:"Token Creation problem"}); 
          }
          else
          {
              var emailsend = new nodeemail();
              emailsend.email(mail,res,function (err2,data2){
                      if (err2) {
                        console.log(err2);
                        return res.send({status:0,code:101,error:"Email send problem"});
                      }
                      else {
                        
                        ////////////////////////////////////////////////////////
                        if (req.body.role == 1)
                        {
                          emailsend.freePackage(data._id,res,function (err31,data31)
                          {
                            if (err31) {
                              return res.send({status:0,code:101,message:"Package Creation Problem"});
                            }
                            else {
                             return res.send({status:1,code:200,message:'success'});  
                            }
                          });  
                        }
                        else
                        {
                          return res.send({status:1,code:200,message:'success'});   
                        }
                        ///////////////////////////////////////////////////////
                        
                      }
              });
          }
        });
        
        // Case To Send Mail End
      }
    });
        
});



/* Forget Password  */
router.post('/forgetpassword', supportCrossOriginScript, function(req, res){
       console.log(req.body);
       var passinfo = new users(req.body);
       var pass = "7U8DT";
       req.body.password = passinfo.createHash(pass);
    /* Case To Send Mail Start*/
       
       users.findOne({ email: req.body.email }, function (err8, docs)
       {
        if (err8 || docs == null) {
         return res.send({status:0,code:101,error:"Data not found"}); 
        }
        else
        {
        //console.log(docs);  
        //res.json(docs);
        
        users.update({ email: req.body.email },{$set:{password: req.body.password}}, function (err7, docsup)
        {
        if(err7 || docsup == null)
        {
         return res.send({status:0,code:101,error:"Data not found"}); 
        }
        else
        {
          var mail = {
            from: "123deals4u Team" ,
            to: req.body.email,
            subject: "Password Recovery",
            text: "Password Recovery",
            html: "Hi " +docs.first_name+ ",<br><br><b>Your login  password is given following.</b><br><br>Your Login Username: " +req.body.email+ "<br><br>Your Login Password : "+pass
        }  
          
          var emailsend = new nodeemail();
          emailsend.email(mail,res,function (err2,data2){
                if (err2) {
                  console.log(err2);
                  return res.send({status:0,code:101,error:"email send problem"});
                }
                else {
                  return res.send({status:1,code:200,msg:'success'});
                }
        });
        
        }
        });
        
        
        }
      });
        
        /* Case To Send Mail End*/
});



/* Service to verify user */
router.post('/verify', function(req, res){
    
     
    var usersinfo = new users(req.body);
    usersinfo.save(function(err, data)
    {
      if (err)
      {
        console.log(err);
        return res.send({status:0,code:101,error:err});
      }
      else
      {
        /* Case To Send Mail Start*/
        var mail = {
            from: req.body.first_name ,
            to: req.body.email,
            subject: "Sign Up Activation Link",
            text: "Sign Up Activation Link",
            html: "Hi " +req.body.first_name+ ",<br><br><b>Thank you for registration with 123deals4u.</b><br><br>Your Login Activation Token : "+req.body.token
        }
        
        users.update({ _id: data._id },{$set:{token: req.body.token}},{upsert:true}, function (err7, docsup)
        {
        if(err7)
        {
         return res.send({status:0,code:101,error:"email send problem"}); 
        }
        else
        {
        var emailsend = new nodeemail();
        emailsend.email(mail,res,function (err2,data2){
                if (err2) {
                  console.log(err2);
                  return res.send({status:0,code:101,error:"email send problem"});
                }
                else {
                  return res.send({status:1,code:200,msg:'success'});
                }
        });
        }
        });
        
        /* Case To Send Mail End*/
      }
    });
        
});

router.get('/profile', function(req, res){
    
    
    if (req.session.usertype == 5) {
      
      adminpanel.findOne({}, function (err8, docs)
       {
        if (err8) {
         return res.send({status:0,code:101,error:"Data not found"}); 
        }
        else
        {
          return res.send({status:1,code:200,data:docs});
        }
       });
      
    }
    else
    {
    users.findOne({ _id: req.session.userid }, function (err8, docs)
       {
        if (err8) {
         return res.send({status:0,code:101,error:"Data not found"}); 
        }
        else
        {
          return res.send({status:1,code:200,data:docs});
        }
       });
    }
});

router.post('/editProfile', supportCrossOriginScript, upload.single('file'), function (req, res) {
        
        if (!req.file){ req.body.photo = ""; }
        else
        {
          req.body.photo = req.file.filename;
         
        }
        adminpanel.update({_id:req.body._id},{$set:{email:req.body.email, password:req.body.password, phone:req.body.phone, zipcode:req.body.zipcode, photo : req.body.photo}},{upsert:true},function(err, data) {
            if (err) {
                res.json({code:101,message:"Data Update Err",error:err});
            }
            else{
             
            res.json({code:200,data:data,message:"success"});
            }
        });
        
    });

router.post('/editUserProfile', supportCrossOriginScript, upload.single('file'), function (req, res) {
        
        if (!req.file){ req.body.photo = ""; }
        else
        {
          req.body.photo = req.file.filename;
         
        }
        if (req.body.password) {
        var passinfo = new users(req.body);
        req.body.password = passinfo.createHash(req.body.password);
        }
                
        users.update({_id:req.body._id},{$set:{email:req.body.email, password:req.body.password, phone:req.body.phone, zipcode:req.body.zipcode, dob:req.body.dob, photo : req.body.photo}},{upsert:true},function(err, data) {
            if (err) {
                res.json({code:101,message:"Data Update Err",error:err});
            }
            else{
             
            res.json({code:200,data:data,message:"success"});
            }
        });
        
    });

router.post('/editAppUserProfile', supportCrossOriginScript, function (req, res) {
        
        var updatejson = {};
        if (req.body.first_name) {
        updatejson.first_name = req.body.first_name;  
        }
        if (req.body.last_name) {
        updatejson.last_name = req.body.last_name;  
        }
        if (req.body.dob) {
        updatejson.dob = req.body.dob;  
        }
        if (req.body.phone) {
        updatejson.phone = req.body.phone;  
        }
        if (req.body.zipcode) {
        updatejson.zipcode = req.body.zipcode;  
        }
        
        if (req.body.share_message) {
        updatejson.share_message = req.body.share_message;  
        }
        if (req.body.invite_message) {
        updatejson.invite_message = req.body.invite_message;  
        }
        if (req.body.enable_share_message) {
        updatejson.enable_share_message = req.body.enable_share_message;  
        }
        if (req.body.enable_invite_message) {
        updatejson.enable_invite_message = req.body.enable_invite_message;  
        }
        
        
        users.update({_id:req.body._id},{$set:updatejson},function(err, data) {
            if (err) {
                res.json({code:101,message:"Data Update Err",error:err});
            }
            else{
             
            res.json({code:200,data:data,message:"success"});
            }
        });
        
    });

router.post('/changePassword', supportCrossOriginScript, function (req, res) {
        
        var passinfo = new users(req.body);
        req.body.password = passinfo.createHash(req.body.password);
        //req.body.oldpassword = passinfo.createHash(req.body.oldpassword);
        
        users.findOne({_id:req.body.id},{password:1},function(err, olddata)
        {
          if (err) {
            res.json({code:101,message:"Data Find Err",error:err});
          }
        else
        {
          //olddata = 1;
          var validpassword = passinfo.validatePassword(req.body.oldpassword,olddata.password);
          if (validpassword != '' && validpassword != null)
          {
            users.update({_id:req.body.id},{$set:{password:req.body.password}},function(err5, data) {
                    if (err5) {
                        res.json({code:101,message:"Data Update Err",error:err5});
                    }
                    else{
                     
                    res.json({code:200,data:data,message:"success"});
                    }
            });
           
          }
          else
          {
          res.json({code:102,message:"Old Password Not Match",error:'Mismatch Passord'});  
          }
        }
        
        });
 });

module.exports = router;
