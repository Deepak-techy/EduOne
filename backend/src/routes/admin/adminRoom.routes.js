import { Router } from "express";
import { verifyAdmin } from "../../middlewares/adminAuth.middleware.js";
import {
    getActiveRooms,
    forceEndRoom,
    getRoomStats,
} from "../../controllers/admin/adminRoom.controller.js";

const router = Router();

router.route("/active").get(verifyAdmin, getActiveRooms);              // GET  /api/admin/rooms/active
router.route("/stats").get(verifyAdmin, getRoomStats);                  // GET  /api/admin/rooms/stats
router.route("/:roomId/force-end").post(verifyAdmin, forceEndRoom);    // POST /api/admin/rooms/:roomId/force-end

export default router;
