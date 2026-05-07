import { Router } from "express";

import {
    getAllPosts,
    getPostById,
    deletePost,
    getFlaggedPosts,
    getAllReports,
    getReportById,
    resolveReport,
    rejectReport,
    deleteComment,
    getCommunityStats,
} from "../../controllers/admin/adminCommunity.controller.js";
import { verifyAdmin } from "../../middlewares/adminAuth.middleware.js";

const router = Router();

// post routes
router.route("/posts").get(verifyAdmin, getAllPosts)    // GET /api/admin/posts
router.route("/posts/flagged").get(verifyAdmin, getFlaggedPosts)    // GET /api/admin/posts/flagged
router.route("/posts/:id").get(verifyAdmin, getPostById)    // GET /api/admin/posts/:id
router.route("/posts/:id/delete").delete(verifyAdmin, deletePost)    // DELETE /api/admin/posts/:id/delete

// report routes
router.route("/reports").get(verifyAdmin, getAllReports)    // GET /api/admin/reports
router.route("/reports/:id").get(verifyAdmin, getReportById)    // GET /api/admin/reports/:id
router.route("/reports/:id/resolve").patch(verifyAdmin, resolveReport)    // PATCH /api/admin/reports/:id/resolve
router.route("/reports/:id/reject").patch(verifyAdmin, rejectReport)    // PATCH /api/admin/reports/:id/reject

// comment routes
router.route("/comments/:id/delete").delete(verifyAdmin, deleteComment)    // DELETE /api/admin/comments/:id/delete

// community stats
router.route("/community/stats").get(verifyAdmin, getCommunityStats)    // GET /api/admin/community/stats

export default router;
