// src/services/roomService.js
import axios from "axios";

const API_URL = "/api/rooms";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export const roomService = {
    // POST /api/rooms/create
    createRoom: (postId, type, options = {}) =>
        api.post("/create", { postId, type, ...options }),

    // GET /api/rooms/:roomId
    getRoom: (roomId) =>
        api.get(`/${roomId}`),

    // GET /api/rooms/post/:postId/active
    getActiveRoomsForPost: (postId) =>
        api.get(`/post/${postId}/active`),

    // POST /api/rooms/:roomId/join
    joinRoom: (roomId) =>
        api.post(`/${roomId}/join`),

    // POST /api/rooms/:roomId/leave
    leaveRoom: (roomId) =>
        api.post(`/${roomId}/leave`),

    // POST /api/rooms/:roomId/end
    endRoom: (roomId) =>
        api.post(`/${roomId}/end`),

    // GET /api/rooms/join-by-code/:code
    joinByCode: (code) =>
        api.get(`/join-by-code/${code}`),

    // GET /api/rooms/active
    getActiveRooms: () =>
        api.get("/active"),

    // GET /api/rooms/:roomId/chat
    getChatHistory: (roomId, page = 1, limit = 50) =>
        api.get(`/${roomId}/chat`, { params: { page, limit } }),
};
