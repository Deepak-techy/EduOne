import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { communityService } from "../../../services/communityService";
import ReportModal from "./ReportModal";
import { Send, Loader2, Trash2, Flag, CheckCircle2, Lightbulb, ChevronDown } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

// Portal-based dropdown for mark menu to avoid z-index / stacking context issues
const MarkMenuPortal = ({ anchorRef, onMarkCorrect, onMarkHelpful, onClose }) => {
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);

  useEffect(() => {
    if (anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + 4,
        left: rect.right - 160, // align right edge with button
      });
    }
  }, [anchorRef]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target) &&
        anchorRef?.current && !anchorRef.current.contains(e.target)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, anchorRef]);

  return createPortal(
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        zIndex: 100000,
      }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-1.5 min-w-[160px] animate-in fade-in slide-in-from-top-1 duration-200"
    >
      <button
        onClick={onMarkCorrect}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors font-medium"
      >
        <CheckCircle2 size={14} />
        Correct Answer
      </button>
      <button
        onClick={onMarkHelpful}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors font-medium"
      >
        <Lightbulb size={14} />
        Helpful Answer
      </button>
    </div>,
    document.body
  );
};

const CommentSection = ({ postId, postAuthorId }) => {
  const [text, setText] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reportCommentId, setReportCommentId] = useState(null);
  const [markMenuId, setMarkMenuId] = useState(null);
  const markBtnRefs = useRef({});
  const { user } = useAuth();

  const isTeacherOrAdmin = user?.role === "Teacher" || user?.role === "Admin";

  const loadComments = async () => {
    try {
      const res = await communityService.getComments(postId);
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
      loadComments();
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDeleteComment = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    try {
      await communityService.deleteComment(deleteConfirmId);
      loadComments();
      setDeleteConfirmId(null);
    } catch (err) {
      console.error("Failed to delete comment:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReportComment = async (data) => {
    await communityService.reportComment(reportCommentId, data);
  };

  const handleMark = async (commentId, markAs) => {
    try {
      await communityService.markComment(commentId, markAs);
      setMarkMenuId(null);
      loadComments();
    } catch (err) {
      console.error("Failed to mark comment:", err);
    }
  };

  const handleUnmark = async (commentId) => {
    try {
      await communityService.unmarkComment(commentId);
      loadComments();
    } catch (err) {
      console.error("Failed to unmark comment:", err);
    }
  };

  const closeMarkMenu = useCallback(() => setMarkMenuId(null), []);

  // Get mark badge styling
  const getMarkBadge = (markedAs) => {
    if (markedAs === "correct") {
      return {
        bg: "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700/50",
        text: "text-emerald-700 dark:text-emerald-300",
        icon: CheckCircle2,
        label: "✓ Correct Answer",
        glow: "ring-2 ring-emerald-200/50 dark:ring-emerald-600/30",
      };
    }
    if (markedAs === "helpful") {
      return {
        bg: "bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700/50",
        text: "text-amber-700 dark:text-amber-300",
        icon: Lightbulb,
        label: "★ Helpful Answer",
        glow: "ring-2 ring-amber-200/50 dark:ring-amber-600/30",
      };
    }
    return null;
  };

  // Helper to get or create a ref for a comment's mark button
  const getMarkBtnRef = (commentId) => {
    if (!markBtnRefs.current[commentId]) {
      markBtnRefs.current[commentId] = { current: null };
    }
    return markBtnRefs.current[commentId];
  };

  return (
    <>
    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">

      {/* Comment input */}
      <div className="flex items-start gap-3">
        <textarea
          className="flex-1 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 p-3 rounded-xl text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all resize-none shadow-inner"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          rows={1}
          style={{ minHeight: "44px" }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              submitComment();
            }
          }}
        />

        <button
          onClick={submitComment}
          disabled={submitting || !text.trim()}
          className="flex items-center justify-center p-3 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg active:scale-95"
          style={{ background: "linear-gradient(255deg, #0099FF 0%, #00D4FF 0%, #60A5FA 70%, #2563EB 150%)" }}
          aria-label="Send comment"
        >
          {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </div>

      {/* Comments list */}
      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="animate-spin text-blue-500" size={24} />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-sm text-gray-500 text-center italic">Be the first to comment.</p>
        ) : (
          comments.map((comment) => {
            const isCommentOwner = user?._id === comment.userId?._id;
            const isPostOwner = user?._id === postAuthorId;
            const isAdmin = user?.role === "Admin";
            const isTeacher = user?.role === "Teacher";
            const canDeleteComment = isCommentOwner || isPostOwner || isAdmin || isTeacher;
            const markBadge = getMarkBadge(comment.markedAs);
            const btnRef = getMarkBtnRef(comment._id);

            return (
              <div key={comment._id} className={`flex gap-3 group ${markBadge ? 'relative' : ''}`}>
                <div 
                  className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-sm"
                  style={{ background: "linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)" }}
                >
                  {(comment.userId?.fullName || "U")[0].toUpperCase()}
                </div>
                <div className={`flex-1 rounded-2xl rounded-tl-none p-3 shadow-sm border relative ${
                  markBadge 
                    ? `${markBadge.bg} ${markBadge.glow}` 
                    : 'bg-gray-50 dark:bg-gray-800/80 border-gray-100 dark:border-gray-700/50'
                }`}>
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                        {comment.userId?.fullName || "User"}
                      </span>
                      {/* Commenter role badge */}
                      {comment.userId?.role && comment.userId.role !== "Student" && (
                        <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider ${
                          comment.userId.role === "Teacher" 
                            ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400" 
                            : "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400"
                        }`}>
                          {comment.userId.role === "Teacher" ? "Educator" : "Admin"}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {/* Mark as Correct/Helpful — Teacher/Admin only */}
                      {isTeacherOrAdmin && !isCommentOwner && (
                        <div className="relative">
                          {comment.markedAs ? (
                            <button
                              onClick={() => handleUnmark(comment._id)}
                              className="text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-[10px] font-medium"
                              title="Remove mark"
                            >
                              ✕
                            </button>
                          ) : (
                            <>
                              <button
                                ref={(el) => { btnRef.current = el; }}
                                onClick={() => setMarkMenuId(markMenuId === comment._id ? null : comment._id)}
                                className="text-gray-400 hover:text-emerald-500 transition-colors opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-emerald-50 dark:hover:bg-emerald-500/10 flex items-center gap-0.5"
                                title="Mark answer"
                              >
                                <CheckCircle2 size={14} />
                                <ChevronDown size={10} />
                              </button>
                              {/* Mark dropdown menu — rendered via portal */}
                              {markMenuId === comment._id && (
                                <MarkMenuPortal
                                  anchorRef={btnRef}
                                  onMarkCorrect={() => handleMark(comment._id, "correct")}
                                  onMarkHelpful={() => handleMark(comment._id, "helpful")}
                                  onClose={closeMarkMenu}
                                />
                              )}
                            </>
                          )}
                        </div>
                      )}

                      {canDeleteComment && (
                        <button 
                          onClick={() => setDeleteConfirmId(comment._id)}
                          className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                          title="Delete comment"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                      {!isCommentOwner && (
                        <button
                          onClick={() => setReportCommentId(comment._id)}
                          className="text-gray-400 hover:text-orange-500 transition-colors opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-orange-50 dark:hover:bg-orange-500/10"
                          title="Report comment"
                        >
                          <Flag size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Mark badge — shown when comment is marked */}
                  {markBadge && (
                    <div className={`inline-flex items-center gap-1.5 mt-1 mb-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${markBadge.text}`}>
                      <markBadge.icon size={13} />
                      {markBadge.label}
                      {comment.markedBy && (
                        <span className="font-normal opacity-70 ml-1">— by {comment.markedBy.fullName}</span>
                      )}
                    </div>
                  )}

                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{comment.text}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && createPortal(
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          backdropFilter: 'blur(6px)',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{
            background: '#FADADD',
            padding: '40px 36px',
            borderRadius: '24px',
            boxShadow: '0 8px 48px rgba(6,182,212,0.3)',
            minWidth: '380px',
            maxWidth: '500px',
            textAlign: 'center',
            border: '5px solid #F47174',
            animation: 'slideUp 0.3s ease-out'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 20px',
              background: 'linear-gradient(135deg, #fecaca, #fca5a5)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(239,68,68,0.25)'
            }}>
              <Trash2 size={36} style={{ color: '#dc2626' }} />
            </div>

            <h2 style={{
              color: '#0891b2',
              fontWeight: 800,
              fontSize: '1.5rem',
              marginBottom: '12px',
              margin: 0
            }}>
              Confirm Deletion
            </h2>

            <p style={{
              color: '#475569',
              marginBottom: '24px',
              marginTop: '16px',
              fontWeight: 500,
              fontSize: '1rem',
              lineHeight: 1.6
            }}>
              Are you sure you want to delete this comment?
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button
                onClick={confirmDeleteComment}
                disabled={isDeleting}
                style={{
                  flex: 1,
                  padding: '14px 24px',
                  background: isDeleting ? '#94a3b8' : 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.3s',
                  boxShadow: isDeleting ? 'none' : '0 4px 16px rgba(239,68,68,0.3)',
                  opacity: isDeleting ? 0.7 : 1
                }}
              >
                {isDeleting ? 'Deleting...' : (
                  <>
                    <Trash2 size={18} />
                    Delete
                  </>
                )}
              </button>

              <button
                onClick={() => setDeleteConfirmId(null)}
                disabled={isDeleting}
                style={{
                  flex: 1,
                  padding: '14px 24px',
                  background: 'white',
                  color: '#475569',
                  border: '2px solid #cbd5e1',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>

      {/* Report Comment Modal */}
      <ReportModal
        open={!!reportCommentId}
        onClose={() => setReportCommentId(null)}
        onSubmit={handleReportComment}
        contentType="Comment"
      />
    </>
  );
};

export default CommentSection;