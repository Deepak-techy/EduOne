import { ApiError } from "../utils/ApiError.js";

/**
 * Role-based authorization middleware.
 * Must be used AFTER verifyJWT (req.user must be set).
 *
 * Usage: authorizeRoles("Teacher", "Admin")
 *
 * @param  {...string} allowedRoles - Roles permitted to access the route
 */
export const authorizeRoles = (...allowedRoles) => {
    return (req, _res, next) => {
        if (!req.user) {
            throw new ApiError(401, "Authentication required");
        }

        if (!allowedRoles.includes(req.user.role)) {
            throw new ApiError(
                403,
                `Access denied. Required role(s): ${allowedRoles.join(", ")}`
            );
        }

        if (req.user.accountStatus !== "Active") {
            throw new ApiError(403, "Your account is not active");
        }

        next();
    };
};
