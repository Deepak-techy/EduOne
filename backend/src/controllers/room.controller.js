import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Room } from "../models/room.model.js";
import { RoomChat } from "../models/roomChat.model.js";
import {
    createRoom,
    joinRoom,
    leaveRoom,
    endRoom,
    getActiveRoomsByPost,
    getAllActiveRooms,
} from "../services/roomManager.service.js";


// POST /api/rooms/create
const createRoomHandler = asyncHandler(async (req, res) => {
    const { postId, type, title, visibility, maxParticipants } = req.body;
    const userId = req.user._id;

    if (!postId || !type) {
        throw new ApiError(400, "Post ID and room type are required");
    }

    if (!["voice", "video"].includes(type)) {
        throw new ApiError(400, "Room type must be 'voice' or 'video'");
    }

    try {
        const room = await createRoom(postId, userId, type, {
            title,
            visibility,
            maxParticipants,
        });

        return res
            .status(201)
            .json(new ApiResponse(201, room, "Room created successfully"));
    } catch (error) {
        throw new ApiError(400, error.message);
    }
});


// GET /api/rooms/:roomId
const getRoomById = asyncHandler(async (req, res) => {
    const { roomId } = req.params;

    const room = await Room.findById(roomId)
        .populate("participants.userId", "fullName userName avatar role")
        .populate("createdBy", "fullName userName avatar")
        .populate("postId", "title")
        .lean();

    if (!room) throw new ApiError(404, "Room not found");

    return res
        .status(200)
        .json(new ApiResponse(200, room, "Room fetched successfully"));
});


// GET /api/rooms/post/:postId/active
const getActiveRoomsForPost = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    const rooms = await getActiveRoomsByPost(postId);

    return res
        .status(200)
        .json(new ApiResponse(200, { rooms }, "Active rooms fetched successfully"));
});


// POST /api/rooms/:roomId/join
const joinRoomHandler = asyncHandler(async (req, res) => {
    const { roomId } = req.params;
    const userId = req.user._id;

    try {
        const room = await joinRoom(roomId, userId);

        return res
            .status(200)
            .json(new ApiResponse(200, room, "Joined room successfully"));
    } catch (error) {
        throw new ApiError(400, error.message);
    }
});


// POST /api/rooms/:roomId/leave
const leaveRoomHandler = asyncHandler(async (req, res) => {
    const { roomId } = req.params;
    const userId = req.user._id;

    try {
        const { room, ended } = await leaveRoom(roomId, userId);

        return res
            .status(200)
            .json(new ApiResponse(200, { room, ended }, "Left room successfully"));
    } catch (error) {
        throw new ApiError(400, error.message);
    }
});


// POST /api/rooms/:roomId/end
const endRoomHandler = asyncHandler(async (req, res) => {
    const { roomId } = req.params;
    const userId = req.user._id;
    const isAdmin = req.user.role === "Admin";

    try {
        const room = await endRoom(roomId, userId, isAdmin);

        return res
            .status(200)
            .json(new ApiResponse(200, room, "Room ended successfully"));
    } catch (error) {
        throw new ApiError(400, error.message);
    }
});


// GET /api/rooms/join-by-code/:code
const joinByCode = asyncHandler(async (req, res) => {
    const { code } = req.params;
    const userId = req.user._id;

    const room = await Room.findOne({ roomCode: code.toUpperCase(), status: "active" });
    if (!room) throw new ApiError(404, "Room not found or has ended");

    try {
        const updatedRoom = await joinRoom(room._id, userId);

        return res
            .status(200)
            .json(new ApiResponse(200, updatedRoom, "Joined room successfully"));
    } catch (error) {
        throw new ApiError(400, error.message);
    }
});


// GET /api/rooms/active
const getActiveRoomsList = asyncHandler(async (req, res) => {
    const rooms = await getAllActiveRooms();

    return res
        .status(200)
        .json(new ApiResponse(200, { rooms }, "Active rooms fetched successfully"));
});


// GET /api/rooms/:roomId/chat
const getRoomChat = asyncHandler(async (req, res) => {
    const { roomId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const messages = await RoomChat.find({ roomId })
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limitNum)
        .populate("userId", "fullName userName avatar")
        .lean();

    const total = await RoomChat.countDocuments({ roomId });

    return res
        .status(200)
        .json(new ApiResponse(200, {
            messages,
            total,
            page: pageNum,
            totalPages: Math.ceil(total / limitNum),
        }, "Chat messages fetched successfully"));
});


export {
    createRoomHandler,
    getRoomById,
    getActiveRoomsForPost,
    joinRoomHandler,
    leaveRoomHandler,
    endRoomHandler,
    joinByCode,
    getActiveRoomsList,
    getRoomChat,
};
