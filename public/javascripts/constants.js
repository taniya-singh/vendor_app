var baseUrl = "http://52.39.212.226:4075";

var webservices = {	

	"authenticate" : baseUrl + "/adminlogin/authenticate",
	"forgot_password" : baseUrl + "/adminlogin/forgot_password",
	"listVehicleTypes" : baseUrl + "/vehicletypes/list",
	"addVehicleType": baseUrl + "/vehicletypes/add",
	"editVehicleType": baseUrl + "/vehicletypes/edit",
	"updateVehicleType": baseUrl + "/vehicletypes/update",
	"statusUpdateVehicleType": baseUrl + "/vehicletypes/update_status",
	"deleteVehicleType": baseUrl + "/vehicletypes/delete",


	//user
	"addUser" : baseUrl + "/users/add",
	"userList" : baseUrl + "/users/list",
	"findOneUser" : baseUrl + "/users/userOne",
	"bulkUpdateUser" : baseUrl + "/users/bulkUpdate",
	"update" : baseUrl + "/users/update",
	
	//vehicle webservice listing
	"listVehicles": baseUrl + "/vehicles/list",


	//category
	"allQuestions" : baseUrl + "/categories/allQuestions",
	"categoryList" : baseUrl + "/categories/list",
	"addCategory" : baseUrl + "/categories/add",
	"updateCategory" : baseUrl + "/categories/update",
	"bulkUpdateCategory" : baseUrl + "/categories/bulkUpdate",
	"findOne" : baseUrl + "/categories/findOne",

	//questionnaire webservice listing
	// "questionnaireList" : baseUrl + "/questionnaire/listquestionnaire",
	// "addquestionnaire" : baseUrl + "/questionnaire/addquestionnaire",
	// "editquestionnaire" : baseUrl + "/questionnaire/editquestionnaire",
	// "updatequestionnaire" : baseUrl + "/questionnaire/updatequestionnaire",
	// "deletequestionnaire" : baseUrl + "/questionnaire/removequestionnaire",
	// "updatestatusquestionnaire" : baseUrl + "/questionnaire/updateStatus",

	"questionnaireList" : baseUrl + "/questionnaire/list",
	"addquestionnaire" : baseUrl + "/questionnaire/add",
	"findOneQuestionnaire" : baseUrl + "/questionnaire/questionnaireOne",
	"bulkUpdateQuestionnaire" : baseUrl + "/questionnaire/bulkUpdate",
	"updateQuestionnaire" : baseUrl + "/questionnaire/update",
	

	//question webservice listing
	"updateQuestion" : baseUrl + "/questions/update",
	"findOneQuestion" : baseUrl + "/questions/question",
	"addQuestion" : baseUrl + "/questions/add",
	"bulkUpdateQuestion" : baseUrl + "/questions/bulkUpdate",
	"getAnswerList" : baseUrl + "/questions/getanswerlist",


	//answertype webservice listing
	"answerTypeList" : baseUrl + "/answer_type/list",
  
  //role
	"roleList" : baseUrl + "/roles/list",
	"addRole" : baseUrl + "/roles/add",
	"updateRole" : baseUrl + "/roles/update",
	"findOneRole" : baseUrl + "/roles/role",
	"bulkUpdateRole" : baseUrl + "/roles/bulkUpdate",

	//permission
	"permissionList" : baseUrl + "/permissions/list",
	"createPermission" : baseUrl + "/permissions/create",
	"updatePermission" : baseUrl + "/permissions/update",
	"findOnePermission" : baseUrl + "/permissions/permission",
	"bulkUpdatePermission" : baseUrl + "/permissions/bulkUpdate",



}

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
