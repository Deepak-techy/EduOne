import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Task } from "../../models/task.model.js";
import { PAGINATION_DEFAULTS } from "../../admin.constants.js";


const getAllTasks = asyncHandler(async (req, res) => {
    const {
        page = PAGINATION_DEFAULTS.PAGE,
        limit = PAGINATION_DEFAULTS.LIMIT,
        search, priority, isCompleted,
        sortBy = "createdAt", order = "desc",
    } = req.query;

    const query = {};
    if (priority) query.priority = priority;
    if (isCompleted !== undefined) query.isCompleted = isCompleted === "true";
    if (search) {
        query.$or = [
            { subject: { $regex: search, $options: "i" } },
            { task: { $regex: search, $options: "i" } },
        ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const totalTasks = await Task.countDocuments(query);
    const totalPages = Math.ceil(totalTasks / limitNum);

    const tasks = await Task.find(query)
        .sort({ [sortBy]: order === "asc" ? 1 : -1 })
        .skip(skip).limit(limitNum)
        .populate("userId", "fullName userName email")
        .lean();

    return res.status(200).json(new ApiResponse(200,
        { count: tasks.length, page: pageNum, totalPages, totalTasks, tasks },
        "Tasks fetched successfully"
    ));
})

const getTaskStats = asyncHandler(async (req, res) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalTasks, completedTasks, pendingTasks, overdueTasks] = await Promise.all([
        Task.countDocuments(),
        Task.countDocuments({ isCompleted: true }),
        Task.countDocuments({ isCompleted: false }),
        Task.countDocuments({ isCompleted: false, dueDate: { $lt: new Date() } }),
    ]);

    // priority distribution
    const priorityDistribution = await Task.aggregate([
        { $group: { _id: "$priority", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
    ]);

    // completion trend (last 30 days)
    const completionTrend = await Task.aggregate([
        { $match: { completedAt: { $gte: thirtyDaysAgo, $ne: null } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$completedAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
    ]);

    // tasks created per day (last 30 days)
    const creationTrend = await Task.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
    ]);

    // subject distribution
    const subjectDistribution = await Task.aggregate([
        { $group: { _id: "$subject", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
    ]);

    return res.status(200).json(new ApiResponse(200,
        {
            overview: {
                totalTasks, completedTasks, pendingTasks, overdueTasks,
                completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
            },
            priorityDistribution,
            trends: { completionTrend, creationTrend },
            subjectDistribution,
        },
        "Task stats fetched successfully"
    ));
})

const getAIPerformanceStats = asyncHandler(async (req, res) => {
    // analyze AI scheduling usage patterns
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ isCompleted: true });

    // average completion time (from creation to completion)
    const avgCompletionTime = await Task.aggregate([
        { $match: { isCompleted: true, completedAt: { $ne: null } } },
        { $project: { completionTime: { $subtract: ["$completedAt", "$createdAt"] } } },
        { $group: { _id: null, avgTime: { $avg: "$completionTime" } } },
    ]);

    // tasks completed before vs after due date
    const completedOnTime = await Task.countDocuments({
        isCompleted: true, completedAt: { $ne: null },
        $expr: { $lte: ["$completedAt", "$dueDate"] }
    });

    const completedLate = completedTasks - completedOnTime;

    // priority-based completion rates
    const priorityCompletion = await Task.aggregate([
        { $group: {
            _id: "$priority",
            total: { $sum: 1 },
            completed: { $sum: { $cond: ["$isCompleted", 1, 0] } }
        }},
        { $project: {
            _id: 0, priority: "$_id", total: 1, completed: 1,
            completionRate: { $round: [{ $multiply: [{ $divide: ["$completed", "$total"] }, 100] }, 0] }
        }},
    ]);

    return res.status(200).json(new ApiResponse(200,
        {
            overview: { totalTasks, completedTasks, completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0 },
            performance: {
                avgCompletionTimeMs: avgCompletionTime[0]?.avgTime || 0,
                completedOnTime, completedLate,
                onTimeRate: completedTasks > 0 ? Math.round((completedOnTime / completedTasks) * 100) : 0,
            },
            priorityCompletion,
        },
        "AI performance stats fetched successfully"
    ));
})

const deleteTask = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw new ApiError(400, "Task ID is required");

    const task = await Task.findByIdAndDelete(id);
    if (!task) throw new ApiError(404, "Task not found");

    return res.status(200).json(new ApiResponse(200, {}, "Task deleted successfully"));
})


export { getAllTasks, getTaskStats, getAIPerformanceStats, deleteTask }
