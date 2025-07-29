const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const crypto = require("crypto");
const User = require("../models/User");
const mailSender = require("../utils/MailSender");
const mongoose = require("mongoose");
const {
  courseEnrollmentEmail,
} = require("../email/templates/CourseEnrollmentEmails");
const { paymentSuccessEmail } = require("../email/templates/paymentSuccessEmail");
const CourseProgress = require("../models/CourseProgress");

exports.capturePayment = async (req, res) => {
  
  const { courses } = req.body;
  const userId = req.user.id;
  
  if (!courses.length) {
    return res.json({ 
      success: false, 
      message: "Please Provide Course ID" 
    });
  }

  let total_amount = 0;
  for (const course_id of courses) {
    let course;
    try {
     
      course = await Course.findById(course_id);
      if (!course) {
        return res
          .status(200)
          .json({ 
            success: false, 
            message: "Could not find the Course" 
          });
      }
      
      const uid = new mongoose.Types.ObjectId(userId);
      if (course.studentsEnroled.includes(uid)) {
        return res
          .status(200)
          .json({ 
            success: false, 
            message: "Student is already Enrolled" 
          });
      }

      total_amount += course.price;

    } 
    catch (error) {
      console.log(error);
      return res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  const options = {
    amount: total_amount * 100,
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
  };

  try {
    
    const paymentResponse = await instance.orders.create(options);
    console.log(paymentResponse);
    res.json({
      success: true,
      data: paymentResponse,
    });
  } 
  catch (error) {
    console.log(error);
    res.status(500).json({ 
        success: false, 
        message: "Could not initiate order." 
      });
  }
};

// verify Payment
exports.verifyPayment = async (req, res) => {
  
  // fetch all id's
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const courses = req.body?.courses;
  const userId = req.user.id;

  // validation
  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(200).json({ 
      success: false, 
      message: "Payment Failed" 
    });
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    // enrolled 
    await enrollStudents(courses, userId, res);
    return res.status(200).json({ success: true, message: "Payment Verified" });
  }
  return res.status(200).json({ success: false, message: "Payment Failed" });
};

exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;

  const userId = req.user.id;

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" });
  }

  try {
    const enrolledStudent = await User.findById(userId);

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    );
  } catch (error) {
    console.log("error in sending mail", error);
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" });
  }
};

const enrollStudents = async (courses, userId, res) => {
  
  // validation
  if (!courses || !userId) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Please Provide Course ID and User ID",
      });
  }

  for (const courseId of courses) {
    try {
      // find the course and enrolled the student in it
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnroled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        return res.status(500).json({ 
          success: false, 
          error: "Course not found" 
        });
      }

      console.log("Updated course: ", enrolledCourse);

      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      });

      // find the student and add the course to their list of enrolledCourse
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      );

      console.log("Enrolled student: ", enrolledStudent);

      const emailResponse = await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
        )
      );

      console.log("Email sent successfully: ", emailResponse.response);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error: error.message });
    }
  }
};

// module.exports = {capturePayments, verifyPayment, enrollStudents}


// Capture the payment and initiate the Razorpay order
// const capturePayments = async(req, res) =>{
    
//     // get courseId and UserId
//     const courseId = req.body;
//     const userId = req.User.id;

//     //validation

//     //valid courseId
//     if (!courseId) {
//         return res
//           .status(200)
//           .json({ success: false, message: "Could not find the Course" })
//       }

//       //valid course Details
//       let course ;
//       try{
//          course = await Course.findById(courseId);
//          if(!course){
//             return res.json({
//                 success: false,
//                 message: 'Could not find the course'
//             })
//          }

//           //user already pay for the same course
//           const uid = new mongoose.Types.ObjectId(userId)
//           if (course.studentsEnroled.includes(uid)) {
//             return res.status(200).json({ 
//                 success: false, 
//                 message: "Student is already Enrolled" 
//             })
//           }

//           // Add the price of the course to the total amount
//           total_amount += course.price
//       }
//       catch(error){
//         console.log(error)
//         res
//           .status(500)
//           .json({ 
//             success: false, 
//             message: error.message,
//           });
//       }


//     //order create
//     const amount = course.price;
//     const currency = "INR";

