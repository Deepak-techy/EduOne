import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Post } from "../../models/post.model.js";
import { Comment } from "../../models/comment.model.js";
import { Bookmark } from "../../models/bookmark.model.js";
import { Report } from "../../models/report.model.js";
import { PAGINATION_DEFAULTS } from "../../admin.constants.js";


const getAllPosts = asyncHandler(async (req, res) => {
    const {
        page = PAGINATION_DEFAULTS.PAGE,
        limit = PAGINATION_DEFAULTS.LIMIT,
        search, authorRole,
        sortBy = "createdAt", order = "desc",
    } = req.query;

    const query = {};
    if (authorRole) query.authorRole = authorRole;
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { content: { $regex: search, $options: "i" } },
        ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const totalPosts = await Post.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / limitNum);

    const posts = await Post.find(query)
        .sort({ [sortBy]: order === "asc" ? 1 : -1 })
        .skip(skip).limit(limitNum)
        .populate("author", "fullName userName avatar role")
        .lean();

    return res.status(200).json(new ApiResponse(200,
        { count: posts.length, page: pageNum, totalPages, totalPosts, posts },
        "Posts fetched successfully"
    ));
})

const getPostById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw new ApiError(400, "Post ID is required");

    const post = await Post.findById(id)
        .populate("author", "fullName userName avatar role").lean();
    if (!post) throw new ApiError(404, "Post not found");

    // get report count for this post
    const reportCount = await Report.countDocuments({
        reportedContentId: id, contentType: "Post"
    });

    return res.status(200).json(new ApiResponse(200,
        { ...post, reportCount },
        "Post fetched successfully"
    ));
})

const deletePost = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw new ApiError(400, "Post ID is required");

    const post = await Post.findById(id);
    if (!post) throw new ApiError(404, "Post not found");

    // delete related comments, bookmarks, and reports
    await Comment.deleteMany({ postId: id });
    await Bookmark.deleteMany({ postId: id });
    await Report.updateMany(
        { reportedContentId: id, contentType: "Post", status: "Pending" },
        { status: "Resolved", resolvedBy: req.user._id, resolvedAt: new Date(), adminNotes: "Post deleted by admin" }
    );
    await Post.deleteOne({ _id: id });

    return res.status(200).json(new ApiResponse(200, {}, "Post deleted successfully"));
})

const getFlaggedPosts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // find post IDs that have pending reports
    const reportedPostIds = await Report.distinct("reportedContentId", {
        contentType: "Post", status: "Pending"
    });

    const totalPosts = reportedPostIds.length;
    const totalPages = Math.ceil(totalPosts / limitNum);

    // fetch those posts with report counts
    const posts = await Post.find({ _id: { $in: reportedPostIds } })
        .sort({ createdAt: -1 }).skip(skip).limit(limitNum)
        .populate("author", "fullName userName avatar role").lean();

    // attach report counts to each post
    const postsWithReportCount = await Promise.all(
        posts.map(async (post) => {
            const reportCount = await Report.countDocuments({
                reportedContentId: post._id, contentType: "Post", status: "Pending"
            });
            return { ...post, reportCount };
        })
    );

    return res.status(200).json(new ApiResponse(200,
        { count: postsWithReportCount.length, page: pageNum, totalPages, totalPosts, posts: postsWithReportCount },
        "Flagged posts fetched successfully"
    ));
})

const getAllReports = asyncHandler(async (req, res) => {
    const {
        page = PAGINATION_DEFAULTS.PAGE,
        limit = PAGINATION_DEFAULTS.LIMIT,
        status, contentType,
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (contentType) query.contentType = contentType;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const totalReports = await Report.countDocuments(query);
    const totalPages = Math.ceil(totalReports / limitNum);

    const reports = await Report.find(query)
        .sort({ createdAt: -1 }).skip(skip).limit(limitNum)
        .populate("reporterId", "fullName userName avatar")
        .populate("resolvedBy", "fullName userName")
        .lean();

    return res.status(200).json(new ApiResponse(200,
        { count: reports.length, page: pageNum, totalPages, totalReports, reports },
        "Reports fetched successfully"
    ));
})

const getReportById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw new ApiError(400, "Report ID is required");

    const report = await Report.findById(id)
        .populate("reporterId", "fullName userName avatar email")
        .populate("resolvedBy", "fullName userName").lean();
    if (!report) throw new ApiError(404, "Report not found");

    // fetch the reported content details
    let reportedContent = null;
    if (report.contentType === "Post") {
        reportedContent = await Post.findById(report.reportedContentId)
            .populate("author", "fullName userName avatar").lean();
    } else if (report.contentType === "Comment") {
        reportedContent = await Comment.findById(report.reportedContentId)
            .populate("userId", "fullName userName avatar").lean();
    }

    return res.status(200).json(new ApiResponse(200,
        { report, reportedContent },
        "Report fetched successfully"
    ));
})

