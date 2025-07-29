const mongoose = require("mongoose");

const SubSectionSchema = new mongoose.Schema({
	title: {
		 type: String, 
		 required: true 
	},
	timeDuration: { 
		type: String, 
		required: true 
	},
	description: { 
		type: String, 
		required: true 
    },
	videoUrl: { 
		type: String, 
		required: true 
	}
},{ timestamps: true });

// Prevent overwriting the model if it already exists
const SubSection = mongoose.models.SubSection || mongoose.model("SubSection", SubSectionSchema);

module.exports = SubSection;
