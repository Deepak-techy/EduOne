import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Room } from "../../models/room.model.js";
import { endRoom, getAllActiveRooms } from "../../services/roomManager.service.js";
import { getIO } from "../../config/socket.config.js";


// GET /api/admin/rooms/active
const getActiveRooms = asyncHandler(async (req, res) => {
    const rooms = await getAllActiveRooms();

    return res
        .status(200)
        .json(new ApiResponse(200, { count: rooms.length, rooms }, "Active rooms fetched"));
});


// POST /api/admin/rooms/:roomId/force-end
const forceEndRoom = asyncHandler(async (req, res) => {
    const { roomId } = req.params;

    try {
        const room = await endRoom(roomId, req.user._id, true);

        // Notify all participants via Socket.IO
        const io = getIO();
        io.to(`room:${roomId}`).emit("room:ended", {
            roomId,
            reason: "Room was ended by an administrator",
        });

        return res
            .status(200)
            .json(new ApiResponse(200, room, "Room force-ended successfully"));
    } catch (error) {
        throw new ApiError(400, error.message);
    }
});


// GET /api/admin/rooms/stats
const getRoomStats = asyncHandler(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
        activeVoice,
        activeVideo,
        totalToday,
        totalAllTime,
    ] = await Promise.all([
        Room.countDocuments({ status: "active", type: "voice" }),
        Room.countDocuments({ status: "active", type: "video" }),
        Room.countDocuments({ createdAt: { $gte: today } }),
        Room.countDocuments({}),
    ]);

    // Average duration of ended rooms
    const avgDurationResult = await Room.aggregate([
        { $match: { status: "ended", endedAt: { $ne: null } } },
        {
            $project: {
                duration: { $subtract: ["$endedAt", "$startedAt"] },
            },
        },
        {
            $group: {
                _id: null,
                avgDuration: { $avg: "$duration" },
            },
        },
    ]);

    const avgDurationMs = avgDurationResult[0]?.avgDuration || 0;
    const avgDurationMinutes = Math.round(avgDurationMs / 60000);

    return res
        .status(200)
        .json(new ApiResponse(200, {
            activeVoice,
            activeVideo,
            totalActive: activeVoice + activeVideo,
            totalToday,
            totalAllTime,
            avgDurationMinutes,
        }, "Room stats fetched"));
});


export {
    getActiveRooms,
    forceEndRoom,
    getRoomStats,
};
