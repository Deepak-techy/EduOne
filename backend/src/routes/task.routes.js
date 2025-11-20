import { Router } from "express";

import {
    createTask,
    getDashboardData,
    getAllTasks,
    getTasksByRange,
    getTasksByDueDate,
    generateAIPrioritizedTasks,
    markTaskCompleted,
    markTaskUncompleted,
    updateTask,
    deleteTask
} from "../controllers/task.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// secured routes
router.route("/create").post(verifyJWT, createTask)    // POST /api/tasks/create
router.route("/dashboard").get(verifyJWT, getDashboardData)    // GET /api/tasks/dashboard
router.route("/all").get(verifyJWT, getAllTasks)    // GET /api/tasks/all
router.route("/range").get(verifyJWT, getTasksByRange)    // GET /api/tasks/range
router.route("/due-date").get(verifyJWT, getTasksByDueDate)    // GET /api/tasks/due-date
router.route("/ai-prioritized").get(verifyJWT, generateAIPrioritizedTasks)    // GET /api/tasks/ai-prioritized


// dynamic routes
router.route("/:taskId/mark-completed").patch(verifyJWT, markTaskCompleted)    // POST /api/tasks/:taskId/mark-completed
router.route("/:taskId/mark-uncompleted").patch(verifyJWT, markTaskUncompleted)    // POST /api/tasks/:taskId/mark-uncompleted
router.route("/:taskId/update").patch(verifyJWT, updateTask)    // POST /api/tasks/:taskId/update
router.route("/:taskId/delete").delete(verifyJWT, deleteTask)    // DELETE /api/tasks/:taskId/delete



export default router;