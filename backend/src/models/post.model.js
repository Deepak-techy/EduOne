import { mongoose, Schema } from "mongoose";

const postSchema = new Schema(
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
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        authorRole: {
            type: String,
            enum: ["Student", "Teacher", "Admin"],
            required: true,
            index: true,
        },
        image: {
            type: String,
            default: null,
        },
        imagePublicId: {
            type: String,
            default: null,
        },
        upvotes: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        downvotes: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        commentsCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
)

// Index for sorting posts by newest first
postSchema.index({ createdAt: -1 });

export const Post = mongoose.model("Post", postSchema);
