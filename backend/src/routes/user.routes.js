import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    forgetPassword,
    resetPassword,
    getUserProfile,
    updateAccountDetails,
    updateUserAvatar,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();


router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/forget-password").post(verifyJWT, forgetPassword)
router.route("/reset-password/:token").post(resetPassword)

// secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(verifyJWT, refreshAccessToken)
router.route("/view-profile").get(verifyJWT, getUserProfile)
router.route("/update-profile").patch(verifyJWT, updateAccountDetails)
router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)

export default router;