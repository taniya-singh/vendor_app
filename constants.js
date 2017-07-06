
const messages = {
	"errorRetreivingData": "Error occured while retreiving the data from collection",
	"successRetreivingData" : "Data retreived successfully from the collection",

	//user message
	"userSuccess": "User saved successfully",
	"userStatusUpdateFailure" : "Error occured while updating Status",
	"userStatusUpdateSuccess" : "User update successfully",
	"userDeleteFailure": "Error occured while deleting the user",
	"userDeleteSuccess": "User(s) deleted successfully",
	"userUpdateSuccess": "User updated successfully",


	//Email message
	"emailExist":"Phone number already exist",
	"validEmail":"Phone number is not valid",
	"errorInput":"error in input",
	"notExist":"Phone number does not exist",
	"erroUpdate":"Error while updating",
	"emailSuccess":"Phone number has been sent successfully",
	"requiredField":"Please pass required fields.",
	"wrongInp":"Something went wrong",
	"validInformation":"Please Enter valid information",
	"updateIssue":"Sorry problem to update",
	"passwordReset":"Password resets successfully",
	"passwordNotSame":"Your new password should not be same as current password",
    "oldPasswordError":"Old password is incorrect",
    "dataNotSaved":"Data not saved",
    "dataNotFound":"Data not found",
    "errorTryAgain":"Error !Please try again later.",
    "notFound":"Unable to find.Please try again later.",
    "mailNotsent":"User registered successfully but mail not sent.",


  
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
	"permissionDeleteSuccess": "Permission(s) deleted successfully."
}
const gmailSMTPCredentials = {
	"service": "gmail",
	"host": "smtp.gmail.com",
	"username": "osgroup.sdei@gmail.com",
	"password": "mohali2378"
}
var obj = {messages:messages, gmailSMTPCredentials:gmailSMTPCredentials};
module.exports = obj; 