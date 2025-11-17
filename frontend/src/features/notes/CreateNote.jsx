// // ============================================================================
// // src/features/notes/CreateNote.jsx - FIXED VERSION (4 PROBLEMS RESOLVED)
// // ============================================================================

// import { useState, useEffect, useCallback, useRef } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useEditor, EditorContent } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Placeholder from '@tiptap/extension-placeholder';
// import TextAlign from '@tiptap/extension-text-align';
// import Underline from '@tiptap/extension-underline';
// import Link from '@tiptap/extension-link';
// import Highlight from '@tiptap/extension-highlight';
// import { TextStyle } from '@tiptap/extension-text-style';  
// import { Color } from '@tiptap/extension-color';        
// import { 
//   Save, Upload, Sparkles, ArrowLeft, BookOpen,
//   Bold, Italic, List, ListOrdered, Undo, Redo,
//   AlignLeft, AlignCenter, AlignRight, Underline as UnderlineIcon,
//   FileText, Loader2, X, Brain, CheckCircle2,
//   ZoomIn, ZoomOut, Download, Maximize2, GripVertical, Eye, EyeOff, Highlighter,
//   Trash2
// } from 'lucide-react';
// import { toast } from 'react-toastify';
// import { notesService } from '../../services/notesService';
// import MarkdownRenderer from '../../components/common/MarkdownRenderer';

// const CreateNote = () => {
//   const navigate = useNavigate();
//   const { noteId } = useParams();
//   const isEditMode = Boolean(noteId);

//   // ============================================================================
//   // 📦 STATE - All component states
//   // ============================================================================
  
//   const [subject, setSubject] = useState('');
//   const [tags, setTags] = useState([]);
//   const [tagInput, setTagInput] = useState('');
//   const [documentUrl, setDocumentUrl] = useState(null);
//   const [documentName, setDocumentName] = useState('');
//   const [isUploading, setIsUploading] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [isGeneratingTags, setIsGeneratingTags] = useState(false);
//   const [lastSaved, setLastSaved] = useState(null);
//   const [selectedText, setSelectedText] = useState('');
//   const [selectedTextPosition, setSelectedTextPosition] = useState(null);
//   const [showAIPrompt, setShowAIPrompt] = useState(false);
//   const [aiLoading, setAiLoading] = useState(false);
//   const [showPdfPanel, setShowPdfPanel] = useState(true);
//   const [pdfZoom, setPdfZoom] = useState(1.0);
//   const [pdfWidth, setPdfWidth] = useState(40);
//   const [isResizing, setIsResizing] = useState(false);
//   const [showFullscreenPdf, setShowFullscreenPdf] = useState(false);
//   const [showColorPicker, setShowColorPicker] = useState(false);
//   const [noteLoaded, setNoteLoaded] = useState(false);

//   // ============================================================================
//   // 🔗 REFS - DOM element references
//   // ============================================================================
  
//   const fileInputRef = useRef(null);
//   const autoSaveTimerRef = useRef(null);
//   const containerRef = useRef(null);
//   const tagInputRef = useRef(null);
//   const hasLoadedRef = useRef(false);

//   // ============================================================================
//   // 📝 EDITOR SETUP - Tiptap configuration
//   // ============================================================================
  
//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Placeholder.configure({
//         placeholder: 'Start writing your notes here...',
//       }),
//       TextAlign.configure({
//         types: ['heading', 'paragraph'],
//       }),
//       Underline,
//       Link.configure({
//         openOnClick: false,
//       }),
//       Highlight.configure({
//         multicolor: true,
//       }),
//       TextStyle,
//       Color,
//     ],
//     content: '',
//     editorProps: {
//       attributes: {
//         class: 'prose prose-base max-w-none focus:outline-none min-h-[800px] p-8 text-slate-700 dark:text-slate-200 bg-gradient-to-br from-blue-50/80 to-sky-50/50',
//       },
//     },
//     onUpdate: ({ editor }) => {
//       scheduleAutoSave();
//     },
//     onSelectionUpdate: ({ editor }) => {
//       const { from, to } = editor.state.selection;
//       const text = editor.state.doc.textBetween(from, to, ' ');
//       setSelectedText(text);
//       setSelectedTextPosition({ from, to });
//       setShowAIPrompt(text.length > 0);
//     },
//   });

//   // ============================================================================
//   // 🔄 LOAD NOTE EFFECT - Load note when component mounts (ONLY ONCE!)
//   // ============================================================================
  
//   useEffect(() => {
//     if (isEditMode && noteId && !hasLoadedRef.current) {
//       hasLoadedRef.current = true;
//       loadNote();
//     }
//   }, [noteId, isEditMode]);

//   // ============================================================================
//   // 📡 API FUNCTIONS
//   // ============================================================================

//   const loadNote = async () => {
//     try {
//       const response = await notesService.getNoteById(noteId);
//       const note = response.data.note || response.data;
      
//       setSubject(note.subject || '');
//       setTags(note.tags || []);
//       setDocumentUrl(note.documentUrl || null);
//       setDocumentName(note.documentName || '');
      
//       if (editor && note.content) {
//         editor.commands.setContent(note.content);
//       }
      
//       toast.success('Note loaded!');
//       setNoteLoaded(true);
//     } catch (error) {
//       console.error('Error loading note:', error);
//       toast.error('Failed to load note');
//     }
//   };

//   const saveNote = async (isAutoSave = false) => {
//     if (!subject.trim()) {
//       if (!isAutoSave) toast.error('Please enter a subject');
//       return null;
//     }

//     setIsSaving(true);

//     try {
//       const noteData = {
//         subject,
//         content: editor?.getHTML() || '',
//         tags,
//         documentUrl,
//         documentName,
//       };

//       let response;
//       if (isEditMode && noteId) {
//         response = await notesService.updateNote(noteId, noteData);
//         if (!isAutoSave) toast.success('Note updated!', { autoClose: 2000 });
//       } else {
//         response = await notesService.createNote(noteData);
//         const newNoteId = response.data.noteId || response.data._id || response.data.data?.noteId;
        
//         if (newNoteId) {
//           toast.success('Note created!');
//           navigate(`/notes-organizer/edit/${newNoteId}`, { replace: true });
//         }
//       }

