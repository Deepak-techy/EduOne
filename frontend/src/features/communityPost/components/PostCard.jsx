import { communityService } from "../../../services/communityService";
import CommentSection from "./CommentSection";
import ReportModal from "./ReportModal";
import { useState } from "react";
import { createPortal } from "react-dom";
import { ThumbsUp, ThumbsDown, Bookmark, MessageSquare, Trash2, Flag } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

const PostCard = ({ post, refreshPosts, refreshBookmarks, bookmarks = [], isAlreadyReported = false }) => {
  const [showComments, setShowComments] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isReported, setIsReported] = useState(isAlreadyReported);
  const { user } = useAuth();

  const isOwner = user?._id === post.author?._id;
  const isAdmin = user?.role === "Admin";
  // The frontend stores "admin" in lowercase usually, but let's check carefully.
  const isAdminDeletingStudent = user?.role?.toLowerCase() === "Admin" && post.authorRole === "Student";
  const canDelete = isOwner || isAdmin || isAdminDeletingStudent;

  const isBookmarked = bookmarks.some((b) => {
    const bPostId = b.postId?._id || b.postId || b._id;
    return bPostId === post._id;
  });

  const isUpvoted = Array.isArray(post.upvotes) && post.upvotes.some(id => (id._id || id).toString() === user?._id?.toString());
  const isDownvoted = Array.isArray(post.downvotes) && post.downvotes.some(id => (id._id || id).toString() === user?._id?.toString());

  const handleUpvote = async () => {
    try {
      await communityService.upvotePost(post._id);
      refreshPosts();
    } catch (err) {
      console.error("Upvote failed:", err);
    }
  };

  const handleDownvote = async () => {
    try {
      await communityService.downvotePost(post._id);
      refreshPosts();
    } catch (err) {
      console.error("Downvote failed:", err);
    }
  };

  const handleBookmark = async () => {
    try {
      if (isBookmarked) {
        await communityService.removeBookmark(post._id);
      } else {
        await communityService.addBookmark(post._id);
      }
      if (refreshBookmarks) refreshBookmarks();
    } catch (err) {
      console.error("Bookmark failed:", err);
    }
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await communityService.deletePost(post._id);
      refreshPosts();
      if (refreshBookmarks) refreshBookmarks();
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReport = async (data) => {
    await communityService.reportPost(post._id, data);
    setIsReported(true);
  };

  return (
    <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-2xl p-5 mb-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300 hover:shadow-lg relative">

      {/* Author info & Actions */}
      <div className="bg-white/50 dark:bg-gray-700/50 rounded-xl p-4 mb-4 border border-gray-100 dark:border-gray-600/50 shadow-sm flex items-start justify-between transition-colors hover:bg-white/80 dark:hover:bg-gray-700/80">
        <div className="flex items-center gap-3">
          {post.author?.avatar ? (
            <img src={post.author.avatar} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm" />
          ) : (
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm"
              style={{ background: "linear-gradient(255deg, #0099FF 0%, #00D4FF 0%, #60A5FA 70%, #2563EB 150%)" }}
            >
              {(post.author?.fullName || post.authorName || "U")[0].toUpperCase()}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-[15px] leading-tight">
                {post.author?.fullName || post.authorName || "Unknown"}
              </h3>
              <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-[10px] font-medium uppercase tracking-wider">
                {post.authorRole}
              </span>
            </div>
            {post.author?.userName && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">@{post.author.userName}</p>
            )}
          </div>
        </div>

        {canDelete && (
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10"
            title="Delete Post"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Post content */}
      {post.title && (
        <h4 className="font-bold text-lg mb-2 px-1 text-gray-900 dark:text-gray-100 leading-snug">{post.title}</h4>
      )}
      <div className="bg-white/50 dark:bg-gray-700/50 rounded-xl p-4 mb-4 border border-gray-100 dark:border-gray-600/50 shadow-sm transition-colors hover:bg-white/80 dark:hover:bg-gray-700/80">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-[15px] whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">

        <button 
          onClick={handleUpvote} 
          className={`flex items-center gap-1.5 transition-colors group text-sm font-medium ${isUpvoted ? "text-blue-500 dark:text-blue-300" : "text-gray-500 hover:text-blue-400 dark:text-gray-400 dark:hover:text-blue-300"}`}
        >
          <div className={`p-1.5 rounded-full transition-colors ${isUpvoted ? "bg-blue-50 dark:bg-blue-500/10" : "group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10"}`}>
            <ThumbsUp size={18} fill={isUpvoted ? "currentColor" : "none"} />
          </div>
          <span>{Array.isArray(post.upvotes) ? post.upvotes.length : post.upvotes || 0}</span>
        </button>

        <button 
          onClick={handleDownvote} 
          className={`flex items-center gap-1.5 transition-colors group text-sm font-medium ${isDownvoted ? "text-red-500 dark:text-red-300" : "text-gray-500 hover:text-red-400 dark:text-gray-400 dark:hover:text-red-300"}`}
        >
          <div className={`p-1.5 rounded-full transition-colors ${isDownvoted ? "bg-red-50 dark:bg-red-500/10" : "group-hover:bg-red-50 dark:group-hover:bg-red-500/10"}`}>
            <ThumbsDown size={18} fill={isDownvoted ? "currentColor" : "none"} />
          </div>
          <span>{Array.isArray(post.downvotes) ? post.downvotes.length : post.downvotes || 0}</span>
        </button>

        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 text-gray-500 hover:text-green-500 dark:text-gray-400 dark:hover:text-green-400 transition-colors group text-sm font-medium ml-auto"
        >
          <div className="p-1.5 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-500/10 transition-colors">
            <MessageSquare size={18} />
          </div>
          <span>{post.commentsCount || 0}</span>
        </button>

        <button 
          onClick={handleBookmark} 
          className={`flex items-center gap-1.5 transition-colors group text-sm font-medium ${
            isBookmarked 
              ? "text-yellow-500" 
              : "text-gray-500 hover:text-yellow-500 dark:text-gray-400 dark:hover:text-yellow-400"
          }`}
        >
          <div className={`p-1.5 rounded-full transition-colors ${
            isBookmarked 
              ? "bg-yellow-50 dark:bg-yellow-500/20" 
              : "group-hover:bg-yellow-50 dark:group-hover:bg-yellow-500/10"
          }`}>
            <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
          </div>
        </button>

        {!isOwner && (
          <button
            onClick={() => isReported ? null : setShowReportModal(true)}
            className={`flex items-center gap-1.5 transition-colors group text-sm font-medium ${
              isReported
                ? 'text-orange-500 dark:text-orange-400 cursor-default'
                : 'text-gray-500 hover:text-orange-500 dark:text-gray-400 dark:hover:text-orange-400'
            }`}
            title={isReported ? 'Already reported' : 'Report Post'}
          >
            <div className={`p-1.5 rounded-full transition-colors ${
              isReported
                ? 'bg-orange-50 dark:bg-orange-500/20'
                : 'group-hover:bg-orange-50 dark:group-hover:bg-orange-500/10'
            }`}>
              <Flag size={18} fill={isReported ? 'currentColor' : 'none'} />
            </div>
          </button>
        )}

      </div>

      {showComments && (
        <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <CommentSection postId={post._id} postAuthorId={post.author?._id} />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && createPortal(
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
              Are you sure you want to delete this post? <br />
              <span style={{
                color: '#0891b2',
                fontWeight: 700,
                fontSize: '1.05rem',
                display: 'inline-block',
                marginTop: '8px'
              }}>
                {post.title || "Untitled Post"}
              </span>
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button
                onClick={confirmDelete}
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
                onClick={() => setShowDeleteConfirm(false)}
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

      {/* Report Modal */}
      <ReportModal
        open={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleReport}
        contentType="Post"
      />
    </div>
  );
};

export default PostCard;