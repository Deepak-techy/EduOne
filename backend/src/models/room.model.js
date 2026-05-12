import { mongoose, Schema } from "mongoose";
import crypto from "crypto";

const participantSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        role: {
            type: String,
            enum: ["host", "moderator", "participant"],
            default: "participant",
        },
        joinedAt: {
            type: Date,
            default: Date.now,
        },
        isMuted: {
            type: Boolean,
            default: false,
        },
        isCameraOff: {
            type: Boolean,
            default: true,
        },
        isHandRaised: {
            type: Boolean,
            default: false,
        },
        isScreenSharing: {
            type: Boolean,
            default: false,
        },
        socketId: {
            type: String,
            default: null,
        },
        peerId: {
            type: String,
            default: null,
        },
    },
    { _id: false }
);

const roomSchema = new Schema(
    {
        postId: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ["voice", "video"],
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        participants: [participantSchema],
        status: {
            type: String,
            enum: ["active", "ended"],
            default: "active",
            index: true,
        },
        visibility: {
            type: String,
            enum: ["public", "private"],
            default: "public",
        },
        maxParticipants: {
            type: Number,
            default: 8,
        },
        roomCode: {
            type: String,
            unique: true,
            index: true,
        },
        startedAt: {
            type: Date,
            default: Date.now,
        },
        endedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Compound indexes for common queries
roomSchema.index({ postId: 1, status: 1 });
roomSchema.index({ status: 1, type: 1 });
roomSchema.index({ createdBy: 1, status: 1 });

// Generate a unique 6-character room code before saving
roomSchema.pre("save", function (next) {
    if (!this.roomCode) {
        this.roomCode = crypto.randomBytes(3).toString("hex").toUpperCase();
    }
    // Set default max participants based on room type
    if (this.isNew && !this.maxParticipants) {
        this.maxParticipants = this.type === "voice" ? 8 : 6;
    }
    next();
});

export const Room = mongoose.model("Room", roomSchema);
