import { mongoose, Schema } from "mongoose";

const reportSchema = new Schema(
    {
        reporterId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        reportedContentId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        contentType: {
            type: String,
            enum: ["Post", "Comment", "User"],
            required: true,
            index: true,
        },
        reason: {
            type: String,
            enum: ["Spam", "Harassment", "Inappropriate", "Misinformation", "Other"],
            required: true,
        },
        description: {
            type: String,
            trim: true,
            maxlength: 1000,
        },
        status: {
            type: String,
            enum: ["Pending", "Resolved", "Rejected"],
            default: "Pending",
            index: true,
        },
        resolvedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        resolvedAt: {
            type: Date,
            default: null,
        },
        adminNotes: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
)

// Compound index for filtering reports by status and content type
reportSchema.index({ status: 1, contentType: 1 });
reportSchema.index({ reportedContentId: 1, contentType: 1 });

export const Report = mongoose.model("Report", reportSchema);
