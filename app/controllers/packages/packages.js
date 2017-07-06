var packObj = require('./../../models/packages/packages.js');

var constantObj = require('./../../../constants.js');
var chConstantObj = require('./../../../chconstants.js');
var moment = require('moment');
var mongoose = require('mongoose');

/*________________________________________________________________________
    * @Date:        06 June 2017.
    * @Module :     Package.
    * Created By:   smartData Enterprises Ltd.
    * @Purpose:     Add a new Package.
    * @Param:       Title,Likes,Pric. 
    * @Return:      Object of response.
_________________________________________________________________________
*/
exports.add = function(req, res) {
	var errorMessage = '';
	var messages = ''
 console.log(req.body)
    if(req.body.title!=="" && req.body.title !=undefined && req.body.price!=="" && req.body.price !=undefined ){
    	packObj(req.body).save(req.body, function(err, data) {
		if (err) {
			
			outputJSON = {
				'status': 'failure',
				'messageId': 401,
				'message': 'Error in finding email' + errorMessage
			};
			res.jsonp(outputJSON);
		} else {
			    outputJSON = {
					'status': 'Success',
					'messageId': 200,
					'message': 'Package has been added successfully.'
				};
				res.status(200).jsonp(outputJSON);
			
		}
	})
    }else{

    outputJSON = {
					'status': 'Success',
					'messageId': 401,
					'message': "input error" 
				};
	res.status(200).jsonp(outputJSON);
    	
    }
	
}

/*________________________________________________________________________
    * @Date:        06 June 2017.
    * @Module :     Package.
    * Created By:   smartData Enterprises Ltd.
    * @Purpose:     Get a list of packages.
    * @Param:        
    * @Return:      Object of response.
_________________________________________________________________________
*/

exports.list = function(req, res) {
	console.log(req.body)
	var page = req.body.page || 1,
		count = req.body.count || 1;
	var skipNo = (page - 1) * count;

	var sortdata = {};
	var sortkey = null;
	for (key in req.body.sort) {
		sortkey = key;
	}
	if (sortkey) {
		var sortquery = {};
		sortquery[sortkey ? sortkey : '_id'] = req.body.sort ? (req.body.sort[sortkey] == 'desc' ? -1 : 1) : -1;
	}
	 //console.log("-----------query-------", query);
	console.log("sortquery", sortquery);
	console.log("page", page);
	console.log("count", count);
	console.log("skipNo",skipNo)
	var query = {};
	var searchStr = req.body.search;
	if (req.body.search) {
		query.$or = [{
			title:new RegExp(searchStr, 'i')
			
		}]
	}
	query.isDeleted=false;
    console.log("-----------query-------", query);
	packObj.find(query).exec(function(err, data) {
		if (err) {
			console.log(err)
		} else {
			var length = data.length;
			packObj.find(
				 query
			).skip(skipNo).limit(count).sort(sortquery)
			.exec(function(err, data1) {
				//console.log(data)
				if (err) {
					console.log("tttte",err)
					outputJSON = {
						'status': 'failure',
						'messageId': 203,
						'message': 'data not retrieved '
					};
				} else {
					outputJSON = {
						'status': 'success',
						'messageId': 200,
						'message': 'data retrieve from collection',
						'data': data1,
						'count': length
					}
				}
				res.status(200).jsonp(outputJSON);
			})
		}
	})
}



// exports.list = function(req, res) {
// 	//console.log("resss")
// 	var errorMessage = '';
// 	var messages = ''
//      packObj.find({isDeleted:false}).exec(function(err, data) {
// 		if (err) {		
// 			console.log(err)
// 			outputJSON = {
// 				'status': 'failure',
// 				'messageId': 401,
// 				'message': 'Error in finding email' + errorMessage
// 			};
// 			res.jsonp(outputJSON);
// 		} else {
// 			console.log(data)
// 			    outputJSON = {
// 					'status': 'Success',
// 					'messageId': 200,
// 					'data':data
// 				};
// 				res.status(200).jsonp(outputJSON);
			
