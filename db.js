var mongoose = require('mongoose');


//mongoose.connect('mongodb://munchapp:munchapp2780@52.39.212.226:27017/munchapp');
mongoose.connect('mongodb://localhost/vendorapp2');

/*mongoose.connect('mongodb://munchapp:munchapp2780@localhost:27017/munchapp');
//mongoose.connect('mongodb://localhost/vendorapp(local)');
>>>>>>> 979b8e2a591708812995959a618b85958b1954fa
*/

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
