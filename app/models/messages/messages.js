var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var MsgSchema = new Schema({
    senderid:{type: Schema.Types.ObjectId, ref: 'users'},
    recieverid:{type: Schema.Types.ObjectId, ref: 'users'},
    text: {type:String},
    is_read : {type : Boolean, default : false},
    is_deleted : {type : Boolean, default : false},
    created_date : {type : Date, default : Date.now}
    
});

var messageSchema = new mongoose.Schema({
  senderid:{type: Schema.Types.ObjectId, ref: 'users'},
  recieverid:{type: Schema.Types.ObjectId, ref: 'users'},  
  message:[MsgSchema],
	is_deleted : {type : Boolean, default : false},
	enable : {type : Boolean, default : true},
	created_date : {type : Date, default : Date.now}
});



messageSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id,
        is_deleted:false
    }).populate({
                path: 'message.senderid',
                select: 'first_name last_name email prof_image'

              })              
    .exec(cb);
};

var messageObj = mongoose.model('messages' , messageSchema);
module.exports = messageObj;