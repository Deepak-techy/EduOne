const BookmarkSidebar = ({ bookmarks }) => {
  return (
    <div className="border-l pl-4 dark:border-gray-700">
      <h2 className="font-bold mb-4 dark:text-white">My Bookmarks</h2>

      {bookmarks.length === 0 ? (
        <p className="text-sm text-gray-400">No bookmarks yet.</p>
      ) : (
        bookmarks.map((b) => {
          // ✅ Backend populates postId with the full post object
          const post = b.postId || b;
          return (
            <div key={b._id} className="text-sm mb-2 border-b pb-2 dark:border-gray-600">
              <p className="font-medium dark:text-gray-200">
                {post.title || "Untitled"}
              </p>
              <p className="text-gray-500 dark:text-gray-400 truncate">
                {post.content ? post.content.substring(0, 60) : ""}
              </p>
            </div>
          );
        })
      )}
    </div>
  );
};

export default BookmarkSidebar;