// // ========================================
// // 📚 LIBRARY PAGE - NOTES ORGANIZER
// // ========================================
// // This page displays all notes with:
// // - ✅ Tag suggestions in search (CLICK FIXED)
// // - ✅ Custom delete modal
// // - ✅ Recently modified notes section
// // - ✅ All notes section with filters
// // ========================================

// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Search, Plus, BookOpen, Filter, Grid, List, 
//   Clock, FileText, Tag, Edit, Trash2, Eye, 
//   Calendar, ArrowLeft, SlidersHorizontal, X,
//   Loader2, TrendingUp, Sparkles, Zap, AlertTriangle
// } from 'lucide-react';
// import { toast } from 'react-toastify';
// import { notesService } from '../../services/notesService';

// const Library = () => {
//   const navigate = useNavigate();

//   // ========================================
//   // 📦 STATE MANAGEMENT
//   // ========================================
  
//   // Notes data
//   const [notes, setNotes] = useState([]);                      // All notes from backend
//   const [recentNotes, setRecentNotes] = useState([]);          // Top 5 recently modified notes
//   const [filteredNotes, setFilteredNotes] = useState([]);      // Filtered & sorted notes
  
//   // UI state
//   const [loading, setLoading] = useState(true);                 // Loading indicator
//   const [viewMode, setViewMode] = useState('grid');             // 'grid' or 'list' view
//   const [showFilters, setShowFilters] = useState(false);        // Show/hide filter panel
//   const [expandedTagsNoteId, setExpandedTagsNoteId] = useState(null); // Which note's tags are expanded
  
//   // Search & filter state
//   const [searchQuery, setSearchQuery] = useState('');           // Active search query
//   const [tempSearchQuery, setTempSearchQuery] = useState('');   // Search input value (before clicking search)
//   const [selectedSubject, setSelectedSubject] = useState('all'); // Selected subject filter
//   const [selectedTags, setSelectedTags] = useState([]);         // Selected tag filters
//   const [sortBy, setSortBy] = useState('recent');               // Sort option
  
//   // Data from backend
//   const [subjects, setSubjects] = useState([]);                 // All unique subjects
//   const [allTags, setAllTags] = useState([]);                   // All unique tags
  
//   // ✅ Tag suggestions & Delete modal
//   const [tagSuggestions, setTagSuggestions] = useState([]);     // Tag suggestions from backend
//   const [showTagSuggestions, setShowTagSuggestions] = useState(false); // Show suggestions dropdown
//   const [deleteNoteId, setDeleteNoteId] = useState(null);       // Note ID to delete
//   const [showDeleteModal, setShowDeleteModal] = useState(false); // Show delete confirmation modal
//   const [deletingNoteId, setDeletingNoteId] = useState(null); // Track which note is being deleted


//   // ========================================
//   // 🔄 LIFECYCLE HOOKS
//   // ========================================
  
//   // Fetch initial data on component mount
//   useEffect(() => {
//     fetchNotes();
//     fetchRecentNotes();
//     fetchSubjects();
//   }, []);

//   // Re-filter notes whenever filters change
//   useEffect(() => {
//     filterAndSortNotes();
//   }, [notes, searchQuery, selectedSubject, selectedTags, sortBy]);

