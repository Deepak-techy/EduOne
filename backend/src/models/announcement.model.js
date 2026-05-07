import { mongoose, Schema } from "mongoose";

const announcementSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        targetAudience: {
            type: String,
            enum: ["All", "Students", "Teachers"],
            default: "All",
        },
        isPinned: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        expiresAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
)

// Index for fetching active announcements sorted by pinned first, then newest
announcementSchema.index({ isActive: 1, isPinned: -1, createdAt: -1 });

export const Announcement = mongoose.model("Announcement", announcementSchema);
