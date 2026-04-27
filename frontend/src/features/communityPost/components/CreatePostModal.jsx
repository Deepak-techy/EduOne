import { useState } from "react";
import { communityService } from "../../../services/communityService";

const CreatePostModal = ({ open, setOpen, role, refreshPosts }) => {
  const [content, setContent] = useState("");

  const submitPost = async () => {
  try {
    await communityService.createPost({
      content,
      type: role === "teacher" ? "announcement" : "post",
    });

    setContent("");
    setOpen(false);
    refreshPosts();
  } catch (err) {
    console.error(err);
  }
};

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">

      <div className="bg-white p-6 rounded-lg w-96">

        <h2 className="text-lg font-bold mb-4">
          {role === "teacher"
            ? "Create Announcement"
            : "Create Post"}
        </h2>

        <textarea
          className="w-full border p-2 rounded"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write something..."
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2"
          >
            Cancel
          </button>

          <button
            onClick={submitPost}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Post
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreatePostModal;