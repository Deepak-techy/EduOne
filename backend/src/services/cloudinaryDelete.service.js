import cloudinary from "../config/cloudinary.config.js";

export const deleteFromCloudinary = async (pdfUrl) => {
    try {
        if (!pdfUrl) {
            console.warn("⚠️ No pdf URL provided for deletion.");
            return;
        }

        const result = await cloudinary.uploader.destroy(pdfUrl);

        if (result.result === "ok") {
            console.log(`✅ Deleted document ${publicId} from Cloudinary`);
        } else {
            console.warn(`⚠️ Cloudinary deletion result: ${result.result}`);
        }

        return result;
    } catch (error) {
        console.error("❌ Error deleting from Cloudinary:", error.message);
        throw new Error("Failed to delete document from Cloudinary");
    }
};