//   // ✅ Fetch tag suggestions as user types (debounced)
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (tempSearchQuery.trim()) {
//         fetchTagSuggestions(tempSearchQuery);
//       } else {
//         setTagSuggestions([]);
//         setShowTagSuggestions(false);
//       }
//     }, 300); // Wait 300ms after user stops typing

//     return () => clearTimeout(timer);
//   }, [tempSearchQuery]);

//   // ========================================
//   // 📡 API FUNCTIONS
//   // ========================================
  
//   // Fetch all notes from backend
//   const fetchNotes = async () => {
//     setLoading(true);
//     try {
//       const response = await notesService.getAllNotes();
//       const notesData = response.data.notes || [];
//       setNotes(notesData);
      
//       // Extract all unique tags from notes
//       const tags = new Set();
//       notesData.forEach(note => {
//         if (note.tags && Array.isArray(note.tags)) {
//           note.tags.forEach(tag => tags.add(tag));
//         }
//       });
//       setAllTags(Array.from(tags));
//     } catch (error) {
//       console.error('Error fetching notes:', error);
//       toast.error('Failed to load notes');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch recently modified notes (top 5)
//   const fetchRecentNotes = async () => {
//     try {
//       const response = await notesService.getRecentNotes();
//       const recent = response.data.notes || [];
//       setRecentNotes(recent.slice(0, 5));
//     } catch (error) {
//       console.error('Error fetching recent notes:', error);
//     }
//   };

//   // Fetch all subjects from backend
//   const fetchSubjects = async () => {
//     try {
//       const response = await notesService.getSubjects();
//       const subjectsArray = response.data || [];
//       setSubjects(subjectsArray);
//     } catch (error) {
//       console.error('Error fetching subjects:', error);
//     }
//   };

//   // ✅ Fetch tag suggestions based on search query
//   const fetchTagSuggestions = async (query) => {
//     try {
//       const response = await notesService.getTagSuggestions(query);
//       const suggestions = response.data || [];
//       setTagSuggestions(suggestions);
//       setShowTagSuggestions(suggestions.length > 0);
//     } catch (error) {
//       console.error('Error fetching tag suggestions:', error);
//       setTagSuggestions([]);
//       setShowTagSuggestions(false);
//     }
//   };

//   // ========================================
//   // 🎯 EVENT HANDLERS
//   // ========================================
  
//   // ✅ Select a tag from suggestions dropdown
//   const handleSelectTagSuggestion = (tag) => {
//     setTempSearchQuery(tag);
//     setSearchQuery(tag);
//     setShowTagSuggestions(false);
//   };

//   // Execute search (set active search query)
//   const handleSearch = () => {
//     setSearchQuery(tempSearchQuery);
//     setShowTagSuggestions(false);
//   };

//   // Handle Enter key in search input
//   const handleSearchKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleSearch();
//     }
//   };

//   // Filter and sort notes based on active filters
//   const filterAndSortNotes = () => {
//     let filtered = [...notes];

//     // Filter by search query (subject, content, or tags)
//     if (searchQuery.trim()) {
//       filtered = filtered.filter(note =>
//         note.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         note.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         note.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
//       );
//     }

//     // Filter by selected subject
//     if (selectedSubject !== 'all') {
//       filtered = filtered.filter(note => note.subject === selectedSubject);
//     }

//     // Filter by selected tags (note must have ALL selected tags)
//     if (selectedTags.length > 0) {
//       filtered = filtered.filter(note =>
//         selectedTags.every(tag => note.tags?.includes(tag))
//       );
//     }

//     // Sort notes
//     filtered.sort((a, b) => {
//       if (sortBy === 'recent') {
//         return new Date(b.updatedAt) - new Date(a.updatedAt);
//       } else if (sortBy === 'oldest') {
//         return new Date(a.updatedAt) - new Date(b.updatedAt);
//       } else if (sortBy === 'subject') {
//         return a.subject?.localeCompare(b.subject);
//       }
//       return 0;
//     });

//     setFilteredNotes(filtered);
//   };

//   // ✅ Show delete confirmation modal
//   const handleDeleteClick = (noteId) => {
//     setDeleteNoteId(noteId);
//     setShowDeleteModal(true);
//   };

//   // ✅ Confirm delete - actually delete note
//   const handleConfirmDelete = async () => {
//     try {
//       await notesService.deleteNote(deleteNoteId);
//       toast.success('Note deleted successfully!');
//       setShowDeleteModal(false);
//       setDeleteNoteId(null);
//       fetchNotes();       // Refresh notes list
//       fetchRecentNotes(); // Refresh recent notes
//     } catch (error) {
//       console.error('Error deleting note:', error);
//       toast.error('Failed to delete note');
//     }
//   };

//   // ✅ Cancel delete
//   const handleCancelDelete = () => {
//     setShowDeleteModal(false);
//     setDeleteNoteId(null);
//   };

//   // Toggle tag selection in filter panel
//   const toggleTag = (tag) => {
//     if (selectedTags.includes(tag)) {
//       setSelectedTags(selectedTags.filter(t => t !== tag));
//     } else {
//       setSelectedTags([...selectedTags, tag]);
//     }
//   };

//   // Clear all active filters
//   const clearFilters = () => {
//     setSearchQuery('');
//     setTempSearchQuery('');
//     setSelectedSubject('all');
//     setSelectedTags([]);
//     setSortBy('recent');
//   };

//   // ========================================
//   // 🛠️ UTILITY FUNCTIONS
//   // ========================================
  
//   // Truncate HTML content to plain text with max length
//   const truncateContent = (html, maxLength = 150) => {
//     const text = html?.replace(/<[^>]*>/g, '') || '';
//     return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
//   };

//   // Format date to readable string
//   const formatDate = (date) => {
//     return new Date(date).toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   // Get relative time (e.g., "2h ago", "Just now")
//   const getTimeAgo = (date) => {
//     const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
//     if (seconds < 60) return 'Just now';
//     if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
//     if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
//     if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
//     return formatDate(date);
//   };

//   // Check if any filters are active
//   const hasActiveFilters = searchQuery || selectedSubject !== 'all' || selectedTags.length > 0;

//   // ========================================
//   // 🎨 RENDER
//   // ========================================
  
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-sky-50/30 to-cyan-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      
//       {/* ========================================
//           ⚠️ DELETE CONFIRMATION MODAL
//           ========================================
//           Colorful modal with red gradient background
//           Shows when user clicks delete button
//       */}
//       {showDeleteModal && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
//           <div className="bg-gradient-to-br from-red-50 via-orange-50 to-pink-50 dark:from-red-900/20 dark:via-orange-900/20 dark:to-pink-900/20 rounded-2xl shadow-2xl border-4 border-red-200 dark:border-red-700 max-w-md w-full p-6 transform transition-all">
            
//             {/* Modal Header with Icon */}
//             <div className="flex items-start gap-4 mb-4">
//               <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
//                 <AlertTriangle className="w-7 h-7 text-white" />
//               </div>
//               <div>
//                 <h3 className="text-xl font-bold text-red-900 dark:text-red-100 mb-2">
//                   Delete Note?
//                 </h3>
//                 <p className="text-sm text-red-700 dark:text-red-300">
//                   Are you sure you want to delete this note? This action cannot be undone.
//                 </p>
//               </div>
//             </div>
            
//             {/* Modal Actions */}
//             <div className="flex gap-3">
//               <button
//                 onClick={handleCancelDelete}
//                 className="flex-1 px-4 py-3 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg transition-all border-2 border-slate-300 dark:border-slate-600"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirmDelete}
//                 className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg"
//               >
//                 <Trash2 className="w-5 h-5" />
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ========================================
//           📌 HEADER SECTION
//           ========================================
//           Top navigation bar with:
//           - Back button
//           - Library title with note count
//           - Create Note button
//       */}
//       <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-blue-200 dark:border-slate-800 px-6 py-4 shadow-sm sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
          
//           {/* Left side - Back button & Title */}
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate('/notes-organizer')}
//               className="p-2 hover:bg-blue-100 dark:hover:bg-slate-800 rounded-lg transition-all"
//             >
//               <ArrowLeft className="w-5 h-5 text-blue-600" />
//             </button>
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
//                 <BookOpen className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
//                   My Library
//                 </h1>
//                 <p className="text-sm text-slate-500">
//                   {notes.length} {notes.length === 1 ? 'note' : 'notes'}
//                 </p>
//               </div>
//             </div>
//           </div>
          
//           {/* Right side - Create Note button */}
//           <button
//             onClick={() => navigate('/notes-organizer/create')}
//             className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/30 transition-all transform hover:scale-105"
//           >
//             <Plus className="w-4 h-4" />
//             Create Note
//           </button>
//         </div>
//       </div>

//       {/* ========================================
//           🔍 MAIN CONTENT AREA
//           ========================================
//       */}
//       <div className="max-w-7xl mx-auto p-6">
        
//         {/* ========================================
//             🔎 SEARCH & FILTERS SECTION
//             ========================================
//             Includes:
//             - Search input with tag suggestions
//             - Search button
//             - Filters toggle button
//             - View mode toggle (grid/list)
//         */}
//         <div className="mb-8 space-y-4">
//           <div className="flex gap-3">
            
//             {/* ✅ Search Bar with Tag Suggestions (CLICK FIXED) */}
//             <div className="flex-1 flex gap-2">
//               <div className="flex-1 relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
//                 <input
//                   type="text"
//                   placeholder="Search notes by subject, content, or tags..."
//                   value={tempSearchQuery}
//                   onChange={(e) => setTempSearchQuery(e.target.value)}
//                   onKeyPress={handleSearchKeyPress}
//                   onFocus={() => tempSearchQuery && setShowTagSuggestions(tagSuggestions.length > 0)}
//                   onBlur={() => setTimeout(() => setShowTagSuggestions(false), 200)}
//                   className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border-2 border-blue-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
//                 />
                
//                 {/* ✅ TAG SUGGESTIONS DROPDOWN - CLICK FIXED WITH onMouseDown */}
//                 {showTagSuggestions && tagSuggestions.length > 0 && (
//                   <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border-2 border-cyan-300 dark:border-slate-700 rounded-lg shadow-xl z-[9999] max-h-48 overflow-y-auto">
//                     {tagSuggestions.map((suggestion, idx) => (
//                       <button
//                         key={idx}
//                         onMouseDown={(e) => {
//                           e.preventDefault(); // ✅ Prevent blur before click registers
//                           handleSelectTagSuggestion(suggestion);
//                         }}
//                         className="w-full px-4 py-2 text-left hover:bg-cyan-50 dark:hover:bg-slate-700 text-sm text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-2"
//                       >
//                         <span className="text-cyan-500">#</span>
//                         {suggestion}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
              
//               {/* Search Button */}
//               <button
//                 onClick={handleSearch}
//                 className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-lg transition-all flex items-center gap-2"
//               >
//                 <Search className="w-5 h-5" />
//                 Search
//               </button>
//             </div>

//             {/* Filters Toggle Button */}
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className={`px-4 py-3 rounded-lg border-2 transition-all flex items-center gap-2 ${
//                 showFilters 
//                   ? 'bg-blue-500 text-white border-blue-500' 
//                   : 'bg-white dark:bg-slate-900 border-blue-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-blue-50'
//               }`}
//             >
//               <SlidersHorizontal className="w-5 h-5" />
//               Filters
//             </button>

//             {/* View Mode Toggle (Grid/List) */}
//             <div className="flex bg-white dark:bg-slate-900 border-2 border-blue-200 dark:border-slate-700 rounded-lg overflow-hidden">
//               <button
//                 onClick={() => setViewMode('grid')}
//                 className={`p-3 transition-all ${
//                   viewMode === 'grid' 
//                     ? 'bg-blue-500 text-white' 
//                     : 'text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-800'
//                 }`}
//               >
//                 <Grid className="w-5 h-5" />
//               </button>
//               <button
//                 onClick={() => setViewMode('list')}
//                 className={`p-3 transition-all ${
//                   viewMode === 'list' 
//                     ? 'bg-blue-500 text-white' 
//                     : 'text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-800'
//                 }`}
//               >
//                 <List className="w-5 h-5" />
//               </button>
//             </div>
//           </div>

//           {/* ========================================
//               🎛️ FILTERS PANEL (Collapsible)
//               ========================================
//               Shows when showFilters is true
//               Contains: Subject, Sort By, and Tags filters
//           */}
//           {showFilters && (
//             <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-blue-200 dark:border-slate-700 rounded-lg p-5 space-y-4">
//               <div className="flex items-center justify-between">
//                 <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
//                   <Filter className="w-5 h-5 text-blue-500" />
//                   Filters
//                 </h3>
//                 <button
//                   onClick={clearFilters}
//                   className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
//                 >
//                   <X className="w-4 h-4" />
//                   Clear All
//                 </button>
//               </div>

//               <div className="grid md:grid-cols-3 gap-4">
                
//                 {/* Subject Filter Dropdown */}
//                 <div>
//                   <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
//                     Subject
//                   </label>
//                   <select
//                     value={selectedSubject}
//                     onChange={(e) => setSelectedSubject(e.target.value)}
//                     className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                   >
//                     <option value="all">All Subjects</option>
//                     {subjects.map((subject) => (
//                       <option key={subject} value={subject}>
//                         {subject}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Sort By Dropdown */}
//                 <div>
//                   <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
//                     Sort By
//                   </label>
//                   <select
//                     value={sortBy}
//                     onChange={(e) => setSortBy(e.target.value)}
//                     className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                   >
//                     <option value="recent">Recently Updated</option>
//                     <option value="oldest">Oldest First</option>
//                     <option value="subject">Subject (A-Z)</option>
//                   </select>
//                 </div>

//                 {/* Tags Filter (Multi-select) */}
//                 <div>
//                   <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
//                     Tags
//                   </label>
//                   <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700">
//                     {allTags.length > 0 ? (
//                       allTags.map((tag) => (
//                         <button
//                           key={tag}
//                           onClick={() => toggleTag(tag)}
//                           className={`px-2 py-1 text-xs rounded-md transition-all ${
//                             selectedTags.includes(tag)
//                               ? 'bg-blue-500 text-white'
//                               : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-100'
//                           }`}
//                         >
//                           #{tag}
//                         </button>
//                       ))
//                     ) : (
//                       <p className="text-xs text-slate-400">No tags yet</p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* ========================================
//               🏷️ ACTIVE FILTERS BADGES
//               ========================================
//               Shows current active filters as removable badges
//           */}
//           {hasActiveFilters && (
//             <div className="flex flex-wrap gap-2">
//               {searchQuery && (
//                 <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
//                   Search: "{searchQuery}"
//                   <button onClick={() => { setSearchQuery(''); setTempSearchQuery(''); }} className="hover:bg-blue-200 rounded-full p-0.5">
//                     <X className="w-3 h-3" />
//                   </button>
//                 </span>
//               )}
//               {selectedSubject !== 'all' && (
//                 <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm flex items-center gap-1">
//                   Subject: {selectedSubject}
//                   <button onClick={() => setSelectedSubject('all')} className="hover:bg-cyan-200 rounded-full p-0.5">
//                     <X className="w-3 h-3" />
//                   </button>
//                 </span>
//               )}
//               {selectedTags.map(tag => (
//                 <span key={tag} className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm flex items-center gap-1">
//                   #{tag}
//                   <button onClick={() => toggleTag(tag)} className="hover:bg-sky-200 rounded-full p-0.5">
//                     <X className="w-3 h-3" />
//                   </button>
//                 </span>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* ========================================
//             📋 NOTES DISPLAY SECTION
//             ========================================
//         */}
//         {loading ? (
          
//           /* Loading Spinner */
//           <div className="flex items-center justify-center h-64">
//             <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
//           </div>
          
//         ) : (
//           <>
//             {/* ========================================
//                 ⏱️ RECENTLY MODIFIED SECTION
//                 ========================================
//                 Shows top 5 recently modified notes
//                 Only visible when no filters are active
//             */}
//             {!hasActiveFilters && (
//               <div className="mb-10">
//                 <div className="flex items-center gap-3 mb-5">
//                   <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
//                     <Clock className="w-6 h-6 text-white" />
//                   </div>
//                   <div>
//                     <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
//                       Recently Modified
//                     </h2>
//                     <p className="text-sm text-slate-500">
//                       {recentNotes.length > 0 ? `Last ${recentNotes.length} updated notes` : 'No recent notes yet'}
//                     </p>
//                   </div>
//                 </div>
                
//                 {recentNotes.length > 0 ? (
//                   <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
//                     {recentNotes.map((note) => (
//                       <RecentNoteCard 
//                         key={note._id} 
//                         note={note} 
//                         navigate={navigate} 
//                         getTimeAgo={getTimeAgo} 
//                       />
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-8 bg-white/50 dark:bg-slate-900/50 rounded-xl border-2 border-dashed border-blue-200 dark:border-slate-700">
//                     <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
//                     <p className="text-slate-500 dark:text-slate-400">No notes modified yet</p>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* ========================================
//                 📚 ALL NOTES SECTION
//                 ========================================
//                 Shows all notes (filtered/sorted)
//             */}
//             <div>
//               <div className="flex items-center gap-3 mb-5">
//                 <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-lg flex items-center justify-center">
//                   <BookOpen className="w-6 h-6 text-white" />
//                 </div>
//                 <div>
//                   <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
//                     All Notes
//                   </h2>
//                   <p className="text-sm text-slate-500">
//                     {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'} total
//                   </p>
//                 </div>
//               </div>

//               {filteredNotes.length === 0 ? (
                
//                 /* Empty State */
//                 <div className="text-center py-12 bg-white/50 dark:bg-slate-900/50 rounded-xl border-2 border-dashed border-blue-200 dark:border-slate-700">
//                   <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center">
//                     {hasActiveFilters ? (
//                       <Search className="w-10 h-10 text-blue-500" />
//                     ) : (
//                       <BookOpen className="w-10 h-10 text-blue-500" />
//                     )}
//                   </div>
//                   <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
//                     {hasActiveFilters ? 'No notes found' : 'No notes yet'}
//                   </h3>
//                   <p className="text-slate-600 dark:text-slate-400 mb-4">
//                     {hasActiveFilters 
//                       ? 'Try adjusting your filters or search query'
//                       : 'Create your first note to get started!'}
//                   </p>
//                   {hasActiveFilters ? (
//                     <button
//                       onClick={clearFilters}
//                       className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all"
//                     >
//                       Clear Filters
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() => navigate('/notes-organizer/create')}
//                       className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg inline-flex items-center gap-2 transition-all"
//                     >
//                       <Plus className="w-5 h-5" />
//                       Create First Note
//                     </button>
//                   )}
//                 </div>
                
//               ) : (
                
//                 /* Notes Grid/List */
//                 <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
//                   {filteredNotes.map((note) => (
//                     viewMode === 'grid' ? (
//                       <NoteCard 
//                         key={note._id} 
//                         note={note} 
//                         onDelete={handleDeleteClick}
//                         navigate={navigate} 
//                         formatDate={formatDate} 
//                         truncateContent={truncateContent}
//                         expandedTagsNoteId={expandedTagsNoteId}
//                         setExpandedTagsNoteId={setExpandedTagsNoteId}
//                       />
//                     ) : (
//                       <NoteListItem 
//                         key={note._id} 
//                         note={note} 
//                         onDelete={handleDeleteClick}
//                         navigate={navigate} 
//                         formatDate={formatDate} 
//                         truncateContent={truncateContent} 
//                       />
//                     )
//                   ))}
//                 </div>
//               )}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// // ========================================
// // 📝 COMPONENT: RecentNoteCard
// // ========================================
// // Small card for recently modified notes
// // Shows: Icon, Subject, Time ago, Top 2 tags
// // ========================================
// const RecentNoteCard = ({ note, navigate, getTimeAgo }) => (
//   <div
//     onClick={() => navigate(`/notes-organizer/edit/${note._id}`)}
//     className="group bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-900 dark:to-slate-800 rounded-xl border-2 border-blue-200 dark:border-slate-700 p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
//   >
//     <div className="flex items-start gap-3 mb-3">
//       <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
//         <FileText className="w-5 h-5 text-white" />
//       </div>
//       <div className="flex-1 min-w-0">
//         <h3 className="font-bold text-slate-800 dark:text-white text-sm line-clamp-2 mb-1">
//           {note.subject}
//         </h3>
//         <span className="text-xs text-slate-500 flex items-center gap-1">
//           <Clock className="w-3 h-3" />
//           {getTimeAgo(note.updatedAt)}
//         </span>
//       </div>
//     </div>
    
//     {note.tags && note.tags.length > 0 && (
//       <div className="flex flex-wrap gap-1">
//         {note.tags.slice(0, 2).map((tag) => (
//           <span
//             key={tag}
//             className="px-2 py-0.5 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 rounded-md text-xs font-medium"
//           >
//             #{tag}
//           </span>
//         ))}
//         {note.tags.length > 2 && (
//           <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-xs">
//             +{note.tags.length - 2}
//           </span>
//         )}
//       </div>
//     )}
//   </div>
// );

// // ========================================
// // 📝 COMPONENT: NoteCard (Grid View)
// // ========================================
// // Full card for notes in grid view
// // Shows: Subject, Date, Content preview, Tags, Edit/Delete buttons
// // ========================================
// const NoteCard = ({ note, onDelete, navigate, formatDate, truncateContent, expandedTagsNoteId, setExpandedTagsNoteId }) => {
//   const isExpanded = expandedTagsNoteId === note._id;
  
//   return (
//     <div className="group bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-900 dark:to-slate-800 rounded-xl border-2 border-blue-200 dark:border-slate-700 p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      
//       {/* Clickable area - opens note in edit mode */}
//       <div onClick={() => navigate(`/notes-organizer/edit/${note._id}`)} className="cursor-pointer flex-1">
        
//         {/* Header: Subject + Date + PDF indicator */}
//         <div className="flex items-start justify-between mb-3">
//           <div className="flex-1">
//             <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1 line-clamp-1">
//               {note.subject}
//             </h3>
//             <div className="flex items-center gap-2 text-xs text-slate-500">
//               <Calendar className="w-3 h-3" />
//               {formatDate(note.updatedAt)}
//             </div>
//           </div>
//           {note.documentUrl && (
//             <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
//               <FileText className="w-4 h-4" />
//             </div>
//           )}
//         </div>

//         {/* Content Preview */}
//         <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-3">
//           {truncateContent(note.content)}
//         </p>
//       </div>

//       {/* Tags Section (Expandable) */}
//       {note.tags && note.tags.length > 0 && (
//         <div className="mb-3">
//           <div className="flex flex-wrap gap-1.5">
//             {(isExpanded ? note.tags : note.tags.slice(0, 3)).map((tag) => (
//               <span key={tag} className="px-2 py-1 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 rounded-md text-xs font-medium">
//                 #{tag}
//               </span>
//             ))}
//             {note.tags.length > 3 && (
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setExpandedTagsNoteId(isExpanded ? null : note._id);
//                 }}
//                 className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md text-xs font-medium transition-all"
//               >
//                 {isExpanded ? 'Show less' : `+${note.tags.length - 3} more`}
//               </button>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Action Buttons (Always at bottom) */}
//       <div className="flex items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-700 mt-auto">
//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             navigate(`/notes-organizer/edit/${note._id}`);
//           }}
//           className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all"
//         >
//           <Edit className="w-4 h-4" />
//           Edit
//         </button>
//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             onDelete(note._id);
//           }}
//           className="flex items-center justify-center gap-2 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-sm font-medium transition-all"
//         >
//           <Trash2 className="w-4 h-4" />
//         </button>
//       </div>
//     </div>
//   );
// };

// // ========================================
// // 📝 COMPONENT: NoteListItem (List View)
// // ========================================
// // Horizontal card for notes in list view
// // Shows: Icon, Subject, Content preview, Date, Tags, Edit/Delete buttons
// // ========================================
// const NoteListItem = ({ note, onDelete, navigate, formatDate, truncateContent }) => (
//   <div 
//     onClick={() => navigate(`/notes-organizer/edit/${note._id}`)}
//     className="bg-gradient-to-r from-white to-blue-50/30 dark:from-slate-900 dark:to-slate-800 rounded-xl border-2 border-blue-200 dark:border-slate-700 p-5 hover:shadow-lg transition-all cursor-pointer"
//   >
//     <div className="flex items-center gap-4">
      
//       {/* Icon */}
//       <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
//         <FileText className="w-6 h-6 text-white" />
//       </div>
      
//       {/* Content */}
//       <div className="flex-1 min-w-0">
//         <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1 truncate">
//           {note.subject}
//         </h3>
//         <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
//           {truncateContent(note.content)}
//         </p>
//         <div className="flex items-center gap-3 mt-2">
//           <span className="text-xs text-slate-500 flex items-center gap-1">
//             <Calendar className="w-3 h-3" />
//             {formatDate(note.updatedAt)}
//           </span>
//           {note.tags && note.tags.length > 0 && (
//             <div className="flex gap-1">
//               {note.tags.slice(0, 2).map((tag) => (
//                 <span key={tag} className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded text-xs">
//                   #{tag}
//                 </span>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="flex items-center gap-2 flex-shrink-0">
//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             navigate(`/notes-organizer/edit/${note._id}`);
//           }}
//           className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-all"
//         >
//           <Edit className="w-5 h-5" />
//         </button>
//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             onDelete(note._id);
//           }}
//           className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-all"
//         >
//           <Trash2 className="w-5 h-5" />
//         </button>
//       </div>
//     </div>
//   </div>
// );

// export default Library;


































// ========================================
// 📚 LIBRARY PAGE - NOTES ORGANIZER
// ========================================
// ✅ WITH DELETE LOADING STATE ADDED
// ========================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Plus, BookOpen, Filter, Grid, List, 
  Clock, FileText, Tag, Edit, Trash2, Eye, 
  Calendar, ArrowLeft, SlidersHorizontal, X,
  Loader2, TrendingUp, Sparkles, Zap, AlertTriangle
} from 'lucide-react';
import { toast } from 'react-toastify';
import { notesService } from '../../services/notesService';

