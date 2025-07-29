const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");

exports.createSection = async(req, res) =>{
    try{

        //data fetch 
        const {sectionName, courseId} = req.body;

        //data validation
        // console.log("SECTION NAME", sectionName);
        // console.log("Course ID", courseId);
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"Missing Properties",
            })
        }

        //create section
        const newSection = await Section.create({ sectionName });

        // Update new course
        const updatedCourse = await Course.findByIdAndUpdate(
                            courseId,
                            {
                              $push: {
                                courseContent: newSection._id,
                              },
                            },
                            { new: true }
        )
          .populate({
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          })
          .exec();

          // console.log("Update Course ", updatedCourse);
          // console.log("Course Contect ",Course.courseContent);



          res.status(200).json({
            success: true,
            message: "Section created successfully",
            updatedCourse,
          });

    } catch(error){
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
    })
  }
}


//Update section
exports.updateSection = async (req, res) => {
  try {
    const { sectionName, sectionId, courseId } = req.body;

    // Validate
    if (!sectionName || !sectionId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Update Section Name
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    // Get updated course with populated data
    const updatedCourse = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    // Send updated course to frontend
    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
      updatedCourse,
    });
  } catch (error) {
    console.error("Update Section Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};




exports.deleteSection = async (req, res) => {
    try {

      // get  ID
      const { sectionId, courseId } = req.body;
      await Course.findByIdAndUpdate(courseId, {
        $pull: {
          courseContent: sectionId,
        },
      });
      const section = await Section.findById(sectionId);
      console.log(sectionId, courseId);
      if (!section) {
        return res.status(404).json({
          success: false,
          message: "Section not found",
        });
      }
  
      await SubSection.deleteMany({ _id: { $in: section.subSection } });
  
      // Delete secontion ID through the findByIdAndDelete
      await Section.findByIdAndDelete(sectionId);
  
      const course = await Course.findById(courseId)
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec();

  
      // Return response
      res.status(200).json({
        success: true,
        message: "Section deleted",
        data: course,
      });
    } catch (error) {
      console.error("Error deleting section:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
};