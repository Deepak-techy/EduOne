import { Router } from "express";

import {
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
    getAnnouncements,
} from "../controllers/community.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// post routes
router.route("/posts/create").post(verifyJWT, createPost)    // POST /api/community/posts/create
router.route("/posts/all").get(verifyJWT, getAllPosts)    // GET /api/community/posts/all

// announcement routes (user side)
router.route("/announcements").get(verifyJWT, getAnnouncements)    // GET /api/community/announcements

// bookmark routes (static before dynamic)
router.route("/bookmarks/add").post(verifyJWT, addBookmark)    // POST /api/community/bookmarks/add
router.route("/bookmarks/remove").delete(verifyJWT, removeBookmark)    // DELETE /api/community/bookmarks/remove
router.route("/bookmarks/my").get(verifyJWT, getMyBookmarks)    // GET /api/community/bookmarks/my

// dynamic post routes
router.route("/posts/:postId").get(verifyJWT, getPostById)    // GET /api/community/posts/:postId
router.route("/posts/:postId/delete").delete(verifyJWT, deletePost)    // DELETE /api/community/posts/:postId/delete
router.route("/posts/:postId/upvote").patch(verifyJWT, toggleUpvote)    // PATCH /api/community/posts/:postId/upvote
router.route("/posts/:postId/downvote").patch(verifyJWT, toggleDownvote)    // PATCH /api/community/posts/:postId/downvote
router.route("/posts/:postId/report").post(verifyJWT, reportPost)    // POST /api/community/posts/:postId/report

// comment routes
router.route("/posts/:postId/comments/create").post(verifyJWT, addComment)    // POST /api/community/posts/:postId/comments/create
router.route("/posts/:postId/comments/all").get(verifyJWT, getComments)    // GET /api/community/posts/:postId/comments/all
router.route("/comments/:commentId/delete").delete(verifyJWT, deleteComment)    // DELETE /api/community/comments/:commentId/delete
router.route("/comments/:commentId/report").post(verifyJWT, reportComment)    // POST /api/community/comments/:commentId/report


export default router;

