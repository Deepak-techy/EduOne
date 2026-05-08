// src/services/communityService.js
import axios from "axios";

const API_URL = "/api/community"; // ✅ Uses Vite proxy (like authService)

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ CRITICAL: Send cookies to backend
});

export const communityService = {
  // ✅ GET /api/community/posts/all?filter=&page=&limit=
  getPosts: (filter = "all", page = 1, limit = 10) =>
    api.get(`/posts/all`, { params: { filter, page, limit } }),

  // ✅ POST /api/community/posts/create
  createPost: (data) =>
    api.post(`/posts/create`, data),

  // ✅ PATCH /api/community/posts/:postId/upvote
  upvotePost: (postId) =>
    api.patch(`/posts/${postId}/upvote`),

  // ✅ PATCH /api/community/posts/:postId/downvote
  downvotePost: (postId) =>
    api.patch(`/posts/${postId}/downvote`),

  // ✅ POST /api/community/bookmarks/add
  addBookmark: (postId) =>
    api.post(`/bookmarks/add`, { postId }),

  // ✅ DELETE /api/community/bookmarks/remove
  removeBookmark: (postId) =>
    api.delete(`/bookmarks/remove`, { data: { postId } }),

  // ✅ GET /api/community/bookmarks/my
  getBookmarks: (page = 1, limit = 10) =>
    api.get(`/bookmarks/my`, { params: { page, limit } }),

  // ✅ POST /api/community/posts/:postId/comments/create
  addComment: (postId, text) =>
    api.post(`/posts/${postId}/comments/create`, { text }),

  // ✅ GET /api/community/posts/:postId/comments/all
  getComments: (postId, page = 1, limit = 10) =>
    api.get(`/posts/${postId}/comments/all`, { params: { page, limit } }),

  // ✅ DELETE /api/community/posts/:postId/delete
  deletePost: (postId) =>
    api.delete(`/posts/${postId}/delete`),

  // ✅ DELETE /api/community/comments/:commentId/delete
  deleteComment: (commentId) =>
    api.delete(`/comments/${commentId}/delete`),

  // ✅ GET /api/community/posts/:postId
  getPostById: (postId) =>
    api.get(`/posts/${postId}`),

  // ✅ POST /api/community/posts/:postId/report
  reportPost: (postId, data) =>
    api.post(`/posts/${postId}/report`, data),

  // ✅ POST /api/community/comments/:commentId/report
  reportComment: (commentId, data) =>
    api.post(`/comments/${commentId}/report`, data),
};