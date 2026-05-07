import { User } from "../models/user.model.js";
import { Note } from "../models/note.model.js";
import { Task } from "../models/task.model.js";
import { Resume } from "../models/resume.model.js";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";
import { LoginHistory } from "../models/loginHistory.model.js";


// Aggregate daily active users from login history
export const aggregateDAU = async (days = 30) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await LoginHistory.aggregate([
        { $match: { loginAt: { $gte: startDate }, status: "Success" } },
        {
            $group: {
                _id: {
                    date: { $dateToString: { format: "%Y-%m-%d", date: "$loginAt" } },
                    userId: "$userId"
                }
            }
        },
        {
            $group: {
                _id: "$_id.date",
                activeUsers: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, date: "$_id", activeUsers: 1 } },
    ]);
};

// Aggregate monthly active users
export const aggregateMAU = async (months = 12) => {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    return await LoginHistory.aggregate([
        { $match: { loginAt: { $gte: startDate }, status: "Success" } },
        {
            $group: {
                _id: {
                    month: { $dateToString: { format: "%Y-%m", date: "$loginAt" } },
                    userId: "$userId"
                }
            }
        },
        {
            $group: {
                _id: "$_id.month",
                activeUsers: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, month: "$_id", activeUsers: 1 } },
    ]);
};

// Aggregate user registration growth over time
export const aggregateUserGrowth = async (months = 12) => {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    return await User.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                newUsers: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, month: "$_id", newUsers: 1 } },
    ]);
};

// Aggregate feature usage across all EduOne features
export const aggregateFeatureUsage = async () => {
    const [notesCount, tasksCount, resumesCount, postsCount, commentsCount] = await Promise.all([
        Note.countDocuments(),
        Task.countDocuments(),
        Resume.countDocuments(),
        Post.countDocuments(),
        Comment.countDocuments(),
    ]);

    return [
        { feature: "Notes Organizer", count: notesCount },
        { feature: "Academic Planner", count: tasksCount },
        { feature: "Resume Analyzer", count: resumesCount },
        { feature: "Community Posts", count: postsCount },
        { feature: "Community Comments", count: commentsCount },
    ].sort((a, b) => b.count - a.count);
};

// Get system health metrics
export const getSystemMetrics = () => {
    const memUsage = process.memoryUsage();
    return {
        uptime: Math.floor(process.uptime()),
        uptimeFormatted: formatUptime(process.uptime()),
        memory: {
            rss: formatBytes(memUsage.rss),
            heapUsed: formatBytes(memUsage.heapUsed),
            heapTotal: formatBytes(memUsage.heapTotal),
            external: formatBytes(memUsage.external),
        },
        nodeVersion: process.version,
        platform: process.platform,
        pid: process.pid,
    };
};

// Helper: format bytes to human readable
const formatBytes = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Helper: format uptime seconds to human readable
const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${mins}m`;
};
