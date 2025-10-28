import { mongoose, Schema } from "mongoose";

const noteSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        subject: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        tags: [
            {
                type: String,
                trim: true,
                lowerCase: true,
                index: true,
            },
        ],
        content: {
            type: String,
            trim: true,
        },
        documentUrl: {
            type: String,
            default: null,
        },
        documentPublicId: {
            type: String,
            default: null,
        },
        documentMetadata: {
            fileName: String,
            fileSize: Number,
            mimeType: String,
            pageCount: Number,
        },
        qdrantCollectionName: {
            type: String,
        },
        documentChunkIds: [
            {
                type: String,
            },
        ],
    },
    {
        timestamps: true,
    }
)

// Index for text search on subject, tags, and content
noteSchema.index({ subject: 'text', tags: 'text', content: 'text' });

// Compound index for subject and tags filtering
noteSchema.index({ userId: 1, subject: 1, tags: 1 });
// noteSchema.index({ subject: 1 });
// noteSchema.index({ tags: 1 });

export const Note = mongoose.model("Note", noteSchema);
