var baseUrl = "http://52.39.212.226:4075";
//var baseUrl = "http://172.24.5.36:4075";
//var baseUrl = "http://172.24.2.167:4075";

var webservices = {	

	"authenticate" : baseUrl + "/adminlogin/authenticate",
	"logout" : baseUrl + "/adminlogin/logout",
	"forgot_password" : baseUrl + "/adminlogin/forgot_password",
	"resendPassword" : baseUrl + "/adminlogin/resendPassword",
	"changePassword" : baseUrl + "/adminlogin/changePassword",	
	"findOneAdminInfo" : baseUrl + "/adminlogin/adminInfo",
	"saveProfile" : baseUrl + "/adminlogin/saveProfile",
	"uploadProImg" : baseUrl + "/adminlogin/uploadProImg",
	"commissionSetting": baseUrl + "/adminlogin/commissionSetting",

	//user
	"addUser" : baseUrl + "/users/add",
	"userList" : baseUrl + "/users/list",
	"update" : baseUrl + "/users/update",
	"getCurrentUserData":baseUrl + "/users/getCurrentUserData",
	"resetPassword":baseUrl+"/users/resetpassword",
	"unSubscribe":baseUrl+"/users/unSubscribe",
	"allUsersCount":baseUrl+"/users/allUsersCount",
	"exportUserList":baseUrl + "/users/exportFile",
	"deleteUser":baseUrl + "/users/deleteUser",
	"totalUser": baseUrl + "/users/totalUser",	
	"deleteUser" : baseUrl + "/users/deleteUser",
    "bulkUpdateUser" : baseUrl + "/users/bulkUpdate",
    "resetpassword":baseUrl+"/users/reset_password",

//vendor

	"addVendor" : baseUrl + "/admin/signupVendor",
	"vendorList" : baseUrl + "/admin/vendorList",
	"update" : baseUrl + "/vendor/update",
	"getCurrentVendorData":baseUrl + "/vendor/getCurrentVendorData",
	"resetpassword":baseUrl+"/admin/reset_password",
	"unSubscribe":baseUrl+"/vendor/unSubscribe",
	"allVendorCount":baseUrl+"/vendor/allVendorCount",
	"exportVendorList":baseUrl + "/vendor/exportFile",
	"deleteVendor":baseUrl + "/admin/deleteVendor",
	"totalVendor": baseUrl + "/admin/totalVendor",
	"latestVendor" : baseUrl + "/vendor/latestVendor",
	"deleteVendor" : baseUrl + "/admin/deleteVendor",
    "bulkUpdateVendor" : baseUrl + "/admin/bulkUpdate",
    "updateVendordata" : baseUrl + "/admin/updateVendordata",
    "getCurrentVendorData" : baseUrl + "/admin/getCurrentVendorData",
      "totalSales" : baseUrl + "/admin/totalSales",
      "totalRevenue" : baseUrl + "/admin/totalRevenue",
         "saleData" : baseUrl + "/admin/saleData",


	//package

	"addPackage" : baseUrl + "/package/add",
	"packages" : baseUrl + "/package/list",
	"getPackageDetail" : baseUrl + "/package/getdetail",
	"updatePackage" : baseUrl + "/package/updatePackage",
	"deletePackage" : baseUrl + "/package/deletePackage",
	"bulkUpdatePackage" : baseUrl + "/package/bulkUpdate",


	

	// help block 
	"updateHelpBlock":baseUrl+"/help/updateHelpBlock",
	"getHelpBlockListing":baseUrl+"/help/getHelpBlockListing",
	"getHelpInformation":baseUrl+"/help/getHelpInformation",
	"insertHelpInformation":baseUrl+"/help/insertHelpInformation",
	"deleteHelp":baseUrl+"/help/deleteHelp",
	// FAQ
	"insertQuestionAnswer": baseUrl+"/FAQ/insertQuestionAnswer",
	"allfaq": baseUrl+"/FAQ/allfaq",
	"deleteAndQues": baseUrl+"/FAQ/deleteAndQues",

	

}
var nav = [
		       {text:'Dashboard', path:'/#/',icon:'fa-dashboard',activeText:'/home'},
		       {text:'Manage Vendors', path:'/#/vendor',icon:'ion ion-person-add',activeText:'/vendor'},
               {text:'Manage Customer', path:'/#/users',icon:'fa-users',activeText:'/users'},
               {text:'Manage FAQs', path:'/#/FAQ',icon:'fa-list',activeText:'/FAQ'},
               {text:'Sales & Revenue', path:'/#/saleData',icon:'fa-shopping-cart',activeText:'/saleData'},
                         ];

var facebookConstants = {
	"facebook_app_id": "1655859644662114"
}

var googleConstants = {

	"google_client_id" : "54372597586-09u72notkj8g82vl3jt77h7cbutvr7ep.apps.googleusercontent.com",
	
}

var appConstants = {

	"authorizationKey": "dGF4aTphcHBsaWNhdGlvbg=="	
}


var headerConstants = {

	"json": "application/json"

}

var pagingConstants = {
	"defaultPageSize": 10,
	"defaultPageNumber":1
}

var messagesConstants = {

	//users
	"saveUser" : "User saved successfully",
	"updateUser" : "User updated successfully",
	"updateStatus" : "Status updated successfully",
	"deleteUser": "User(s) deleted successfully",

	//questionnaires
	"saveQuestionnaire" : "Questionnaire saved successfully",
	"updateQuestionnaire" : "Questionnaire updated successfully",
	"deleteQuestionnaire" : "Questionnaire deleted successfully",

	//questions
	"saveQuestion" : "Question saved successfully",
	"updateQuestion" : "Question updated successfully",
	"deleteQuestion": "Question deleted successfully",
	"updateStatus" : "Question updated successfully",
	//Error
	"enterQuestion" : "Please enter the question.",
	"selectAnswerType" : "Please select the answer type.",
	"enterAnswer" : "Please enter the answer.",
	"selectAnswerCorrect" : "Please choose the answer as correct.",
	"enterKeyword" : "Please enter the Keyword.",



}
