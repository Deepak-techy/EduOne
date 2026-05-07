import { Router } from "express";

import {
    getAllResumes,
    getResumeById,
    deleteResume,
    getResumeStats,
} from "../../controllers/admin/adminResumes.controller.js";
import { verifyAdmin } from "../../middlewares/adminAuth.middleware.js";

const router = Router();

// static routes
router.route("/").get(verifyAdmin, getAllResumes)    // GET /api/admin/resumes
router.route("/stats").get(verifyAdmin, getResumeStats)    // GET /api/admin/resume/stats

// dynamic routes
router.route("/:id").get(verifyAdmin, getResumeById)    // GET /api/admin/resumes/:id
router.route("/:id/delete").delete(verifyAdmin, deleteResume)    // DELETE /api/admin/resumes/:id/delete

export default router;
