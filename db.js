

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/vendorapp2');
//mongoose.connect('mongodb://munchapp:munchapp2780\\\\\\\@localhost:27017/munchapp?authMechanism="DEFAULT"');
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

