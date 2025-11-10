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
        let resourceType = "auto";

        if ([".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".tiff", ".svg"].includes(ext)) {
            folder = "images";
            resourceType = "image";
        } else if (ext === ".pdf") {
            folder = "documents";
            resourceType = "raw";
        }

        // Upload file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: resourceType,
            folder: folder
        })
        // file has been uploaded successfully
        console.log("File uploaded to Cloudinary successfully ", response.url)

        // Delete local temp file safely
        if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);

        return response

    } catch (error) {
        // Cleanup temp file safely
        if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
        return null
    }
}

export { uploadOnCloudinary }