const mongoose = require("mongoose");
const Category = require("../models/Category");


//create a category  handler function 

exports.createCategory = async(req, res) =>{

    try{
        //fetch data 
        const {name, description, status} = req.body;

        // Validation
        if(!name ){
            return res.status(400).json({
                success:false,
                message:"All fieds are required",
            })
        }

        //create entry in db
        const categoryDetails = await Category.create({
            name:name,
            description:description,
        });

        // console.log(categoryDetails);

        return res.status(200).json({
            success:true,
            message:"Category Created Successfuly",
        })
    } catch(error){
        return res.status(500).json({
            success:true,
            message:error.message,
        });
    }
}


// Show all Categories
exports.showAllCategories = async (req, res) => {
    try {
      
      
      // const allCategories = await Category.find().populate("courses");
      // console.log("all category ",allCategories)

      const allCategories = await Category.find().populate("courses");
      // console.log("all category ",allCategories)

      const categoriesWithPublishedCourses = allCategories.filter((category) =>
        category.courses.some((course) => course.status === "Published")
      );
      
     
      // console.log("categories With Published Courses ",categoriesWithPublishedCourses)
     
      res.status(200).json({
        success: true,
        data: categoriesWithPublishedCourses,
      });
    } 
    catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


  
//categories page details
exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;

    if ( !mongoose.Types.ObjectId.isValid(categoryId)) {
      console.log("Error")
      return res.status(400).json({
        success: false,
        message: "Invalid or missing categoryId",
      });
    }

    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        // populate: "ratingAndReviews",
      })
      .exec();

    if (!selectedCategory) {
      console.log("Category not found.");
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    if (selectedCategory.courses.length === 0) {
      console.log("No courses found for the selected category.");
      return res.status(200).json({
        success: true,
        message: "No courses found for the selected category.",
      });
    }

    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    });


    function getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }
    
    let differentCategory = await Category.findOne(
      categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
        ._id
    )
      .populate({
        path: "courses",
        match: { status: "Published" },
      })
      .exec();

    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
      })
      .exec();

    const allCourses = allCategories.flatMap((category) => category.courses);



    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

    res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};