import cloudinary from "../config/cloudinary.config.js"
import fs from "fs"
import path from "path";

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return

        // Detect file extension
        const ext = path.extname(localFilePath).toLowerCase();

        // Decide folder based on file extension
        let folder = "others";
        if ([".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".tiff", ".svg"].includes(ext)) {
            folder = "images";
        } else if (ext === ".pdf") {
            folder = "documents";
        }

        // Upload file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: folder
        })
        // file has been uploaded successfully
        console.log("File uploaded to Cloudinary successfully ", response.url)
        fs.unlinkSync(localFilePath)
        return response

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null
    }
}

export { uploadOnCloudinary }