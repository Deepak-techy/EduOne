import { Router } from "express";

import {
    getAllNotes,
    getNoteById,
    deleteNote,
    getNotesUsageStats,
} from "../../controllers/admin/adminNotes.controller.js";
import { verifyAdmin } from "../../middlewares/adminAuth.middleware.js";

const router = Router();

// static routes
router.route("/").get(verifyAdmin, getAllNotes)    // GET /api/admin/notes
router.route("/usage-stats").get(verifyAdmin, getNotesUsageStats)    // GET /api/admin/notes/usage-stats

// dynamic routes
router.route("/:id").get(verifyAdmin, getNoteById)    // GET /api/admin/notes/:id
router.route("/:id/delete").delete(verifyAdmin, deleteNote)    // DELETE /api/admin/notes/:id/delete

export default router;