//       setLastSaved(new Date());
//       return response;
//     } catch (error) {
//       console.error('Save error:', error);
//       if (!isAutoSave) toast.error('Failed to save');
//       return null;
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const scheduleAutoSave = useCallback(() => {
//     if (autoSaveTimerRef.current) {
//       clearTimeout(autoSaveTimerRef.current);
//     }
//     autoSaveTimerRef.current = setTimeout(() => {
//       if (noteId) {
//         saveNote(true);
//       }
//     }, 30000);
//   }, [noteId]);

//   // ============================================================================
//   // ✅ FIX #1 - PDF UPLOAD VALIDATION
//   // ============================================================================
//   // PROBLEM: Two toasts shown when user clicks "Upload PDF" without entering subject
//   // SOLUTION: Check subject FIRST before any upload logic
//   // If no subject, show error and return early (don't upload)
  
//   const handleFileUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     // ✅ FIX #1a: Check subject FIRST - if no subject, reject immediately
//     if (!subject.trim()) {
//       toast.error('Please enter a subject first');
//       if (fileInputRef.current) {
//         fileInputRef.current.value = '';
//       }
//       return; // ✅ EXIT EARLY - don't proceed with upload
//     }

//     if (file.type !== 'application/pdf') {
//       toast.error('Please upload a PDF file');
//       return;
//     }

//     if (file.size > 10 * 1024 * 1024) {
//       toast.error('File must be less than 10MB');
//       return;
//     }

//     setIsUploading(true);
//     toast.info('Uploading PDF...');

//     try {
//       let uploadNoteId = noteId;

//       if (!uploadNoteId) {
//         // ✅ FIX #1b: Create note with subject + optional content first
//         toast.info('Saving note first...');
        
//         const noteData = {
//           subject,
//           content: editor?.getHTML() || '',
//           tags,
//           documentUrl: null,
//           documentName: '',
//         };

//         const response = await notesService.createNote(noteData);
//         uploadNoteId = response.data.noteId || response.data._id || response.data.data?.noteId;
        
//         if (!uploadNoteId) {
//           throw new Error('Failed to get note ID');
//         }

//         window.history.replaceState(null, '', `/notes-organizer/edit/${uploadNoteId}`);
//         await new Promise(resolve => setTimeout(resolve, 500));
//       }

//       const uploadResponse = await notesService.uploadDocument(uploadNoteId, file);
//       const pdfUrl = uploadResponse.data.documentUrl || uploadResponse.data.url;
      
//       if (!pdfUrl) {
//         throw new Error('No document URL returned');
//       }

//       setDocumentUrl(pdfUrl);
//       setDocumentName(file.name);
//       setShowPdfPanel(true);
      
//       toast.success('PDF uploaded successfully!');
//     } catch (error) {
//       console.error('Upload error:', error);
//       toast.error(error.message || 'Failed to upload PDF');
//     } finally {
//       setIsUploading(false);
//       if (fileInputRef.current) {
//         fileInputRef.current.value = '';
//       }
//     }
//   };

//   const handleDeletePDF = async () => {
//     if (!noteId) {
//       toast.error('Please save note first');
//       return;
//     }

//     setIsUploading(true);
//     try {
//       await notesService.deleteDocument(noteId);
      
//       setDocumentUrl(null);
//       setDocumentName('');
//       setShowPdfPanel(false);
      
//       toast.success('PDF deleted successfully!');
//     } catch (error) {
//       console.error('Delete PDF error:', error);
//       toast.error(error.message || 'Failed to delete PDF');
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleAddTag = () => {
//     if (!tagInput.trim()) return;
//     const newTag = tagInput.trim().replace(/^#/, '');
//     if (!tags.includes(newTag)) {
//       setTags([...tags, newTag]);
//     }
//     setTagInput('');
//   };

//   const handleRemoveTag = (tagToRemove) => {
//     setTags(tags.filter(tag => tag !== tagToRemove));
//   };

//   // ============================================================================
//   // ✅ FIX #2 - AI GENERATE TAGS BUTTON
//   // ============================================================================
//   // PROBLEM: Button shows error and doesn't work after adding subject
//   // SOLUTION: 
//   // - Auto-save the note if it doesn't exist yet (noteId is null)
//   // - Then generate tags (Subject + Content required, PDF optional)
  
//   const handleGenerateTags = async () => {
//     const currentContent = editor?.getHTML() || '';
//     const plainTextContent = editor?.getText() || '';

//     if (!subject.trim()) {
//       toast.error('Please enter a subject first');
//       return;
//     }

//     if (!plainTextContent.trim() || plainTextContent.length < 10) {
//       toast.error('Please write some content first (at least 10 characters)');
//       return;
//     }

//     // ✅ FIX #2a: If note doesn't exist yet, auto-save it first
//     let tagGenerationNoteId = noteId;
    
//     if (!tagGenerationNoteId) {
//       try {
//         toast.info('Saving note first...');
//         const response = await saveNote(true); // ✅ Auto-save the note
        
//         if (response?.data?.noteId) {
//           tagGenerationNoteId = response.data.noteId;
//         } else if (response?.data?._id) {
//           tagGenerationNoteId = response.data._id;
//         } else if (response?.data?.data?.noteId) {
//           tagGenerationNoteId = response.data.data.noteId;
//         }

//         if (!tagGenerationNoteId) {
//           toast.error('Failed to save note. Please save manually first.');
//           return;
//         }
//       } catch (error) {
//         toast.error('Failed to save note');
//         return;
//       }
//     }

//     setIsGeneratingTags(true);
    
//     try {
//       // ✅ FIX #2b: Now generate tags using the note ID
//       const response = await notesService.generateTags(
//         tagGenerationNoteId,
//         subject.trim(),
//         currentContent
//       );
      
//       const generatedTags = response.data || [];
      
//       if (generatedTags.length === 0) {
//         toast.warning('No tags generated. Try adding more content.');
//         return;
//       }

//       setTags(generatedTags);
//       toast.success(`${generatedTags.length} tags generated successfully!`);
      
//     } catch (error) {
//       console.error('Generate tags error:', error);
//       toast.error(error.message || 'Failed to generate tags');
//     } finally {
//       setIsGeneratingTags(false);
//     }
//   };

//   // ============================================================================
//   // ✅ FIX #3 - AI ANSWER FORMAT
//   // ============================================================================
//   // PROBLEM: 
//   // - Selected text gets REPLACED with AI answer
//   // - AI answer shows as plain text (no formatting)
//   // SOLUTION:
//   // - Keep original selected line INTACT
//   // - Add AI answer BELOW with MarkdownRenderer for nice formatting
//   // - Don't repeat the question in the answer
  
//   const handleAskAI = async () => {
//     if (!selectedText.trim()) {
//       toast.error('Please select some text first');
//       return;
//     }

//     if (!noteId) {
//       toast.error('Please save the note first');
//       return;
//     }

//     setAiLoading(true);
//     try {
//       const response = await notesService.askAI(noteId, selectedText);
//       const answer = response.data.answer || response.data;
      
//       if (selectedTextPosition && editor) {
//         const { to } = selectedTextPosition;
        
//         // ✅ FIX #3a: Move cursor to END of selected text (don't replace it)
//         editor.commands.setTextSelection(to);
        
//         // ✅ FIX #3b: Add AI answer BELOW with proper formatting
//         // Using a styled container with MarkdownRenderer-compatible content
//         const formattedAnswer = `
//         <div class="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-l-4 border-blue-500 p-4 rounded-lg my-4 shadow-sm">
//           <p class="font-bold text-blue-700 dark:text-blue-300 mb-2">🤖 AI Answer</p>
//           <div class="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
//             ${answer}
//           </div>
//         </div>
//         `;

//         // ✅ FIX #3c: Insert formatted answer on new lines BELOW selected text
//         editor.commands.insertContent(`\n\n${formattedAnswer}\n\n`);
//       }
      
//       toast.success('AI answer inserted!');
//       setShowAIPrompt(false);
//     } catch (error) {
//       console.error('AI error:', error);
//       toast.error('Failed to get AI answer');
//     } finally {
//       setAiLoading(false);
//     }
//   };

//   // ============================================================================
//   // 🎯 EVENT HANDLERS - PDF controls
//   // ============================================================================

//   const handleZoomIn = () => {
//     const newZoom = Math.min(pdfZoom + 0.1, 2.0);
//     setPdfZoom(newZoom);
//   };

//   const handleZoomOut = () => {
//     const newZoom = Math.max(pdfZoom - 0.1, 0.5);
//     setPdfZoom(newZoom);
//   };

//   const handleMouseDown = (e) => {
//     setIsResizing(true);
//     e.preventDefault();
//   };

//   const handleMouseMove = useCallback((e) => {
//     if (!isResizing || !containerRef.current) return;

//     const container = containerRef.current;
//     const containerWidth = container.offsetWidth;
//     const mouseX = e.clientX - container.getBoundingClientRect().left;
//     const newWidth = ((containerWidth - mouseX) / containerWidth) * 100;

//     if (newWidth >= 25 && newWidth <= 60) {
//       setPdfWidth(newWidth);
//     }
//   }, [isResizing]);

//   const handleMouseUp = () => {
//     setIsResizing(false);
//   };

//   useEffect(() => {
//     if (!isResizing) return;

//     const onMouseMove = (e) => handleMouseMove(e);
//     const onMouseUp = () => handleMouseUp();

//     document.addEventListener('mousemove', onMouseMove);
//     document.addEventListener('mouseup', onMouseUp);

//     return () => {
//       document.removeEventListener('mousemove', onMouseMove);
//       document.removeEventListener('mouseup', onMouseUp);
//     };
//   }, [isResizing, handleMouseMove]);

//   const hasContent = () => {
//     if (!editor) return false;
//     const text = editor.getText();
//     return text.trim().length > 0;
//   };

//   // ============================================================================
//   // 🛠️ TOOLBAR COMPONENT WITH FIX #4
//   // ============================================================================
//   // ✅ FIX #4: Make toolbar FIXED at top of editor, only content scrolls

//   const EditorToolbar = () => {
//     if (!editor) return null;

//     const ToolButton = ({ onClick, isActive, icon: Icon, title, disabled }) => (
//       <button
//         onClick={onClick}
//         disabled={disabled}
//         className={`p-2 rounded-lg transition-all ${
//           isActive 
//             ? 'bg-blue-100 text-blue-600 shadow-sm' 
//             : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
//         } disabled:opacity-30`}
//         title={title}
//       >
//         <Icon className="w-4 h-4" />
//       </button>
//     );

//     const colors = ['#000000', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];
//     const highlights = ['#FEF3C7', '#FED7AA', '#DBEAFE', '#D1FAE5', '#E9D5FF', '#FBCFE8'];

//     return (
//       <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-white to-blue-50/50 dark:from-slate-800 dark:to-slate-800 border-b border-blue-200 dark:border-slate-700">
//         <div className="flex items-center gap-1 flex-wrap">
//           <ToolButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} icon={Bold} title="Bold" />
//           <ToolButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} icon={Italic} title="Italic" />
//           <ToolButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} icon={UnderlineIcon} title="Underline" />
          
//           <div className="w-px h-5 bg-blue-300 mx-2"></div>
          
//           <div className="relative">
//             <button
//               onClick={() => setShowColorPicker(!showColorPicker)}
//               className={`p-2 rounded-lg transition-all ${
//                 editor.isActive('highlight') ? 'bg-yellow-100 text-yellow-600' : 'text-slate-500 hover:bg-slate-100'
//               }`}
//               title="Highlight Text"
//             >
//               <Highlighter className="w-4 h-4" />
//             </button>
            
//             {showColorPicker && (
//               <div className="absolute top-full left-0 mt-2 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-xl border-2 border-blue-200 dark:border-slate-700 z-50">
//                 <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Highlights</p>
//                 <div className="flex gap-2 mb-3">
//                   {highlights.map((color) => (
//                     <button
//                       key={color}
//                       onClick={() => {
//                         editor.chain().focus().toggleHighlight({ color }).run();
//                         setShowColorPicker(false);
//                       }}
//                       className="w-6 h-6 rounded border-2 border-slate-300 hover:scale-110 transition-transform"
//                       style={{ backgroundColor: color }}
//                       title={color}
//                     />
//                   ))}
//                   <button
//                     onClick={() => {
//                       editor.chain().focus().unsetHighlight().run();
//                       setShowColorPicker(false);
//                     }}
//                     className="w-6 h-6 rounded border-2 border-slate-300 hover:scale-110 transition-transform bg-white flex items-center justify-center"
//                     title="Remove Highlight"
//                   >
//                     <X className="w-3 h-3 text-red-500" />
//                   </button>
//                 </div>
                
//                 <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Text Color</p>
//                 <div className="flex gap-2">
//                   {colors.map((color) => (
//                     <button
//                       key={color}
//                       onClick={() => {
//                         editor.chain().focus().setColor(color).run();
//                         setShowColorPicker(false);
//                       }}
//                       className="w-6 h-6 rounded border-2 border-slate-300 hover:scale-110 transition-transform"
//                       style={{ backgroundColor: color }}
//                       title={color}
//                     />
//                   ))}
//                   <button
//                     onClick={() => {
//                       editor.chain().focus().unsetColor().run();
//                       setShowColorPicker(false);
//                     }}
//                     className="w-6 h-6 rounded border-2 border-slate-300 hover:scale-110 transition-transform bg-white flex items-center justify-center"
//                     title="Remove Color"
//                   >
//                     <X className="w-3 h-3 text-red-500" />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
          
//           <div className="w-px h-5 bg-blue-300 mx-2"></div>
          
//           <ToolButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} icon={List} title="Bullet List" />
//           <ToolButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} icon={ListOrdered} title="Numbered List" />
          
//           <div className="w-px h-5 bg-cyan-300 mx-2"></div>
          
//           <ToolButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} icon={AlignLeft} title="Align Left" />
//           <ToolButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} icon={AlignCenter} title="Align Center" />
//           <ToolButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} icon={AlignRight} title="Align Right" />
          
//           <div className="w-px h-5 bg-sky-300 mx-2"></div>
          
//           <ToolButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} icon={Undo} title="Undo" />
//           <ToolButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} icon={Redo} title="Redo" />
//         </div>

//         {lastSaved && (
//           <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-sm font-medium">
//             <CheckCircle2 className="w-4 h-4" />
//             <span>Saved {lastSaved.toLocaleTimeString()}</span>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // ============================================================================
//   // 🎨 MAIN RENDER
//   // ============================================================================

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-sky-50/30 to-cyan-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      
//       {/* HEADER */}
//       <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-blue-200 dark:border-slate-800 px-6 py-4 shadow-sm">
//         <div className="max-w-full mx-auto flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate('/notes-organizer')}
//               className="p-2 hover:bg-blue-100 dark:hover:bg-slate-800 rounded-lg transition-all"
//             >
//               <ArrowLeft className="w-5 h-5 text-blue-600" />
//             </button>
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
//                 <FileText className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
//                   {isEditMode ? 'Edit Note' : 'Create New Note'}
//                 </h1>
//               </div>
//             </div>
//           </div>
          
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => navigate('/notes-organizer/library')}
//               className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-lg shadow-lg shadow-blue-400/30 transition-all transform hover:scale-105"
//             >
//               <BookOpen className="w-4 h-4" />
//               Library
//             </button>
            
//             <button
//               onClick={() => saveNote(false)}
//               disabled={isSaving}
//               className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/30 disabled:opacity-50 transition-all transform hover:scale-105"
//             >
//               {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
//               {isSaving ? 'Saving...' : 'Save Note'}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* TOP SECTION */}
//       <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b-2 border-blue-200 dark:border-slate-700 px-6 py-5 shadow-sm">
//         <div className="max-w-full mx-auto space-y-4">
          
//           <div className="grid grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-bold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-2">
//                 <span className="text-lg">📚</span> Subject
//               </label>
//               <input
//                 type="text"
//                 placeholder="e.g., Data Structures, Algorithms..."
//                 value={subject}
//                 onChange={(e) => setSubject(e.target.value)}
//                 className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-blue-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium shadow-sm"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-bold text-sky-700 dark:text-sky-400 mb-2 flex items-center gap-2">
//                 <span className="text-lg">📄</span> Reference PDF
//               </label>
//               <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf" className="hidden" />
              
//               {!documentUrl ? (
//                 <button
//                   onClick={() => fileInputRef.current?.click()}
//                   disabled={isUploading}
//                   className="w-1/2 px-5 py-3 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-md"
//                 >
//                   {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
//                   {isUploading ? 'Uploading...' : 'Upload PDF'}
//                 </button>
//               ) : (
//                 <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-sky-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-lg border border-sky-200 w-fit">
//                   <FileText className="w-6 h-6 text-sky-600 flex-shrink-0" />
//                   <span className="text-sm text-sky-700 dark:text-sky-300 font-medium truncate max-w-[200px]">{documentName}</span>
//                   <button
//                     onClick={() => setShowPdfPanel(!showPdfPanel)}
//                     className="p-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-all"
//                   >
//                     {showPdfPanel ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                   </button>
//                   <button 
//                     onClick={handleDeletePDF}
//                     disabled={isUploading}
//                     className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg disabled:opacity-50 transition-all"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-bold text-cyan-700 dark:text-cyan-400 mb-2 flex items-center gap-2">
//                 <span className="text-lg">🏷️</span> Add Tags
//               </label>
//               <div className="flex gap-2">
//                 <input
//                   ref={tagInputRef}
//                   type="text"
//                   placeholder="Enter tag..."
//                   value={tagInput}
//                   onChange={(e) => setTagInput(e.target.value)}
//                   onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
//                   className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border-2 border-cyan-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm"
//                 />
//                 <button
//                   onClick={handleAddTag}
//                   className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all shadow-md"
//                 >
//                   Add
//                 </button>
//               </div>
//             </div>

//             <div>
//               <label className=" block text-sm font-bold text-purple-700 dark:text-purple-400 mb-2 flex items-center gap-2">
//                 <span className="text-lg">✨</span> AI Generate Tags
//               </label>
//               <button
//                 onClick={handleGenerateTags}
//                 disabled={isGeneratingTags || !hasContent()}
//                 className="w-1/2 px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md"
//               >
//                 {isGeneratingTags ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
//                 {isGeneratingTags ? 'Generating...' : 'Generate AI Tags'}
//               </button>
//             </div>
//           </div>

//           {tags.length > 0 && (
//             <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-lg border border-cyan-200">
//               <div className="flex flex-wrap gap-2">
//                 {tags.map((tag, idx) => (
//                   <span
//                     key={idx}
//                     className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 rounded-lg text-sm font-medium shadow-sm"
//                   >
//                     #{tag}
//                     <button onClick={() => handleRemoveTag(tag)} className="hover:bg-cyan-200 rounded-full p-1">
//                       <X className="w-3 h-3" />
//                     </button>
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ✅ FIX #4 - EDITOR + PDF SECTION WITH FIXED TOOLBAR */}
//       {/* The container uses flexbox to keep toolbar fixed while content scrolls */}
//       <div ref={containerRef} className="flex h-screen relative">
        
//         {/* EDITOR CONTAINER - Toolbar stays fixed, content scrolls */}
//         <div 
//           className={`${documentUrl && showPdfPanel ? '' : 'flex-1'} bg-white dark:bg-slate-900 overflow-hidden shadow-lg flex flex-col`} 
//           style={{ width: documentUrl && showPdfPanel ? `${100 - pdfWidth}%` : '100%' }}
//         >
//           {/* ✅ FIX #4a: Toolbar is FIXED (not in scroll container) */}
//           <EditorToolbar />
          
//           {/* ✅ FIX #4b: ONLY editor content scrolls, toolbar stays at top */}
//           <div className="overflow-y-auto flex-1">
//             <EditorContent editor={editor} />
//           </div>
//         </div>

//         {documentUrl && showPdfPanel && (
//           <>
//             <div
//               onMouseDown={handleMouseDown}
//               className="w-1.5 bg-gradient-to-b from-blue-300 to-cyan-300 hover:from-blue-500 hover:to-cyan-500 cursor-col-resize flex items-center justify-center group relative z-10"
//             >
//               <GripVertical className="w-5 h-5 text-white drop-shadow-lg" />
//             </div>

//             <div className="bg-slate-100 dark:bg-slate-800 flex flex-col shadow-lg" style={{ width: `${pdfWidth}%` }}>
//               <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md">
//                 <div className="flex items-center gap-2">
//                   <FileText className="w-5 h-5" />
//                   <span className="font-semibold text-sm truncate max-w-[180px]">{documentName}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <button onClick={handleZoomOut} className="p-2 hover:bg-white/20 rounded-lg">
//                     <ZoomOut className="w-4 h-4" />
//                   </button>
//                   <span className="text-sm px-3 bg-white/20 rounded-lg py-1 font-bold">
//                     {Math.round(pdfZoom * 100)}%
//                   </span>
//                   <button onClick={handleZoomIn} className="p-2 hover:bg-white/20 rounded-lg">
//                     <ZoomIn className="w-4 h-4" />
//                   </button>
//                   <div className="w-px h-6 bg-white/40"></div>
//                   <button onClick={() => setShowFullscreenPdf(true)} className="p-2 hover:bg-white/20 rounded-lg">
//                     <Maximize2 className="w-4 h-4" />
//                   </button>
//                   <a href={documentUrl} download={documentName} className="p-2 hover:bg-white/20 rounded-lg">
//                     <Download className="w-4 h-4" />
//                   </a>
//                 </div>
//               </div>
              
//               <div className="flex-1 overflow-hidden bg-slate-200">
//                 <iframe 
//                   src={`${documentUrl}#zoom=${Math.round(pdfZoom * 100)}`}
//                   className="w-full h-full" 
//                   style={{ border: 'none', transform: `scale(${pdfZoom})`, transformOrigin: 'top left' }}
//                 />
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       {showFullscreenPdf && (
//         <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
//           <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
//             <div className="flex items-center gap-3">
//               <FileText className="w-6 h-6" />
//               <span className="font-bold text-lg">{documentName}</span>
//             </div>
//             <div className="flex items-center gap-4">
//               <button onClick={handleZoomOut} className="p-2 hover:bg-white/20 rounded-lg">
//                 <ZoomOut className="w-5 h-5" />
//               </button>
//               <span className="text-sm px-4 bg-white/20 rounded-lg py-2 font-bold">
//                 {Math.round(pdfZoom * 100)}%
//               </span>
//               <button onClick={handleZoomIn} className="p-2 hover:bg-white/20 rounded-lg">
//                 <ZoomIn className="w-5 h-5" />
//               </button>
//               <div className="w-px h-7 bg-white/40"></div>
//               <a href={documentUrl} download={documentName} className="p-2 hover:bg-white/20 rounded-lg">
//                 <Download className="w-5 h-5" />
//               </a>
//               <button onClick={() => setShowFullscreenPdf(false)} className="p-2 hover:bg-white/20 rounded-lg">
//                 <X className="w-6 h-6" />
//               </button>
//             </div>
//           </div>
//           <div className="flex-1 overflow-auto bg-slate-200 p-4">
//             <iframe 
//               src={`${documentUrl}#zoom=${Math.round(pdfZoom * 100)}`}
//               className="w-full h-full rounded-lg shadow-2xl" 
//               style={{ border: 'none', minHeight: '100%', transform: `scale(${pdfZoom})`, transformOrigin: 'top left' }}
//             />
//           </div>
//         </div>
//       )}

//       {showAIPrompt && (
//         <button
//           onClick={handleAskAI}
//           disabled={aiLoading}
//           className="fixed bottom-10 left-1/2 transform-translate-x-1/2 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-full shadow-2xl shadow-blue-500/50 transition-all transform hover:scale-105 z-40"
//         >
//           {aiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Brain className="w-5 h-5" />}
//           {aiLoading ? 'Thinking...' : 'Ask AI'}
//         </button>
//       )}

//       <style>{`
//         .ProseMirror { min-height: 800px; }
//         .ProseMirror p.is-editor-empty:first-child::before {
//           content: attr(data-placeholder);
//           float: left;
//           color: #94a3b8;
//           pointer-events: none;
//           height: 0;
//         }
//         .ProseMirror:focus { outline: none; }
//         .ProseMirror ul { list-style-type: disc; padding-left: 1.5em; }
//         .ProseMirror ol { list-style-type: decimal; padding-left: 1.5em; }
//         .ProseMirror li { margin: 0.25em 0; }
//       `}</style>
//     </div>
//   );
// };

// export default CreateNote;









// ============================================================================
// src/features/notes/CreateNote.jsx - COMPLETE CORRECTED CODE
// ============================================================================
// ALL 4 FIXES APPLIED + FIX #2 MODIFICATION (No Auto-Save)
// ============================================================================

// import { useState, useEffect, useCallback, useRef } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useEditor, EditorContent } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Placeholder from '@tiptap/extension-placeholder';
// import TextAlign from '@tiptap/extension-text-align';
// import Underline from '@tiptap/extension-underline';
// import Link from '@tiptap/extension-link';
// import Highlight from '@tiptap/extension-highlight';
// import { TextStyle } from '@tiptap/extension-text-style';  
// import { Color } from '@tiptap/extension-color';        
// import { 
//   Save, Upload, Sparkles, ArrowLeft, BookOpen,
//   Bold, Italic, List, ListOrdered, Undo, Redo,
//   AlignLeft, AlignCenter, AlignRight, Underline as UnderlineIcon,
//   FileText, Loader2, X, Brain, CheckCircle2,
//   ZoomIn, ZoomOut, Download, Maximize2, GripVertical, Eye, EyeOff, Highlighter,
//   Trash2
// } from 'lucide-react';
// import { toast } from 'react-toastify';
// import { notesService } from '../../services/notesService';
// import MarkdownRenderer from '../../components/common/MarkdownRenderer';

// const CreateNote = () => {
//   const navigate = useNavigate();
//   const { noteId } = useParams();
//   const isEditMode = Boolean(noteId);

//   // ============================================================================
//   // 📦 STATE - All component states
//   // ============================================================================
  
//   const [subject, setSubject] = useState('');
//   const [tags, setTags] = useState([]);
//   const [tagInput, setTagInput] = useState('');
//   const [documentUrl, setDocumentUrl] = useState(null);
//   const [documentName, setDocumentName] = useState('');
//   const [isUploading, setIsUploading] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [isGeneratingTags, setIsGeneratingTags] = useState(false);
//   const [lastSaved, setLastSaved] = useState(null);
//   const [selectedText, setSelectedText] = useState('');
//   const [selectedTextPosition, setSelectedTextPosition] = useState(null);
//   const [showAIPrompt, setShowAIPrompt] = useState(false);
//   const [aiLoading, setAiLoading] = useState(false);
//   const [showPdfPanel, setShowPdfPanel] = useState(true);
//   const [pdfZoom, setPdfZoom] = useState(1.0);
//   const [pdfWidth, setPdfWidth] = useState(40);
//   const [isResizing, setIsResizing] = useState(false);
//   const [showFullscreenPdf, setShowFullscreenPdf] = useState(false);
//   const [showColorPicker, setShowColorPicker] = useState(false);
//   const [noteLoaded, setNoteLoaded] = useState(false);

//   // ============================================================================
//   // 🔗 REFS - DOM element references
//   // ============================================================================
  
//   const fileInputRef = useRef(null);
//   const autoSaveTimerRef = useRef(null);
//   const containerRef = useRef(null);
//   const tagInputRef = useRef(null);
//   const hasLoadedRef = useRef(false);

//   // ============================================================================
//   // 📝 EDITOR SETUP - Tiptap configuration
//   // ============================================================================
  
//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Placeholder.configure({
//         placeholder: 'Start writing your notes here...',
//       }),
//       TextAlign.configure({
//         types: ['heading', 'paragraph'],
//       }),
//       Underline,
//       Link.configure({
//         openOnClick: false,
//       }),
//       Highlight.configure({
//         multicolor: true,
//       }),
//       TextStyle,
//       Color,
//     ],
//     content: '',
//     editorProps: {
//       attributes: {
//         class: 'prose prose-base max-w-none focus:outline-none min-h-[800px] p-8 text-slate-700 dark:text-slate-200 bg-gradient-to-br from-blue-50/80 to-sky-50/50',
//       },
//     },
//     onUpdate: ({ editor }) => {
//       scheduleAutoSave();
//     },
//     onSelectionUpdate: ({ editor }) => {
//       const { from, to } = editor.state.selection;
//       const text = editor.state.doc.textBetween(from, to, ' ');
//       setSelectedText(text);
//       setSelectedTextPosition({ from, to });
//       setShowAIPrompt(text.length > 0);
//     },
//   });

//   // ============================================================================
//   // 🔄 LOAD NOTE EFFECT - Load note when component mounts (ONLY ONCE!)
//   // ============================================================================
  
//   useEffect(() => {
//     if (isEditMode && noteId && !hasLoadedRef.current) {
//       hasLoadedRef.current = true;
//       loadNote();
//     }
//   }, [noteId, isEditMode]);

//   // ============================================================================
//   // 📡 API FUNCTIONS
//   // ============================================================================

//   const loadNote = async () => {
//     try {
//       const response = await notesService.getNoteById(noteId);
//       const note = response.data.note || response.data;
      
//       setSubject(note.subject || '');
//       setTags(note.tags || []);
//       setDocumentUrl(note.documentUrl || null);
//       setDocumentName(note.documentName || '');
      
//       if (editor && note.content) {
//         editor.commands.setContent(note.content);
//       }
      
//       toast.success('Note loaded!');
//       setNoteLoaded(true);
//     } catch (error) {
//       console.error('Error loading note:', error);
//       toast.error('Failed to load note');
//     }
//   };

//   const saveNote = async (isAutoSave = false) => {
//     if (!subject.trim()) {
//       if (!isAutoSave) toast.error('Please enter a subject');
//       return null;
//     }

//     setIsSaving(true);

//     try {
//       const noteData = {
//         subject,
//         content: editor?.getHTML() || '',
//         tags,
//         documentUrl,
//         documentName,
//       };

//       let response;
//       if (isEditMode && noteId) {
//         response = await notesService.updateNote(noteId, noteData);
//         if (!isAutoSave) toast.success('Note updated!', { autoClose: 2000 });
//       } else {
//         response = await notesService.createNote(noteData);
//         const newNoteId = response.data.noteId || response.data._id || response.data.data?.noteId;
        
//         if (newNoteId) {
//           toast.success('Note created!');
//           navigate(`/notes-organizer/edit/${newNoteId}`, { replace: true });
//         }
//       }

//       setLastSaved(new Date());
//       return response;
//     } catch (error) {
//       console.error('Save error:', error);
//       if (!isAutoSave) toast.error('Failed to save');
//       return null;
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const scheduleAutoSave = useCallback(() => {
//     if (autoSaveTimerRef.current) {
//       clearTimeout(autoSaveTimerRef.current);
//     }
//     autoSaveTimerRef.current = setTimeout(() => {
//       if (noteId) {
//         saveNote(true);
//       }
//     }, 30000);
//   }, [noteId]);

//   // ============================================================================
//   // ✅ FIX #1 - PDF UPLOAD VALIDATION
//   // ============================================================================
//   // Check subject FIRST before any upload logic
//   // If no subject, show error and return early (don't upload)
  
//   const handleFileUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     // ✅ FIX #1: Check subject FIRST - if no subject, reject immediately
//     if (!subject.trim()) {
//       toast.error('Please enter a subject first');
//       if (fileInputRef.current) {
//         fileInputRef.current.value = '';
//       }
//       return; // EXIT EARLY - don't proceed with upload
//     }

//     if (file.type !== 'application/pdf') {
//       toast.error('Please upload a PDF file');
//       return;
//     }

//     if (file.size > 10 * 1024 * 1024) {
//       toast.error('File must be less than 10MB');
//       return;
//     }

//     setIsUploading(true);
//     toast.info('Uploading PDF...');

//     try {
//       let uploadNoteId = noteId;

//       if (!uploadNoteId) {
//         // Create note with subject + optional content first
//         toast.info('Saving note first...');
        
//         const noteData = {
//           subject,
//           content: editor?.getHTML() || '',
//           tags,
//           documentUrl: null,
//           documentName: '',
//         };

//         const response = await notesService.createNote(noteData);
//         uploadNoteId = response.data.noteId || response.data._id || response.data.data?.noteId;
        
//         if (!uploadNoteId) {
//           throw new Error('Failed to get note ID');
//         }

//         window.history.replaceState(null, '', `/notes-organizer/edit/${uploadNoteId}`);
//         await new Promise(resolve => setTimeout(resolve, 500));
//       }

//       const uploadResponse = await notesService.uploadDocument(uploadNoteId, file);
//       const pdfUrl = uploadResponse.data.documentUrl || uploadResponse.data.url;
      
//       if (!pdfUrl) {
//         throw new Error('No document URL returned');
//       }

//       setDocumentUrl(pdfUrl);
//       setDocumentName(file.name);
//       setShowPdfPanel(true);
      
//       toast.success('PDF uploaded successfully!');
//     } catch (error) {
//       console.error('Upload error:', error);
//       toast.error(error.message || 'Failed to upload PDF');
//     } finally {
//       setIsUploading(false);
//       if (fileInputRef.current) {
//         fileInputRef.current.value = '';
//       }
//     }
//   };

//   const handleDeletePDF = async () => {
//     if (!noteId) {
//       toast.error('Please save note first');
//       return;
//     }

//     setIsUploading(true);
//     try {
//       await notesService.deleteDocument(noteId);
      
//       setDocumentUrl(null);
//       setDocumentName('');
//       setShowPdfPanel(false);
      
//       toast.success('PDF deleted successfully!');
//     } catch (error) {
//       console.error('Delete PDF error:', error);
//       toast.error(error.message || 'Failed to delete PDF');
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleAddTag = () => {
//     if (!tagInput.trim()) return;
//     const newTag = tagInput.trim().replace(/^#/, '');
//     if (!tags.includes(newTag)) {
//       setTags([...tags, newTag]);
//     }
//     setTagInput('');
//   };

//   const handleRemoveTag = (tagToRemove) => {
//     setTags(tags.filter(tag => tag !== tagToRemove));
//   };

//   // ============================================================================
//   // ✅ FIX #2 - AI GENERATE TAGS BUTTON (MODIFIED - NO AUTO-SAVE)
//   // ============================================================================
//   // MODIFICATION: User saves note manually, not auto-save
//   // - Only generate tags if Subject + Content exist
//   // - PDF is optional
//   // - Require user to save note FIRST before generating tags
  
//   const handleGenerateTags = async () => {
//     const currentContent = editor?.getHTML() || '';
//     const plainTextContent = editor?.getText() || '';

//     if (!subject.trim()) {
//       toast.error('Please enter a subject first');
//       return;
//     }

//     if (!plainTextContent.trim() || plainTextContent.length < 10) {
//       toast.error('Please write some content first (at least 10 characters)');
//       return;
//     }

//     // ✅ FIX #2 MODIFICATION: Instead of auto-save, require user to save first
//     if (!noteId) {
//       toast.warning('Please save the note first before generating tags');
//       return;
//     }

//     setIsGeneratingTags(true);
    
//     try {
//       // Generate tags using the existing noteId
//       const response = await notesService.generateTags(
//         noteId,
//         subject.trim(),
//         currentContent
//       );
      
//       const generatedTags = response.data || [];
      
//       if (generatedTags.length === 0) {
//         toast.warning('No tags generated. Try adding more content.');
//         return;
//       }

//       setTags(generatedTags);
//       toast.success(`${generatedTags.length} tags generated successfully!`);
      
//     } catch (error) {
//       console.error('Generate tags error:', error);
//       toast.error(error.message || 'Failed to generate tags');
//     } finally {
//       setIsGeneratingTags(false);
//     }
//   };

//   // ============================================================================
//   // ✅ FIX #3 - AI ANSWER FORMAT
//   // ============================================================================
//   // Keep original selected line INTACT
//   // Add AI answer BELOW with proper formatting
//   // Don't repeat the question in the answer
  
//   const handleAskAI = async () => {
//     if (!selectedText.trim()) {
//       toast.error('Please select some text first');
//       return;
//     }

//     if (!noteId) {
//       toast.error('Please save the note first');
//       return;
//     }

//     setAiLoading(true);
//     try {
//       const response = await notesService.askAI(noteId, selectedText);
//       const answer = response.data.answer || response.data;
      
//       if (selectedTextPosition && editor) {
//         const { to } = selectedTextPosition;
        
//         // ✅ FIX #3: Move cursor to END of selected text (don't replace it)
//         editor.commands.setTextSelection(to);
        
//         // ✅ FIX #3: Add AI answer BELOW with proper formatting
//         const formattedAnswer = `
//         <div class="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-l-4 border-blue-500 p-4 rounded-lg my-4 shadow-sm">
//           <p class="font-bold text-blue-700 dark:text-blue-300 mb-2">🤖 AI Answer</p>
//           <div class="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
//             ${answer}
//           </div>
//         </div>
//         `;

//         // ✅ FIX #3: Insert formatted answer on new lines BELOW selected text
//         editor.commands.insertContent(`\n\n${formattedAnswer}\n\n`);
//       }
      
//       toast.success('AI answer inserted!');
//       setShowAIPrompt(false);
//     } catch (error) {
//       console.error('AI error:', error);
//       toast.error('Failed to get AI answer');
//     } finally {
//       setAiLoading(false);
//     }
//   };

//   // ============================================================================
//   // 🎯 EVENT HANDLERS - PDF controls
//   // ============================================================================

//   const handleZoomIn = () => {
//     const newZoom = Math.min(pdfZoom + 0.1, 2.0);
//     setPdfZoom(newZoom);
//   };

//   const handleZoomOut = () => {
//     const newZoom = Math.max(pdfZoom - 0.1, 0.5);
//     setPdfZoom(newZoom);
//   };

//   const handleMouseDown = (e) => {
//     setIsResizing(true);
//     e.preventDefault();
//   };

//   const handleMouseMove = useCallback((e) => {
//     if (!isResizing || !containerRef.current) return;

//     const container = containerRef.current;
//     const containerWidth = container.offsetWidth;
//     const mouseX = e.clientX - container.getBoundingClientRect().left;
//     const newWidth = ((containerWidth - mouseX) / containerWidth) * 100;

//     if (newWidth >= 25 && newWidth <= 60) {
//       setPdfWidth(newWidth);
//     }
//   }, [isResizing]);

//   const handleMouseUp = () => {
//     setIsResizing(false);
//   };

//   useEffect(() => {
//     if (!isResizing) return;

//     const onMouseMove = (e) => handleMouseMove(e);
//     const onMouseUp = () => handleMouseUp();

//     document.addEventListener('mousemove', onMouseMove);
//     document.addEventListener('mouseup', onMouseUp);

//     return () => {
//       document.removeEventListener('mousemove', onMouseMove);
//       document.removeEventListener('mouseup', onMouseUp);
//     };
//   }, [isResizing, handleMouseMove]);

//   const hasContent = () => {
//     if (!editor) return false;
//     const text = editor.getText();
//     return text.trim().length > 0;
//   };

//   // ============================================================================
//   // 🛠️ TOOLBAR COMPONENT WITH FIX #4
//   // ============================================================================
//   // ✅ FIX #4: Make toolbar FIXED at top of editor, only content scrolls

//   const EditorToolbar = () => {
//     if (!editor) return null;

//     const ToolButton = ({ onClick, isActive, icon: Icon, title, disabled }) => (
//       <button
//         onClick={onClick}
//         disabled={disabled}
//         className={`p-2 rounded-lg transition-all ${
//           isActive 
//             ? 'bg-blue-100 text-blue-600 shadow-sm' 
//             : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
//         } disabled:opacity-30`}
//         title={title}
//       >
//         <Icon className="w-4 h-4" />
//       </button>
//     );

//     const colors = ['#000000', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];
//     const highlights = ['#FEF3C7', '#FED7AA', '#DBEAFE', '#D1FAE5', '#E9D5FF', '#FBCFE8'];

//     return (
//       <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-white to-blue-50/50 dark:from-slate-800 dark:to-slate-800 border-b border-blue-200 dark:border-slate-700">
//         <div className="flex items-center gap-1 flex-wrap">
//           <ToolButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} icon={Bold} title="Bold" />
//           <ToolButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} icon={Italic} title="Italic" />
//           <ToolButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} icon={UnderlineIcon} title="Underline" />
          
//           <div className="w-px h-5 bg-blue-300 mx-2"></div>
          
//           <div className="relative">
//             <button
//               onClick={() => setShowColorPicker(!showColorPicker)}
//               className={`p-2 rounded-lg transition-all ${
//                 editor.isActive('highlight') ? 'bg-yellow-100 text-yellow-600' : 'text-slate-500 hover:bg-slate-100'
//               }`}
//               title="Highlight Text"
//             >
//               <Highlighter className="w-4 h-4" />
//             </button>
            
//             {showColorPicker && (
//               <div className="absolute top-full left-0 mt-2 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-xl border-2 border-blue-200 dark:border-slate-700 z-50">
//                 <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Highlights</p>
//                 <div className="flex gap-2 mb-3">
//                   {highlights.map((color) => (
//                     <button
//                       key={color}
//                       onClick={() => {
//                         editor.chain().focus().toggleHighlight({ color }).run();
//                         setShowColorPicker(false);
//                       }}
//                       className="w-6 h-6 rounded border-2 border-slate-300 hover:scale-110 transition-transform"
//                       style={{ backgroundColor: color }}
//                       title={color}
//                     />
//                   ))}
//                   <button
//                     onClick={() => {
//                       editor.chain().focus().unsetHighlight().run();
//                       setShowColorPicker(false);
//                     }}
//                     className="w-6 h-6 rounded border-2 border-slate-300 hover:scale-110 transition-transform bg-white flex items-center justify-center"
//                     title="Remove Highlight"
//                   >
//                     <X className="w-3 h-3 text-red-500" />
//                   </button>
//                 </div>
                
//                 <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Text Color</p>
//                 <div className="flex gap-2">
//                   {colors.map((color) => (
//                     <button
//                       key={color}
//                       onClick={() => {
//                         editor.chain().focus().setColor(color).run();
//                         setShowColorPicker(false);
//                       }}
//                       className="w-6 h-6 rounded border-2 border-slate-300 hover:scale-110 transition-transform"
//                       style={{ backgroundColor: color }}
//                       title={color}
//                     />
//                   ))}
//                   <button
//                     onClick={() => {
//                       editor.chain().focus().unsetColor().run();
//                       setShowColorPicker(false);
//                     }}
//                     className="w-6 h-6 rounded border-2 border-slate-300 hover:scale-110 transition-transform bg-white flex items-center justify-center"
//                     title="Remove Color"
//                   >
//                     <X className="w-3 h-3 text-red-500" />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
          
//           <div className="w-px h-5 bg-blue-300 mx-2"></div>
          
//           <ToolButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} icon={List} title="Bullet List" />
//           <ToolButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} icon={ListOrdered} title="Numbered List" />
          
//           <div className="w-px h-5 bg-cyan-300 mx-2"></div>
          
//           <ToolButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} icon={AlignLeft} title="Align Left" />
//           <ToolButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} icon={AlignCenter} title="Align Center" />
//           <ToolButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} icon={AlignRight} title="Align Right" />
          
//           <div className="w-px h-5 bg-sky-300 mx-2"></div>
          
//           <ToolButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} icon={Undo} title="Undo" />
//           <ToolButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} icon={Redo} title="Redo" />
//         </div>

//         {lastSaved && (
//           <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-sm font-medium">
//             <CheckCircle2 className="w-4 h-4" />
//             <span>Saved {lastSaved.toLocaleTimeString()}</span>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // ============================================================================
//   // 🎨 MAIN RENDER
//   // ============================================================================

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-sky-50/30 to-cyan-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      
//       {/* HEADER */}
//       <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-blue-200 dark:border-slate-800 px-6 py-4 shadow-sm">
//         <div className="max-w-full mx-auto flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate('/notes-organizer')}
//               className="p-2 hover:bg-blue-100 dark:hover:bg-slate-800 rounded-lg transition-all"
//             >
//               <ArrowLeft className="w-5 h-5 text-blue-600" />
//             </button>
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
//                 <FileText className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
//                   {isEditMode ? 'Edit Note' : 'Create New Note'}
//                 </h1>
//               </div>
//             </div>
//           </div>
          
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => navigate('/notes-organizer/library')}
//               className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-lg shadow-lg shadow-blue-400/30 transition-all transform hover:scale-105"
//             >
//               <BookOpen className="w-4 h-4" />
//               Library
//             </button>
            
//             <button
//               onClick={() => saveNote(false)}
//               disabled={isSaving}
//               className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/30 disabled:opacity-50 transition-all transform hover:scale-105"
//             >
//               {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
//               {isSaving ? 'Saving...' : 'Save Note'}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* TOP SECTION */}
//       <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b-2 border-blue-200 dark:border-slate-700 px-6 py-5 shadow-sm">
//         <div className="max-w-full mx-auto space-y-4">
          
//           <div className="grid grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-bold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-2">
//                 <span className="text-lg">📚</span> Subject
//               </label>
//               <input
//                 type="text"
//                 placeholder="e.g., Data Structures, Algorithms..."
//                 value={subject}
//                 onChange={(e) => setSubject(e.target.value)}
//                 className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-blue-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium shadow-sm"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-bold text-sky-700 dark:text-sky-400 mb-2 flex items-center gap-2">
//                 <span className="text-lg">📄</span> Reference PDF
//               </label>
//               <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf" className="hidden" />
              
//               {!documentUrl ? (
//                 <button
//                   onClick={() => fileInputRef.current?.click()}
//                   disabled={isUploading}
//                   className="w-1/2 px-5 py-3 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-md"
//                 >
//                   {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
//                   {isUploading ? 'Uploading...' : 'Upload PDF'}
//                 </button>
//               ) : (
//                 <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-sky-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-lg border border-sky-200 w-fit">
//                   <FileText className="w-6 h-6 text-sky-600 flex-shrink-0" />
//                   <span className="text-sm text-sky-700 dark:text-sky-300 font-medium truncate max-w-[200px]">{documentName}</span>
//                   <button
//                     onClick={() => setShowPdfPanel(!showPdfPanel)}
//                     className="p-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-all"
//                   >
//                     {showPdfPanel ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                   </button>
//                   <button 
//                     onClick={handleDeletePDF}
//                     disabled={isUploading}
//                     className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg disabled:opacity-50 transition-all"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-bold text-cyan-700 dark:text-cyan-400 mb-2 flex items-center gap-2">
//                 <span className="text-lg">🏷️</span> Add Tags
//               </label>
//               <div className="flex gap-2">
//                 <input
//                   ref={tagInputRef}
//                   type="text"
//                   placeholder="Enter tag..."
//                   value={tagInput}
//                   onChange={(e) => setTagInput(e.target.value)}
//                   onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
//                   className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border-2 border-cyan-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm"
//                 />
//                 <button
//                   onClick={handleAddTag}
//                   className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all shadow-md"
//                 >
//                   Add
//                 </button>
//               </div>
//             </div>

//             <div>
//               <label className=" block text-sm font-bold text-purple-700 dark:text-purple-400 mb-2 flex items-center gap-2">
//                 <span className="text-lg">✨</span> AI Generate Tags
//               </label>
//               <button
//                 onClick={handleGenerateTags}
//                 disabled={isGeneratingTags || !hasContent()}
//                 className="w-1/2 px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md"
//               >
//                 {isGeneratingTags ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
//                 {isGeneratingTags ? 'Generating...' : 'Generate AI Tags'}
//               </button>
//             </div>
//           </div>

//           {tags.length > 0 && (
//             <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-lg border border-cyan-200">
//               <div className="flex flex-wrap gap-2">
//                 {tags.map((tag, idx) => (
//                   <span
//                     key={idx}
//                     className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 rounded-lg text-sm font-medium shadow-sm"
//                   >
//                     #{tag}
//                     <button onClick={() => handleRemoveTag(tag)} className="hover:bg-cyan-200 rounded-full p-1">
//                       <X className="w-3 h-3" />
//                     </button>
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ✅ FIX #4 - EDITOR + PDF SECTION WITH FIXED TOOLBAR */}
//       <div ref={containerRef} className="flex h-screen relative">
        
//         {/* EDITOR CONTAINER - Toolbar stays fixed, content scrolls */}
//         <div 
//           className={`${documentUrl && showPdfPanel ? '' : 'flex-1'} bg-white dark:bg-slate-900 overflow-hidden shadow-lg flex flex-col`} 
//           style={{ width: documentUrl && showPdfPanel ? `${100 - pdfWidth}%` : '100%' }}
//         >
//           {/* ✅ FIX #4: Toolbar is FIXED (not in scroll container) */}
//           <EditorToolbar />
          
//           {/* ✅ FIX #4: ONLY editor content scrolls, toolbar stays at top */}
//           <div className="overflow-y-auto flex-1">
//             <EditorContent editor={editor} />
//           </div>
//         </div>

//         {documentUrl && showPdfPanel && (
//           <>
//             <div
//               onMouseDown={handleMouseDown}
//               className="w-1.5 bg-gradient-to-b from-blue-300 to-cyan-300 hover:from-blue-500 hover:to-cyan-500 cursor-col-resize flex items-center justify-center group relative z-10"
//             >
//               <GripVertical className="w-5 h-5 text-white drop-shadow-lg" />
//             </div>

//             <div className="bg-slate-100 dark:bg-slate-800 flex flex-col shadow-lg" style={{ width: `${pdfWidth}%` }}>
//               <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md">
//                 <div className="flex items-center gap-2">
//                   <FileText className="w-5 h-5" />
//                   <span className="font-semibold text-sm truncate max-w-[180px]">{documentName}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <button onClick={handleZoomOut} className="p-2 hover:bg-white/20 rounded-lg">
//                     <ZoomOut className="w-4 h-4" />
//                   </button>
//                   <span className="text-sm px-3 bg-white/20 rounded-lg py-1 font-bold">
//                     {Math.round(pdfZoom * 100)}%
//                   </span>
//                   <button onClick={handleZoomIn} className="p-2 hover:bg-white/20 rounded-lg">
//                     <ZoomIn className="w-4 h-4" />
//                   </button>
//                   <div className="w-px h-6 bg-white/40"></div>
//                   <button onClick={() => setShowFullscreenPdf(true)} className="p-2 hover:bg-white/20 rounded-lg">
//                     <Maximize2 className="w-4 h-4" />
//                   </button>
//                   <a href={documentUrl} download={documentName} className="p-2 hover:bg-white/20 rounded-lg">
//                     <Download className="w-4 h-4" />
//                   </a>
//                 </div>
//               </div>
              
//               <div className="flex-1 overflow-hidden bg-slate-200">
//                 <iframe 
//                   src={`${documentUrl}#zoom=${Math.round(pdfZoom * 100)}`}
//                   className="w-full h-full" 
//                   style={{ border: 'none', transform: `scale(${pdfZoom})`, transformOrigin: 'top left' }}
//                 />
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       {showFullscreenPdf && (
//         <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
//           <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
//             <div className="flex items-center gap-3">
//               <FileText className="w-6 h-6" />
//               <span className="font-bold text-lg">{documentName}</span>
//             </div>
//             <div className="flex items-center gap-4">
//               <button onClick={handleZoomOut} className="p-2 hover:bg-white/20 rounded-lg">
//                 <ZoomOut className="w-5 h-5" />
//               </button>
//               <span className="text-sm px-4 bg-white/20 rounded-lg py-2 font-bold">
//                 {Math.round(pdfZoom * 100)}%
//               </span>
//               <button onClick={handleZoomIn} className="p-2 hover:bg-white/20 rounded-lg">
//                 <ZoomIn className="w-5 h-5" />
//               </button>
//               <div className="w-px h-7 bg-white/40"></div>
//               <a href={documentUrl} download={documentName} className="p-2 hover:bg-white/20 rounded-lg">
//                 <Download className="w-5 h-5" />
//               </a>
//               <button onClick={() => setShowFullscreenPdf(false)} className="p-2 hover:bg-white/20 rounded-lg">
//                 <X className="w-6 h-6" />
//               </button>
//             </div>
//           </div>
//           <div className="flex-1 overflow-auto bg-slate-200 p-4">
//             <iframe 
//               src={`${documentUrl}#zoom=${Math.round(pdfZoom * 100)}`}
//               className="w-full h-full rounded-lg shadow-2xl" 
//               style={{ border: 'none', minHeight: '100%', transform: `scale(${pdfZoom})`, transformOrigin: 'top left' }}
//             />
//           </div>
//         </div>
//       )}

//       {showAIPrompt && (
//         <button
//           onClick={handleAskAI}
//           disabled={aiLoading}
//           className="fixed bottom-10 left-1/2 transform -translate-x-1/2 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-full shadow-2xl shadow-blue-500/50 transition-all transform hover:scale-105 z-40"
//         >
//           {aiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Brain className="w-5 h-5" />}
//           {aiLoading ? 'Thinking...' : 'Ask AI'}
//         </button>
//       )}

//       <style>{`
//         .ProseMirror { min-height: 800px; }
//         .ProseMirror p.is-editor-empty:first-child::before {
//           content: attr(data-placeholder);
//           float: left;
//           color: #94a3b8;
//           pointer-events: none;
//           height: 0;
//         }
//         .ProseMirror:focus { outline: none; }
//         .ProseMirror ul { list-style-type: disc; padding-left: 1.5em; }
//         .ProseMirror ol { list-style-type: decimal; padding-left: 1.5em; }
//         .ProseMirror li { margin: 0.25em 0; }
//       `}</style>
//     </div>
//   );
// };

// export default CreateNote;





























//src/features/notes/CreateNote.jsx - COMPLETE FIXED CODE

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';  
import { Color } from '@tiptap/extension-color';        
import { 
  Save, Upload, Sparkles, ArrowLeft, BookOpen,
  Bold, Italic, List, ListOrdered, Undo, Redo,
  AlignLeft, AlignCenter, AlignRight, Underline as UnderlineIcon,
  FileText, Loader2, X, Brain, CheckCircle2,
  ZoomIn, ZoomOut, Download, Maximize2, GripVertical, Eye, EyeOff, Highlighter,
  Trash2
} from 'lucide-react';
import { toast } from 'react-toastify';
import { notesService } from '../../services/notesService';

const CreateNote = () => {
  const navigate = useNavigate();
  const { noteId } = useParams();
  const isEditMode = Boolean(noteId);

  // ============================================================================
  // 📦 STATE
  // ============================================================================
  
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
  const [selectedTextPosition, setSelectedTextPosition] = useState(null);
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [showPdfPanel, setShowPdfPanel] = useState(true);
  const [pdfZoom, setPdfZoom] = useState(1.0);
  const [pdfWidth, setPdfWidth] = useState(40);
  const [isResizing, setIsResizing] = useState(false);
  const [showFullscreenPdf, setShowFullscreenPdf] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [noteLoaded, setNoteLoaded] = useState(false);
  
  // ✅ FIX #2 & #3: Track current noteId in state (syncs with URL)
  const [currentNoteId, setCurrentNoteId] = useState(noteId);

  // ============================================================================
  // 🔗 REFS
  // ============================================================================
  
  const fileInputRef = useRef(null);
  const autoSaveTimerRef = useRef(null);
  const containerRef = useRef(null);
  const tagInputRef = useRef(null);
  const hasLoadedRef = useRef(false);

  // ============================================================================
  // 📝 EDITOR SETUP
  // ============================================================================
  
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
      Highlight.configure({
        multicolor: true,
      }),
      TextStyle,
      Color,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-base max-w-none focus:outline-none min-h-[800px] p-8 text-slate-700 dark:text-slate-200 bg-gradient-to-br from-blue-50/80 to-sky-50/50',
      },
    },
    onUpdate: ({ editor }) => {
      scheduleAutoSave();
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      const text = editor.state.doc.textBetween(from, to, ' ');
      setSelectedText(text);
      setSelectedTextPosition({ from, to });
      setShowAIPrompt(text.length > 0);
    },
  });

  // ============================================================================
  // 🔄 LOAD NOTE EFFECT
  // ============================================================================
  
  useEffect(() => {
    if (isEditMode && noteId && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      setCurrentNoteId(noteId);
      loadNote();
    }
  }, [noteId, isEditMode]);

  // ============================================================================
  // 📡 API FUNCTIONS
  // ============================================================================

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
      setNoteLoaded(true);
    } catch (error) {
      console.error('Error loading note:', error);
      toast.error('Failed to load note');
    }
  };

  // ✅ FIX #2: Modified saveNote to use currentNoteId state
  const saveNote = async (isAutoSave = false) => {
    if (!subject.trim()) {
      if (!isAutoSave) toast.error('Please enter a subject');
      return null;
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
      
      // ✅ FIX #2: Use currentNoteId instead of noteId from params
      if (currentNoteId) {
        // UPDATE existing note
        response = await notesService.updateNote(currentNoteId, noteData);
        if (!isAutoSave) toast.success('Note updated!', { autoClose: 2000 });
      } else {
        // CREATE new note
        response = await notesService.createNote(noteData);
        const newNoteId = response.data.noteId || response.data._id || response.data.data?.noteId;
        
        if (newNoteId) {
          // ✅ FIX #2: Update both state AND URL
          setCurrentNoteId(newNoteId);
          navigate(`/notes-organizer/edit/${newNoteId}`, { replace: true });
          toast.success('Note created!');
        }
      }

      setLastSaved(new Date());
      return response;
    } catch (error) {
      console.error('Save error:', error);
      if (!isAutoSave) toast.error('Failed to save');
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ FIX #2: Auto-save now uses currentNoteId
  const scheduleAutoSave = useCallback(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    autoSaveTimerRef.current = setTimeout(() => {
      if (currentNoteId) {
        saveNote(true);
      }
    }, 30000);
  }, [currentNoteId]);

  // ✅ FIX #2: PDF upload now updates currentNoteId
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!subject.trim()) {
      toast.error('Please enter a subject first');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File must be less than 10MB');
      return;
    }

    setIsUploading(true);
    toast.info('Uploading PDF...');

    try {
      let uploadNoteId = currentNoteId; // ✅ FIX #2: Use currentNoteId

      if (!uploadNoteId) {
        toast.info('Saving note first...');
        
        const noteData = {
          subject,
          content: editor?.getHTML() || '',
          tags,
          documentUrl: null,
          documentName: '',
        };

        const response = await notesService.createNote(noteData);
        uploadNoteId = response.data.noteId || response.data._id || response.data.data?.noteId;
        
        if (!uploadNoteId) {
          throw new Error('Failed to get note ID');
        }

        // ✅ FIX #2: Update state AND URL
        setCurrentNoteId(uploadNoteId);
        navigate(`/notes-organizer/edit/${uploadNoteId}`, { replace: true });
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      const uploadResponse = await notesService.uploadDocument(uploadNoteId, file);
      const pdfUrl = uploadResponse.data.documentUrl || uploadResponse.data.url;
      
      if (!pdfUrl) {
        throw new Error('No document URL returned');
      }

      setDocumentUrl(pdfUrl);
      setDocumentName(file.name);
      setShowPdfPanel(true);
      
      toast.success('PDF uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload PDF');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeletePDF = async () => {
    if (!currentNoteId) {
      toast.error('Please save note first');
      return;
    }

    setIsUploading(true);
    try {
      await notesService.deleteDocument(currentNoteId);
      
      setDocumentUrl(null);
      setDocumentName('');
      setShowPdfPanel(false);
      
      toast.success('PDF deleted successfully!');
    } catch (error) {
      console.error('Delete PDF error:', error);
      toast.error(error.message || 'Failed to delete PDF');
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

  // ✅ FIX #3: AI Tags now uses currentNoteId (works after PDF upload)
  const handleGenerateTags = async () => {
    const currentContent = editor?.getHTML() || '';
    const plainTextContent = editor?.getText() || '';

    if (!subject.trim()) {
      toast.error('Please enter a subject first');
      return;
    }

    if (!plainTextContent.trim() || plainTextContent.length < 10) {
      toast.error('Please write some content first (at least 10 characters)');
      return;
    }

    // ✅ FIX #3: Use currentNoteId (which exists after PDF upload)
    if (!currentNoteId) {
      toast.warning('Please save the note first before generating tags');
      return;
    }

    setIsGeneratingTags(true);
    
    try {
      const response = await notesService.generateTags(
        currentNoteId, // ✅ FIX #3: Uses current note ID
        subject.trim(),
        currentContent
      );
      
      const generatedTags = response.data || [];
      
      if (generatedTags.length === 0) {
        toast.warning('No tags generated. Try adding more content.');
        return;
      }

      setTags(generatedTags);
      toast.success(`${generatedTags.length} tags generated successfully!`);
      
    } catch (error) {
      console.error('Generate tags error:', error);
      toast.error(error.message || 'Failed to generate tags');
    } finally {
      setIsGeneratingTags(false);
    }
  };

  // ✅ FIX #1: Clean AI Answer display (ChatGPT-like)

const handleAskAI = async () => {
  if (!selectedText.trim()) {
    toast.error('Please select some text first');
    return;
  }

  if (!currentNoteId) {
    toast.error('Please save the note first');
    return;
  }

  setAiLoading(true);
  try {
    const response = await notesService.askAI(currentNoteId, selectedText);
    let answer = response.data.answer || response.data;
    
    // Convert line breaks to HTML
    answer = answer.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
    
    if (selectedTextPosition && editor) {
      const { to } = selectedTextPosition;
      
      // Move cursor to END of selected text
      editor.commands.setTextSelection(to);
      
      // Insert answer in simple format
      const formattedAnswer = `<br><br>🤖 <strong>AI Answer:</strong> ${answer}<br><br>`;
      editor.commands.insertContent(formattedAnswer);
    }
    
    toast.success('AI answer inserted!');
    setShowAIPrompt(false);
  } catch (error) {
    console.error('AI error:', error);
    toast.error('Failed to get AI answer');
  } finally {
    setAiLoading(false);
  }
};

  // ============================================================================
  // 🎯 EVENT HANDLERS - PDF controls
  // ============================================================================

  const handleZoomIn = () => {
    const newZoom = Math.min(pdfZoom + 0.1, 2.0);
    setPdfZoom(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(pdfZoom - 0.1, 0.5);
    setPdfZoom(newZoom);
  };

  const handleMouseDown = (e) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleMouseMove = useCallback((e) => {
    if (!isResizing || !containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.offsetWidth;
    const mouseX = e.clientX - container.getBoundingClientRect().left;
    const newWidth = ((containerWidth - mouseX) / containerWidth) * 100;

    if (newWidth >= 25 && newWidth <= 60) {
      setPdfWidth(newWidth);
    }
  }, [isResizing]);

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (!isResizing) return;

    const onMouseMove = (e) => handleMouseMove(e);
    const onMouseUp = () => handleMouseUp();

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isResizing, handleMouseMove]);

  const hasContent = () => {
    if (!editor) return false;
    const text = editor.getText();
    return text.trim().length > 0;
  };

  // ============================================================================
  // 🛠️ TOOLBAR COMPONENT
  // ============================================================================

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

    const colors = ['#000000', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];
    const highlights = ['#FEF3C7', '#FED7AA', '#DBEAFE', '#D1FAE5', '#E9D5FF', '#FBCFE8'];

    return (
      <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-white to-blue-50/50 dark:from-slate-800 dark:to-slate-800 border-b border-blue-200 dark:border-slate-700">
        <div className="flex items-center gap-1 flex-wrap">
          <ToolButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} icon={Bold} title="Bold" />
          <ToolButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} icon={Italic} title="Italic" />
          <ToolButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} icon={UnderlineIcon} title="Underline" />
          
          <div className="w-px h-5 bg-blue-300 mx-2"></div>
          
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className={`p-2 rounded-lg transition-all ${
                editor.isActive('highlight') ? 'bg-yellow-100 text-yellow-600' : 'text-slate-500 hover:bg-slate-100'
              }`}
              title="Highlight Text"
            >
              <Highlighter className="w-4 h-4" />
            </button>
            
            {showColorPicker && (
              <div className="absolute top-full left-0 mt-2 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-xl border-2 border-blue-200 dark:border-slate-700 z-50">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Highlights</p>
                <div className="flex gap-2 mb-3">
                  {highlights.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        editor.chain().focus().toggleHighlight({ color }).run();
                        setShowColorPicker(false);
                      }}
                      className="w-6 h-6 rounded border-2 border-slate-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                  <button
                    onClick={() => {
                      editor.chain().focus().unsetHighlight().run();
                      setShowColorPicker(false);
                    }}
                    className="w-6 h-6 rounded border-2 border-slate-300 hover:scale-110 transition-transform bg-white flex items-center justify-center"
                    title="Remove Highlight"
                  >
                    <X className="w-3 h-3 text-red-500" />
                  </button>
                </div>
                
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Text Color</p>
                <div className="flex gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        editor.chain().focus().setColor(color).run();
                        setShowColorPicker(false);
                      }}
                      className="w-6 h-6 rounded border-2 border-slate-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                  <button
                    onClick={() => {
                      editor.chain().focus().unsetColor().run();
                      setShowColorPicker(false);
                    }}
                    className="w-6 h-6 rounded border-2 border-slate-300 hover:scale-110 transition-transform bg-white flex items-center justify-center"
                    title="Remove Color"
                  >
                    <X className="w-3 h-3 text-red-500" />
                  </button>
                </div>
              </div>
            )}
          </div>
          
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

  // ============================================================================
  // 🎨 MAIN RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-sky-50/30 to-cyan-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      
      {/* HEADER */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-blue-200 dark:border-slate-800 px-6 py-4 shadow-sm">
        <div className="max-w-full mx-auto flex items-center justify-between">
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
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/notes-organizer/library')}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-lg shadow-lg shadow-blue-400/30 transition-all transform hover:scale-105"
            >
              <BookOpen className="w-4 h-4" />
              Library
            </button>
            
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
      </div>

      {/* TOP SECTION */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b-2 border-blue-200 dark:border-slate-700 px-6 py-5 shadow-sm">
        <div className="max-w-full mx-auto space-y-4">
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-2">
                <span className="text-lg">📚</span> Subject
              </label>
              <input
                type="text"
                placeholder="e.g., Data Structures, Algorithms..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-blue-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-sky-700 dark:text-sky-400 mb-2 flex items-center gap-2">
                <span className="text-lg">📄</span> Reference PDF
              </label>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf" className="hidden" />
              
              {!documentUrl ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-1/2 px-5 py-3 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-md"
                >
                  {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                  {isUploading ? 'Uploading...' : 'Upload PDF'}
                </button>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-sky-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-lg border border-sky-200 w-fit">
                  <FileText className="w-6 h-6 text-sky-600 flex-shrink-0" />
                  <span className="text-sm text-sky-700 dark:text-sky-300 font-medium truncate max-w-[200px]">{documentName}</span>
                  <button
                    onClick={() => setShowPdfPanel(!showPdfPanel)}
                    className="p-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-all"
                  >
                    {showPdfPanel ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={handleDeletePDF}
                    disabled={isUploading}
                    className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg disabled:opacity-50 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-cyan-700 dark:text-cyan-400 mb-2 flex items-center gap-2">
                <span className="text-lg">🏷️</span> Add Tags
              </label>
              <div className="flex gap-2">
                <input
                  ref={tagInputRef}
                  type="text"
                  placeholder="Enter tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border-2 border-cyan-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm"
                />
                <button
                  onClick={handleAddTag}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all shadow-md"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <label className=" block text-sm font-bold text-purple-700 dark:text-purple-400 mb-2 flex items-center gap-2">
                <span className="text-lg">✨</span> AI Generate Tags
              </label>
              <button
                onClick={handleGenerateTags}
                disabled={isGeneratingTags || !hasContent()}
                className="w-1/2 px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md"
              >
                {isGeneratingTags ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                {isGeneratingTags ? 'Generating...' : 'Generate AI Tags'}
              </button>
            </div>
          </div>

          {tags.length > 0 && (
            <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-lg border border-cyan-200">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 rounded-lg text-sm font-medium shadow-sm"
                  >
                    #{tag}
                    <button onClick={() => handleRemoveTag(tag)} className="hover:bg-cyan-200 rounded-full p-1">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* EDITOR + PDF SECTION */}
      <div ref={containerRef} className="flex h-screen relative">
        
        {/* EDITOR CONTAINER */}
        <div 
          className={`${documentUrl && showPdfPanel ? '' : 'flex-1'} bg-white dark:bg-slate-900 overflow-hidden shadow-lg flex flex-col`} 
          style={{ width: documentUrl && showPdfPanel ? `${100 - pdfWidth}%` : '100%' }}
        >
          <EditorToolbar />
          
          <div className="overflow-y-auto flex-1">
            <EditorContent editor={editor} />
          </div>
        </div>

        {documentUrl && showPdfPanel && (
          <>
            <div
              onMouseDown={handleMouseDown}
              className="w-1.5 bg-gradient-to-b from-blue-300 to-cyan-300 hover:from-blue-500 hover:to-cyan-500 cursor-col-resize flex items-center justify-center group relative z-10"
            >
              <GripVertical className="w-5 h-5 text-white drop-shadow-lg" />
            </div>

            <div className="bg-slate-100 dark:bg-slate-800 flex flex-col shadow-lg" style={{ width: `${pdfWidth}%` }}>
              <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  <span className="font-semibold text-sm truncate max-w-[180px]">{documentName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleZoomOut} className="p-2 hover:bg-white/20 rounded-lg">
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-sm px-3 bg-white/20 rounded-lg py-1 font-bold">
                    {Math.round(pdfZoom * 100)}%
                  </span>
                  <button onClick={handleZoomIn} className="p-2 hover:bg-white/20 rounded-lg">
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <div className="w-px h-6 bg-white/40"></div>
                  <button onClick={() => setShowFullscreenPdf(true)} className="p-2 hover:bg-white/20 rounded-lg">
                    <Maximize2 className="w-4 h-4" />
                  </button>
                  <a href={documentUrl} download={documentName} className="p-2 hover:bg-white/20 rounded-lg">
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>
              
              <div className="flex-1 overflow-hidden bg-slate-200">
                <iframe 
                  src={`${documentUrl}#zoom=${Math.round(pdfZoom * 100)}`}
                  className="w-full h-full" 
                  style={{ border: 'none', transform: `scale(${pdfZoom})`, transformOrigin: 'top left' }}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {showFullscreenPdf && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6" />
              <span className="font-bold text-lg">{documentName}</span>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={handleZoomOut} className="p-2 hover:bg-white/20 rounded-lg">
                <ZoomOut className="w-5 h-5" />
              </button>
              <span className="text-sm px-4 bg-white/20 rounded-lg py-2 font-bold">
                {Math.round(pdfZoom * 100)}%
              </span>
              <button onClick={handleZoomIn} className="p-2 hover:bg-white/20 rounded-lg">
                <ZoomIn className="w-5 h-5" />
              </button>
              <div className="w-px h-7 bg-white/40"></div>
              <a href={documentUrl} download={documentName} className="p-2 hover:bg-white/20 rounded-lg">
                <Download className="w-5 h-5" />
              </a>
              <button onClick={() => setShowFullscreenPdf(false)} className="p-2 hover:bg-white/20 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto bg-slate-200 p-4">
            <iframe 
              src={`${documentUrl}#zoom=${Math.round(pdfZoom * 100)}`}
              className="w-full h-full rounded-lg shadow-2xl" 
              style={{ border: 'none', minHeight: '100%', transform: `scale(${pdfZoom})`, transformOrigin: 'top left' }}
            />
          </div>
        </div>
      )}

      {showAIPrompt && (
        <button
          onClick={handleAskAI}
          disabled={aiLoading}
          className="fixed bottom-10 left-1/2 transform -translate-x-1/2 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-full shadow-2xl shadow-blue-500/50 transition-all transform hover:scale-105 z-40"
        >
          {aiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Brain className="w-5 h-5" />}
          {aiLoading ? 'Thinking...' : 'Ask AI'}
        </button>
      )}

      <style>{`
        .ProseMirror { min-height: 800px; }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #94a3b8;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror:focus { outline: none; }
        .ProseMirror ul { list-style-type: disc; padding-left: 1.5em; }
        .ProseMirror ol { list-style-type: decimal; padding-left: 1.5em; }
        .ProseMirror li { margin: 0.25em 0; }
      `}</style>
    </div>
  );
};

export default CreateNote;
