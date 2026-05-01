import { useNavigate } from "react-router-dom";
import { Users, UserCircle, ArrowRight, Sparkles, MessageSquare } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

const CommunityDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth() || {};

  return (
    <div className="min-h-screen p-6 lg:p-12 relative overflow-hidden bg-gray-50 dark:bg-[#121212]">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 dark:bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 dark:bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="mb-12 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium text-sm mb-4">
            <Sparkles size={16} />
            <span>EduOne Community Hub</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
            Welcome to the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Community</span>
            {user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Connect with peers, share knowledge, ask questions, and build your academic network all in one place.
          </p>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Feed Card */}
          <div 
            onClick={() => navigate('/community/feed')}
            className="group relative bg-white/70 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 cursor-pointer overflow-hidden"
          >
            {/* Hover Gradient Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-500/30">
                <Users size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Community Feed</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                Explore discussions, answer questions, and stay updated with the latest posts from students and teachers across the platform.
              </p>
              
              <div className="flex items-center gap-4 text-blue-600 dark:text-blue-400 font-semibold">
                <span className="flex items-center gap-2">
                  <MessageSquare size={18} /> Join the discussion
                </span>
                <ArrowRight size={20} className="transform group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </div>
          </div>

          {/* Profile Card */}
          <div 
            onClick={() => navigate('/community/profile')}
            className="group relative bg-white/70 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 cursor-pointer overflow-hidden"
          >
            {/* Hover Gradient Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center text-white mb-6 shadow-lg shadow-purple-500/30">
                <UserCircle size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">My Profile</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                View your community stats, manage your posts, review your saved bookmarks, and customize how others see you.
              </p>
              
              <div className="flex items-center gap-4 text-purple-600 dark:text-purple-400 font-semibold">
                <span className="flex items-center gap-2">
                  <UserCircle size={18} /> View your profile
                </span>
                <ArrowRight size={20} className="transform group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CommunityDashboard;
