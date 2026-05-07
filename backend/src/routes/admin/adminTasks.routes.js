import { Router } from "express";

import {
    getAllTasks,
    getTaskStats,
    getAIPerformanceStats,
    deleteTask,
} from "../../controllers/admin/adminTasks.controller.js";
import { verifyAdmin } from "../../middlewares/adminAuth.middleware.js";

const router = Router();

// static routes
router.route("/").get(verifyAdmin, getAllTasks)    // GET /api/admin/tasks
router.route("/stats").get(verifyAdmin, getTaskStats)    // GET /api/admin/tasks/stats
router.route("/ai-performance").get(verifyAdmin, getAIPerformanceStats)    // GET /api/admin/tasks/ai-performance

// dynamic routes
router.route("/delete/:id").delete(verifyAdmin, deleteTask)    // DELETE /api/admin/tasks/delete/:id

export default router;
