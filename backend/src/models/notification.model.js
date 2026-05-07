import { mongoose, Schema } from "mongoose";

const notificationSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ["System", "Admin", "Alert"],
            default: "Admin",
        },
        targetUsers: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        sentBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        readBy: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        timestamps: true,
    }
)

// Index for fetching notifications for a specific user
notificationSchema.index({ targetUsers: 1, createdAt: -1 });
notificationSchema.index({ sentBy: 1 });

export const Notification = mongoose.model("Notification", notificationSchema);
