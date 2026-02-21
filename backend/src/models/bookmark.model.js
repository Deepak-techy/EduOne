import { mongoose, Schema } from "mongoose";

const bookmarkSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        postId: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

// Unique compound index to prevent duplicate bookmarks
bookmarkSchema.index({ userId: 1, postId: 1 }, { unique: true });

// Index for fetching user's bookmarks sorted by date
bookmarkSchema.index({ userId: 1, createdAt: -1 });

export const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
