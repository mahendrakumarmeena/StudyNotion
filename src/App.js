import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './index.css';
import { Route, Routes } from 'react-router-dom';
import Home from "./pages/Home"
import Signup from './pages/Singup';
import Login from './pages/Login';
import OpenRoute from './component/core/Auth/OpenRoute';
import Navbar from './component/common/Navbar';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import VerifyEmail from './pages/VerifyEmail';
import About from './pages/About';
import MyProfile from './component/core/Dashboard/MyProfile';
import Dashboard from './pages/DashBoard';
import PrivateRoute from './component/core/Auth/PrivateRoute'
import Error from './pages/Error'
import EnrolledCourses from './component/core/Dashboard/EnrolledCourses';
import Cart from './component/core/Dashboard/Cart';
import { ACCOUNT_TYPE } from './Util/constants';
import { useSelector } from 'react-redux';
import Settings from './component/core/Dashboard/Setting';
import AddCourse from './component/core/Dashboard/AddCourse';
// import ContactUsForm from './component/core/ContactUsPage/ContactUsForm';
import Contact from './pages/Contact';
import Catalog from './pages/Catalog';
import MyCourses from './component/core/Dashboard/MyCourses';
import EditCourse from './component/core/Dashboard/EditCourse'
import Instructor from './component/core/Dashboard/Instructor';
import ViewCourse from './pages/ViewCourse';
import CourseDetails from './pages/CourseDetails';
import { getUserDetails } from './services copy/Opreration/profileAPI';
import VideoDetails from './component/core/ViewCourse/VideoDetails';




function App() {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { user } = useSelector((state) => state.profile)
  //  console.log("App user ", user);
 
  // useEffect( () =>{
  //   if(localStorage.getItem("token")){
  //     const token = JSON.parse(localStorage.getItem("token"))
  //     dispatch(getUserDetails(token, navigate))
  //   }
  // })
 
   return (
     <div className="flex min-h-screen w-screen flex-col bg-richblack-900 font-inter">
       <Navbar />
       <Routes>
         <Route path="/" element={<Home />} />
         <Route path="/about" element={<About />} />
         <Route path="/contact" element={<Contact />} />
         <Route path='/courses/:courseId' element={<CourseDetails/>}/>
         <Route path="catalog/:catalogName" element={<Catalog />} />
      
 
         <Route
           path="login"
           element={
             <OpenRoute>
               <Login />
             </OpenRoute>
           }
         />
         <Route
           path="forgot-password"
           element={
             <OpenRoute>
               <ForgotPassword />
             </OpenRoute>
           }
         />
         <Route
           path="update-password/:id"
           element={
             <OpenRoute>
               <UpdatePassword />
             </OpenRoute>
           }
         />
         <Route
           path="signup"
           element={
             <OpenRoute>
               <Signup />
             </OpenRoute>
           }
         />
         <Route
           path="verify-email"
           element={
             <OpenRoute>
               <VerifyEmail />
             </OpenRoute>
           }
         />
         <Route
           element={
             <PrivateRoute>
               <Dashboard />
             </PrivateRoute>
           }
         >
           <Route path="dashboard/my-profile" element={<MyProfile />} />
           <Route path="dashboard/Settings" element={<Settings />} />
           {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
             <>
               <Route path="dashboard/instructor" element={<Instructor />} />
               <Route path="dashboard/my-courses" element={<MyCourses />} />
               <Route path="dashboard/add-course" element={<AddCourse />} />
               <Route
                 path="dashboard/edit-course/:courseId"
                 element={<EditCourse />}
               />
             </>
           )}
           {user?.accountType === ACCOUNT_TYPE.STUDENT && (
             <>
               <Route
                 path="dashboard/enrolled-courses"
                 element={<EnrolledCourses />}
               />
               <Route path="/dashboard/cart" element={<Cart />} />
             </>
           )}
           <Route path="dashboard/settings" element={<Settings />} />
         </Route> 
 
         <Route
           element={
             <PrivateRoute>
               <ViewCourse />
             </PrivateRoute>
           }
         >
            {user?.accountType === ACCOUNT_TYPE.STUDENT && (
             <>
               <Route
                 path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                 element={<VideoDetails />}
               />
             </>
           )}
         </Route>
 
         <Route path="*" element={<Error />} />
       </Routes>
     </div>
   )
 }
 
 export default App