import { Router } from "express";

import {
    uploadAndAnalyzeResume,
    getResumeById,
    getUserResumes,
    deleteResume
} from "../controllers/resume.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// secured routes
router.route("/analyze").post(verifyJWT, upload.single("resume"), uploadAndAnalyzeResume)   // POST /api/resumes/analyze
router.route("/all").get(verifyJWT, getUserResumes)    // GET /api/resumes/all

// dynamic routes
router.route("/:resumeId").get(verifyJWT, getResumeById)    // GET /api/resumes/:resumeId
router.route("/:resumeId/delete").delete(verifyJWT, deleteResume)    // DELETE /api/resumes/:resumeId/delete

export default router;