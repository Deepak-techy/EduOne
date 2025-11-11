import { Router } from "express";

import {
    uploadAndAnalyzeResume,
} from "../controllers/resume.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// secured routes
router.route("/analyze").post(verifyJWT, upload.single("resume"), uploadAndAnalyzeResume)   // POST /api/resumes/analyze

export default router;