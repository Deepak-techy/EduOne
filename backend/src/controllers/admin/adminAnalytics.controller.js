import mongoose from "mongoose";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ErrorLog } from "../../models/errorLog.model.js";
import { PAGINATION_DEFAULTS } from "../../admin.constants.js";
import {
    aggregateDAU,
    aggregateMAU,
    aggregateFeatureUsage,
    aggregateUserGrowth,
    getSystemMetrics,
} from "../../services/adminAnalytics.service.js";


const getDailyActiveUsers = asyncHandler(async (req, res) => {
    const { days = 30 } = req.query;
    const data = await aggregateDAU(parseInt(days));

    return res.status(200).json(new ApiResponse(200, data, "Daily active users fetched successfully"));
})

const getMonthlyActiveUsers = asyncHandler(async (req, res) => {
    const { months = 12 } = req.query;
    const data = await aggregateMAU(parseInt(months));

    return res.status(200).json(new ApiResponse(200, data, "Monthly active users fetched successfully"));
})

const getFeatureUsage = asyncHandler(async (req, res) => {
    const data = await aggregateFeatureUsage();

    return res.status(200).json(new ApiResponse(200, data, "Feature usage fetched successfully"));
})

const getUserGrowth = asyncHandler(async (req, res) => {
    const { months = 12 } = req.query;
    const data = await aggregateUserGrowth(parseInt(months));

    return res.status(200).json(new ApiResponse(200, data, "User growth data fetched successfully"));
})

const getTopFeatures = asyncHandler(async (req, res) => {
    const features = await aggregateFeatureUsage();

    // top features are already sorted by count
    return res.status(200).json(new ApiResponse(200,
        { features: features.slice(0, 5) },
        "Top features fetched successfully"
    ));
})

const getTrafficSource = asyncHandler(async (req, res) => {
    // placeholder — returns user agent distribution from login history as a proxy for traffic source
    const { LoginHistory } = await import("../../models/loginHistory.model.js");

    const sources = await LoginHistory.aggregate([
        { $match: { status: "Success" } },
        { $project: {
            browser: {
                $switch: {
                    branches: [
                        { case: { $regexMatch: { input: "$userAgent", regex: /Chrome/i } }, then: "Chrome" },
                        { case: { $regexMatch: { input: "$userAgent", regex: /Firefox/i } }, then: "Firefox" },
                        { case: { $regexMatch: { input: "$userAgent", regex: /Safari/i } }, then: "Safari" },
                        { case: { $regexMatch: { input: "$userAgent", regex: /Edge/i } }, then: "Edge" },
                    ],
                    default: "Other"
                }
            }
        }},
        { $group: { _id: "$browser", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $project: { _id: 0, source: "$_id", count: 1 } },
    ]);

    return res.status(200).json(new ApiResponse(200, sources, "Traffic source data fetched successfully"));
})

const getErrorLogs = asyncHandler(async (req, res) => {
    const {
        page = PAGINATION_DEFAULTS.PAGE,
        limit = PAGINATION_DEFAULTS.LIMIT,
        statusCode,
    } = req.query;

    const query = {};
    if (statusCode) query.statusCode = parseInt(statusCode);

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const totalLogs = await ErrorLog.countDocuments(query);
    const totalPages = Math.ceil(totalLogs / limitNum);

    const logs = await ErrorLog.find(query)
        .sort({ createdAt: -1 }).skip(skip).limit(limitNum)
        .populate("userId", "fullName userName").lean();

    return res.status(200).json(new ApiResponse(200,
        { count: logs.length, page: pageNum, totalPages, totalLogs, logs },
        "Error logs fetched successfully"
    ));
})

const getSystemHealth = asyncHandler(async (req, res) => {
    const metrics = getSystemMetrics();

    // check MongoDB connection
    const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";

    return res.status(200).json(new ApiResponse(200,
        {
            status: "Healthy",
            database: { status: dbStatus, name: mongoose.connection.name, host: mongoose.connection.host },
            server: metrics,
            timestamp: new Date().toISOString(),
        },
        "System health fetched successfully"
    ));
})


export {
    getDailyActiveUsers, getMonthlyActiveUsers, getFeatureUsage,
    getUserGrowth, getTopFeatures, getTrafficSource,
    getErrorLogs, getSystemHealth,
}