// 		}
// 	})
// }
	

/*________________________________________________________________________
    * @Date:        06 June 2017.
    * @Module :     Package.
    * Created By:   smartData Enterprises Ltd.
    * @Purpose:     Get Informations of package.
    * @Param:       packageId 
    * @Return:      Object of response.
_________________________________________________________________________
*/
exports.getdetail = function(req, res) {
	//console.log(req.params.id)
	var errorMessage = '';
	var messages = ''
	var query = {};
    query._id = req.params.id;

    packObj.find(query, function(err, data) {
		if (err) {		
			console.log(err)
			outputJSON = {
				'status': 'failure',
				'messageId': 401,
				'message': 'Error in finding email' + errorMessage
			};
			res.jsonp(outputJSON);
		} else {
			console.log(data)
			    outputJSON = {
					'status': 'Success',
					'messageId': 200,
					'data':data
				};
			res.status(200).jsonp(outputJSON);		
		}
	})
}


/*________________________________________________________________________
    * @Date:        06 June 2017.
    * @Module :     Package.
    * Created By:   smartData Enterprises Ltd.
    * @Purpose:     Update Informations of package.
    * @Param:       packageId 
    * @Return:      Object of response.
_________________________________________________________________________
*/
exports.updatePackage = function(req, res) {
	console.log(req.body)
	var errorMessage = '';
	var messages = ''
	packObj.update({
					_id: req.body._id
				}, {
					$set:req.body
				}, function(err, data) {
		if (err) {		
			console.log(err)
			outputJSON = {
				'status': 'failure',
				'messageId': 401,
				'message': 'Error in finding email' + errorMessage
			};
			res.jsonp(outputJSON);
		} else {
			console.log(data)
			    outputJSON = {
					'status': 'Success',
					'messageId': 200,
					'data':data
				};
			res.status(200).jsonp(outputJSON);		
		}
	})
}

/*________________________________________________________________________
    * @Date:        06 June 2017.
    * @Module :     Update.
    * Created By:   smartData Enterprises Ltd.
    * @Purpose:     Update Informations of package.
    * @Param:       packageId 
    * @Return:      Object of response.
_________________________________________________________________________
*/

exports.bulkUpdate = function(req, res) {
	var outputJSON = "";
	var inputData = req.body;
	var roleLength = inputData.data.length;
	var bulk = packObj.collection.initializeUnorderedBulkOp();
	for (var i = 0; i < roleLength; i++) {
		var userData = inputData.data[i];
		var id = mongoose.Types.ObjectId(userData.id);
		bulk.find({
			_id: id
		}).update({
			$set: userData
		});
	}
	bulk.execute(function(data) {
		outputJSON = {
			'status': 'success',
			'messageId': 200,
			'message': "Package has been updated successfully"
		};
		res.jsonp(outputJSON);
	});
	
}

/*________________________________________________________________________
    * @Date:        06 June 2017.
    * @Module :     Package.
    * Created By:   smartData Enterprises Ltd.
    * @Purpose:     Delete package.
    * @Param:       packageId 
    * @Return:      Object of response.
_________________________________________________________________________
*/

exports.deletePackage = function(req,res){
	if(req.params.id){

		packObj.update({
					_id: req.params.id
				}, {
					$set:{isDeleted:true}
				}, function(err, data) {
		if (err) {		
			console.log(err)
			outputJSON = {
				'status': 'failure',
				'messageId': 401,
				'message': 'Error in finding email' + errorMessage
			};
			res.jsonp(outputJSON);
		} else {
			console.log(data)
			    outputJSON = {
					'status': 'Success',
					'messageId': 200,
					'data':data
				};
			res.status(200).jsonp(outputJSON);		
		}
	})
		
	}
	else{
		res.status(200).jsonp({
			"status": 'failure',
			"messageId": 401,
			"message": "Please sent required fields."
		})
	}
}

