import { useState, useEffect } from "react";
import { communityService } from "../../../services/communityService";
import { X, PenLine } from "lucide-react";

const CreatePostModal = ({ open, setOpen, role, refreshPosts }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const submitPost = async () => {
    if (!title.trim() || !content.trim()) return;

    try {
      setSubmitting(true);
      await communityService.createPost({
        title,
        content,
      });

      setTitle("");
      setContent("");
      setOpen(false);
      refreshPosts();
    } catch (err) {
      console.error("Failed to create post:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => { setOpen(false); setTitle(""); setContent(""); }}
      ></div>

      {/* Modal Dialog */}
      <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 w-full max-w-lg rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-lg text-white shadow-sm"
              style={{ background: "linear-gradient(255deg, #0099FF 0%, #00D4FF 0%, #60A5FA 70%, #2563EB 150%)" }}
            >
              <PenLine size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              {role === "Admin" ? "Create Announcement" : "Create Post"}
            </h2>
          </div>
          <button 
            onClick={() => { setOpen(false); setTitle(""); setContent(""); }}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all shadow-inner"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your post about?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content
            </label>
            <textarea
              className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all shadow-inner resize-none"
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts, ask a question, or start a discussion..."
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 bg-gray-50/50 dark:bg-gray-900/50 rounded-b-2xl">
          <button
            onClick={() => { setOpen(false); setTitle(""); setContent(""); }}
            className="px-5 py-2.5 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={submitPost}
            disabled={submitting || !title.trim() || !content.trim()}
            className="px-6 py-2.5 rounded-xl text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg active:scale-95"
            style={{ background: "linear-gradient(255deg, #0099FF 0%, #00D4FF 0%, #60A5FA 70%, #2563EB 150%)" }}
          >
            {submitting ? "Posting..." : "Publish Post"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreatePostModal;