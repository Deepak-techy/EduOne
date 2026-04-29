import { useState, useEffect } from "react";
import { communityService } from "../../../services/communityService";

const CommentSection = ({ postId }) => {
  const [text, setText] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadComments = async () => {
    try {
      const res = await communityService.getComments(postId);
      // ✅ Backend returns: { data: { comments, count, page, ... } }
      setComments(res.data?.data?.comments || []);
    } catch (err) {
      console.error("Failed to load comments:", err);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  const submitComment = async () => {
    if (!text.trim()) return;

    try {
      setSubmitting(true);
      await communityService.addComment(postId, text);
      setText("");
      loadComments(); // Refresh comments after adding
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4 border-t pt-3 dark:border-gray-600">

      {/* Comment input */}
      <div className="flex gap-2">
        <textarea
          className="flex-1 border p-2 rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          rows={2}
        />

        <button
          onClick={submitComment}
          disabled={submitting || !text.trim()}
          className="bg-gray-800 text-white px-3 py-1 rounded self-end disabled:opacity-50 text-sm"
        >
          {submitting ? "..." : "Comment"}
        </button>
      </div>

      {/* Comments list */}
      {loading ? (
        <p className="text-sm text-gray-400 mt-3">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-gray-400 mt-3">No comments yet.</p>
      ) : (
        <div className="mt-3 space-y-2">
          {comments.map((comment) => (
            <div key={comment._id} className="text-sm border-b pb-2 dark:border-gray-600">
              <span className="font-semibold dark:text-gray-200">
                {comment.userId?.fullName || "User"}
              </span>
              <p className="text-gray-600 dark:text-gray-400">{comment.text}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default CommentSection;