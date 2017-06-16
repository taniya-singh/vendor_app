var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var permissionSchema = new mongoose.Schema({
	permission : {type:String, unique: true, required : 'Please enter the permission name.'},
	is_deleted : {type : Boolean, default : false},
	enable : {type : Boolean},
	created_date : {type : Date, default : Date.now}
});


//custom validations

permissionSchema.path('permission').validate(function(value) {
  var validateExpression = /^[a-zA-Z ]*$/;
  return validateExpression.test(value);
}, "Please enter valid permission name");

permissionSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    })
    .exec(cb);
};

permissionSchema.plugin(uniqueValidator, {message:'Permission already exists'});

var permissionObj = mongoose.model('permissions' , permissionSchema);
module.exports = permissionObj;