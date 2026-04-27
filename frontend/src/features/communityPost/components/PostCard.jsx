import { communityService } from "../../../services/communityService";
import CommentSection from "./CommentSection";
import { useState } from "react";

const PostCard = ({ post, refreshPosts }) => {
  const [showComments, setShowComments] = useState(false);

  const vote = async (type) => {
    await communityService.votePost(post._id, type);
    refreshPosts();
  };

  const bookmark = async () => {
    await communityService.bookmarkPost(post._id);
    refreshPosts();
  };

  return (
    <div className="border rounded-lg p-4 mb-4 shadow-sm">

      <h3 className="font-semibold">{post.authorName}</h3>
      <p className="text-gray-600">{post.content}</p>

      <div className="flex gap-4 mt-3 text-sm">

        <button onClick={() => vote("up")}>👍 {post.upvotes}</button>

        <button onClick={() => vote("down")}>👎 {post.downvotes}</button>

        <button onClick={bookmark}>🔖 Bookmark</button>

        <button onClick={() => setShowComments(!showComments)}>
          💬 Comments
        </button>

      </div>

      {showComments && (
        <CommentSection postId={post._id} />
      )}

    </div>
  );
};

export default PostCard;