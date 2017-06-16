
const messages = {
	"errorRetreivingData": "Error occured while retreiving the data from collection",
	"successRetreivingData" : "Data retreived successfully from the collection",

	//VehicleType
	"vehicleTypeFailure": "Error occured while saving the data",
	"vehicleTypeSuccess": "Vehicle Type saved successfully",
	"vehicleTypeUpdateSuccess": "Vehicle Type updated successfully",
	"vehicleTypeStatusUpdateSuccess": "Status updated successfully",
	"vehicleTypeStatusUpdateFailure": "Error occured while updating status",
	"vehicleTypeStatusDeleteFailure": "Error occured while deleting the vehicle types",
	"vehicleTypeDeleteSuccess":"Vehicle Type(s) deleted successfully",

	//forgot password
	"successSendingForgotPasswordEmail": "Password sent successfully",

    //item message
         "successRetreivingData" : "Data retreived successfully from the collection",
    //Add items
    "errorAddingItems": "Error occured while adding the data to collection",
	"errorAddingItems" : "Items successfully added to the collection",

    //Update items
    "errorUpdatingItems": "Error occured while updating the items to the collection",
	"successUpdatingItems" : "Items successfully updated to the collection",


    //user message
    "LoginSuccess": "User logged in success",
    "LoginFailed" : "logged in Failed",
	"userSuccess": "User saved successfully",
	"userStatusUpdateFailure" : "Error occured while updating Status",
	"userStatusUpdateSuccess" : "User update successfully",
	"userDeleteFailure": "Error occured while deleting the user",
	"userDeleteSuccess": "User(s) deleted successfully",
	"userUpdateSuccess": "User updated successfully",
  
  	//role message
	"roleSuccess": "Role has been saved successfully.",
	"roleStatusUpdateFailure" : "An error has been occured while updating status.",
	"roleStatusUpdateSuccess" : "Role has been updated successfully.",
	"roleDeleteFailure": "An error has been occured while deleting the role.",
	"rolerDeleteSuccess": "Role(s) deleted successfully.",

	//Permission message
	"permissionSuccess": "Permission has been saved successfully.",
	"permissionStatusUpdateFailure" : "An error has been occured while updating status.",
	"permissionStatusUpdateSuccess" : "Permission has been updated successfully.",
	"permissionDeleteFailure": "An error has been occured while deleting the permission.",
	"permissionDeleteSuccess": "Permission(s) deleted successfully.",

	//category
	"categorySuccess" : "Category has been saved successfully.",
	"categoryUpdateSuccess": "Category has been updated successfully.",
	"categoryStatusUpdateFailure": "An error has been occurred while updating status.",
	"categoryStatusUpdateSuccess" : "Category status has been updated successfully.",
	"categoryDeleteFailure": "Error occured while deleting the category.",
	"categoryDeleteSuccess": "Category has been deleted successfully.",

	//answertype
	"answertypeSuccess" : "Answer type saved successfully",

	//question message
	"questionFailure" : "Error occured while saving the data",
	"questionSuccess" : "Question saved successfully",
	"questionUpdateSuccess" : "Question updated successfully",
	"questionStatusUpdateFailure" : "Error occured while updating status",
	"questionStatusUpdateSuccess": "Status updated successfully",
	"questionDeleteFailure" : "Error occured while deleting the question",
	"questionDeleteSuccess" : "Question deleted successfully",
	"questionAnswerSuccess" : "Answers retreived successfully",

	//questionnaire message
	"questionnaireSuccess" : "Questionnaire has been saved successfully.",
	"questionnaireUpdateQuestionFailure" : "An error has been occured while saving the question in questionnaire.",
	"questionnaireUpdateSuccess": "Questionnaire has been updated successfully.",
	"questionnaireDeleteFailure": "An error has been occured while deleting the questionnaire.",
	"questionnaireDeleteSuccess" : "Questionnaire has been deleted successfully.",
	"questionnaireStatusUpdateFailure": "An error has been occured while updating status.",
	"questionnaireStatusUpdateSuccess": "Status has been updated successfully.",

	//techdomain
	"techdomainSuccess" : "Domain saved successfully",

	//candidateposition
	"candidatepositionSuccess": "Position saved successfully",

	//result
	"resultFailure" : "Result not saved successfully",
	"resultSuccess" : "Result saved successfully",
	"categoryError" : "Please select the category.",


}

const gmailSMTPCredentials = {
	"service": "gmail",
	"host": "smtp.gmail.com",
	"username": "username",
	"password": "password"

}


const facebookCredentials = {
	"app_id" : "1655859644662114", 
	"secret":"62da09d9663d9f8315e873abfdbbe70f",
	 "token_secret": process.env.token_secret || 'JWT Token Secret'
}

const twitterCredentials = {
	"consumer_key" : "q2doqAf3TC6Znkc1XwLvfSD4m",
	"consumer_secret" : "Yrfi1hr84UMoamS2vnJZQn6CeP8dHsv6XjDoyRqsfzSNwyFQBZ"
}

const googleCredentials = {
	"client_secret_key" : "leWdLHJOoo9g6B9oLCV1lMqY"
}

var obj = {messages:messages, gmailSMTPCredentials:gmailSMTPCredentials, facebookCredentials:facebookCredentials, twitterCredentials : twitterCredentials, googleCredentials : googleCredentials};
module.exports = obj; 