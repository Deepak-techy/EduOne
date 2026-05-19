import { mongoose, Schema } from "mongoose";

const commentSchema = new Schema(
    {
        postId: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true,
            index: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
            required: true,
            trim: true,
        },
        markedAs: {
            type: String,
            enum: ["correct", "helpful", null],
            default: null,
        },
        markedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    {
        timestamps: true,
    }
)

// Compound index for fetching comments by post sorted by date
commentSchema.index({ postId: 1, createdAt: -1 });

export const Comment = mongoose.model("Comment", commentSchema);
