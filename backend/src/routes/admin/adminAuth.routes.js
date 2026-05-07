import { Router } from "express";

import {
    adminLogin,
    getAdminProfile,
    changeAdminPassword,
    getDashboardOverview,
} from "../../controllers/admin/adminAuth.controller.js";
import { verifyAdmin } from "../../middlewares/adminAuth.middleware.js";

const router = Router();

router.route("/login").post(adminLogin)    // POST /api/admin/login
router.route("/profile").get(verifyAdmin, getAdminProfile)    // GET /api/admin/profile
router.route("/change-password").put(verifyAdmin, changeAdminPassword)    // PUT /api/admin/change-password
router.route("/dashboard-overview").get(verifyAdmin, getDashboardOverview)    // GET /api/admin/dashboard-overview

export default router;
