import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { User } from "../../models/user.model.js";
import { Note } from "../../models/note.model.js";
import { Task } from "../../models/task.model.js";
import { Resume } from "../../models/resume.model.js";
import { Post } from "../../models/post.model.js";
import { LoginHistory } from "../../models/loginHistory.model.js";
import { PAGINATION_DEFAULTS, BULK_ACTION_TYPES } from "../../admin.constants.js";
import { generateUsersCSV } from "../../services/adminExport.service.js";
import { getOnlineUsersList } from "../../services/activeUsersTracker.service.js";


const getAllUsers = asyncHandler(async (req, res) => {
    const {
        page = PAGINATION_DEFAULTS.PAGE,
        limit = PAGINATION_DEFAULTS.LIMIT,
        search, role, status,
        sortBy = "createdAt", order = "desc",
    } = req.query;

    const query = {};
    if (role) query.role = role;
    if (status) query.accountStatus = status;
    if (search) {
        query.$or = [
            { fullName: { $regex: search, $options: "i" } },
            { userName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
        ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limitNum);

    const users = await User.find(query)
        .sort({ [sortBy]: order === "asc" ? 1 : -1 })
        .skip(skip).limit(limitNum)
        .select("-password -refreshToken -resetPasswordToken -resetPasswordExpires")
        .lean();

    return res.status(200).json(new ApiResponse(200,
        { count: users.length, page: pageNum, totalPages, totalUsers, users },
        "Users fetched successfully"
    ));
})

const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw new ApiError(400, "User ID is required");

    const user = await User.findById(id)
        .select("-password -refreshToken -resetPasswordToken -resetPasswordExpires").lean();
    if (!user) throw new ApiError(404, "User not found");

    return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
})

const createUser = asyncHandler(async (req, res) => {
    const { fullName, userName, email, password, role } = req.body;
    if (!fullName || !userName || !email || !password || !role) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({ $or: [{ userName }, { email }] });
    if (existedUser) throw new ApiError(409, "User with email or username already exists");

    const user = await User.create({ fullName, userName, email, password, role });
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) throw new ApiError(500, "Something went wrong while creating the user");

    return res.status(201).json(new ApiResponse(201, createdUser, "User created successfully"));
})

const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { fullName, userName, email, role, accountStatus } = req.body;
    if (!id) throw new ApiError(400, "User ID is required");

    if (userName) {
        const existing = await User.findOne({ userName, _id: { $ne: id } });
        if (existing) throw new ApiError(409, "Username already exists");
    }
    if (email) {
        const existing = await User.findOne({ email, _id: { $ne: id } });
        if (existing) throw new ApiError(409, "Email already exists");
    }

    const updateFields = {};
    if (fullName) updateFields.fullName = fullName;
    if (userName) updateFields.userName = userName;
    if (email) updateFields.email = email;
    if (role) updateFields.role = role;
    if (accountStatus) updateFields.accountStatus = accountStatus;

    const updatedUser = await User.findByIdAndUpdate(id, updateFields, { new: true })
        .select("-password -refreshToken -resetPasswordToken -resetPasswordExpires");
    if (!updatedUser) throw new ApiError(404, "User not found");

    return res.status(200).json(new ApiResponse(200, updatedUser, "User updated successfully"));
})

const suspendUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw new ApiError(400, "User ID is required");
    if (id === req.user._id.toString()) throw new ApiError(400, "Cannot suspend your own account");

    const user = await User.findByIdAndUpdate(id, { accountStatus: "Suspended" }, { new: true })
        .select("-password -refreshToken");
    if (!user) throw new ApiError(404, "User not found");

    return res.status(200).json(new ApiResponse(200, user, "User suspended successfully"));
})

const activateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw new ApiError(400, "User ID is required");

    const user = await User.findByIdAndUpdate(id, { accountStatus: "Active" }, { new: true })
        .select("-password -refreshToken");
    if (!user) throw new ApiError(404, "User not found");

    return res.status(200).json(new ApiResponse(200, user, "User activated successfully"));
})

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw new ApiError(400, "User ID is required");
    if (id === req.user._id.toString()) throw new ApiError(400, "Cannot delete your own account");

    const user = await User.findByIdAndUpdate(id, { accountStatus: "Deleted" }, { new: true })
        .select("-password -refreshToken");
    if (!user) throw new ApiError(404, "User not found");

    return res.status(200).json(new ApiResponse(200, {}, "User deleted successfully"));
})

const changeUserRole = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    if (!id) throw new ApiError(400, "User ID is required");
    if (!role || !["Student", "Teacher", "Admin"].includes(role)) {
        throw new ApiError(400, "Valid role is required (Student, Teacher, or Admin)");
    }
    if (id === req.user._id.toString()) throw new ApiError(400, "Cannot change your own role");

    const user = await User.findByIdAndUpdate(id, { role }, { new: true })
        .select("-password -refreshToken");
    if (!user) throw new ApiError(404, "User not found");

    return res.status(200).json(new ApiResponse(200, user, "User role updated successfully"));
})

