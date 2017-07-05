module.exports = function(app, express, passport) {
	var router = express.Router();
	var likeDislikeObj = require('./../app/controllers/likeAndDislike/likeAndDislike.js');
	router.post('/leftRightSwipe', likeDislikeObj.leftRightSwipe);
	router.post('/findFriends',likeDislikeObj.findFriends);
	router.post('/matchListing', likeDislikeObj.matchListing);
	router.post('/deleteUser',likeDislikeObj.deleteUser)
	router.post('/listBlockUser',likeDislikeObj.listBlockUser);
	app.use('/likeDislike', router);
}

