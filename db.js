var mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/barberdo');
mongoose.connect('mongodb://munchapp:munchapp2780@52.39.212.226:27017/munchapp',{auth:{authdb:"munchapp"}});
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});



