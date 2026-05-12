import { useState, useEffect, useRef } from "react";
import { communityService } from "../../../services/communityService";
import { X, PenLine, ImagePlus, Trash2 } from "lucide-react";

const CreatePostModal = ({ open, setOpen, role, refreshPosts }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

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

  // Clean up preview URL on unmount/change
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.match(/^image\/(jpeg|jpg|png|gif|webp)$/)) {
      alert("Only image files (jpg, png, gif, webp) are allowed");
      return;
    }
    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be under 5MB");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    removeImage();
  };

  const submitPost = async () => {
    if (!title.trim() || !content.trim()) return;

    try {
      setSubmitting(true);

      if (imageFile) {
        // Use FormData for multipart upload
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("image", imageFile);
        await communityService.createPost(formData);
      } else {
        // Plain JSON
        await communityService.createPost({ title, content });
      }

      resetForm();
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
        onClick={() => { setOpen(false); resetForm(); }}
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
            onClick={() => { setOpen(false); resetForm(); }}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
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

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Image <span className="text-gray-400 font-normal">(optional)</span>
            </label>

            {imagePreview ? (
              <div className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-h-64 object-contain bg-gray-50 dark:bg-gray-800/50"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/90 text-white hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                  title="Remove image"
                >
                  <Trash2 size={16} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 px-3 py-1.5 bg-black/40 backdrop-blur-sm text-white text-xs truncate">
                  {imageFile?.name}
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center justify-center gap-2 py-8 px-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:border-blue-500 dark:hover:bg-blue-500/5 transition-all cursor-pointer group"
              >
                <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 transition-colors">
                  <ImagePlus size={24} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Click to upload an image
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, GIF, WebP · Max 5MB</p>
                </div>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={handleImageSelect}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 bg-gray-50/50 dark:bg-gray-900/50 rounded-b-2xl">
          <button
            onClick={() => { setOpen(false); resetForm(); }}
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