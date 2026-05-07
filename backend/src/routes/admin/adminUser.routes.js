import { Router } from "express";

import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    suspendUser,
    activateUser,
    deleteUser,
    changeUserRole,
    getUserActivity,
    getUserLoginHistory,
    exportUsers,
    getOnlineUsers,
    bulkAction,
} from "../../controllers/admin/adminUser.controller.js";
import { verifyAdmin } from "../../middlewares/adminAuth.middleware.js";

const router = Router();

// static routes first
router.route("/").get(verifyAdmin, getAllUsers)    // GET /api/admin/users
router.route("/create").post(verifyAdmin, createUser)    // POST /api/admin/users/create
router.route("/export").get(verifyAdmin, exportUsers)    // GET /api/admin/users/export
router.route("/online").get(verifyAdmin, getOnlineUsers)    // GET /api/admin/users/online
router.route("/bulk-action").post(verifyAdmin, bulkAction)    // POST /api/admin/users/bulk-action

// dynamic routes
router.route("/:id").get(verifyAdmin, getUserById)    // GET /api/admin/users/:id
router.route("/:id/update").put(verifyAdmin, updateUser)    // PUT /api/admin/users/:id/update
router.route("/:id/suspend").patch(verifyAdmin, suspendUser)    // PATCH /api/admin/users/:id/suspend
router.route("/:id/activate").patch(verifyAdmin, activateUser)    // PATCH /api/admin/users/:id/activate
router.route("/:id/delete").delete(verifyAdmin, deleteUser)    // DELETE /api/admin/users/:id/delete
router.route("/:id/role").patch(verifyAdmin, changeUserRole)    // PATCH /api/admin/users/:id/role
router.route("/:id/activity").get(verifyAdmin, getUserActivity)    // GET /api/admin/users/:id/activity
router.route("/:id/login-history").get(verifyAdmin, getUserLoginHistory)    // GET /api/admin/users/:id/login-history

export default router;
