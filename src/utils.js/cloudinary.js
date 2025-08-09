import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import dotenv from "dotenv";
dotenv.config({
    path: './.env'
})
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null

        const response = await cloudinary.uploader.upload(localFilePath,
            {
                resource_type: "auto",
            }
        )
        // console.log("file has been succesfully uploaded to cloudinary", response.url);
        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);

        // Safely delete the local file if upload fails
        try {
            fs.unlinkSync(localFilePath);

        } catch (unlinkError) {
            console.error("Failed to delete local file:", unlinkError);
        }

        return null;
    }
}

const deleteImageFromCloudinary = async (public_id) => {
    try {
        const result = await cloudinary.uploader.destroy(public_id);
        // console.log("Deleted image:", result);
        return result;
    } catch (error) {
        console.error("Error deleting image:", error);
        throw error;
    }
};


export { uploadOnCloudinary, deleteImageFromCloudinary }