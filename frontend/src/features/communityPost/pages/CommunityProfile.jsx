import { ArrowLeft, UserCircle, Settings, FileText, Bookmark, Shield, Heart, Camera, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useState, useEffect, useRef } from "react";
import { communityService } from "../../../services/communityService";
import { authService } from "../../../services/authService";
import Feed from "../components/Feed";
import { toast } from "react-toastify";

const CommunityProfile = () => {
  const navigate = useNavigate();
  const { user, updateProfile, setUser } = useAuth() || {};

  const [activeTab, setActiveTab] = useState("my-posts"); // "my-posts", "bookmarks", "liked"
  const [posts, setPosts] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Profile Modal States
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({ fullName: "", userName: "", bio: "" });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setEditFormData({ 
        fullName: user.fullName || "", 
        userName: user.userName || "",
        bio: user.bio || ""
      });
    }
  }, [user]);

  const loadBookmarks = async () => {
    try {
      const res = await communityService.getBookmarks();
      const updatedBookmarks = res.data?.data?.bookmarks || [];
      setBookmarks(updatedBookmarks);
      
      // If the user is currently viewing the Bookmarks tab, instantly remove the unbookmarked post from the screen
      if (activeTab === "bookmarks") {
        setPosts(updatedBookmarks.map((b) => b.postId || b));
      }
    } catch (err) {
      console.error("Failed to load bookmarks:", err);
    }
  };

  const loadPosts = async () => {
    setLoading(true);
    try {
      if (activeTab === "bookmarks") {
        const res = await communityService.getBookmarks();
        setPosts(res.data?.data?.bookmarks?.map((b) => b.postId || b) || []);
      } else if (activeTab === "my-posts") {
        const res = await communityService.getPosts("my-posts", 1, 100);
        let fetchedPosts = res.data?.data?.posts || [];
        // Robust frontend fallback just in case backend query hasn't taken effect
        fetchedPosts = fetchedPosts.filter(p => p.author?._id === user?._id || p.author === user?._id);
        setPosts(fetchedPosts);
      } else if (activeTab === "liked") {
        const res = await communityService.getPosts("liked", 1, 100);
        let fetchedPosts = res.data?.data?.posts || [];
        // Robust frontend fallback
        fetchedPosts = fetchedPosts.filter(p => Array.isArray(p.upvotes) && p.upvotes.some(id => (id._id || id).toString() === user?._id?.toString()));
        setPosts(fetchedPosts);
      }
    } catch (err) {
      console.error("Failed to load profile posts:", err);
      setPosts([]);
    }
    setLoading(false);
  };

  // Initial load
  useEffect(() => {
    loadBookmarks();
  }, []);

  // Reload posts when tab changes
  useEffect(() => {
    loadPosts();
  }, [activeTab]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!editFormData.fullName.trim() && !editFormData.userName.trim()) return;

    setIsUpdatingProfile(true);
    try {
      await updateProfile(editFormData);
      setShowEditModal(false);
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUpdatingAvatar(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await authService.updateAvatar(formData);
      const updatedUser = res.data;
      
      // Manually map avatarUrl exactly as AuthContext does on init
      setUser({
        ...updatedUser,
        avatarUrl: updatedUser.avatar || updatedUser.avatarUrl || null,
      });

      toast.success("Profile picture updated successfully!");
    } catch (error) {
      console.error("Avatar update failed", error);
      toast.error(error.message || "Failed to update profile picture");
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  return (
    <div className="min-h-screen p-6 lg:p-12 relative overflow-hidden bg-gray-50 dark:bg-[#121212]">
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

      <div className="max-w-[1600px] mx-auto relative z-10">
        
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
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(255deg, #a855f7 0%, #c084fc 50%, #e879f9 100%)" }}
            >
              My Profile
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400 hidden sm:block">Manage your posts, bookmarks, and account details.</p>
          </div>

          <div className="flex-1 flex justify-end">
            <button 
              onClick={() => navigate('/community/feed')}
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium bg-blue-50/80 dark:bg-blue-500/10 px-4 py-2 rounded-xl backdrop-blur-md border border-blue-200/50 dark:border-blue-700/30 shadow-sm hover:shadow"
            >
              <span className="hidden sm:inline">Go to Feed</span>
              <span className="sm:hidden">Feed</span>
              <FileText size={18} />
            </button>
          </div>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-3xl p-8 mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 dark:from-white/5 dark:to-transparent pointer-events-none" />
          
          <div className="relative group z-10">
            {isUpdatingAvatar && (
              <div className="absolute inset-0 z-20 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Loader2 size={32} className="text-white animate-spin" />
              </div>
            )}
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-xl" />
            ) : (
              <div 
                className="w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-white dark:border-gray-700"
                style={{ background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)" }}
              >
                {(user?.fullName || "U")[0].toUpperCase()}
              </div>
            )}
            <button 
              onClick={() => setShowEditModal(true)}
              className="absolute bottom-0 right-0 p-2.5 bg-white dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-200 shadow-lg border border-gray-100 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors hover:scale-110 active:scale-95"
              title="Edit Profile"
            >
              <Settings size={18} className="transform group-hover:rotate-45 transition-transform duration-300" />
            </button>
          </div>

          <div className="flex-1 text-center md:text-left z-10">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                {user?.fullName || "Community Member"}
              </h1>
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded-full text-xs font-bold uppercase tracking-wider w-fit mx-auto md:mx-0 flex items-center gap-1.5">
                <Shield size={14} />
                {user?.role || "Student"}
              </span>
            </div>
            
            {user?.userName && (
              <p className="text-gray-500 dark:text-gray-400 font-medium mb-4">@{user.userName}</p>
            )}
            
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl mb-6">
              {user?.bio ? (
                user.bio
              ) : (
                <span className="italic opacity-70 text-gray-500">
                  No bio yet. Click the gear icon to write a little about yourself!
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveTab("my-posts")}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 whitespace-nowrap ${
              activeTab === "my-posts"
                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                : "bg-white/40 dark:bg-gray-800/40 backdrop-blur-md text-gray-600 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-gray-800/60 border border-white/50 dark:border-gray-700/50 shadow-sm"
            }`}
          >
            <FileText size={18} />
            My Posts
          </button>
          
          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 whitespace-nowrap ${
              activeTab === "bookmarks"
                ? "bg-yellow-500 text-white shadow-lg shadow-yellow-500/30"
                : "bg-white/40 dark:bg-gray-800/40 backdrop-blur-md text-gray-600 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-gray-800/60 border border-white/50 dark:border-gray-700/50 shadow-sm"
            }`}
          >
            <Bookmark size={18} />
            Bookmarks
          </button>

          <button
            onClick={() => setActiveTab("liked")}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 whitespace-nowrap ${
              activeTab === "liked"
                ? "bg-pink-500 text-white shadow-lg shadow-pink-500/30"
                : "bg-white/40 dark:bg-gray-800/40 backdrop-blur-md text-gray-600 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-gray-800/60 border border-white/50 dark:border-gray-700/50 shadow-sm"
            }`}
          >
            <Heart size={18} />
            Liked Posts
          </button>
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Loading...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border border-dashed border-gray-300 dark:border-gray-600 rounded-3xl p-12 text-center">
            {activeTab === "my-posts" && <FileText size={48} className="mx-auto text-blue-400/50 mb-4" />}
            {activeTab === "bookmarks" && <Bookmark size={48} className="mx-auto text-yellow-400/50 mb-4" />}
            {activeTab === "liked" && <Heart size={48} className="mx-auto text-pink-400/50 mb-4" />}
            
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">No posts found</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              {activeTab === "my-posts" && "You haven't uploaded any community posts yet. Share your thoughts with the community!"}
              {activeTab === "bookmarks" && "You haven't saved any posts yet. Bookmark interesting discussions to read them later."}
              {activeTab === "liked" && "You haven't liked any posts yet. Give a thumbs up to posts you find helpful!"}
            </p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Feed 
              posts={posts} 
              refreshPosts={loadPosts} 
              refreshBookmarks={loadBookmarks} 
              bookmarks={bookmarks} 
            />
          </div>
        )}

      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowEditModal(false)}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Profile</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {/* Avatar Upload Section */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg group-hover:opacity-80 transition-opacity" />
                  ) : (
                    <div 
                      className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-white dark:border-gray-800 group-hover:opacity-80 transition-opacity"
                      style={{ background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)" }}
                    >
                      {(user?.fullName || "U")[0].toUpperCase()}
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={24} className="text-white" />
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleAvatarChange} 
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 font-medium">Click to change avatar</p>
              </div>

              {/* Form Section */}
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.fullName}
                    onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all dark:text-white"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={editFormData.userName}
                    onChange={(e) => setEditFormData({ ...editFormData, userName: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all dark:text-white"
                    placeholder="johndoe123"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={editFormData.bio}
                    onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all dark:text-white resize-none"
                    placeholder="Tell the community a little about yourself..."
                    rows={3}
                    maxLength={500}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  {isUpdatingProfile ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default CommunityProfile;
