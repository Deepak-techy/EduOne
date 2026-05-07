import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Resume } from "../../models/resume.model.js";
import { deleteFromCloudinary } from "../../services/cloudinaryDelete.service.js";
import { PAGINATION_DEFAULTS } from "../../admin.constants.js";


const getAllResumes = asyncHandler(async (req, res) => {
    const {
        page = PAGINATION_DEFAULTS.PAGE,
        limit = PAGINATION_DEFAULTS.LIMIT,
        search, experienceLevel,
        sortBy = "createdAt", order = "desc",
    } = req.query;

    const query = {};
    if (experienceLevel) query.experienceLevel = experienceLevel;
    if (search) {
        query.$or = [
            { fullName: { $regex: search, $options: "i" } },
            { jobRole: { $regex: search, $options: "i" } },
        ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const totalResumes = await Resume.countDocuments(query);
    const totalPages = Math.ceil(totalResumes / limitNum);

    const resumes = await Resume.find(query)
        .sort({ [sortBy]: order === "asc" ? 1 : -1 })
        .skip(skip).limit(limitNum)
        .populate("userId", "fullName userName email")
        .lean();

    return res.status(200).json(new ApiResponse(200,
        { count: resumes.length, page: pageNum, totalPages, totalResumes, resumes },
        "Resumes fetched successfully"
    ));
})

const getResumeById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw new ApiError(400, "Resume ID is required");

    const resume = await Resume.findById(id)
        .populate("userId", "fullName userName email").lean();
    if (!resume) throw new ApiError(404, "Resume not found");

    return res.status(200).json(new ApiResponse(200, resume, "Resume fetched successfully"));
})

const deleteResume = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw new ApiError(400, "Resume ID is required");

    const resume = await Resume.findById(id);
    if (!resume) throw new ApiError(404, "Resume not found");

    // delete from cloudinary
    if (resume.resumePublicId) {
        await deleteFromCloudinary(resume.resumePublicId);
    }

    await Resume.deleteOne({ _id: id });

    return res.status(200).json(new ApiResponse(200, {}, "Resume deleted successfully"));
})

const getResumeStats = asyncHandler(async (req, res) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalResumes, recentResumes] = await Promise.all([
        Resume.countDocuments(),
        Resume.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    ]);

    // average overall score
    const avgScore = await Resume.aggregate([
        { $group: { _id: null, avgScore: { $avg: "$analysisResult.overallScore" } } },
    ]);

    // experience level distribution
    const experienceDistribution = await Resume.aggregate([
        { $group: { _id: "$experienceLevel", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
    ]);

    // top job roles
    const topJobRoles = await Resume.aggregate([
        { $group: { _id: "$jobRole", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
    ]);

    // score distribution (buckets: 0-20, 21-40, 41-60, 61-80, 81-100)
    const scoreDistribution = await Resume.aggregate([
        { $bucket: {
            groupBy: "$analysisResult.overallScore",
            boundaries: [0, 21, 41, 61, 81, 101],
            default: "Unknown",
            output: { count: { $sum: 1 } }
        }},
    ]);

    // upload trend (last 30 days)
    const uploadTrend = await Resume.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
    ]);

    return res.status(200).json(new ApiResponse(200,
        {
            overview: { totalResumes, recentResumes, avgOverallScore: Math.round(avgScore[0]?.avgScore || 0) },
            experienceDistribution,
            topJobRoles,
            scoreDistribution,
            trends: { uploadTrend },
        },
        "Resume stats fetched successfully"
    ));
})


export { getAllResumes, getResumeById, deleteResume, getResumeStats }
