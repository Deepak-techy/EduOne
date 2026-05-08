import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Notification } from "../models/notification.model.js";

const getUserNotifications = asyncHandler(async (req, res) => {
    const { _id: userId } = req.user;

    const notifications = await Notification.find({
        targetUsers: userId
    })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

    // Map to include a simple 'isRead' field for the frontend
    const processedNotifications = notifications.map(n => ({
        ...n,
        isRead: n.readBy?.some(id => id.toString() === userId.toString())
    }));

    return res.status(200).json(
        new ApiResponse(200, processedNotifications, "Notifications fetched successfully")
    );
});

const markNotificationAsRead = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { _id: userId } = req.user;

    const notification = await Notification.findById(id);
    if (!notification) {
        throw new ApiError(404, "Notification not found");
    }

    // Check if user is in targetUsers
    const isTarget = notification.targetUsers.some(id => id.toString() === userId.toString());
    if (!isTarget) {
        throw new ApiError(403, "Not authorized to read this notification");
    }

    // Add to readBy if not already there
    if (!notification.readBy.some(id => id.toString() === userId.toString())) {
        notification.readBy.push(userId);
        await notification.save();
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Notification marked as read")
    );
});

const markAllAsRead = asyncHandler(async (req, res) => {
    const { _id: userId } = req.user;

    await Notification.updateMany(
        { 
            targetUsers: userId,
            readBy: { $ne: userId }
        },
        { 
            $addToSet: { readBy: userId } 
        }
    );

    return res.status(200).json(
        new ApiResponse(200, {}, "All notifications marked as read")
    );
});

const deleteNotification = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { _id: userId } = req.user;

    const notification = await Notification.findById(id);
    if (!notification) {
        throw new ApiError(404, "Notification not found");
    }

    // Instead of deleting the whole document (which might be a broadcast),
    // we remove the user from targetUsers so they don't see it anymore.
    notification.targetUsers = notification.targetUsers.filter(
        tid => tid.toString() !== userId.toString()
    );
    
    await notification.save();

    return res.status(200).json(
        new ApiResponse(200, {}, "Notification removed")
    );
});

const getUnreadCount = asyncHandler(async (req, res) => {
    const { _id: userId } = req.user;

    const unreadCount = await Notification.countDocuments({
        targetUsers: userId,
        readBy: { $ne: userId }
    });

    return res.status(200).json(
        new ApiResponse(200, { unreadCount }, "Unread count fetched")
    );
});

export {
    getUserNotifications,
    markNotificationAsRead,
    markAllAsRead,
    deleteNotification,
    getUnreadCount
};
