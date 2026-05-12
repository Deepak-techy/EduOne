import { mongoose, Schema } from "mongoose";

const roomChatSchema = new Schema(
    {
        roomId: {
            type: Schema.Types.ObjectId,
            ref: "Room",
            required: true,
            index: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
            maxLength: 1000,
        },
        type: {
            type: String,
            enum: ["text", "system", "emoji"],
            default: "text",
        },
    },
    {
        timestamps: true,
    }
);

// Index for fetching chat messages in order
roomChatSchema.index({ roomId: 1, createdAt: 1 });

// TTL index — auto-delete messages after 7 days
roomChatSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 });

export const RoomChat = mongoose.model("RoomChat", roomChatSchema);
