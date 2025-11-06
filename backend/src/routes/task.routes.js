import { Router } from "express";

import {
    createTask,
    getDashboardData,
    getAllTasks,
    getTasksByRange,
    getTasksByDueDate,
} from "../controllers/task.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// secured routes
router.route("/create").post(verifyJWT, createTask)    // POST /api/tasks/create
router.route("/dashboard").get(verifyJWT, getDashboardData)    // GET /api/tasks/dashboard
router.route("/all").get(verifyJWT, getAllTasks)    // GET /api/tasks/all
router.route("/range").get(verifyJWT, getTasksByRange)    // GET /api/tasks/range
router.route("/due-date").get(verifyJWT, getTasksByDueDate)    // GET /api/tasks/due-date


export default router;