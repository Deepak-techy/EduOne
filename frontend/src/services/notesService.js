// // src/services/notesService.js
// import axios from 'axios';

// const API_URL = '/api/notes';

// // Create axios instance
// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true,
// });

// export const notesService = {
  
//   // 1. Create a new note
//   createNote: async (noteData) => {
//     try {
//       const response = await api.post('/create', noteData);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || { message: 'Failed to create note' };
//     }
//   },

//   // 2. Upload PDF document for a note
//   uploadDocument: async (noteId, file) => {
//     try {
//       const formData = new FormData();
//       formData.append('document', file);

//       const response = await axios.post(`${API_URL}/${noteId}/upload`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         withCredentials: true,
//       });
      
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || { message: 'Failed to upload document' };
//     }
//   },

//   // 3. Get all notes (with optional filters)
//   getAllNotes: async (filters = {}) => {
//     try {
//       const params = new URLSearchParams(filters);
//       const response = await api.get(`/all?${params}`);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || { message: 'Failed to fetch notes' };
//     }
//   },

//   // 4. Get recently updated notes
//   getRecentNotes: async () => {
//     try {
//       const response = await api.get('/last-updated');
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || { message: 'Failed to fetch recent notes' };
//     }
//   },

//   // 5. Get single note by ID
//   getNoteById: async (noteId) => {
//     try {
//       const response = await api.get(`/${noteId}`);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || { message: 'Failed to fetch note' };
//     }
//   },

//   // 6. Update note
//   updateNote: async (noteId, noteData) => {
//     try {
//       const response = await api.patch(`/${noteId}/update`, noteData);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || { message: 'Failed to update note' };
//     }
//   },

//   // 7. Delete note
//   deleteNote: async (noteId) => {
//     try {
//       const response = await api.delete(`/${noteId}/delete`);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || { message: 'Failed to delete note' };
//     }
//   },

//   // 8. Ask AI based on document
//   askAI: async (noteId, question) => {
//     try {
//       const response = await api.post(`/${noteId}/ask-ai`, { question });
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || { message: 'Failed to get AI response' };
//     }
//   },

//   // 9. Generate AI tags
//   generateTags: async (noteId) => {
//     try {
//       const response = await api.post(`/${noteId}/generate-tags`);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || { message: 'Failed to generate tags' };
//     }
//   },

//   // 10. Get tag suggestions
//   getTagSuggestions: async (query = '') => {
//     try {
//       const response = await api.get(`/tag-suggestions?q=${query}`);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || { message: 'Failed to fetch tag suggestions' };
//     }
//   },

//   // 11. Get all subjects
//   getSubjects: async () => {
//     try {
//       const response = await api.get('/subjects');
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || { message: 'Failed to fetch subjects' };
//     }
//   },
// };

// export default notesService;




// src/services/notesService.js - FIXED AI TAGS & SUBJECTS
import axios from 'axios';

const API_URL = '/api/notes';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const notesService = {
  
  // 1. Create a new note
  createNote: async (noteData) => {
    try {
      const response = await api.post('/create', noteData);
      return response.data;
    } catch (error) {
      console.error('Create note error:', error);
      throw error.response?.data || { message: 'Failed to create note' };
    }
  },

  // 2. Upload PDF document for a note
  uploadDocument: async (noteId, file) => {
    try {
      const formData = new FormData();
      formData.append('document', file);

      const response = await axios.post(`${API_URL}/${noteId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      
      return response.data;
    } catch (error) {
      console.error('Upload document error:', error);
      throw error.response?.data || { message: 'Failed to upload document' };
    }
  },

  // 3. Get all notes (with optional filters)
  getAllNotes: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/all?${params}`);
      return response.data;
    } catch (error) {
      console.error('Get all notes error:', error);
      throw error.response?.data || { message: 'Failed to fetch notes' };
    }
  },

  // 4. Get recently updated notes
  getRecentNotes: async () => {
    try {
      const response = await api.get('/last-updated');
      return response.data;
    } catch (error) {
      console.error('Get recent notes error:', error);
      throw error.response?.data || { message: 'Failed to fetch recent notes' };
    }
  },

  // 5. Get single note by ID
  getNoteById: async (noteId) => {
    try {
      const response = await api.get(`/${noteId}`);
      return response.data;
    } catch (error) {
      console.error('Get note by ID error:', error);
      throw error.response?.data || { message: 'Failed to fetch note' };
    }
  },

  // 6. Update note
  updateNote: async (noteId, noteData) => {
    try {
      const response = await api.patch(`/${noteId}/update`, noteData);
      return response.data;
    } catch (error) {
      console.error('Update note error:', error);
      throw error.response?.data || { message: 'Failed to update note' };
    }
  },

  // 7. Delete note
  deleteNote: async (noteId) => {
    try {
      const response = await api.delete(`/${noteId}/delete`);
      return response.data;
    } catch (error) {
      console.error('Delete note error:', error);
      throw error.response?.data || { message: 'Failed to delete note' };
    }
  },

  // 8. Ask AI based on document
  askAI: async (noteId, question) => {
    try {
      const response = await api.post(`/${noteId}/ask-ai`, { question });
      return response.data;
    } catch (error) {
      console.error('Ask AI error:', error);
      throw error.response?.data || { message: 'Failed to get AI response' };
    }
  },


// 9. Generate AI tags
generateTags: async (noteId, subject, content) => {
  try {
    console.log('🔧 API Call - Generate Tags:', {
      endpoint: `${API_URL}/${noteId}/generate-tags`,
      noteId,
      subject,
      contentLength: content?.length || 0
    });

    const response = await api.post(`/${noteId}/generate-tags`, {
      subject: subject,
      content: content
    });
    
    console.log('✅ Generate tags response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Generate tags error:', error.response?.data || error);
    throw error.response?.data || { message: 'Failed to generate tags' };
  }
},


  // 10. Get tag suggestions
  getTagSuggestions: async (query = '') => {
    try {
      const response = await api.get(`/tag-suggestions?q=${query}`);
      return response.data;
    } catch (error) {
      console.error('Get tag suggestions error:', error);
      throw error.response?.data || { message: 'Failed to fetch tag suggestions' };
    }
  },

  // ✅ 11. Get all subjects - FIXED: Correct response structure
  getSubjects: async () => {
    try {
      const response = await api.get('/subjects');
      // Response structure: { statusCode: 200, data: ["DSA"], message: "...", success: true }
      return response.data;
    } catch (error) {
      console.error('Get subjects error:', error);
      throw error.response?.data || { message: 'Failed to fetch subjects' };
    }
  },
};

export default notesService;
