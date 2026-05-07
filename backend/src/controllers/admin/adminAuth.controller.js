import jwt from "jsonwebtoken"

import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { User } from "../../models/user.model.js";
import { Note } from "../../models/note.model.js";
import { Task } from "../../models/task.model.js";
import { Resume } from "../../models/resume.model.js";
import { Post } from "../../models/post.model.js";
import { Comment } from "../../models/comment.model.js";
import { LoginHistory } from "../../models/loginHistory.model.js";
import { Report } from "../../models/report.model.js";


const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh token")
    }
}

const adminLogin = asyncHandler(async (req, res) => {
    // get credentials from frontend
    const { email, userName, password } = req.body

    if (!(email || userName)) {
        throw new ApiError(400, "Email or username is required")
    }

    // find the user
    const user = await User.findOne({
        $or: [{ email }, { userName }]
    })

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    // verify admin role
    if (user.role !== "Admin") {
        throw new ApiError(403, "Access denied. Admin privileges required")
    }

    // check account status
    if (user.accountStatus !== "Active") {
        throw new ApiError(403, "Admin account is not active")
    }

    // check the password
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        // log failed login attempt
        await LoginHistory.create({
            userId: user._id,
            ipAddress: req.ip || req.headers["x-forwarded-for"] || "Unknown",
            userAgent: req.headers["user-agent"] || "Unknown",
            status: "Failed",
        })

        throw new ApiError(401, "Invalid password")
    }

    // generate access and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    // log successful login
    await LoginHistory.create({
        userId: user._id,
        ipAddress: req.ip || req.headers["x-forwarded-for"] || "Unknown",
        userAgent: req.headers["user-agent"] || "Unknown",
        status: "Success",
    })

    const loggedInAdmin = await User.findById(user._id).select("-password -refreshToken")

    // send tokens through cookies
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200,
                {
                    user: loggedInAdmin, accessToken, refreshToken
                },
                "Admin logged in successfully"
            )
        )
})

const getAdminProfile = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "Admin profile fetched successfully"))
})

const changeAdminPassword = asyncHandler(async (req, res) => {
    // get passwords from frontend
    const { oldPassword, newPassword, confirmNewPassword } = req.body
    const { _id: userId } = req.user

    if (!oldPassword || !newPassword || !confirmNewPassword) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findById(userId)

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    // verify the old password
    const isPasswordValid = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid old password")
    }

    // check if new password is same as old one
    if (oldPassword === newPassword) {
        throw new ApiError(400, "New password cannot be same as old password")
    }

    if (newPassword !== confirmNewPassword) {
        throw new ApiError(400, "New password and confirm new password do not match")
    }

    // update the password
    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    // return response
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getDashboardOverview = asyncHandler(async (req, res) => {
    // aggregate counts from all collections
    const [
        totalUsers,
        activeUsers,
        suspendedUsers,
        totalStudents,
        totalTeachers,
        totalAdmins,
        totalPosts,
        totalComments,
        totalNotes,
        totalTasks,
        completedTasks,
        totalResumes,
        pendingReports,
    ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ accountStatus: "Active" }),
        User.countDocuments({ accountStatus: "Suspended" }),
        User.countDocuments({ role: "Student" }),
        User.countDocuments({ role: "Teacher" }),
        User.countDocuments({ role: "Admin" }),
        Post.countDocuments(),
        Comment.countDocuments(),
        Note.countDocuments(),
        Task.countDocuments(),
        Task.countDocuments({ isCompleted: true }),
        Resume.countDocuments(),
        Report.countDocuments({ status: "Pending" }),
    ])

    // get recent registrations (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentRegistrations = await User.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    })

    // get recent posts (last 7 days)
    const recentPosts = await Post.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    })

    // return response
    return res
        .status(200)
        .json(new ApiResponse(200,
            {
                users: {
                    total: totalUsers,
                    active: activeUsers,
                    suspended: suspendedUsers,
                    students: totalStudents,
                    teachers: totalTeachers,
                    admins: totalAdmins,
                    recentRegistrations,
                },
                community: {
                    totalPosts,
                    totalComments,
                    recentPosts,
                },
                features: {
                    totalNotes,
                    totalTasks,
                    completedTasks,
                    taskCompletionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
                    totalResumes,
                },
                moderation: {
                    pendingReports,
                },
            },
            "Dashboard overview fetched successfully"
        ))
})


export {
    adminLogin,
    getAdminProfile,
    changeAdminPassword,
    getDashboardOverview,
}
