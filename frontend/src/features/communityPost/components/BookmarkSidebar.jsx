const BookmarkSidebar = ({ bookmarks }) => {
  return (
    <div className="border-l pl-4">
      <h2 className="font-bold mb-4">My Bookmarks</h2>

      {bookmarks.map((b) => (
        <div key={b._id} className="text-sm mb-2 border-b pb-2">
          {b.title || b.content.substring(0, 40)}
        </div>
      ))}
    </div>
  );
};

export default BookmarkSidebar;