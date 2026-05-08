import { Router } from "express";
import { 
    getUserNotifications, 
    markNotificationAsRead, 
    markAllAsRead, 
    deleteNotification,
    getUnreadCount
} from "../controllers/notification.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Secure all routes with JWT
router.use(verifyJWT);

router.route("/").get(getUserNotifications);
router.route("/unread-count").get(getUnreadCount);
router.route("/mark-all-read").patch(markAllAsRead);
router.route("/:id/read").patch(markNotificationAsRead);
router.route("/:id").delete(deleteNotification);

export default router;
