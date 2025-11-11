import { Router } from "express";

import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    forgetPassword,
    resetPassword,
    changePassword,
    getUserProfile,
    updateAccountDetails,
    updateUserAvatar,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();


router.route("/register").post(registerUser)    // POST /api/users/register
router.route("/login").post(loginUser)    // POST /api/users/login
router.route("/forget-password").post(verifyJWT, forgetPassword)    // POST /api/users/forget-password
router.route("/reset-password/:token").post(resetPassword)    // POST /api/users/reset-password/:token

// secured routes
router.route("/change-password").post(verifyJWT, changePassword)    // POST /api/users/change-password
router.route("/logout").post(verifyJWT, logoutUser)   // POST /api/users/logout
router.route("/refresh-token").post(verifyJWT, refreshAccessToken)   // POST /api/users/refresh-token
router.route("/view-profile").get(verifyJWT, getUserProfile)    // GET /api/users/view-profile
router.route("/update-profile").patch(verifyJWT, updateAccountDetails)    // PATCH /api/users/update-profile
router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)    // PATCH /api/users/update-avatar

export default router;