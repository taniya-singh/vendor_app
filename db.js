/*
 * The file will take care of the database connectivity
 
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/squadapp');
//mongoose.connect('mongodb://oddjob:oddjob#9809@localhost:27017/oddjob');

//check if we are connected successfully or not
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
*/




var mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost/vendorapp2');
var promise = mongoose.connect('mongodb://localhost/vendorapp2', {
  useMongoClient: true,//mongoose.connect('mongodb://munchapp:munchapp2780\\\\\\\@localhost:27017/munchapp?authMechanism="DEFAULT"');
// //mongoose.connection.on('error', function() {
//   console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
//   process.exit(1);
});


