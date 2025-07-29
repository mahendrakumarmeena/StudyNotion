// import requires modules
const express = require("express")
const router = express.Router();


// Import the required controllers and middleware function
const {
    login,
    signup,
    sendotp,
    changepassword,
} = require("../controllers/Auth");


const{
    resetPasswordToken,
    resetPassword,
} = require("../controllers/ResetPassword");

const { auth } = require("../middlewares/auth");

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************


// Routes for user login
router.post("/login", login);

// Route for user signup
router.post("/signup", signup);

// Route for sending OTP to the user's email
router.post("/sendotp", sendotp);

//Route for changing the password
router.post("/changepassword", auth, changepassword);





// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************


// Route for resetting user's password after verification
router.post("/reset-password-token", resetPasswordToken);

//Route for reseting password
router.post("/reset-password", resetPassword);


// Export the router for user in the main application
module.exports = router;