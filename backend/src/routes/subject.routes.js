import { Router } from "express";

import {
    getSubjectQueryAnswer,
    getAvailableSubjects
} from "../controllers/subject.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()


// secured routes
router.route("/").get(verifyJWT, getAvailableSubjects)     // GET /api/subjects
router.route("/query").post(verifyJWT, getSubjectQueryAnswer)   // POST /api/subjects/query

export default router;