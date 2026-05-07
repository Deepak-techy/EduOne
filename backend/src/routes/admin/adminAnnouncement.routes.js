import { Router } from "express";

import {
    getAllAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    sendNotification,
    broadcastEmail,
    sendPushNotification,
    pinAnnouncement,
} from "../../controllers/admin/adminAnnouncement.controller.js";
import { verifyAdmin } from "../../middlewares/adminAuth.middleware.js";

const router = Router();

// announcement routes
router.route("/announcements").get(verifyAdmin, getAllAnnouncements)    // GET /api/admin/announcements
router.route("/announcements/create").post(verifyAdmin, createAnnouncement)    // POST /api/admin/announcements/create
router.route("/announcements/:id/update").put(verifyAdmin, updateAnnouncement)    // PUT /api/admin/announcements/:id/update
router.route("/announcements/:id/delete").delete(verifyAdmin, deleteAnnouncement)    // DELETE /api/admin/announcements/:id/delete

// notification routes
router.route("/notifications/send").post(verifyAdmin, sendNotification)    // POST /api/admin/notifications/send
router.route("/email/broadcast").post(verifyAdmin, broadcastEmail)    // POST /api/admin/email/broadcast
router.route("/push-notification/send").post(verifyAdmin, sendPushNotification)    // POST /api/admin/push-notification/send

// pin announcement
router.route("/announcement/pin/:id").patch(verifyAdmin, pinAnnouncement)    // PATCH /api/admin/announcement/pin/:id

export default router;
