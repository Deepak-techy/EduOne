import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Announcement } from "../../models/announcement.model.js";
import { Notification } from "../../models/notification.model.js";
import { User } from "../../models/user.model.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { PAGINATION_DEFAULTS } from "../../admin.constants.js";


const getAllAnnouncements = asyncHandler(async (req, res) => {
    const { page = PAGINATION_DEFAULTS.PAGE, limit = PAGINATION_DEFAULTS.LIMIT } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const totalAnnouncements = await Announcement.countDocuments();
    const totalPages = Math.ceil(totalAnnouncements / limitNum);

    const announcements = await Announcement.find()
        .sort({ isPinned: -1, createdAt: -1 })
        .skip(skip).limit(limitNum)
        .populate("createdBy", "fullName userName").lean();

    return res.status(200).json(new ApiResponse(200,
        { count: announcements.length, page: pageNum, totalPages, totalAnnouncements, announcements },
        "Announcements fetched successfully"
    ));
})

const createAnnouncement = asyncHandler(async (req, res) => {
    const { title, content, targetAudience, isPinned, expiresAt, notifyUsers } = req.body;

    if (!title || !content) {
        throw new ApiError(400, "Title and content are required");
    }

    const announcement = await Announcement.create({
        title, content, targetAudience,
        isPinned: isPinned || false,
        expiresAt: expiresAt || null,
        createdBy: req.user._id,
    });

    if (!announcement) {
        throw new ApiError(500, "Failed to create announcement");
    }

    // Automatically create system notifications if requested
    if (notifyUsers) {
        const query = { accountStatus: "Active" };
        if (targetAudience === "Students") query.role = "Student";
        if (targetAudience === "Teachers") query.role = "Teacher";

        const users = await User.find(query).select("_id").lean();
        const userIds = users.map(u => u._id);

        if (userIds.length > 0) {
            await Notification.create({
                title: `📢 ${title}`,
                message: content.substring(0, 200) + (content.length > 200 ? "..." : ""),
                type: "System",
                targetUsers: userIds,
                sentBy: req.user._id,
            });
        }
    }

    const populatedAnnouncement = await Announcement.findById(announcement._id)
        .populate("createdBy", "fullName userName").lean();

    return res.status(201).json(new ApiResponse(201, populatedAnnouncement, "Announcement created successfully"));
})

const updateAnnouncement = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, content, targetAudience, isPinned, isActive, expiresAt } = req.body;
    if (!id) throw new ApiError(400, "Announcement ID is required");

    const updateFields = {};
    if (title) updateFields.title = title;
    if (content) updateFields.content = content;
    if (targetAudience) updateFields.targetAudience = targetAudience;
    if (isPinned !== undefined) updateFields.isPinned = isPinned;
    if (isActive !== undefined) updateFields.isActive = isActive;
    if (expiresAt !== undefined) updateFields.expiresAt = expiresAt;

    const announcement = await Announcement.findByIdAndUpdate(id, updateFields, { new: true })
        .populate("createdBy", "fullName userName");
    if (!announcement) throw new ApiError(404, "Announcement not found");

    return res.status(200).json(new ApiResponse(200, announcement, "Announcement updated successfully"));
})

const deleteAnnouncement = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw new ApiError(400, "Announcement ID is required");

    const announcement = await Announcement.findByIdAndDelete(id);
    if (!announcement) throw new ApiError(404, "Announcement not found");

    return res.status(200).json(new ApiResponse(200, {}, "Announcement deleted successfully"));
})

const sendNotification = asyncHandler(async (req, res) => {
    const { title, message, type, targetUserIds } = req.body;

    if (!title || !message) {
        throw new ApiError(400, "Title and message are required");
    }

    const notification = await Notification.create({
        title, message,
        type: type || "Admin",
        targetUsers: targetUserIds || [],
        sentBy: req.user._id,
    });

    if (!notification) {
        throw new ApiError(500, "Failed to send notification");
    }

    return res.status(201).json(new ApiResponse(201, notification, "Notification sent successfully"));
})

const broadcastEmail = asyncHandler(async (req, res) => {
    const { subject, htmlContent, targetAudience } = req.body;

    if (!subject || !htmlContent) {
        throw new ApiError(400, "Subject and content are required");
    }

    // get target users based on audience
    const query = { accountStatus: "Active" };
    if (targetAudience === "Students") query.role = "Student";
    if (targetAudience === "Teachers") query.role = "Teacher";

    const users = await User.find(query).select("email").lean();

    if (users.length === 0) {
        throw new ApiError(404, "No users found for the target audience");
    }

    // send emails in batches to avoid overwhelming SMTP
    const batchSize = 10;
    let sentCount = 0;
    let failedCount = 0;

    for (let i = 0; i < users.length; i += batchSize) {
        const batch = users.slice(i, i + batchSize);
        const emailPromises = batch.map(user =>
            sendEmail(user.email, subject, htmlContent).catch(() => {
                failedCount++;
                return null;
            })
        );
        const results = await Promise.all(emailPromises);
        sentCount += results.filter(r => r !== null).length;
    }

    return res.status(200).json(new ApiResponse(200,
        { totalRecipients: users.length, sent: sentCount, failed: failedCount },
        "Broadcast email sent successfully"
    ));
})

const sendPushNotification = asyncHandler(async (req, res) => {
    // placeholder for future push notification integration (Firebase/OneSignal)
    const { title, message, targetUserIds } = req.body;

    if (!title || !message) {
        throw new ApiError(400, "Title and message are required");
    }

    // save as notification for now
    const notification = await Notification.create({
        title, message,
        type: "Alert",
        targetUsers: targetUserIds || [],
        sentBy: req.user._id,
    });

    return res.status(201).json(new ApiResponse(201, notification,
        "Push notification saved (push delivery not yet configured)"
    ));
})

const pinAnnouncement = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw new ApiError(400, "Announcement ID is required");

    const announcement = await Announcement.findById(id);
    if (!announcement) throw new ApiError(404, "Announcement not found");

    // toggle pin status
    announcement.isPinned = !announcement.isPinned;
    await announcement.save();

    return res.status(200).json(new ApiResponse(200, announcement,
        announcement.isPinned ? "Announcement pinned successfully" : "Announcement unpinned successfully"
    ));
})


export {
    getAllAnnouncements, createAnnouncement, updateAnnouncement,
    deleteAnnouncement, sendNotification, broadcastEmail,
    sendPushNotification, pinAnnouncement,
}
