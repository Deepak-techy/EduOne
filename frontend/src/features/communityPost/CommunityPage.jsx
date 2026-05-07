import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserCircle } from "lucide-react";
import Feed from "./components/Feed";
import BookmarkSidebar from "./components/BookmarkSidebar";
import Filters from "./components/Filters";
import { communityService } from "../../services/communityService";
import { useAuth } from "../../contexts/AuthContext";

const CommunityPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    try {
      const res = await communityService.getPosts(filter);
      setPosts(res.data?.data?.posts || []);
    } catch (err) {
      console.error("Failed to load posts:", err);
      setPosts([]);
    }
  };

  const loadBookmarks = async () => {
    try {
      const res = await communityService.getBookmarks();
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
          <p className="text-gray-600 dark:text-gray-300 font-medium">Loading community...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      
      {/* Dynamic Background Gradients for Glassmorphism */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Top-right glow */}
        <div 
          className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full opacity-30 dark:opacity-40 blur-[120px]"
          style={{ background: "linear-gradient(255deg, #a855f7 0%, #c084fc 50%, #e879f9 100%)" }}
        ></div>
        
        {/* Bottom-left glow */}
        <div 
          className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full opacity-[0.25] dark:opacity-30 blur-[120px]"
          style={{ background: "linear-gradient(255deg, #3b82f6 0%, #60a5fa 50%, #93c5fd 100%)" }}
        ></div>

        {/* Soft ambient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-50/30 to-blue-50/40 dark:via-purple-900/10 dark:to-blue-900/10 mix-blend-overlay"></div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-10 relative">
          <div className="flex-1 flex justify-start">
            <button 
              onClick={() => navigate('/community')}
              className="flex items-center justify-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-all duration-300 bg-transparent hover:bg-gray-200/50 dark:hover:bg-gray-700/40 p-2.5 rounded-xl hover:backdrop-blur-md border border-transparent hover:border-gray-300/50 dark:hover:border-gray-600/50"
              title="Dashboard"
            >
              <ArrowLeft size={25} />
            </button>
          </div>
          
          <div className="text-center px-2 sm:px-4">
            <h1 
  className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text leading-tight"
  style={{ backgroundImage: "linear-gradient(255deg, #0099FF 0%, #00D4FF 20%, #60A5FA 70%, #2563EB 100%)" }}
>
  Community Hub
</h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400 hidden sm:block">Connect through ideas, share knowledge, and be part of something meaningful</p>
          </div>

          <div className="flex-1 flex justify-end">
            <button 
              onClick={() => navigate('/community/profile')}
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium bg-blue-50/80 dark:bg-blue-500/10 px-4 py-2 rounded-xl backdrop-blur-md border border-blue-200/50 dark:border-blue-700/30 shadow-sm hover:shadow"
            >
              <span className="hidden sm:inline">My Profile</span>
              <span className="sm:hidden">Profile</span>
              <UserCircle size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Feed */}
          <div className="lg:col-span-3 space-y-6">
            <Filters
              filter={filter}
              setFilter={setFilter}
              role={user?.role}
              refreshPosts={loadPosts}
            />

            <Feed posts={posts} refreshPosts={loadPosts} refreshBookmarks={loadBookmarks} bookmarks={bookmarks} />
          </div>

          {/* Bookmark Sidebar */}
          <div className="lg:col-span-1 hidden lg:block">
            <BookmarkSidebar bookmarks={bookmarks} refreshBookmarks={loadBookmarks} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default CommunityPage;