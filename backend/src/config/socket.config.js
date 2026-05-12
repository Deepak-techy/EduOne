import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { RoomChat } from "../models/roomChat.model.js";
import {
    updateParticipant,
    removeParticipantBySocketId,
} from "../services/roomManager.service.js";

let io;

const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.CORS_ORIGIN,
            credentials: true,
        },
    });

    // ─── Socket Authentication Middleware ───
    io.use(async (socket, next) => {
        try {
            const token =
                socket.handshake.auth?.token ||
                socket.handshake.headers?.cookie
                    ?.split(";")
                    .find((c) => c.trim().startsWith("accessToken="))
                    ?.split("=")[1];

            if (token) {
                const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
                const user = await User.findById(decoded._id).select(
                    "fullName userName avatar role"
                );
                if (user) {
                    socket.user = user;
                }
            }
        } catch (err) {
            // Auth is optional — unauthenticated sockets can still listen to public events
            console.log("Socket auth skipped:", err.message);
        }
        next();
    });

    io.on("connection", (socket) => {
        console.log(
            `Socket connected: ${socket.id}${socket.user ? ` (${socket.user.userName})` : ""}`
        );

        // ──────────────── COMMUNITY POST EVENTS (existing) ────────────────

        // join a specific post room to receive real-time updates for that post
        socket.on("joinPost", (postId) => {
            socket.join(`post:${postId}`);
        });

        // leave a specific post room
        socket.on("leavePost", (postId) => {
            socket.leave(`post:${postId}`);
        });

        // join admin dashboard room for real-time admin events
        socket.on("joinAdminDashboard", () => {
            socket.join("admin-dashboard");
        });

        // ──────────────── COLLABORATION ROOM EVENTS ────────────────

        /**
         * Join a collaboration room's socket namespace.
         * Payload: { roomId, peerId }
         */
        socket.on("room:join", async ({ roomId, peerId }) => {
            if (!socket.user) return;

            socket.join(`room:${roomId}`);
            socket.currentRoomId = roomId;

            // Update participant's socketId and peerId in the database
            await updateParticipant(roomId, socket.user._id, {
                socketId: socket.id,
                peerId: peerId || null,
            });

            // Notify other participants that a new peer has joined
            socket.to(`room:${roomId}`).emit("webrtc:peer-joined", {
                userId: socket.user._id.toString(),
                userName: socket.user.fullName,
                avatar: socket.user.avatar,
                peerId,
                socketId: socket.id,
            });

            // Send system chat message
            const systemMsg = await RoomChat.create({
                roomId,
                userId: socket.user._id,
                message: `${socket.user.fullName} joined the room`,
                type: "system",
            });

            const populatedMsg = await RoomChat.findById(systemMsg._id)
                .populate("userId", "fullName userName avatar")
                .lean();

            io.to(`room:${roomId}`).emit("room:chat-message", populatedMsg);
        });

        /**
         * Leave a collaboration room.
         * Payload: { roomId }
         */
        socket.on("room:leave", async ({ roomId }) => {
            if (!socket.user) return;

            socket.leave(`room:${roomId}`);
            socket.currentRoomId = null;

            // Notify others
            socket.to(`room:${roomId}`).emit("webrtc:peer-left", {
                userId: socket.user._id.toString(),
                userName: socket.user.fullName,
            });

            // System message
            const systemMsg = await RoomChat.create({
                roomId,
                userId: socket.user._id,
                message: `${socket.user.fullName} left the room`,
                type: "system",
            });

            const populatedMsg = await RoomChat.findById(systemMsg._id)
                .populate("userId", "fullName userName avatar")
                .lean();

            io.to(`room:${roomId}`).emit("room:chat-message", populatedMsg);
        });

        /**
         * Participant state update (mute, camera, hand raise, screen share).
         * Payload: { roomId, ...updates }
         */
        socket.on("room:participant-update", async ({ roomId, ...updates }) => {
            if (!socket.user) return;

            await updateParticipant(roomId, socket.user._id, updates);

            // Broadcast to all in room (including sender for confirmation)
            io.to(`room:${roomId}`).emit("room:participant-updated", {
                userId: socket.user._id.toString(),
                ...updates,
            });
        });

        /**
         * In-room chat message.
         * Payload: { roomId, message }
         */
        socket.on("room:chat-message", async ({ roomId, message }) => {
            if (!socket.user || !message?.trim()) return;

            const chatMsg = await RoomChat.create({
                roomId,
                userId: socket.user._id,
                message: message.trim(),
                type: "text",
            });

            const populatedMsg = await RoomChat.findById(chatMsg._id)
                .populate("userId", "fullName userName avatar")
                .lean();

            io.to(`room:${roomId}`).emit("room:chat-message", populatedMsg);
        });

        /**
         * Typing indicator.
         * Payload: { roomId, isTyping }
         */
        socket.on("room:typing", ({ roomId, isTyping }) => {
            if (!socket.user) return;

            socket.to(`room:${roomId}`).emit("room:typing", {
                userId: socket.user._id.toString(),
                userName: socket.user.fullName,
                isTyping,
            });
        });

        /**
         * Voice activity / speaking indicator.
         * Payload: { roomId, isSpeaking }
         */
        socket.on("room:speaking", ({ roomId, isSpeaking }) => {
            if (!socket.user) return;

            socket.to(`room:${roomId}`).emit("room:speaking", {
                userId: socket.user._id.toString(),
                isSpeaking,
            });
        });

        /**
         * Emoji reaction in room.
         * Payload: { roomId, emoji }
         */
        socket.on("room:reaction", ({ roomId, emoji }) => {
            if (!socket.user) return;

            io.to(`room:${roomId}`).emit("room:reaction", {
                userId: socket.user._id.toString(),
                userName: socket.user.fullName,
                emoji,
            });
        });

        /**
         * Room ended notification (sent by host).
         * Payload: { roomId }
         */
        socket.on("room:end", ({ roomId }) => {
            io.to(`room:${roomId}`).emit("room:ended", {
                roomId,
                reason: "Room was ended by the host",
            });
        });

        // ──────────────── WEBRTC SIGNALING EVENTS ────────────────

        /**
         * Forward SDP offer to a specific peer.
         * Payload: { roomId, targetSocketId, offer }
         */
        socket.on("webrtc:offer", ({ roomId, targetSocketId, offer }) => {
            io.to(targetSocketId).emit("webrtc:offer", {
                offer,
                from: socket.id,
                userId: socket.user?._id?.toString(),
                userName: socket.user?.fullName,
            });
        });

        /**
         * Forward SDP answer to a specific peer.
         * Payload: { roomId, targetSocketId, answer }
         */
        socket.on("webrtc:answer", ({ roomId, targetSocketId, answer }) => {
            io.to(targetSocketId).emit("webrtc:answer", {
                answer,
                from: socket.id,
            });
        });

        /**
         * Forward ICE candidate to a specific peer.
         * Payload: { roomId, targetSocketId, candidate }
         */
        socket.on("webrtc:ice-candidate", ({ roomId, targetSocketId, candidate }) => {
            io.to(targetSocketId).emit("webrtc:ice-candidate", {
                candidate,
                from: socket.id,
            });
        });

        /**
         * Screen share start/stop notifications.
         * Payload: { roomId, isSharing }
         */
        socket.on("room:screen-share", ({ roomId, isSharing }) => {
            if (!socket.user) return;

            socket.to(`room:${roomId}`).emit("room:screen-share", {
                userId: socket.user._id.toString(),
                userName: socket.user.fullName,
                isSharing,
            });
        });

        // ──────────────── DISCONNECT HANDLER ────────────────

        socket.on("disconnect", async () => {
            console.log(
                `Socket disconnected: ${socket.id}${socket.user ? ` (${socket.user.userName})` : ""}`
            );

            // If user was in a room, clean up their participant entry
            if (socket.user) {
                const result = await removeParticipantBySocketId(socket.id);

                if (result) {
                    const { room, userId, ended } = result;
                    const roomId = room._id.toString();

                    // Notify others in the room
                    socket.to(`room:${roomId}`).emit("webrtc:peer-left", {
                        userId: userId.toString(),
                        userName: socket.user.fullName,
                    });

                    // System message
                    try {
                        const systemMsg = await RoomChat.create({
                            roomId: room._id,
                            userId: socket.user._id,
                            message: `${socket.user.fullName} disconnected`,
                            type: "system",
                        });
                        const populatedMsg = await RoomChat.findById(systemMsg._id)
                            .populate("userId", "fullName userName avatar")
                            .lean();
                        io.to(`room:${roomId}`).emit("room:chat-message", populatedMsg);
                    } catch (_) {
                        // ignore chat errors on disconnect
                    }

                    if (ended) {
                        io.to(`room:${roomId}`).emit("room:ended", {
                            roomId,
                            reason: "All participants left",
                        });
                    }

                    // Notify the post room about participant change
                    if (room.postId) {
                        const postId = typeof room.postId === "object" ? room.postId._id : room.postId;
                        io.to(`post:${postId}`).emit("room:participant-count-updated", {
                            roomId,
                            postId: postId.toString(),
                            count: room.participants.length,
                            ended,
                        });
                    }
                }
            }
        });
    });

    console.log("Socket.IO initialized with collaboration support");
    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO not initialized. Call initSocket first.");
    }
    return io;
};

export { initSocket, getIO };
