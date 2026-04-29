import { useEffect, useState } from "react";
import Feed from "./components/Feed";
import BookmarkSidebar from "./components/BookmarkSidebar";
import Filters from "./components/Filters";
import { communityService } from "../../services/communityService";
import { useAuth } from "../../contexts/AuthContext"; // ✅ Use AuthContext instead of localStorage

const CommunityPage = () => {
  const { user } = useAuth(); // ✅ Get user from context (cookie-based auth)

  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    try {
      const res = await communityService.getPosts(filter);
      // ✅ Backend returns: { data: { posts, count, page, ... } }
      setPosts(res.data?.data?.posts || []);
    } catch (err) {
      console.error("Failed to load posts:", err);
      setPosts([]);
    }
  };

  const loadBookmarks = async () => {
    try {
      const res = await communityService.getBookmarks();
      // ✅ Backend returns: { data: { bookmarks, count, page, ... } }
      setBookmarks(res.data?.data?.bookmarks || []);
    } catch (err) {
      console.error("Failed to load bookmarks:", err);
      setBookmarks([]);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadPosts();
      setLoading(false);
    };
    init();
  }, [filter]);

  useEffect(() => {
    loadBookmarks();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading community...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-6 p-6">
      
      {/* Main Feed */}
      <div className="col-span-3">
        <Filters
          filter={filter}
          setFilter={setFilter}
          role={user?.role}
          refreshPosts={loadPosts}
        />

        <Feed posts={posts} refreshPosts={loadPosts} />
      </div>

      {/* Bookmark Sidebar */}
      <BookmarkSidebar bookmarks={bookmarks} refreshBookmarks={loadBookmarks} />

    </div>
  );
};

export default CommunityPage;