// Admin-specific constants

// Report statuses for content moderation
export const REPORT_STATUS = {
    PENDING: "Pending",
    RESOLVED: "Resolved",
    REJECTED: "Rejected",
};

// Report reasons for flagging content
export const REPORT_REASONS = [
    "Spam",
    "Harassment",
    "Inappropriate",
    "Misinformation",
    "Other",
];

// Notification types
export const NOTIFICATION_TYPES = {
    SYSTEM: "System",
    ADMIN: "Admin",
    ALERT: "Alert",
};

// Announcement target audiences
export const ANNOUNCEMENT_TARGETS = {
    ALL: "All",
    STUDENTS: "Students",
    TEACHERS: "Teachers",
};

// Pagination defaults
export const PAGINATION_DEFAULTS = {
    PAGE: 1,
    LIMIT: 20,
};

// Online user timeout (5 minutes of inactivity)
export const ONLINE_USER_TIMEOUT = 5 * 60 * 1000;

// CSV export field mapping for users
export const USER_EXPORT_FIELDS = [
    "fullName",
    "userName",
    "email",
    "role",
    "accountStatus",
    "createdAt",
    "lastLoginAt",
];

// Bulk action types
export const BULK_ACTION_TYPES = {
    SUSPEND: "suspend",
    ACTIVATE: "activate",
    DELETE: "delete",
    CHANGE_ROLE: "change-role",
};
