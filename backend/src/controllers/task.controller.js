import { Task } from "../models/task.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateAIBasedDailyPriorities } from "../services/aiGenerateTask.service.js";
import {
    getDateRange,
    isToday,
    getWeekRange,
    getPriorityColor,
} from "../utils/dateUtils.js";
import { getTaskStats } from "../utils/taskAnalyzer.js";

const createTask = asyncHandler(async (req, res) => {
    // get task details from frontend
    const { subject, task, dueDate, priority } = req.body;
    const { _id: userId } = req.user;

    if (!subject || !task || !dueDate || !priority) {
        throw new ApiError(400, "All fields are required");
    }

    // get priority color
    const colorCode = getPriorityColor(priority);

    // create task
    const taskData = await Task.create({
        userId,
        subject,
        task,
        dueDate: new Date(dueDate),
        priority,
        colorCode,
    });

    if (!taskData) {
        throw new ApiError(500, "Failed to create task");
    }

    // return response
    return res
        .status(201)
        .json(new ApiResponse(201, taskData, "Task created successfully"));
})

const getDashboardData = asyncHandler(async (req, res) => {
    // get userId from request
    const { _id: userId } = req.user;

    // set date to start of day
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // set date to end of day
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // get today's tasks
    const todaysTasks = await Task.find({
        userId,
        dueDate: {
            $gte: today,
            $lt: tomorrow,
        }
    }).sort({
        priority: -1
    })

    // get this week's tasks
    const { startOfWeek, endOfWeek } = getWeekRange();

    const weeklyTasks = await Task.find({
        userId,
        dueDate: {
            $gte: startOfWeek,
            $lt: endOfWeek,
        }
    }).sort({
        dueDate: 1
    })

    // get task stats
    const todaysStats = getTaskStats(todaysTasks);
    const weeklyStats = getTaskStats(weeklyTasks);

    // return response
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {
                today: {
                    tasks: todaysTasks,
                    stats: todaysStats,
                },
                week: {
                    tasks: weeklyTasks,
                    stats: weeklyStats,
                }
            },
            "Dashboard data fetched successfully"
    ))
});

const getAllTasks = asyncHandler(async (req, res) => {
    // get userId from request
    const { _id: userId } = req.user;

    // get all tasks
    const tasks = await Task.find({
        userId,
    }).sort({
        dueDate: 1
    })

    // return response
    return res
        .status(200)
        .json(new ApiResponse(200,
            {
                count: tasks.length,
                tasks
            },
            "Tasks fetched successfully"
        ));
})

const getTasksByRange = asyncHandler(async (req, res) => {
    // get userId from request
    const { _id: userId } = req.user;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        throw new ApiError(400, "Start date and end date are required");
    }

    // creare the query
    const query = {
        userId,
        dueDate: {
            $gte: new Date(startDate),
            $lte: new Date (endDate),
        }
    }

    // get all tasks within the range
    const tasks = await Task.find(
        query
    ).sort({
        dueDate: 1,
        priority: -1
    })

    // return response
    return res
        .status(200)
        .json(new ApiResponse(200,
            {
                count: tasks.length,
                tasks
            },
            "Tasks fetched successfully"
        ));
})

const getTasksByDueDate = asyncHandler(async (req, res) => {
    // get userId from request
    const { _id: userId } = req.user;
    const { dueDate } = req.query;

    if (!dueDate) {
        throw new ApiError(400, "dueDate query parameter is required. Example: ?dueDate=2025-11-05");
    }

    // set date to start of day
    const targetDate = new Date(dueDate)
    if (isNaN(targetDate.getTime())) {
        throw new ApiError(400, "Invalid date format for dueDate. Use YYYY-MM-DD or an ISO date string.");
    }

    targetDate.setHours(0, 0, 0, 0);

    // set date to end of day
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // get all tasks within the range
    const tasks = await Task.find({
        userId,
        dueDate: {
            $gte: targetDate,
            $lt: nextDay,
        }
    }).sort({
        priority: -1
    })

    // get stats of the tasks
    const stats = getTaskStats(tasks);

    // return response
    return res
        .status(200)
        .json(new ApiResponse(200,
            {
                count: tasks.length,
                tasks,
                stats
            },
            "Tasks fetched successfully"
    ))

})

const generateAIPrioritizedTasks = asyncHandler(async (req, res) => {
    // get userId from request
    const { _id: userId } = req.user

    // get the date range
    const { startDate, endDate } = getDateRange(7);

    // get all incomplete tasks for the next 7 days
    const upcomingTasks = await Task.find({
        userId,
        dueDate: {
            $gte: startDate,
            $lte: endDate,
        },
        isCompleted: false,
    }).sort({ 
        dueDate: 1
    })

    if (upcomingTasks.length === 0) {
        return res
            .status(200)
            .json(new ApiResponse(200, [], "No tasks found for the next 7 days"));
    }

    // generate AI prioritized tasks
    const prioritizedTasks = await generateAIBasedDailyPriorities(upcomingTasks);

    if (!prioritizedTasks) {
        throw new ApiError(500, "Failed to generate AI prioritized tasks");
    }

    // return response
    return res
        .status(200)
        .json(new ApiResponse(200, prioritizedTasks, "AI prioritized tasks generated successfully"));
})

const markTaskCompleted = asyncHandler(async (req, res) => {
    // get taskId from params and userId from request
    const { taskId } = req.params;
    const { _id: userId } = req.user;

    if (!taskId) {
        throw new ApiError(400, "taskId is required");
    }

    // find and update the task
    const task = await Task.findOneAndUpdate(
        {
            _id: taskId,
            userId
        },
        {
            isCompleted: true,
            completedAt: new Date()
        },
        { new: true }
    );

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    // return response
    return res
        .status(200)
        .json(new ApiResponse(200, task, "Task marked as completed successfully"));
});

const updateTask = asyncHandler(async (req, res) => {
    // get taskId from params and userId from request
    const { taskId } = req.params;
    const { _id: userId } = req.user;
    const updates = req.body;

    // update color if priority changed
    if (updates.priority) {
        updates.colorCode = getPriorityColor(updates.priority);
    }

    // find and update the task
    const task = await Task.findOneAndUpdate(
        {
            _id: taskId,
            userId
        },
        updates,
        {
            new: true,
            runValidators: true
        }
    )

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    // return response
    return res
        .status(200)
        .json(new ApiResponse(200, task, "Task updated successfully"));

})

const deleteTask = asyncHandler(async (req, res) => {
    // get taskId from params and userId from request
    const { taskId } = req.params;
    const { _id: userId } = req.user;

    if (!taskId) {
        throw new ApiError(400, "taskId is required");
    }

    // find and delete the task
    const task = await Task.findOneAndDelete(
        {
            _id: taskId,
            userId
        });

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    // return response
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Task deleted successfully"));
});


export {
    createTask,
    getDashboardData,
    getAllTasks,
    getTasksByRange,
    getTasksByDueDate,
    generateAIPrioritizedTasks,
    markTaskCompleted,
    updateTask,
    deleteTask
}