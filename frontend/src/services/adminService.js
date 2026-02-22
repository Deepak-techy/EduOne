// src/services/adminService.js
// ─── Mock data (replace with real axios calls once backend is ready) ──────────

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK = {
    dashboard: {
        totalUsers: 1284,
        dailyActive: 347,
        notesCreated: 892,
        tasksCompleted: 621,
        growth: {
            totalUsers: '+12%',
            dailyActive: '+8%',
            notesCreated: '+24%',
            tasksCompleted: '+5%',
        },
        dailyActiveUsers: [
            { date: '15 Feb', count: 280 },
            { date: '16 Feb', count: 310 },
            { date: '17 Feb', count: 295 },
            { date: '18 Feb', count: 340 },
            { date: '19 Feb', count: 320 },
            { date: '20 Feb', count: 360 },
            { date: '21 Feb', count: 347 },
        ],
        tasksOverview: { completed: 621, pending: 183 },
        recentActivity: [
            { id: 1, type: 'note', user: 'Priya Sharma', action: 'Created a new note on Physics', time: '2m ago' },
            { id: 2, type: 'register', user: 'Rahul Verma', action: 'Registered as a new student', time: '15m ago' },
            { id: 3, type: 'upload', user: 'Anjali Mehta', action: 'Uploaded Chemistry PDF', time: '1h ago' },
            { id: 4, type: 'announcement', user: 'Admin', action: 'Posted mid-term exam schedule', time: '3h ago' },
            { id: 5, type: 'resume', user: 'Karan Singh', action: 'Generated AI resume', time: '5h ago' },
        ],
        featureUsage: [
            { name: 'Notes', usage: 84 },
            { name: 'Tasks', usage: 67 },
            { name: 'Resume', usage: 45 },
            { name: 'Uploads', usage: 38 },
            { name: 'AI Assistant', usage: 72 },
        ],
    },

    users: [
        { _id: 'u1', fullName: 'Priya Sharma', email: 'priya@example.com', role: 'Student', accountStatus: 'Active', createdAt: '2025-09-10T08:00:00Z' },
        { _id: 'u2', fullName: 'Rahul Verma', email: 'rahul@example.com', role: 'Student', accountStatus: 'Active', createdAt: '2025-10-03T09:00:00Z' },
        { _id: 'u3', fullName: 'Anjali Mehta', email: 'anjali@example.com', role: 'Teacher', accountStatus: 'Active', createdAt: '2025-08-15T10:00:00Z' },
        { _id: 'u4', fullName: 'Karan Singh', email: 'karan@example.com', role: 'Student', accountStatus: 'Suspended', createdAt: '2025-11-20T11:00:00Z' },
        { _id: 'u5', fullName: 'Deepak Gupta', email: 'deepak@example.com', role: 'Teacher', accountStatus: 'Active', createdAt: '2025-07-01T12:00:00Z' },
        { _id: 'u6', fullName: 'Sneha Patel', email: 'sneha@example.com', role: 'Student', accountStatus: 'Active', createdAt: '2026-01-05T13:00:00Z' },
    ],

    posts: [
        { _id: 'p1', author: { fullName: 'Karan Singh', role: 'Student' }, content: 'This exam schedule is completely unfair and needs to be revised immediately.', flagged: true, flagCount: 3, createdAt: '2026-02-18T10:00:00Z' },
        { _id: 'p2', author: { fullName: 'Priya Sharma', role: 'Student' }, content: 'Can someone share notes for Chapter 5 of Organic Chemistry?', flagged: false, flagCount: 0, createdAt: '2026-02-19T11:00:00Z' },
        { _id: 'p3', author: { fullName: 'Rahul Verma', role: 'Student' }, content: 'I think the grading policy is biased. Not happy with the teacher feedback.', flagged: true, flagCount: 1, createdAt: '2026-02-20T09:00:00Z' },
        { _id: 'p4', author: { fullName: 'Anjali Mehta', role: 'Teacher' }, content: 'Assignment 3 deadline has been extended to March 1st. Please check the portal.', flagged: false, flagCount: 0, createdAt: '2026-02-21T14:00:00Z' },
    ],

    analytics: {
        featureUsage: [
            { name: 'Notes', usage: 84 },
            { name: 'AI Assistant', usage: 72 },
            { name: 'Tasks', usage: 67 },
            { name: 'Resume', usage: 45 },
            { name: 'Uploads', usage: 38 },
        ],
        weeklyActivity: [
            { date: 'Mon', count: 210 },
            { date: 'Tue', count: 275 },
            { date: 'Wed', count: 310 },
            { date: 'Thu', count: 290 },
            { date: 'Fri', count: 340 },
            { date: 'Sat', count: 180 },
            { date: 'Sun', count: 150 },
        ],
    },

    announcements: [
        { _id: 'a1', title: 'Mid-Term Exam Schedule Released', body: 'Mid-term exams will be held from March 10–15. Check the portal for your timetable.', createdAt: '2026-02-20T08:00:00Z' },
        { _id: 'a2', title: 'Platform Maintenance — Feb 25', body: 'EduOne will be under maintenance on Feb 25 from 2:00 AM to 4:00 AM IST. Plan accordingly.', createdAt: '2026-02-19T10:00:00Z' },
        { _id: 'a3', title: 'New AI Resume Feature is Live!', body: 'Generate a professional resume in seconds using our new AI-powered tool under the Resume tab.', createdAt: '2026-02-15T09:00:00Z' },
    ],
};

