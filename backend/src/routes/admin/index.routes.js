import { Router } from "express";

import adminAuthRoutes from "./adminAuth.routes.js";
import adminUserRoutes from "./adminUser.routes.js";
import adminCommunityRoutes from "./adminCommunity.routes.js";
import adminNotesRoutes from "./adminNotes.routes.js";
import adminTasksRoutes from "./adminTasks.routes.js";
import adminResumesRoutes from "./adminResumes.routes.js";
import adminAnalyticsRoutes from "./adminAnalytics.routes.js";
import adminAnnouncementRoutes from "./adminAnnouncement.routes.js";

const router = Router();

// auth routes (login, profile, change-password, dashboard-overview)
router.use("/", adminAuthRoutes);

// user management routes
router.use("/users", adminUserRoutes);

// community & content moderation routes (posts, reports, comments, community/stats)
router.use("/", adminCommunityRoutes);

// notes management routes
router.use("/notes", adminNotesRoutes);

// tasks management routes
router.use("/tasks", adminTasksRoutes);

// resumes management routes
router.use("/resumes", adminResumesRoutes);

// resume stats (singular path as per spec)
// Note: /api/admin/resume/stats is handled inside adminResumes.routes.js as /stats

// analytics dashboard routes
router.use("/analytics", adminAnalyticsRoutes);

// announcements & notifications routes
router.use("/", adminAnnouncementRoutes);

export default router;
