import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Verify JWT and ensure user has Admin role
export const verifyAdmin = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.headers["authorization"]?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken._id).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }

        if (user.role !== "Admin") {
            throw new ApiError(403, "Admin access required")
        }

        if (user.accountStatus !== "Active") {
            throw new ApiError(403, "Admin account is not active")
        }

        req.user = user
        next()
    } catch (error) {
        throw new ApiError(error.statusCode || 401, error?.message || "Invalid Access Token")
    }
})
