import { ONLINE_USER_TIMEOUT } from "../admin.constants.js";

// In-memory store for tracking active/online users
const activeUsers = new Map();

// Track user activity — called on each authenticated admin API request
export const trackUser = (user) => {
    activeUsers.set(user._id.toString(), {
        userId: user._id,
        userName: user.userName,
        fullName: user.fullName,
        role: user.role,
        avatar: user.avatar || null,
        lastActive: Date.now(),
    });
};

// Get all currently online users (active within ONLINE_USER_TIMEOUT)
export const getOnlineUsersList = () => {
    const now = Date.now();
    const onlineUsers = [];

    activeUsers.forEach((userData, userId) => {
        if (now - userData.lastActive <= ONLINE_USER_TIMEOUT) {
            onlineUsers.push(userData);
        } else {
            // clean up stale entries
            activeUsers.delete(userId);
        }
    });

    return onlineUsers;
};

// Get count of online users
export const getOnlineUsersCount = () => {
    return getOnlineUsersList().length;
};

// Remove a user from the active list (e.g., on logout)
export const removeUser = (userId) => {
    activeUsers.delete(userId.toString());
};

// Periodic cleanup of stale entries (runs every 5 minutes)
setInterval(() => {
    const now = Date.now();
    activeUsers.forEach((userData, userId) => {
        if (now - userData.lastActive > ONLINE_USER_TIMEOUT) {
            activeUsers.delete(userId);
        }
    });
}, ONLINE_USER_TIMEOUT);
