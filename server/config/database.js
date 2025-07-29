const mongoose = require("mongoose");

require("dotenv").config();


exports.connect = () =>{
    
       // const  cnt = 
        mongoose.connect(process.env.DATA_BASE_URL, {
            useNewUrlParser : true,
            useUnifiedTopology: true,
        })
        .then(() => console.log( "DB Connected Successfully"))
        .catch((error) =>{
            console.log("DB CONNECTION FAILED");
            console.error(error);
            process.exit(1);
        })

}