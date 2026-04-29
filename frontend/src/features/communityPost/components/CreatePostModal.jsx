import { useState } from "react";
import { communityService } from "../../../services/communityService";

const CreatePostModal = ({ open, setOpen, role, refreshPosts }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">

        <h2 className="text-lg font-bold mb-4 dark:text-white">
          {role === "Admin"
            ? "Create Announcement"
            : "Create Post"}
        </h2>

        {/* ✅ Title field — backend requires title */}
        <input
          type="text"
          className="w-full border p-2 rounded mb-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title..."
        />

        <textarea
          className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write something..."
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => { setOpen(false); setTitle(""); setContent(""); }}
            className="px-4 py-2 dark:text-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={submitPost}
            disabled={submitting || !title.trim() || !content.trim()}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {submitting ? "Posting..." : "Post"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreatePostModal;