// src/features/notes/CreateNote.jsx - 
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { 
  Save, Upload, Sparkles, ArrowLeft,
  Bold, Italic, List, ListOrdered, Undo, Redo,
  AlignLeft, AlignCenter, AlignRight, Underline as UnderlineIcon,
  FileText, Loader2, X, Brain, Eye, EyeOff, CheckCircle2, Clock,
  ZoomIn, ZoomOut, Download
} from 'lucide-react';
import { toast } from 'react-toastify';
import { notesService } from '../../services/notesService';

const CreateNote = () => {
  const navigate = useNavigate();
  const { noteId } = useParams();
  const isEditMode = Boolean(noteId);

  const [subject, setSubject] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [documentUrl, setDocumentUrl] = useState(null);
  const [documentName, setDocumentName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [selectedText, setSelectedText] = useState('');
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [showPdfPanel, setShowPdfPanel] = useState(true);
  const [pdfZoom, setPdfZoom] = useState(100);

  const fileInputRef = useRef(null);
  const autoSaveTimerRef = useRef(null);

  // TipTap Editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your notes here...',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-base max-w-none focus:outline-none min-h-[500px] p-8 text-slate-700 dark:text-slate-200 bg-gradient-to-br from-blue-50/80 to-sky-50/50',
      },
    },
    onUpdate: ({ editor }) => {
      scheduleAutoSave();
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      const text = editor.state.doc.textBetween(from, to, ' ');
      setSelectedText(text);
      setShowAIPrompt(text.length > 0);
    },
  });

  const hasContent = () => {
    if (!editor) return false;
    const text = editor.getText();
    return text.trim().length > 0;
  };

  useEffect(() => {
    if (isEditMode && noteId) {
      loadNote();
    }
  }, [noteId, isEditMode]);

  const loadNote = async () => {
    try {
      const response = await notesService.getNoteById(noteId);
      const note = response.data.note || response.data;
      
      setSubject(note.subject || '');
      setTags(note.tags || []);
      setDocumentUrl(note.documentUrl || null);
      setDocumentName(note.documentName || '');
      
      if (editor && note.content) {
        editor.commands.setContent(note.content);
      }
      
      toast.success('Note loaded!');
    } catch (error) {
      console.error('Error loading note:', error);
      toast.error('Failed to load note');
    }
  };

  const scheduleAutoSave = useCallback(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    autoSaveTimerRef.current = setTimeout(() => {
      saveNote(true);
    }, 30000);
  }, []);

  const saveNote = async (isAutoSave = false) => {
    if (!subject.trim()) {
      if (!isAutoSave) toast.error('Please enter a subject');
      return;
    }

    setIsSaving(true);

    try {
      const noteData = {
        subject,
        content: editor?.getHTML() || '',
        tags,
        documentUrl,
        documentName,
      };

      let response;
      if (isEditMode) {
        response = await notesService.updateNote(noteId, noteData);
        toast.success(isAutoSave ? '✓ Saved' : 'Note updated!', { autoClose: 2000 });
      } else {
        response = await notesService.createNote(noteData);
        const newNoteId = response.data.noteId || response.data._id;
        toast.success('Note created!');
        navigate(`/notes-organizer/edit/${newNoteId}`);
      }

      setLastSaved(new Date());
    } catch (error) {
      console.error('Save error:', error);
      if (!isAutoSave) toast.error('Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File must be less than 10MB');
      return;
    }

    if (!noteId) {
      toast.info('Saving note first...');
      await saveNote(false);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    setIsUploading(true);

    try {
      const currentNoteId = noteId || window.location.pathname.split('/').pop();
      
      if (!currentNoteId) {
        throw new Error('Note ID not found');
      }

      const response = await notesService.uploadDocument(currentNoteId, file);
      const uploadedUrl = response.data.documentUrl || response.data.url;
      
      setDocumentUrl(uploadedUrl);
      setDocumentName(file.name);
      setShowPdfPanel(true);
      toast.success('PDF uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload PDF. Please save the note first.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const newTag = tagInput.trim().replace(/^#/, '');
    if (!tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleGenerateTags = async () => {
    if (!hasContent()) {
      toast.error('Please write some content first');
      return;
    }

    if (!noteId) {
      toast.error('Please save the note first');
      return;
    }

    setIsGeneratingTags(true);
    try {
      const response = await notesService.generateTags(noteId);
      setTags(response.data.tags || []);
      toast.success('Tags generated!');
    } catch (error) {
      console.error('Generate tags error:', error);
      toast.error('Failed to generate tags');
    } finally {
      setIsGeneratingTags(false);
    }
  };

  const handleAskAI = async () => {
    if (!selectedText.trim()) {
      toast.error('Please select some text first');
      return;
    }

    if (!noteId) {
      toast.error('Please save the note first');
      return;
    }

    setAiLoading(true);
    try {
      const response = await notesService.askAI(noteId, selectedText);
      const answer = response.data.answer || response.data;
      
      editor?.commands.insertContent(`\n\n<div class="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-l-4 border-blue-500 p-4 rounded-lg my-3 shadow-sm"><p class="font-bold text-blue-700 dark:text-blue-300 mb-2">🤖 AI Answer</p><p>${answer}</p></div>\n\n`);
      
      toast.success('AI answer inserted!');
      setShowAIPrompt(false);
    } catch (error) {
      console.error('AI error:', error);
      toast.error('Failed to get AI answer');
    } finally {
      setAiLoading(false);
    }
  };

  const EditorToolbar = () => {
    if (!editor) return null;

    const ToolButton = ({ onClick, isActive, icon: Icon, title, disabled }) => (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`p-2 rounded-lg transition-all ${
          isActive 
            ? 'bg-blue-100 text-blue-600 shadow-sm' 
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
        } disabled:opacity-30`}
        title={title}
      >
        <Icon className="w-4 h-4" />
      </button>
    );

    return (
      <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-white to-blue-50/50 dark:from-slate-800 dark:to-slate-800 border-b border-blue-200 dark:border-slate-700">
        <div className="flex items-center gap-1">
          <ToolButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} icon={Bold} title="Bold" />
          <ToolButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} icon={Italic} title="Italic" />
          <ToolButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} icon={UnderlineIcon} title="Underline" />
          
          <div className="w-px h-5 bg-blue-300 mx-2"></div>
          
          <ToolButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} icon={List} title="Bullet List" />
          <ToolButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} icon={ListOrdered} title="Numbered List" />
          
          <div className="w-px h-5 bg-cyan-300 mx-2"></div>
          
          <ToolButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} icon={AlignLeft} title="Align Left" />
          <ToolButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} icon={AlignCenter} title="Align Center" />
          <ToolButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} icon={AlignRight} title="Align Right" />
          
          <div className="w-px h-5 bg-sky-300 mx-2"></div>
          
          <ToolButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} icon={Undo} title="Undo" />
          <ToolButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} icon={Redo} title="Redo" />
        </div>

        {lastSaved && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>Saved {lastSaved.toLocaleTimeString()}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-sky-50/30 to-cyan-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      
      {/* Header */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-blue-200 dark:border-slate-800 px-6 py-4 shadow-sm">
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
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {isEditMode ? 'Edit Note' : 'Create New Note'}
                </h1>
                <p className="text-sm text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Auto-saves every 30 seconds
                </p>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => saveNote(false)}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/30 disabled:opacity-50 transition-all transform hover:scale-105"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Saving...' : 'Save Note'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-12 gap-6">
        
        {/* Left Sidebar - FIXED OVERFLOW */}
        <div className="col-span-3 space-y-4">
          
          {/* Subject Card */}
          <div className="bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-900 dark:to-slate-800 backdrop-blur-sm rounded-xl border border-blue-200 dark:border-slate-700 p-5 shadow-sm">
            <label className="block text-sm font-semibold text-blue-700 dark:text-blue-400 mb-3">
              📚 Subject
            </label>
            <input
              type="text"
              placeholder="e.g., Data Structures"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
            />
          </div>

          {/* Tags Card - FIXED */}
          <div className="bg-gradient-to-br from-white to-cyan-50/50 dark:from-slate-900 dark:to-slate-800 backdrop-blur-sm rounded-xl border border-cyan-200 dark:border-slate-700 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-cyan-700 dark:text-cyan-400">
                🏷️ Tags
              </label>
              <button
                onClick={handleGenerateTags}
                disabled={isGeneratingTags || !hasContent() || !noteId}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-md hover:from-cyan-600 hover:to-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                title={!hasContent() ? "Write content first" : "Generate AI tags"}
              >
                {isGeneratingTags ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                AI
              </button>
            </div>

            {/* Tags Display */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 rounded-md text-xs font-medium shadow-sm"
                  >
                    #{tag}
                    <button onClick={() => handleRemoveTag(tag)} className="hover:bg-cyan-200 rounded-full p-0.5 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Tag Input - FIXED OVERFLOW */}
            <div className="flex gap-1.5">
              <input
                type="text"
                placeholder="Add tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                className="flex-1 min-w-0 px-3 py-2 bg-white dark:bg-slate-800 border-2 border-cyan-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
              />
              <button
                onClick={handleAddTag}
                className="px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all shadow-sm text-sm flex-shrink-0"
              >
                Add
              </button>
            </div>
          </div>

          {/* PDF Upload Card */}
          <div className="bg-gradient-to-br from-white to-sky-50/50 dark:from-slate-900 dark:to-slate-800 backdrop-blur-sm rounded-xl border border-sky-200 dark:border-slate-700 p-5 shadow-sm">
            <label className="block text-sm font-semibold text-sky-700 dark:text-sky-400 mb-3">
              📄 Reference PDF
            </label>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf" className="hidden" />
            
            {!documentUrl ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full px-4 py-3 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white font-medium rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-md"
              >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {isUploading ? 'Uploading...' : 'Upload PDF'}
              </button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-sky-100 to-blue-100 rounded-lg">
                  <FileText className="w-4 h-4 text-sky-600 flex-shrink-0" />
                  <span className="text-sm text-sky-700 truncate flex-1 font-medium">{documentName}</span>
                  <button onClick={() => { setDocumentUrl(null); setDocumentName(''); setShowPdfPanel(false); }} className="p-1 hover:bg-sky-200 rounded-full transition-colors flex-shrink-0">
                    <X className="w-4 h-4 text-sky-700" />
                  </button>
                </div>
                <button
                  onClick={() => setShowPdfPanel(!showPdfPanel)}
                  className="w-full px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all"
                >
                  {showPdfPanel ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showPdfPanel ? 'Hide PDF' : 'Show PDF'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Middle - Editor */}
        <div className={`${showPdfPanel && documentUrl ? 'col-span-5' : 'col-span-9'} bg-white dark:bg-slate-900 backdrop-blur-sm rounded-xl border-2 border-blue-200 dark:border-slate-700 overflow-hidden shadow-lg`}>
          <EditorToolbar />
          <div className="overflow-y-auto max-h-[calc(100vh-240px)]">
            <EditorContent editor={editor} />
          </div>

          {/* Floating AI Button */}
          {showAIPrompt && (
            <button
              onClick={handleAskAI}
              disabled={aiLoading}
              className="fixed bottom-10 left-1/2 transform-translate-x-1/2 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-full shadow-2xl shadow-blue-500/50 transition-all transform hover:scale-105 z-50"
            >
              {aiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Brain className="w-5 h-5" />}
              {aiLoading ? 'Thinking...' : 'Ask AI'}
            </button>
          )}
        </div>

        {/* Right - ENHANCED PDF Viewer */}
        {documentUrl && showPdfPanel && (
          <div className="col-span-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl border-2 border-blue-200 dark:border-slate-700 overflow-hidden shadow-lg flex flex-col">
            {/* PDF Header with Controls */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <span className="font-semibold text-sm truncate max-w-[150px]" title={documentName}>
                  {documentName}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setPdfZoom(Math.max(50, pdfZoom - 10))} 
                  className="p-1.5 hover:bg-white/20 rounded transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs px-2">{pdfZoom}%</span>
                <button 
                  onClick={() => setPdfZoom(Math.min(200, pdfZoom + 10))} 
                  className="p-1.5 hover:bg-white/20 rounded transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <div className="w-px h-5 bg-white/30 mx-1"></div>
                <a 
                  href={documentUrl} 
                  download={documentName}
                  className="p-1.5 hover:bg-white/20 rounded transition-colors"
                  title="Download PDF"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button 
                  onClick={() => setShowPdfPanel(false)} 
                  className="p-1.5 hover:bg-white/20 rounded transition-colors"
                  title="Close"
                >
                  <EyeOff className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* PDF Viewer */}
            <div className="flex-1 overflow-hidden bg-slate-100 dark:bg-slate-800">
              <iframe 
                src={`${documentUrl}#zoom=${pdfZoom}`}
                className="w-full h-full" 
                title="PDF Viewer"
                style={{ border: 'none' }}
              />
            </div>
          </div>
        )}
      </div>

      <style>{`
        .ProseMirror { 
          min-height: 500px;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #94a3b8;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror:focus { outline: none; }
        
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5em;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5em;
        }
        .ProseMirror li {
          margin: 0.25em 0;
        }
      `}</style>
    </div>
  );
};

export default CreateNote;
