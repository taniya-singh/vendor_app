var constantObj = require('./../../../constants.js');
var cmsObj = require('./../../models/helpBlock/cms.js');
var userObj = require('./../../models/users/users.js');
var nodeMail = require('./../../../common/nodeMailer.js');
var commonjs = require('./../commonFunction/common.js');
exports.getEmail = function (req,res) {
    
        cmsObj.find({"identifier":"eNewsLetter"},{"addedBy":0,"created":0,"isDisabled":0,"modified":0},function(err,data){
            if(err){
                console.log(err);
                 outputJSON = {
                'status': 'failure',
                'messageId': 203,
                'message': constantObj.messages.errorRetreivingData
                };
                res.status(401).jsonp(outputJSON)
            }else{
                res.status(200).jsonp({
                'status': 'success',
                'messageId': 200,
                'data':data
            });
            }
        })
}

exports.sentEmailNewsLetter = function(req,res){
    console.log(req.body);
    userObj.find({subScribeNewsLetter:true},{email:1,first_name:1},function(err,data){
        if(err){
             outputJSON = {
                'status': 'failure',
                'messageId': 401,
                'message': "Something happen wrong."
                };
                res.status(401).jsonp(outputJSON)
        }
        else{
            console.log(data);
            console.log(req.headers.host);

           callNodeMailerFunction(data,data.length,req.body.description,req.body.title,req.headers.host,res);
          
            // for(var i=0;i<data.length;i++){
            //     nodeMail.pushRequest(data[i].email,req.body.description,req.body,title,function(err,data){
            //         if(err){
            //             console.log(err)
            //         }
            //         else{
            //             console.log(data);
            //         }
            //     })
            //     i++
            // }
        }
    })
}

var callNodeMailerFunction = function(mydata,n,description,title,req,res){
    // console.log("req",req);
    var len = n;
    console.log("mydata",mydata);
    console.log("n is",n)
    console.log("mydata[n].email",mydata[n-1]);
    // var emailItems = ['hshussain86@gmail.com','hussain.mohammed@smartdatainc.net','hshussain86@hotmail.com'];
            if(n >0){
                var desc = description;
                // var idEncrypt = commonjs.encrypt(mydata[n-1]._id);
                var generatedText = commonjs.makeid();
                  var resetUrl = "http://" + req + "/#/" + "user/unSubScribe/" + mydata[n-1]._id+"/"+generatedText ;
                  console.log("resetUrl",resetUrl);
                
                  desc = desc.replace("{{fullName}}",mydata[n-1].first_name);
                  desc = desc.replace("{{applink}}",resetUrl)
                // desc = desc.replace()
                // console.log("sending")
            nodeMail.pushRequest(mydata[n-1].email,desc,title,function(err,data){
                        if(err){
                            console.log(err)
                            console.log("err in sending email");
                            //callNodeMailerFunction(mydata,--n,description,title,req,res)
                        }
                        else{
                            console.log("working",data);
                            console.log("value of n ",n);
                            
                        }
                    })
            callNodeMailerFunction(mydata,--n,description,title,req,res)
        }
        else{
                res.jsonp({ 'status': 'success',
                'messageId': 200,
                'message': "Mail has been sent."})
        }
}
