import { mongoose } from "mongoose";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";
import { Bookmark } from "../models/bookmark.model.js";
import { Report } from "../models/report.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getIO } from "../config/socket.config.js";


const createPost = asyncHandler(async (req, res) => {
    // get title and content from frontend
    const { title, content } = req.body;
    const { _id: userId, role } = req.user;

    if (!title || !content) {
        throw new ApiError(400, "Title and content are required");
    }

    // create post
    const post = await Post.create({
        title,
        content,
        author: userId,
        authorRole: role,
    });

    if (!post) {
        throw new ApiError(500, "Failed to create post");
    }

    // populate author for real-time broadcast
    const populatedPost = await Post.findById(post._id)
        .populate("author", "fullName userName avatar")
        .lean();

    // emit real-time event for new post
    getIO().emit("community:newPost", populatedPost);

    // return response
    return res
        .status(201)
        .json(new ApiResponse(201, populatedPost, "Post created successfully"));
})

const getAllPosts = asyncHandler(async (req, res) => {
    // get filter and pagination params from query
    const { filter = "all", page = 1, limit = 10 } = req.query;

    // build query based on filter
    const query = {};

    if (filter === "student") {
        query.authorRole = "Student";
    } else if (filter === "teacher") {
        query.authorRole = "Teacher";
    } else if (filter === "admin") {
        query.authorRole = "Admin";
    } else if (filter === "my-posts") {
        query.author = new mongoose.Types.ObjectId(req.user._id);
    } else if (filter === "liked") {
        query.upvotes = { $in: [new mongoose.Types.ObjectId(req.user._id)] };
    }

    // calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // get total count for pagination
    const totalPosts = await Post.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / limitNum);

    // fetch posts sorted newest first with author populated
    const posts = await Post.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate("author", "fullName userName avatar")
        .lean();

    // return response
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {
                count: posts.length,
                page: pageNum,
                totalPages,
                totalPosts,
                posts,
            },
            "Posts fetched successfully"
        ));
})

const getPostById = asyncHandler(async (req, res) => {
    // get postId from params
    const { postId } = req.params;

    if (!postId) {
        throw new ApiError(400, "Post ID is required");
    }

    // find post and populate author
    const post = await Post.findById(postId)
        .populate("author", "fullName userName avatar")
        .lean();

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    // return response
    return res
        .status(200)
        .json(new ApiResponse(200, post, "Post fetched successfully"));
})

const deletePost = asyncHandler(async (req, res) => {
    // get postId from params
    const { postId } = req.params;
    const { _id: userId, role } = req.user;

    if (!postId) {
        throw new ApiError(400, "Post ID is required");
    }

    // find the post
    const post = await Post.findById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    const isOwner = post.author.toString() === userId.toString();
    const isAdmin = role === "Admin";
    const isTeacherDeletingStudent = role === "Teacher" && post.authorRole === "Student";

    if (!isOwner && !isAdmin && !isTeacherDeletingStudent) {
        throw new ApiError(403, "You are not authorized to delete this post");
    }

    // delete the post and its related comments and bookmarks
    await Comment.deleteMany({ postId });
    await Bookmark.deleteMany({ postId });
    await Post.deleteOne({ _id: postId });

    // emit real-time event for deleted post
    getIO().emit("community:postDeleted", { postId });

    // return response
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Post deleted successfully"));
})

// ==================== VOTING ====================

const toggleUpvote = asyncHandler(async (req, res) => {
    // get postId from params
    const { postId } = req.params;
    const { _id: userId } = req.user;

    if (!postId) {
        throw new ApiError(400, "Post ID is required");
    }

    // find the post
    const post = await Post.findById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    // check if user already upvoted
    const hasUpvoted = post.upvotes.includes(userId);

    if (hasUpvoted) {
        // remove upvote (toggle off)
        post.upvotes.pull(userId);
    } else {
        // remove from downvotes if present, then add upvote
        post.downvotes.pull(userId);
        post.upvotes.push(userId);
    }

    await post.save();

    const voteData = {
        postId,
        upvotes: post.upvotes.length,
        downvotes: post.downvotes.length,
    };

    // emit real-time vote update to users viewing this post
    getIO().to(`post:${postId}`).emit("community:voteUpdated", voteData);

    // return response
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {
                ...voteData,
                hasUpvoted: !hasUpvoted,
                hasDownvoted: false,
            },
            hasUpvoted ? "Upvote removed" : "Post upvoted successfully"
        ));
})

