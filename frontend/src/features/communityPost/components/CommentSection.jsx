import { useState } from "react";
import { communityService } from "../../../services/communityService";

const CommentSection = ({ postId }) => {
  const [text, setText] = useState("");

  const submitComment = async () => {
    await communityService.addComment(postId, text);
    setText("");
  };

  return (
    <div className="mt-4 border-t pt-3">

      <textarea
        className="w-full border p-2 rounded"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write comment..."
      />

      <button
        onClick={submitComment}
        className="bg-gray-800 text-white px-3 py-1 mt-2 rounded"
      >
        Comment
      </button>

    </div>
  );
};

export default CommentSection;