// ─── Service object ────────────────────────────────────────────────────────────
// Each method simulates a network delay, then returns mock data.
// Replace the body of each method with a real axios call when the backend is ready:
//   import axios from 'axios';
//   const api = axios.create({ baseURL: '/api/admin', withCredentials: true });
//   getDashboard: async () => { const r = await api.get('/dashboard'); return r.data; }

export const adminService = {

    getDashboard: async () => {
        await delay();
        return { data: MOCK.dashboard };
    },

    // --- User Management ---
    getUsers: async () => {
        await delay();
        return { data: MOCK.users };
    },

    updateUserRole: async (id, role) => {
        await delay(300);
        const user = MOCK.users.find((u) => u._id === id);
        if (user) user.role = role;
        return { data: { message: 'Role updated' } };
    },

    updateUserStatus: async (id, status) => {
        await delay(300);
        const user = MOCK.users.find((u) => u._id === id);
        if (user) user.accountStatus = status;
        return { data: { message: 'Status updated' } };
    },

    deleteUser: async (id) => {
        await delay(300);
        const idx = MOCK.users.findIndex((u) => u._id === id);
        if (idx !== -1) MOCK.users.splice(idx, 1);
        return { data: { message: 'User deleted' } };
    },

    // --- Content Moderation ---
    getPosts: async () => {
        await delay();
        return { data: MOCK.posts };
    },

    deletePost: async (id) => {
        await delay(300);
        const idx = MOCK.posts.findIndex((p) => p._id === id);
        if (idx !== -1) MOCK.posts.splice(idx, 1);
        return { data: { message: 'Post deleted' } };
    },

    flagPost: async (id, flagged) => {
        await delay(300);
        const post = MOCK.posts.find((p) => p._id === id);
        if (post) {
            post.flagged = flagged;
            post.flagCount = flagged ? (post.flagCount || 0) + 1 : Math.max(0, (post.flagCount || 1) - 1);
        }
        return { data: { message: 'Post updated' } };
    },

    // --- Analytics ---
    getAnalytics: async () => {
        await delay();
        return { data: MOCK.analytics };
    },

    // --- Announcements ---
    getAnnouncements: async () => {
        await delay();
        return { data: [...MOCK.announcements] };
    },

    createAnnouncement: async (data) => {
        await delay(300);
        const newItem = { _id: `a${Date.now()}`, ...data, createdAt: new Date().toISOString() };
        MOCK.announcements.unshift(newItem);
        return { data: newItem };
    },

    deleteAnnouncement: async (id) => {
        await delay(300);
        const idx = MOCK.announcements.findIndex((a) => a._id === id);
        if (idx !== -1) MOCK.announcements.splice(idx, 1);
        return { data: { message: 'Announcement deleted' } };
    },
};

export default adminService;
