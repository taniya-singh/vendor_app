var mongoose = require('mongoose');


//mongoose.connect('mongodb://munchapp:munchapp2780@52.39.212.226:27017/munchapp');
mongoose.connect('mongodb://localhost/vendorapp(local)');


mongoose.connection.on('connected', function(error,data) {
	if(error)
	{
		console.log('MongoDB Connection Error. Please make sure that MongoDB is running.', error);

	}
	else
	{
		console.log("connected on port 4075");
	}

});
