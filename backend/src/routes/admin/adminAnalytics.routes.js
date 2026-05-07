import { Router } from "express";

import {
    getDailyActiveUsers,
    getMonthlyActiveUsers,
    getFeatureUsage,
    getUserGrowth,
    getTopFeatures,
    getTrafficSource,
    getErrorLogs,
    getSystemHealth,
} from "../../controllers/admin/adminAnalytics.controller.js";
import { verifyAdmin } from "../../middlewares/adminAuth.middleware.js";

const router = Router();

router.route("/daily-users").get(verifyAdmin, getDailyActiveUsers)    // GET /api/admin/analytics/daily-users
router.route("/monthly-users").get(verifyAdmin, getMonthlyActiveUsers)    // GET /api/admin/analytics/monthly-users
router.route("/feature-usage").get(verifyAdmin, getFeatureUsage)    // GET /api/admin/analytics/feature-usage
router.route("/user-growth").get(verifyAdmin, getUserGrowth)    // GET /api/admin/analytics/user-growth
router.route("/top-features").get(verifyAdmin, getTopFeatures)    // GET /api/admin/analytics/top-features
router.route("/traffic-source").get(verifyAdmin, getTrafficSource)    // GET /api/admin/analytics/traffic-source
router.route("/error-logs").get(verifyAdmin, getErrorLogs)    // GET /api/admin/analytics/error-logs
router.route("/system-health").get(verifyAdmin, getSystemHealth)    // GET /api/admin/analytics/system-health

export default router;