//     const options = {
//         amount: amount*100,
//         currency,
//         receipt: Math.random(Date.now()).toString(),
//         notes:{
//             courseId:courseId,
//             userId:userId,
//         }
//     };


//     try{
//         // Initiate the payment using Razorpay
//         const paymentResponse = await instance.orders.create(options);
//         console.log(paymentResponse);

//         // return response
//         res.json({
//             success: true,
//             courseName:courseName,
//             courseDescription:course.courseDescription,
//             thumbnail: course.thumbnail,
//             orderId:paymentResponse.id,
//             currency: paymentResponse.currency,
//             amount:paymentResponse.amount,
//           })
//     } catch(error){
//         res.json({
//             success:false,
//             success:error.message,
//         })
//     }
// };


// // Verify payment or Signature of Razorpay and server
// const verifyPayment = async (req, res) => {

//     const razorpay_order_id = req.body?.razorpay_order_id;
//     const razorpay_payment_id = req.body?.razorpay_payment_id;
//     const razorpay_signature = req.body?.razorpay_signature;
//     const courses = req.body?.courses;
//     const userId = req.user.id;
//     if (
//       !razorpay_order_id ||
//       !razorpay_payment_id ||
//       !razorpay_signature ||
//       !courses ||
//       !userId
//     ) 
//     {
//       return res.status(200).json({ 
//         success: false, 
//         message: "Payment Failed" 
//       });
//     }


//     let body = razorpay_order_id + "|" + razorpay_payment_id;
    
//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_SECRET)
//       .update(body.toString())
//       .digest("hex");
//     if (expectedSignature === razorpay_signature) {
//       await enrollStudents(courses, userId, res);
//       return res.status(200).json({ success: true, message: "Payment Verified" });
//     }
//     return res.status(200).json({ success: false, message: "Payment Failed" });
//   };
  
//  const sendPaymentSuccessEmail = async (req, res) => {
//     const { orderId, paymentId, amount } = req.body;
  
//     const userId = req.user.id;
  
//     if (!orderId || !paymentId || !amount || !userId) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Please provide all the details" });
//     }
  
//     try {
//       const enrolledStudent = await User.findById(userId);
  
//       await mailSender(
//         enrolledStudent.email,
//         `Payment Received`,
//         paymentSuccessEmail(
//           `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
//           amount / 100,
//           orderId,
//           paymentId
//         )
//       );
//     } catch (error) {
//       console.log("error in sending mail", error);
//       return res
//         .status(400)
//         .json({ success: false, message: "Could not send email" });
//     }
//   };
  
//   const enrollStudents = async (courses, userId, res) => {
//     if (!courses || !userId) {
//       return res
//         .status(400)
//         .json({
//           success: false,
//           message: "Please Provide Course ID and User ID",
//         });
//     }
  
//     for (const courseId of courses) {
//       try {
//         const enrolledCourse = await Course.findOneAndUpdate(
//           { _id: courseId },
//           { $push: { studentsEnroled: userId } },
//           { new: true }
//         );
  
//         if (!enrolledCourse) {
//           return res
//             .status(500)
//             .json({ success: false, error: "Course not found" });
//         }
//         console.log("Updated course: ", enrolledCourse);
  
//         const courseProgress = await CourseProgress.create({
//           courseID: courseId,
//           userId: userId,
//           completedVideos: [],
//         });
  
//         const enrolledStudent = await User.findByIdAndUpdate(
//           userId,
//           {
//             $push: {
//               courses: courseId,
//               courseProgress: courseProgress._id,
//             },
//           },
//           { new: true }
//         );
  
//         console.log("Enrolled student: ", enrolledStudent);
  
//         const emailResponse = await mailSender(
//           enrolledStudent.email,
//           `Successfully Enrolled into ${enrolledCourse.courseName}`,
//           courseEnrollmentEmail(
//             enrolledCourse.courseName,
//             `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
//           )
//         );
  
//         console.log("Email sent successfully: ", emailResponse.response);
//       } catch (error) {
//         console.log(error);
//         return res.status(400).json({ success: false, error: error.message });
//       }
//     }
//   }  

//   module.exports = {capturePayments, verifyPayment, sendPaymentSuccessEmail, enrollStudents}