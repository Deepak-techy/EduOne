import { Router } from "express";
import multer from "multer";
import path from "path";

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
    getMyReportedPostIds,
    markComment,
    unmarkComment,
} from "../controllers/community.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

// Image upload config — temp storage before Cloudinary upload
const communityUpload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, 'uploads'),
        filename: (req, file, cb) => {
            const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
            cb(null, uniqueName);
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        if (ext && mime) cb(null, true);
        else cb(new Error('Only image files (jpg, png, gif, webp) are allowed'));
    }
});

const router = Router();

// post routes
router.route("/posts/create").post(verifyJWT, communityUpload.single("image"), createPost)    // POST /api/community/posts/create
router.route("/posts/all").get(verifyJWT, getAllPosts)    // GET /api/community/posts/all

// announcement routes (user side)
router.route("/announcements").get(verifyJWT, getAnnouncements)    // GET /api/community/announcements

// reports (user side)
router.route("/reports/my-reported-posts").get(verifyJWT, getMyReportedPostIds)    // GET /api/community/reports/my-reported-posts

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
router.route("/comments/:commentId/mark").patch(verifyJWT, markComment)    // PATCH /api/community/comments/:commentId/mark
router.route("/comments/:commentId/unmark").delete(verifyJWT, unmarkComment)    // DELETE /api/community/comments/:commentId/unmark


export default router;

