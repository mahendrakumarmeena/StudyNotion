const express = require("express");
const router = express.Router();
const {auth, isInstructor } = require("../middlewares/auth");
const {
    deleteAccount,
    updateProfile,
    getAllUserDetails,
    updateDisplayPicture,
    getEnrolledCourses,
    isInstructorDashboard,
}= require("../controllers/Profile");

const { route } = require("./user");

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delet User Account
router.delete("/deleteProfile", auth, deleteAccount);
router.put("/updateProfile", auth, updateProfile);
router.get("/getUserDetails", auth, getAllUserDetails);

//get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses);
router.put("/updateDisplayPicture", auth, updateDisplayPicture);
router.get("/instructorDashboard", auth, isInstructor, isInstructorDashboard)

module.exports = router;