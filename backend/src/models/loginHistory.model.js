import { mongoose, Schema } from "mongoose";

const loginHistorySchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        loginAt: {
            type: Date,
            default: Date.now,
        },
        ipAddress: {
            type: String,
            default: "Unknown",
        },
        userAgent: {
            type: String,
            default: "Unknown",
        },
        status: {
            type: String,
            enum: ["Success", "Failed"],
            default: "Success",
        },
    },
    {
        timestamps: true,
    }
)

// Compound index for fetching login history by user sorted by date
loginHistorySchema.index({ userId: 1, loginAt: -1 });

export const LoginHistory = mongoose.model("LoginHistory", loginHistorySchema);
