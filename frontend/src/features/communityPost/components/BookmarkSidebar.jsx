import { Bookmark as BookmarkIcon, ChevronRight, Trash2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { communityService } from "../../../services/communityService";

const BookmarkSidebar = ({ bookmarks, refreshBookmarks }) => {
  const [selectedPost, setSelectedPost] = useState(null);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedPost) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedPost]);

  const handleRemoveBookmark = async (e, postId) => {
    e.stopPropagation(); // Prevent opening the modal
    try {
      await communityService.removeBookmark(postId);
      if (refreshBookmarks) refreshBookmarks();
    } catch (err) {
      console.error("Failed to remove bookmark:", err);
    }
  };

  return (
    <>
      <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] sticky top-8 relative">
        
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700/50">
          <div 
            className="p-2 rounded-lg text-white shadow-sm"
            style={{ background: "linear-gradient(255deg, #0099FF 0%, #00D4FF 0%, #60A5FA 70%, #2563EB 150%)" }}
          >
            <BookmarkIcon size={18} />
          </div>
          <h2 className="font-bold text-lg text-gray-900 dark:text-white tracking-tight">Saved Posts</h2>
        </div>

        {bookmarks.length === 0 ? (
          <div className="text-center py-8">
            <BookmarkIcon size={32} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">No bookmarks yet.</p>
            <p className="text-xs text-gray-400 mt-1">Save interesting posts to read later.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookmarks.map((b) => {
              const post = b.postId || b;
              return (
                <div 
                  key={b._id} 
                  onClick={() => setSelectedPost(post)}
                  className="group p-3 -mx-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all cursor-pointer border border-transparent hover:border-gray-500 dark:hover:border-gray-700"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-gray-200 text-sm truncate mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {post.title || "Untitled"}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
                        {typeof post.content === "string" ? (post.content.trim().split(/\s+/).slice(0, 3).join(" ") + (post.content.trim().split(/\s+/).length > 3 ? "..." : "")) : ""}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-2 flex-shrink-0 mt-0.5">
                      <button 
                        onClick={(e) => handleRemoveBookmark(e, post._id)}
                        className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove bookmark"
                      >
                        <Trash2 size={16} />
                      </button>
                      <ChevronRight size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 duration-300" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Post Details Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-0">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedPost(null)}
          ></div>
          <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 p-6 sm:p-8">
            {/* <button 
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X size={20} />
            </button> */}
            
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 mb-4 border border-gray-100 dark:border-gray-700/50 shadow-sm flex items-center gap-3 transition-colors hover:bg-white/80 dark:hover:bg-gray-800/80">
              {selectedPost.author?.avatar ? (
                <img src={selectedPost.author.avatar} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm" />
              ) : (
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm"
                  style={{ background: "linear-gradient(255deg, #0099FF 0%, #00D4FF 0%, #60A5FA 70%, #2563EB 150%)" }}
                >
                  {(selectedPost.author?.fullName || selectedPost.authorName || "U")[0].toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-[15px]">
                  {selectedPost.author?.fullName || selectedPost.authorName || "Unknown"}
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedPost.authorRole}
                </span>
              </div>
            </div>

            {selectedPost.title && (
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 px-1 leading-snug">
                {selectedPost.title}
              </h2>
            )}
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 mb-4 border border-gray-100 dark:border-gray-700/50 shadow-sm transition-colors hover:bg-white/80 dark:hover:bg-gray-800/80">
              <p className="text-gray-700 dark:text-gray-300 text-[15px] leading-relaxed whitespace-pre-wrap m-0">
                {selectedPost.content}
              </p>
            </div>
            
            <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <button
                onClick={() => setSelectedPost(null)}
                className="px-5 py-2.5 rounded-xl font-medium text-white bg-gray-900 hover:bg-black transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookmarkSidebar;