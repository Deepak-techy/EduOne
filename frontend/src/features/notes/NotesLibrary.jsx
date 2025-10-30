
// src/features/notes/Library.jsx - HEADERS ALWAYS VISIBLE
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Plus, BookOpen, Filter, Grid, List, 
  Clock, FileText, Tag, Edit, Trash2, Eye, 
  Calendar, ArrowLeft, SlidersHorizontal, X,
  Loader2, TrendingUp, Sparkles, Zap
} from 'lucide-react';
import { toast } from 'react-toastify';
import { notesService } from '../../services/notesService';

const Library = () => {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [recentNotes, setRecentNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [tempSearchQuery, setTempSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    fetchNotes();
    fetchRecentNotes();
    fetchSubjects();
  }, []);

  useEffect(() => {
    filterAndSortNotes();
  }, [notes, searchQuery, selectedSubject, selectedTags, sortBy]);

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
      setSubjects(response.data.subjects || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleSearch = () => {
    setSearchQuery(tempSearchQuery);
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

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await notesService.deleteNote(noteId);
      toast.success('Note deleted successfully!');
      fetchNotes();
      fetchRecentNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-sky-50/30 to-cyan-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      
      {/* Header */}
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

      <div className="max-w-7xl mx-auto p-6">
        
        {/* Search & Filters Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-3">
            {/* Search with Button */}
            <div className="flex-1 flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search notes by subject, content, or tags..."
                  value={tempSearchQuery}
                  onChange={(e) => setTempSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border-2 border-blue-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-lg transition-all flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Search
              </button>
            </div>

            {/* Filter Button */}
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

            {/* View Toggle */}
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

          {/* Filters Panel */}
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

          {/* Active Filters Display */}
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

        {/* Main Content */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : (
          <>
            {/* SECTION 1: Recently Modified - ALWAYS SHOW HEADER */}
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

            {/* SECTION 2: All Notes - ALWAYS SHOW HEADER */}
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
                        onDelete={handleDeleteNote} 
                        navigate={navigate} 
                        formatDate={formatDate} 
                        truncateContent={truncateContent} 
                      />
                    ) : (
                      <NoteListItem 
                        key={note._id} 
                        note={note} 
                        onDelete={handleDeleteNote} 
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

// Recent Note Card Component
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

// Note Card & List Item components remain the same...
// (Include NoteCard and NoteListItem from previous code)

const NoteCard = ({ note, onDelete, navigate, formatDate, truncateContent }) => (
  <div className="group bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-900 dark:to-slate-800 rounded-xl border-2 border-blue-200 dark:border-slate-700 p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
    <div onClick={() => navigate(`/notes-organizer/edit/${note._id}`)}>
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

      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {note.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-1 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 rounded-md text-xs font-medium">
              #{tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs">
              +{note.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </div>

    <div className="flex items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
      <button
        onClick={() => navigate(`/notes-organizer/edit/${note._id}`)}
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
