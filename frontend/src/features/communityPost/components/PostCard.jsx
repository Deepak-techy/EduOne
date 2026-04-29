import { communityService } from "../../../services/communityService";
import CommentSection from "./CommentSection";
import { useState } from "react";

const PostCard = ({ post, refreshPosts }) => {
  const [showComments, setShowComments] = useState(false);

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
      await communityService.addBookmark(post._id);
    } catch (err) {
      console.error("Bookmark failed:", err);
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">

      {/* Author info */}
      <div className="flex items-center gap-2 mb-2">
        {post.author?.avatar && (
          <img src={post.author.avatar} alt="" className="w-8 h-8 rounded-full" />
        )}
        <div>
          <h3 className="font-semibold dark:text-white">
            {post.author?.fullName || post.authorName || "Unknown"}
          </h3>
          {post.author?.userName && (
            <p className="text-xs text-gray-400">@{post.author.userName}</p>
          )}
        </div>
        <span className="ml-auto text-xs text-gray-400">
          {post.authorRole}
        </span>
      </div>

      {/* Post content */}
      {post.title && (
        <h4 className="font-medium text-lg mb-1 dark:text-gray-100">{post.title}</h4>
      )}
      <p className="text-gray-600 dark:text-gray-300">{post.content}</p>

      {/* Action buttons */}
      <div className="flex gap-4 mt-3 text-sm">

        <button onClick={handleUpvote} className="hover:text-blue-500 dark:text-gray-300">
          👍 {Array.isArray(post.upvotes) ? post.upvotes.length : post.upvotes || 0}
        </button>

        <button onClick={handleDownvote} className="hover:text-red-500 dark:text-gray-300">
          👎 {Array.isArray(post.downvotes) ? post.downvotes.length : post.downvotes || 0}
        </button>

        <button onClick={handleBookmark} className="hover:text-yellow-500 dark:text-gray-300">
          🔖 Bookmark
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="hover:text-green-500 dark:text-gray-300"
        >
          💬 {post.commentsCount || 0} Comments
        </button>

      </div>

      {showComments && (
        <CommentSection postId={post._id} />
      )}

    </div>
  );
};

export default PostCard;