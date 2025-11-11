import crypto from "crypto"
import jwt from "jsonwebtoken"

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { sendEmail } from "../utils/sendEmail.js";
import { uploadOnCloudinary } from "../services/cloudinaryUpload.service.js";


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

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    const { fullName, userName, email, password, role } = req.body

    // validation - not empty
    if ([fullName, userName, email, password, role].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    // check if user already exists: userName, email
    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    // create user object - create entry in db
    const user = await User.create({
        fullName,
        userName,
        email,
        password,
        role,
    })

    // remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // check for user creation
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registring the user")
    }

    // return response
    return res
        .status(200)
        .json(new ApiResponse(200, createdUser, "User registered successfully"))

})

const loginUser = asyncHandler(async (req, res) => {
    // req.body se data lo
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

    // check the password
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password")
    }

    // generate access and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

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
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged in successfully"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    // remove the refreshToken from the database
    User.findByIdAndUpdate(
        req.user._id,   // here user gets added to the req object bcz of verifyJwt middleware
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    // return response
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, "User logged out successfully"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    // take the refreshToken from cookies or body
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    // verify the refreshToken
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        // find the user
        const user = await User.findById(decodedToken._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        console.log("incomingRefreshToken: ", incomingRefreshToken)
        console.log("Refresh Token: ", user?.refreshToken)

        // check if the refreshToken is expired
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        // generate new access and refresh token
        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id)

        // return response
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const forgetPassword = asyncHandler(async (req, res) => {
    // take the email from body
    const { email } = req.body

    if (!email) {
        throw new ApiError(400, "Email is required")
    }

    // find the user
    const user = await User.findOne({
        email
    })

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    // generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpires = Date.now() + Number(process.env.RESET_TOKEN_EXP_MINUTES) * 60 * 1000; // 15 mins

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;

    await user.save({
        validateBeforeSave: false
    })

    // send email
    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password/${resetToken}`

    // 5️⃣ Compose email content
    const message = `
    <p>Hi ${user.name || "User"},</p>
    <p>You requested a password reset for <b>${process.env.APP_NAME}</b>.</p>
    <p>Click the link below to reset your password (valid for ${process.env.RESET_TOKEN_EXP_MINUTES} minutes):</p>
    <a href="${resetUrl}" target="_blank">${resetUrl}</a>
    <p>If you didn’t request this, please ignore this email.</p>
  `

    await sendEmail(user.email, "Reset Your Password", message);

    // return response
    return res
        .status(200)
        .json(new ApiResponse(200, "Password reset link sent to your email"))
})

const resetPassword = asyncHandler(async (req, res) => {
    // take the token from the url
    const { token } = req.params
    const { newPassword, confirmNewPassword } = req.body

    if (!token) {
        throw new ApiError(400, "Token is required")
    }

    if (newPassword !== confirmNewPassword) {
        throw new ApiError(400, "New password and confirm new password do not match")
    }

    // find the user
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    })

    if (!user) {
        throw new ApiError(400, "Invalid or expired token")
    }

    // update the password
    user.password = newPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save({
        validateBeforeSave: false
    })

    // return response
    return res
        .status(200)
        .json(new ApiResponse(200, "Password reset successfully"))
})

const changePassword = asyncHandler(async (req, res) => {
    // get user passwords from frontend
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
        throw new ApiError(400, "New password cannot be same as old password");
    }

    if(newPassword !== confirmNewPassword) {
        throw new ApiError(400, "New password and confirm new password do not match")
    }

    // update the password
    user.password = newPassword
    await user.save({
        validateBeforeSave: false
    })

    // return response
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getUserProfile = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "Current user details"))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    // get the user id
    const userId = req.user?._id

    if (!userId) {
        throw new ApiError(401, "Unauthorized request")
    }

    // get user details from frontend
    const { fullName, userName, email, } = req.body

    if (!fullName && !userName && !email) {
        throw new ApiError(400, "No fields provided to update");
    }

    // prevent duplicate usernames and emails
    const existingUserName = await User.findOne({
        userName,
        _id: {
            $ne: userId
        }
    })

    if (existingUserName) {
        throw new ApiError(409, "Username already exists")
    }

    const existingEmail = await User.findOne({
        email,
        _id: {
            $ne: userId
        }
    })

    if (existingEmail) {
        throw new ApiError(409, "Email already exists")
    }

    // update and return the new user details
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            fullName,
            userName,
            email
        },
        { new: true }
    ).select("-password -refreshToken -resetPasswordToken -resetPasswordExpire")

    if (!updatedUser) {
        throw new ApiError(404, "User not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, "Account details updated successfully"))
})

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading the avatar")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password -refreshToken -resetPasswordToken -resetPasswordExpire")

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Avatar updated successfully")
        )
})

export {
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
}