const toggleDownvote = asyncHandler(async (req, res) => {
    // get postId from params
    const { postId } = req.params;
    const { _id: userId } = req.user;

    if (!postId) {
        throw new ApiError(400, "Post ID is required");
    }

    // find the post
    const post = await Post.findById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    // check if user already downvoted
    const hasDownvoted = post.downvotes.includes(userId);

    if (hasDownvoted) {
        // remove downvote (toggle off)
        post.downvotes.pull(userId);
    } else {
        // remove from upvotes if present, then add downvote
        post.upvotes.pull(userId);
        post.downvotes.push(userId);
    }

    await post.save();

    const voteData = {
        postId,
        upvotes: post.upvotes.length,
        downvotes: post.downvotes.length,
    };

    // emit real-time vote update to users viewing this post
    getIO().to(`post:${postId}`).emit("community:voteUpdated", voteData);

    // return response
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {
                ...voteData,
                hasUpvoted: false,
                hasDownvoted: !hasDownvoted,
            },
            hasDownvoted ? "Downvote removed" : "Post downvoted successfully"
        ));
})

// ==================== COMMENTS ====================

const addComment = asyncHandler(async (req, res) => {
    // get postId from params and text from body
    const { postId } = req.params;
    const { text } = req.body;
    const { _id: userId } = req.user;

    if (!postId) {
        throw new ApiError(400, "Post ID is required");
    }

    if (!text) {
        throw new ApiError(400, "Comment text is required");
    }

    // check if post exists
    const post = await Post.findById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    // create comment
    const comment = await Comment.create({
        postId,
        userId,
        text,
    });

    if (!comment) {
        throw new ApiError(500, "Failed to add comment");
    }

    // increment commentsCount on the post
    await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

    // populate userId for response
    const populatedComment = await Comment.findById(comment._id)
        .populate("userId", "fullName userName avatar")
        .lean();

    // emit real-time event for new comment to users viewing this post
    getIO().to(`post:${postId}`).emit("community:newComment", {
        postId,
        comment: populatedComment,
        commentsCount: post.commentsCount + 1,
    });

    // return response
    return res
        .status(201)
        .json(new ApiResponse(201, populatedComment, "Comment added successfully"));
})

const getComments = asyncHandler(async (req, res) => {
    // get postId from params and pagination from query
    const { postId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!postId) {
        throw new ApiError(400, "Post ID is required");
    }

    // check if post exists
    const postExists = await Post.exists({ _id: postId });

    if (!postExists) {
        throw new ApiError(404, "Post not found");
    }

    // calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // get total count for pagination
    const totalComments = await Comment.countDocuments({ postId });
    const totalPages = Math.ceil(totalComments / limitNum);

    // fetch comments sorted newest first
    const comments = await Comment.find({ postId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate("userId", "fullName userName avatar")
        .lean();

    // return response
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {
                count: comments.length,
                page: pageNum,
                totalPages,
                totalComments,
                comments,
            },
            "Comments fetched successfully"
        ));
})

const deleteComment = asyncHandler(async (req, res) => {
    // get commentId from params
    const { commentId } = req.params;
    const { _id: userId, role } = req.user;

    if (!commentId) {
        throw new ApiError(400, "Comment ID is required");
    }

    // find the comment
    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    const post = await Post.findById(comment.postId);
    const isPostOwner = post && post.author.toString() === userId.toString();
    const isCommentOwner = comment.userId.toString() === userId.toString();
    const isAdmin = role === "Admin";

    if (!isCommentOwner && !isAdmin && !isPostOwner) {
        throw new ApiError(403, "You are not authorized to delete this comment");
    }

    // delete the comment and decrement commentsCount
    await Comment.deleteOne({ _id: commentId });
    const updatedPost = await Post.findByIdAndUpdate(
        comment.postId,
        { $inc: { commentsCount: -1 } },
        { new: true }
    );

    // emit real-time event for deleted comment
    getIO().to(`post:${comment.postId}`).emit("community:commentDeleted", {
        postId: comment.postId,
        commentId,
        commentsCount: updatedPost.commentsCount,
    });

    // return response
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Comment deleted successfully"));
})

