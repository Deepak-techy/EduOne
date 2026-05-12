import { Room } from "../models/room.model.js";
import { RoomChat } from "../models/roomChat.model.js";
import { Post } from "../models/post.model.js";

/**
 * Create a new voice or video room linked to a community post.
 */
export const createRoom = async (postId, userId, type, options = {}) => {
    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) throw new Error("Post not found");

    // Check if there's already an active room of the same type for this post
    const existingRoom = await Room.findOne({
        postId,
        type,
        status: "active",
    });
    if (existingRoom) throw new Error(`An active ${type} room already exists for this post`);

    const room = await Room.create({
        postId,
        type,
        title: options.title || post.title || `${type === "voice" ? "Voice Channel" : "Video Meeting"}`,
        createdBy: userId,
        visibility: options.visibility || "public",
        maxParticipants: options.maxParticipants || (type === "voice" ? 8 : 6),
        participants: [
            {
                userId,
                role: "host",
                joinedAt: new Date(),
                isMuted: false,
                isCameraOff: type === "voice",
            },
        ],
    });

    return Room.findById(room._id)
        .populate("participants.userId", "fullName userName avatar role")
        .populate("createdBy", "fullName userName avatar")
        .populate("postId", "title");
};

/**
 * Join an existing room. Validates capacity and prevents duplicate joins.
 */
export const joinRoom = async (roomId, userId) => {
    const room = await Room.findById(roomId);
    if (!room) throw new Error("Room not found");
    if (room.status !== "active") throw new Error("Room is no longer active");

    // Check if user is already in the room
    const isAlready = room.participants.some(
        (p) => p.userId.toString() === userId.toString()
    );
    if (isAlready) {
        // Return room data as-is (re-join scenario e.g. page refresh)
        return Room.findById(roomId)
            .populate("participants.userId", "fullName userName avatar role")
            .populate("createdBy", "fullName userName avatar")
            .populate("postId", "title");
    }

    // Check capacity
    if (room.participants.length >= room.maxParticipants) {
        throw new Error("Room is full");
    }

    room.participants.push({
        userId,
        role: "participant",
        joinedAt: new Date(),
        isMuted: false,
        isCameraOff: room.type === "voice",
    });

    await room.save();

    return Room.findById(roomId)
        .populate("participants.userId", "fullName userName avatar role")
        .populate("createdBy", "fullName userName avatar")
        .populate("postId", "title");
};

/**
 * Leave a room. Auto-ends the room if it becomes empty.
 * Returns { room, ended } to let caller know if room was auto-ended.
 */
export const leaveRoom = async (roomId, userId) => {
    const room = await Room.findById(roomId);
    if (!room) throw new Error("Room not found");

    room.participants = room.participants.filter(
        (p) => p.userId.toString() !== userId.toString()
    );

    let ended = false;

    // If room is empty, end it
    if (room.participants.length === 0) {
        room.status = "ended";
        room.endedAt = new Date();
        ended = true;
    }

    await room.save();

    const populated = await Room.findById(roomId)
        .populate("participants.userId", "fullName userName avatar role")
        .populate("createdBy", "fullName userName avatar")
        .populate("postId", "title");

    return { room: populated, ended };
};

/**
 * End a room (host or admin action).
 */
export const endRoom = async (roomId, userId, isAdmin = false) => {
    const room = await Room.findById(roomId);
    if (!room) throw new Error("Room not found");
    if (room.status === "ended") throw new Error("Room already ended");

    // Only host or admin can end a room
    if (!isAdmin) {
        const hostParticipant = room.participants.find(
            (p) => p.userId.toString() === userId.toString() && p.role === "host"
        );
        if (!hostParticipant) throw new Error("Only the host or an admin can end this room");
    }

    room.status = "ended";
    room.endedAt = new Date();
    await room.save();

    return Room.findById(roomId)
        .populate("participants.userId", "fullName userName avatar role")
        .populate("createdBy", "fullName userName avatar")
        .populate("postId", "title");
};

/**
 * Update a participant's state (mute, camera, hand raise, screen share, peerId, socketId).
 */
export const updateParticipant = async (roomId, userId, updates) => {
    const room = await Room.findById(roomId);
    if (!room) return null;

    const participant = room.participants.find(
        (p) => p.userId.toString() === userId.toString()
    );
    if (!participant) return null;

    const allowedFields = ["isMuted", "isCameraOff", "isHandRaised", "isScreenSharing", "peerId", "socketId"];
    for (const key of allowedFields) {
        if (updates[key] !== undefined) {
            participant[key] = updates[key];
        }
    }

    await room.save();
    return room;
};

/**
 * Get active rooms for a specific post.
 */
export const getActiveRoomsByPost = async (postId) => {
    return Room.find({ postId, status: "active" })
        .populate("participants.userId", "fullName userName avatar role")
        .populate("createdBy", "fullName userName avatar")
        .lean();
};

/**
 * Get all active rooms (for discovery or admin).
 */
export const getAllActiveRooms = async () => {
    return Room.find({ status: "active" })
        .populate("participants.userId", "fullName userName avatar role")
        .populate("createdBy", "fullName userName avatar")
        .populate("postId", "title")
        .sort({ startedAt: -1 })
        .lean();
};

/**
 * Cleanup: end stale rooms with no participants that have been active for > 5 minutes.
 */
export const cleanupStaleRooms = async () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    const staleRooms = await Room.find({
        status: "active",
        "participants.0": { $exists: false }, // no participants
        updatedAt: { $lt: fiveMinAgo },
    });

    for (const room of staleRooms) {
        room.status = "ended";
        room.endedAt = new Date();
        await room.save();
    }

    return staleRooms.length;
};

/**
 * Remove a participant by socketId (used on disconnect).
 * Returns { room, userId, ended } or null.
 */
export const removeParticipantBySocketId = async (socketId) => {
    const room = await Room.findOne({
        status: "active",
        "participants.socketId": socketId,
    });

    if (!room) return null;

    const participant = room.participants.find((p) => p.socketId === socketId);
    if (!participant) return null;

    const userId = participant.userId;

    room.participants = room.participants.filter((p) => p.socketId !== socketId);

    let ended = false;
    if (room.participants.length === 0) {
        room.status = "ended";
        room.endedAt = new Date();
        ended = true;
    }

    await room.save();

    return { room, userId, ended };
};

// Run cleanup every 5 minutes
setInterval(cleanupStaleRooms, 5 * 60 * 1000);
