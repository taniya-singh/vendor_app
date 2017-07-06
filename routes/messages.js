module.exports = function(app, express, passport) {
	var router = express.Router();
	var messageObj = require('./../app/controllers/messages/messages.js');	
	router.get('/list/:userId', [passport.authenticate('bearer', {session:true})], messageObj.list);
	router.get('/allContacts/:userId', [passport.authenticate('bearer', {session:true})], messageObj.allContacts);	
	router.post('/add', [passport.authenticate('bearer', {session:true})], messageObj.add);
	router.param('messageId', messageObj.message);
	router.param('messageId', messageObj.message);
	router.post('/update/:messageId', [passport.authenticate('bearer', {session:true})], messageObj.update);	
	router.get('/thread/:userId/:threadId', [passport.authenticate('bearer', {session:true})],  messageObj.findThread);
	router.get('/userThread/:userId/:contactId', [passport.authenticate('bearer', {session:true})],  messageObj.findUserThread);
	router.post('/bulkUpdate', [passport.authenticate('bearer', {session:true})],  messageObj.bulkUpdate);
	app.use('/messages', router);

}