const Library = () => {
  const navigate = useNavigate();

  // ========================================
  // 📦 STATE MANAGEMENT
  // ========================================
  
  // Notes data
  const [notes, setNotes] = useState([]);
  const [recentNotes, setRecentNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedTagsNoteId, setExpandedTagsNoteId] = useState(null);
  
  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [tempSearchQuery, setTempSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState('recent');
  
  // Data from backend
  const [subjects, setSubjects] = useState([]);
  const [allTags, setAllTags] = useState([]);
  
  // Tag suggestions & Delete modal
  const [tagSuggestions, setTagSuggestions] = useState([]);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [deleteNoteId, setDeleteNoteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // ✅ NEW: Loading state for delete operation
  const [deletingNoteId, setDeletingNoteId] = useState(null);

  // ========================================
  // 🔄 LIFECYCLE HOOKS
  // ========================================
  
  useEffect(() => {
    fetchNotes();
    fetchRecentNotes();
    fetchSubjects();
  }, []);

  useEffect(() => {
    filterAndSortNotes();
  }, [notes, searchQuery, selectedSubject, selectedTags, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (tempSearchQuery.trim()) {
        fetchTagSuggestions(tempSearchQuery);
      } else {
        setTagSuggestions([]);
        setShowTagSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [tempSearchQuery]);

  // ========================================
  // 📡 API FUNCTIONS
  // ========================================
  
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await notesService.getAllNotes();
      const notesData = response.data.notes || [];
      setNotes(notesData);
      
      const tags = new Set();
      notesData.forEach(note => {
        if (note.tags && Array.isArray(note.tags)) {
          note.tags.forEach(tag => tags.add(tag));
        }
      });
      setAllTags(Array.from(tags));
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentNotes = async () => {
    try {
      const response = await notesService.getRecentNotes();
      const recent = response.data.notes || [];
      setRecentNotes(recent.slice(0, 5));
    } catch (error) {
      console.error('Error fetching recent notes:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await notesService.getSubjects();
      const subjectsArray = response.data || [];
      setSubjects(subjectsArray);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchTagSuggestions = async (query) => {
    try {
      const response = await notesService.getTagSuggestions(query);
      const suggestions = response.data || [];
      setTagSuggestions(suggestions);
      setShowTagSuggestions(suggestions.length > 0);
    } catch (error) {
      console.error('Error fetching tag suggestions:', error);
      setTagSuggestions([]);
      setShowTagSuggestions(false);
    }
  };

  // ========================================
  // 🎯 EVENT HANDLERS
  // ========================================
  
  const handleSelectTagSuggestion = (tag) => {
    setTempSearchQuery(tag);
    setSearchQuery(tag);
    setShowTagSuggestions(false);
  };

  const handleSearch = () => {
    setSearchQuery(tempSearchQuery);
    setShowTagSuggestions(false);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const filterAndSortNotes = () => {
    let filtered = [...notes];

    if (searchQuery.trim()) {
      filtered = filtered.filter(note =>
        note.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedSubject !== 'all') {
      filtered = filtered.filter(note => note.subject === selectedSubject);
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(note =>
        selectedTags.every(tag => note.tags?.includes(tag))
      );
    }

    filtered.sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      } else if (sortBy === 'oldest') {
        return new Date(a.updatedAt) - new Date(b.updatedAt);
      } else if (sortBy === 'subject') {
        return a.subject?.localeCompare(b.subject);
      }
      return 0;
    });

    setFilteredNotes(filtered);
  };

  const handleDeleteClick = (noteId) => {
    setDeleteNoteId(noteId);
    setShowDeleteModal(true);
  };

  // ✅ FIXED: Delete handler with loading state
  const handleConfirmDelete = async () => {
    setDeletingNoteId(deleteNoteId); // Show loading spinner
    
    try {
      await notesService.deleteNote(deleteNoteId);
      toast.success('Note deleted successfully!');
      setShowDeleteModal(false);
      setDeleteNoteId(null);
      fetchNotes();
      fetchRecentNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
    } finally {
      setDeletingNoteId(null); // Hide loading spinner
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteNoteId(null);
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setTempSearchQuery('');
    setSelectedSubject('all');
    setSelectedTags([]);
    setSortBy('recent');
  };

  // ========================================
  // 🛠️ UTILITY FUNCTIONS
  // ========================================
  
  const truncateContent = (html, maxLength = 150) => {
    const text = html?.replace(/<[^>]*>/g, '') || '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return formatDate(date);
  };

  const hasActiveFilters = searchQuery || selectedSubject !== 'all' || selectedTags.length > 0;

  // ========================================
  // 🎨 RENDER
  // ========================================
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-sky-50/30 to-cyan-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      
      {/* ✅ FIXED: DELETE MODAL WITH LOADING STATE */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-red-50 via-orange-50 to-pink-50 dark:from-red-900/20 dark:via-orange-900/20 dark:to-pink-900/20 rounded-2xl shadow-2xl border-4 border-red-200 dark:border-red-700 max-w-md w-full p-6 transform transition-all">
            
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <AlertTriangle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-900 dark:text-red-100 mb-2">
                  Delete Note?
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Are you sure you want to delete this note? This action cannot be undone.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                disabled={deletingNoteId !== null}
                className="flex-1 px-4 py-3 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg transition-all border-2 border-slate-300 dark:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deletingNoteId !== null}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:from-red-300 disabled:to-pink-300 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                {deletingNoteId ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-blue-200 dark:border-slate-800 px-6 py-4 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/notes-organizer')}
              className="p-2 hover:bg-blue-100 dark:hover:bg-slate-800 rounded-lg transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-blue-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  My Library
                </h1>
                <p className="text-sm text-slate-500">
                  {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                </p>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => navigate('/notes-organizer/create')}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/30 transition-all transform hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            Create Note
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto p-6">
        
        {/* SEARCH & FILTERS */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-3">
            
            <div className="flex-1 flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                <input
                  type="text"
                  placeholder="Search notes by subject, content, or tags..."
                  value={tempSearchQuery}
                  onChange={(e) => setTempSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  onFocus={() => tempSearchQuery && setShowTagSuggestions(tagSuggestions.length > 0)}
                  onBlur={() => setTimeout(() => setShowTagSuggestions(false), 200)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border-2 border-blue-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                
                {showTagSuggestions && tagSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border-2 border-cyan-300 dark:border-slate-700 rounded-lg shadow-xl z-[9999] max-h-48 overflow-y-auto">
                    {tagSuggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectTagSuggestion(suggestion);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-cyan-50 dark:hover:bg-slate-700 text-sm text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-2"
                      >
                        <span className="text-cyan-500">#</span>
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-lg transition-all flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Search
              </button>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-lg border-2 transition-all flex items-center gap-2 ${
                showFilters 
                  ? 'bg-blue-500 text-white border-blue-500' 
                  : 'bg-white dark:bg-slate-900 border-blue-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-blue-50'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>

            <div className="flex bg-white dark:bg-slate-900 border-2 border-blue-200 dark:border-slate-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-800'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 transition-all ${
                  viewMode === 'list' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-800'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-blue-200 dark:border-slate-700 rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                  <Filter className="w-5 h-5 text-blue-500" />
                  Filters
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Clear All
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    Subject
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="all">All Subjects</option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="recent">Recently Updated</option>
                    <option value="oldest">Oldest First</option>
                    <option value="subject">Subject (A-Z)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700">
                    {allTags.length > 0 ? (
                      allTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-2 py-1 text-xs rounded-md transition-all ${
                            selectedTags.includes(tag)
                              ? 'bg-blue-500 text-white'
                              : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-100'
                          }`}
                        >
                          #{tag}
                        </button>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400">No tags yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
                  Search: "{searchQuery}"
                  <button onClick={() => { setSearchQuery(''); setTempSearchQuery(''); }} className="hover:bg-blue-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedSubject !== 'all' && (
                <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm flex items-center gap-1">
                  Subject: {selectedSubject}
                  <button onClick={() => setSelectedSubject('all')} className="hover:bg-cyan-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedTags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm flex items-center gap-1">
                  #{tag}
                  <button onClick={() => toggleTag(tag)} className="hover:bg-sky-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* NOTES DISPLAY */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : (
          <>
            {!hasActiveFilters && (
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                      Recently Modified
                    </h2>
                    <p className="text-sm text-slate-500">
                      {recentNotes.length > 0 ? `Last ${recentNotes.length} updated notes` : 'No recent notes yet'}
                    </p>
                  </div>
                </div>
                
                {recentNotes.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {recentNotes.map((note) => (
                      <RecentNoteCard 
                        key={note._id} 
                        note={note} 
                        navigate={navigate} 
                        getTimeAgo={getTimeAgo} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-white/50 dark:bg-slate-900/50 rounded-xl border-2 border-dashed border-blue-200 dark:border-slate-700">
                    <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 dark:text-slate-400">No notes modified yet</p>
                  </div>
                )}
              </div>
            )}

            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                    All Notes
                  </h2>
                  <p className="text-sm text-slate-500">
                    {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'} total
                  </p>
                </div>
              </div>

              {filteredNotes.length === 0 ? (
                <div className="text-center py-12 bg-white/50 dark:bg-slate-900/50 rounded-xl border-2 border-dashed border-blue-200 dark:border-slate-700">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center">
                    {hasActiveFilters ? (
                      <Search className="w-10 h-10 text-blue-500" />
                    ) : (
                      <BookOpen className="w-10 h-10 text-blue-500" />
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                    {hasActiveFilters ? 'No notes found' : 'No notes yet'}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    {hasActiveFilters 
                      ? 'Try adjusting your filters or search query'
                      : 'Create your first note to get started!'}
                  </p>
                  {hasActiveFilters ? (
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all"
                    >
                      Clear Filters
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/notes-organizer/create')}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg inline-flex items-center gap-2 transition-all"
                    >
                      <Plus className="w-5 h-5" />
                      Create First Note
                    </button>
                  )}
                </div>
              ) : (
                <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                  {filteredNotes.map((note) => (
                    viewMode === 'grid' ? (
                      <NoteCard 
                        key={note._id} 
                        note={note} 
                        onDelete={handleDeleteClick}
                        navigate={navigate} 
                        formatDate={formatDate} 
                        truncateContent={truncateContent}
                        expandedTagsNoteId={expandedTagsNoteId}
                        setExpandedTagsNoteId={setExpandedTagsNoteId}
                      />
                    ) : (
                      <NoteListItem 
                        key={note._id} 
                        note={note} 
                        onDelete={handleDeleteClick}
                        navigate={navigate} 
                        formatDate={formatDate} 
                        truncateContent={truncateContent} 
                      />
                    )
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ========================================
// COMPONENT: RecentNoteCard
// ========================================
const RecentNoteCard = ({ note, navigate, getTimeAgo }) => (
  <div
    onClick={() => navigate(`/notes-organizer/edit/${note._id}`)}
    className="group bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-900 dark:to-slate-800 rounded-xl border-2 border-blue-200 dark:border-slate-700 p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
  >
    <div className="flex items-start gap-3 mb-3">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
        <FileText className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-slate-800 dark:text-white text-sm line-clamp-2 mb-1">
          {note.subject}
        </h3>
        <span className="text-xs text-slate-500 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {getTimeAgo(note.updatedAt)}
        </span>
      </div>
    </div>
    
    {note.tags && note.tags.length > 0 && (
      <div className="flex flex-wrap gap-1">
        {note.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 rounded-md text-xs font-medium"
          >
            #{tag}
          </span>
        ))}
        {note.tags.length > 2 && (
          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-xs">
            +{note.tags.length - 2}
          </span>
        )}
      </div>
    )}
  </div>
);

// ========================================
// COMPONENT: NoteCard (Grid View)
// ========================================
const NoteCard = ({ note, onDelete, navigate, formatDate, truncateContent, expandedTagsNoteId, setExpandedTagsNoteId }) => {
  const isExpanded = expandedTagsNoteId === note._id;
  
  return (
    <div className="group bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-900 dark:to-slate-800 rounded-xl border-2 border-blue-200 dark:border-slate-700 p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      
      <div onClick={() => navigate(`/notes-organizer/edit/${note._id}`)} className="cursor-pointer flex-1">
        
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1 line-clamp-1">
              {note.subject}
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="w-3 h-3" />
              {formatDate(note.updatedAt)}
            </div>
          </div>
          {note.documentUrl && (
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <FileText className="w-4 h-4" />
            </div>
          )}
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-3">
          {truncateContent(note.content)}
        </p>
      </div>

      {note.tags && note.tags.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1.5">
            {(isExpanded ? note.tags : note.tags.slice(0, 3)).map((tag) => (
              <span key={tag} className="px-2 py-1 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 rounded-md text-xs font-medium">
                #{tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedTagsNoteId(isExpanded ? null : note._id);
                }}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md text-xs font-medium transition-all"
              >
                {isExpanded ? 'Show less' : `+${note.tags.length - 3} more`}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-700 mt-auto">
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/notes-organizer/edit/${note._id}`);
          }}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note._id);
          }}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-sm font-medium transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ========================================
// COMPONENT: NoteListItem (List View)
// ========================================
const NoteListItem = ({ note, onDelete, navigate, formatDate, truncateContent }) => (
  <div 
    onClick={() => navigate(`/notes-organizer/edit/${note._id}`)}
    className="bg-gradient-to-r from-white to-blue-50/30 dark:from-slate-900 dark:to-slate-800 rounded-xl border-2 border-blue-200 dark:border-slate-700 p-5 hover:shadow-lg transition-all cursor-pointer"
  >
    <div className="flex items-center gap-4">
      
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
        <FileText className="w-6 h-6 text-white" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1 truncate">
          {note.subject}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
          {truncateContent(note.content)}
        </p>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(note.updatedAt)}
          </span>
          {note.tags && note.tags.length > 0 && (
            <div className="flex gap-1">
              {note.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded text-xs">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/notes-organizer/edit/${note._id}`);
          }}
          className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-all"
        >
          <Edit className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note._id);
          }}
          className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-all"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
);

export default Library;
