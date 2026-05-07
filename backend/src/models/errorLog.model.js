import { mongoose, Schema } from "mongoose";

const errorLogSchema = new Schema(
    {
        errorMessage: {
            type: String,
            required: true,
        },
        stackTrace: {
            type: String,
        },
        endpoint: {
            type: String,
        },
        method: {
            type: String,
        },
        statusCode: {
            type: Number,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    {
        timestamps: true,
    }
)

// Index for fetching error logs sorted by newest first
errorLogSchema.index({ createdAt: -1 });
errorLogSchema.index({ statusCode: 1 });

export const ErrorLog = mongoose.model("ErrorLog", errorLogSchema);
