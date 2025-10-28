import cloudinary from "../config/cloudinary.config.js";

export const deleteFromCloudinary = async (documentPublicId) => {
    try {
        if (!documentPublicId) {
            console.warn("⚠️ No document public ID provided for deletion.");
            return;
        }

        console.log(`Attempting to delete from Cloudinary: ${documentPublicId}`);

        // Delete PDF/document from Cloudinary (PDFs use resource_type: 'raw')
        const result = await cloudinary.uploader.destroy(documentPublicId, {
            resource_type: 'raw',  
            invalidate: true        // Optional: clear CDN cache
        });

        if (result.result === "ok") {
            console.log(`✅ Deleted document ${documentPublicId} from Cloudinary`);
        } else if (result.result === "not found") {
            console.warn(`⚠️ Document not found in Cloudinary: ${documentPublicId}`);
        } else {
            console.warn(`⚠️ Cloudinary deletion result: ${result.result}`);
        }

        return result;
    } catch (error) {
        console.error(`❌ Error deleting from Cloudinary (${documentPublicId}):`, error.message);
        throw new Error("Failed to delete document from Cloudinary");
    }
};
