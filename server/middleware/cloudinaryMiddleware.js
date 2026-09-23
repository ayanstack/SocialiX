import { v2 as cloudinary } from 'cloudinary';
import fs from "node:fs"
import dotenv from "dotenv";
dotenv.config();


// Configuration
cloudinary.config({
    cloud_name: 'dde60gchv',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});



const uploadToCloudinary = async (filePath) => {
    try {
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto"
        });
        return uploadResult;
    } catch (error) {
        console.error("Cloudinary upload error:", error?.message || error);
        if (typeof filePath === "string" && fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
            } catch (unlinkErr) {
                console.error("Error removing local temp file:", unlinkErr);
            }
        }
        return null;
    }
};

export default uploadToCloudinary;



// import { v2 as cloudinary } from 'cloudinary';
// import fs from "node:fs"
// import dotenv from "dotenv";
// dotenv.config();


// // Configuration
// cloudinary.config({
//     cloud_name: 'dde60gchv',
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });




// const uploadToCloudinary = async (filePath) => {


//     // Upload an image
//     const uploadResult = await cloudinary.uploader
//         .upload(
//             filePath, {
//             resource_type: "auto"
//         }
//         )
//         .catch((error) => {
//             console.log(error);
//             // If failes remove file from our server
//             fs.unlinkSync(filePath)
//         });
//     return uploadResult

// }


// export default uploadToCloudinary