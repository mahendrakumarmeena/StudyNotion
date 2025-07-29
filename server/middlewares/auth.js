// Importing required modules
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");
const { useSelector } = require("react-redux");
// Configuring dotenv to load environment variables from .env file
dotenv.config();

// This function is used as middleware to authenticate user requests
const auth = async (req, res, next) => {
	// const token = useSelector((state) =>state.auth);
	// console.log("Token", token);
	try {

		
		// console.log("BEFORE TOKEN EXTRACTION")
		// extract token
		// const token = req.header("Authorisation").replace("Bearer ", "");
		const token = req.cookies.token ||  req.body.token || req.header("Authorization").replace("Bearer ", "");

			// console.log("token ",token);
		// If JWT is missing, then return 401 Unauthorized response
		if (!token) {
			return res.status(401).json({ 
				success: false, 
				message: `Token Missing` 
			});
		}
		// console.log("TOKEN ", token);

		try {
			
            //Verifying the JWT using the secret  key stored in envirment variabless
			// console.log("BEFORE")
			const decode =  jwt.verify(token, process.env.JWT_SECRET);
			// console.log("DECODE ",decode);
			// console.log("AFTER", process.env.JWT_SECRET);
			
            //Storing the decode JWT payload in the request object for further use
			req.user = decode;
		} 
		catch(error){
            console.log("ERROR INTERVERl")
			//IF JWT verification fails, return 401 Unauthprized response
			return res.status(401).json({ 
				success: false,
				 message: "token is invalid" 
			});

		}
		console.log()

		//If JWT is valid, move on to the next middleware or request handler
		next();
		// console.log("ERROR");
	} 
	catch(error){
		
        //If there is an error during the authentication process, return 401 Unauthorized response
		return res.status(401).json({
			success: false,
			message: `Something Went Wrong While Validating the Token`,
		});
	}
};

// module.exports = { auth };

const isStudent = async (req, res, next) => {
	try {
		const userDetails = await User.findOne({ email: req.user.email });

		if (userDetails.accountType !== "Student") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for Students",
			});
		}
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: `User Role Can't be Verified` });
	}
};

const isAdmin = async (req, res, next) => {
	// console.logsAccount type", req.user.accountType);
	try {
		const userDetails = await User.findOne({ email: req.user.email });

		if (userDetails.accountType !== "Admin") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for Admin",
			});
		}
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: `User Role Can't be Verified` });
	}
};


const isInstructor = async (req, res, next) => {
	// console.log("Error")
	try {
		const userDetails = await User.findOne({ email: req.user.email });
		// console.log("user details ",userDetails);

		// console.log("Account type ",userDetails.accountType);

		if (userDetails.accountType !== "Instructor") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for Instructor",
			});
		}
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: `User Role Can't be Verified` });
	}
};

module.exports = {isAdmin, isInstructor, auth, isStudent};