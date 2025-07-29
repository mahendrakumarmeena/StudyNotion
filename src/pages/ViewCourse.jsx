import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
import { getFullDetailsOfCourse } from "../services copy/Opreration/courseDetailsAPI";
import { 
    setCourseSectionData, 
    setTotalNoOfLectures,
    setEntireCourseData,
    setCompletedLectures 
} from "../slices/viewCourseSlice ";
import VideoDetailsSlidebar from "../component/core/ViewCourse/VideoDetailsSlidebar";
import CourseReviewModal from "../component/core/ViewCourse/CourseReviewModal";



const  ViewCourse = ()=>{

        const {courseId}  = useParams();
        const { token } = useSelector((state) => state.auth);
        const dispatch = useDispatch();
        const [reviewModal, setReviewModal] = useState(false);

        useEffect(() => {
            ; (async () => {
              const courseData = await getFullDetailsOfCourse(courseId, token)
        
              dispatch(setCourseSectionData(courseData.courseDetails.courseContent))
              dispatch(setEntireCourseData(courseData.courseDetails))
              dispatch(setCompletedLectures(courseData.completedVideos))
              let lectures = 0
              courseData?.courseDetails?.courseContent?.forEach((sec) => {
                lectures += sec.subSection.length
              })
              dispatch(setTotalNoOfLectures(lectures))
            })()
        
          }, [])


    return (
          <>
              <div className="relative flex min-h-[calc(100vh-3.5rem)]">
                   <VideoDetailsSlidebar setReviewModal={setReviewModal}/>

                   <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
                      <div className="mx-6">
                         <Outlet/>
                      </div>
                   </div>
              </div>

              {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
          </>
    )
}


export default ViewCourse