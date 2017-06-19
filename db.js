var mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/barberdo');
mongoose.connect('mongodb://munchapp:munchapp2780@localhost:27017/munchapp');
mongoose.connection.on('error', function(error) {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.', error);
  process.exit(1);
});
