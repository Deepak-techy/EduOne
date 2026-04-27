import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const communityService = {
  getPosts: (filter) =>
    axios.get(`${API}/community/posts?filter=${filter}`),

  createPost: (data) =>
    axios.post(`${API}/community/posts`, data),

  votePost: (postId, type) =>
    axios.post(`${API}/community/posts/vote`, { postId, type }),

  bookmarkPost: (postId) =>
    axios.post(`${API}/community/posts/bookmark`, { postId }),

  getBookmarks: () =>
    axios.get(`${API}/community/bookmarks`),

  addComment: (postId, text) =>
    axios.post(`${API}/community/posts/comment`, {
      postId,
      text,
    }),
};