const getUserActivity = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw new ApiError(400, "User ID is required");

    const user = await User.findById(id).select("fullName userName email role").lean();
    if (!user) throw new ApiError(404, "User not found");

    const [notesCount, tasksCount, resumesCount, postsCount, recentNotes, recentTasks, recentPosts] = await Promise.all([
        Note.countDocuments({ userId: id }),
        Task.countDocuments({ userId: id }),
        Resume.countDocuments({ userId: id }),
        Post.countDocuments({ author: id }),
        Note.find({ userId: id }).sort({ updatedAt: -1 }).limit(5).select("subject updatedAt").lean(),
        Task.find({ userId: id }).sort({ createdAt: -1 }).limit(5).select("subject task dueDate isCompleted").lean(),
        Post.find({ author: id }).sort({ createdAt: -1 }).limit(5).select("title createdAt commentsCount").lean(),
    ]);

    return res.status(200).json(new ApiResponse(200,
        {
            user,
            stats: { notesCount, tasksCount, resumesCount, postsCount },
            recentActivity: { notes: recentNotes, tasks: recentTasks, posts: recentPosts },
        },
        "User activity fetched successfully"
    ));
})

const getUserLoginHistory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    if (!id) throw new ApiError(400, "User ID is required");

    const userExists = await User.exists({ _id: id });
    if (!userExists) throw new ApiError(404, "User not found");

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const totalRecords = await LoginHistory.countDocuments({ userId: id });
    const totalPages = Math.ceil(totalRecords / limitNum);

    const loginHistory = await LoginHistory.find({ userId: id })
        .sort({ loginAt: -1 }).skip(skip).limit(limitNum).lean();

    return res.status(200).json(new ApiResponse(200,
        { count: loginHistory.length, page: pageNum, totalPages, totalRecords, loginHistory },
        "Login history fetched successfully"
    ));
})

const exportUsers = asyncHandler(async (req, res) => {
    const { role, status } = req.query;
    const query = {};
    if (role) query.role = role;
    if (status) query.accountStatus = status;

    const users = await User.find(query)
        .select("-password -refreshToken -resetPasswordToken -resetPasswordExpires")
        .sort({ createdAt: -1 }).lean();

    const csv = generateUsersCSV(users);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=users_export.csv");
    return res.status(200).send(csv);
})

const getOnlineUsers = asyncHandler(async (req, res) => {
    const onlineUsers = getOnlineUsersList();
    return res.status(200).json(new ApiResponse(200,
        { count: onlineUsers.length, users: onlineUsers },
        "Online users fetched successfully"
    ));
})

const bulkAction = asyncHandler(async (req, res) => {
    const { action, userIds, role: newRole } = req.body;
    if (!action) throw new ApiError(400, "Action is required");
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        throw new ApiError(400, "User IDs array is required");
    }

    const adminId = req.user._id.toString();
    if (userIds.includes(adminId)) throw new ApiError(400, "Cannot perform bulk action on your own account");

    let updateData = {};
    let message = "";

    switch (action) {
        case BULK_ACTION_TYPES.SUSPEND:
            updateData = { accountStatus: "Suspended" };
            message = `${userIds.length} users suspended successfully`;
            break;
        case BULK_ACTION_TYPES.ACTIVATE:
            updateData = { accountStatus: "Active" };
            message = `${userIds.length} users activated successfully`;
            break;
        case BULK_ACTION_TYPES.DELETE:
            updateData = { accountStatus: "Deleted" };
            message = `${userIds.length} users deleted successfully`;
            break;
        case BULK_ACTION_TYPES.CHANGE_ROLE:
            if (!newRole || !["Student", "Teacher", "Admin"].includes(newRole)) {
                throw new ApiError(400, "Valid role is required for role change action");
            }
            updateData = { role: newRole };
            message = `${userIds.length} users role changed to ${newRole}`;
            break;
        default:
            throw new ApiError(400, "Invalid action. Use: suspend, activate, delete, or change-role");
    }

    const result = await User.updateMany({ _id: { $in: userIds } }, updateData);

    return res.status(200).json(new ApiResponse(200,
        { matchedCount: result.matchedCount, modifiedCount: result.modifiedCount },
        message
    ));
})

export {
    getAllUsers, getUserById, createUser, updateUser,
    suspendUser, activateUser, deleteUser, changeUserRole,
    getUserActivity, getUserLoginHistory, exportUsers,
    getOnlineUsers, bulkAction,
}