const resolveReport = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { adminNotes } = req.body;
    if (!id) throw new ApiError(400, "Report ID is required");

    const report = await Report.findById(id);
    if (!report) throw new ApiError(404, "Report not found");
    if (report.status !== "Pending") throw new ApiError(400, "Report is already " + report.status.toLowerCase());

    report.status = "Resolved";
    report.resolvedBy = req.user._id;
    report.resolvedAt = new Date();
    if (adminNotes) report.adminNotes = adminNotes;
    await report.save();

    return res.status(200).json(new ApiResponse(200, report, "Report resolved successfully"));
})

const rejectReport = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { adminNotes } = req.body;
    if (!id) throw new ApiError(400, "Report ID is required");

    const report = await Report.findById(id);
    if (!report) throw new ApiError(404, "Report not found");
    if (report.status !== "Pending") throw new ApiError(400, "Report is already " + report.status.toLowerCase());

    report.status = "Rejected";
    report.resolvedBy = req.user._id;
    report.resolvedAt = new Date();
    if (adminNotes) report.adminNotes = adminNotes;
    await report.save();

    return res.status(200).json(new ApiResponse(200, report, "Report rejected successfully"));
})

const deleteComment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw new ApiError(400, "Comment ID is required");

    const comment = await Comment.findById(id);
    if (!comment) throw new ApiError(404, "Comment not found");

    // delete the comment and decrement commentsCount on the post
    await Comment.deleteOne({ _id: id });
    await Post.findByIdAndUpdate(comment.postId, { $inc: { commentsCount: -1 } });

    // resolve any pending reports for this comment
    await Report.updateMany(
        { reportedContentId: id, contentType: "Comment", status: "Pending" },
        { status: "Resolved", resolvedBy: req.user._id, resolvedAt: new Date(), adminNotes: "Comment deleted by admin" }
    );

    return res.status(200).json(new ApiResponse(200, {}, "Comment deleted successfully"));
})

const getCommunityStats = asyncHandler(async (req, res) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
        totalPosts, totalComments, totalReports,
        pendingReports, resolvedReports,
        recentPosts, recentComments,
    ] = await Promise.all([
        Post.countDocuments(),
        Comment.countDocuments(),
        Report.countDocuments(),
        Report.countDocuments({ status: "Pending" }),
        Report.countDocuments({ status: "Resolved" }),
        Post.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
        Comment.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    ]);

    // posts per day trend (last 30 days)
    const postsPerDay = await Post.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
    ]);

    // top contributors
    const topContributors = await Post.aggregate([
        { $group: { _id: "$author", postCount: { $sum: 1 } } },
        { $sort: { postCount: -1 } },
        { $limit: 10 },
        { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
        { $unwind: "$user" },
        { $project: { _id: 0, userId: "$_id", fullName: "$user.fullName", userName: "$user.userName", postCount: 1 } },
    ]);

    return res.status(200).json(new ApiResponse(200,
        {
            overview: { totalPosts, totalComments, totalReports, pendingReports, resolvedReports },
            recent: { posts: recentPosts, comments: recentComments },
            trends: { postsPerDay },
            topContributors,
        },
        "Community stats fetched successfully"
    ));
})


export {
    getAllPosts, getPostById, deletePost, getFlaggedPosts,
    getAllReports, getReportById, resolveReport, rejectReport,
    deleteComment, getCommunityStats,
}