// ==================== BOOKMARKS ====================

const addBookmark = asyncHandler(async (req, res) => {
    // get postId from body
    const { postId } = req.body;
    const { _id: userId } = req.user;

    if (!postId) {
        throw new ApiError(400, "Post ID is required");
    }

    // check if post exists
    const postExists = await Post.exists({ _id: postId });

    if (!postExists) {
        throw new ApiError(404, "Post not found");
    }

    // create bookmark (unique index handles duplicates)
    try {
        const bookmark = await Bookmark.create({
            userId,
            postId,
        });

        // return response
        return res
            .status(201)
            .json(new ApiResponse(201, bookmark, "Post bookmarked successfully"));
    } catch (error) {
        if (error.code === 11000) {
            throw new ApiError(409, "Post already bookmarked");
        }
        throw error;
    }
})

const removeBookmark = asyncHandler(async (req, res) => {
    // get postId from body
    const { postId } = req.body;
    const { _id: userId } = req.user;

    if (!postId) {
        throw new ApiError(400, "Post ID is required");
    }

    // find and delete the bookmark
    const bookmark = await Bookmark.findOneAndDelete({ userId, postId });

    if (!bookmark) {
        throw new ApiError(404, "Bookmark not found");
    }

    // return response
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Bookmark removed successfully"));
})

const getMyBookmarks = asyncHandler(async (req, res) => {
    // get userId from request and pagination from query
    const { _id: userId } = req.user;
    const { page = 1, limit = 10 } = req.query;

    // calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // get total count for pagination
    const totalBookmarks = await Bookmark.countDocuments({ userId });
    const totalPages = Math.ceil(totalBookmarks / limitNum);

    // fetch bookmarks sorted by bookmarked date descending
    const bookmarks = await Bookmark.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate({
            path: "postId",
            populate: {
                path: "author",
                select: "fullName userName avatar",
            },
        })
        .lean();

    // return response
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {
                count: bookmarks.length,
                page: pageNum,
                totalPages,
                totalBookmarks,
                bookmarks,
            },
            "Bookmarks fetched successfully"
        ));
})

// ==================== REPORTS ====================

const reportPost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { reason, description } = req.body;
    const { _id: userId } = req.user;

    if (!postId) {
        throw new ApiError(400, "Post ID is required");
    }

    if (!reason) {
        throw new ApiError(400, "Report reason is required");
    }

    // check if post exists
    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    // prevent self-reporting
    if (post.author.toString() === userId.toString()) {
        throw new ApiError(400, "You cannot report your own post");
    }

    // prevent duplicate pending reports
    const existingReport = await Report.findOne({
        reporterId: userId,
        reportedContentId: postId,
        contentType: "Post",
        status: "Pending",
    });

    if (existingReport) {
        throw new ApiError(409, "You have already reported this post");
    }

    const report = await Report.create({
        reporterId: userId,
        reportedContentId: postId,
        contentType: "Post",
        reason,
        description: description || undefined,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, report, "Post reported successfully"));
})

const reportComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { reason, description } = req.body;
    const { _id: userId } = req.user;

    if (!commentId) {
        throw new ApiError(400, "Comment ID is required");
    }

    if (!reason) {
        throw new ApiError(400, "Report reason is required");
    }

    // check if comment exists
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    // prevent self-reporting
    if (comment.userId.toString() === userId.toString()) {
        throw new ApiError(400, "You cannot report your own comment");
    }

    // prevent duplicate pending reports
    const existingReport = await Report.findOne({
        reporterId: userId,
        reportedContentId: commentId,
        contentType: "Comment",
        status: "Pending",
    });

    if (existingReport) {
        throw new ApiError(409, "You have already reported this comment");
    }

    const report = await Report.create({
        reporterId: userId,
        reportedContentId: commentId,
        contentType: "Comment",
        reason,
        description: description || undefined,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, report, "Comment reported successfully"));
})


export {
    createPost,
    getAllPosts,
    getPostById,
    deletePost,
    toggleUpvote,
    toggleDownvote,
    addComment,
    getComments,
    deleteComment,
    addBookmark,
    removeBookmark,
    getMyBookmarks,
    reportPost,
    reportComment,
}

