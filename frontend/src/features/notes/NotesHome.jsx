// src/features/notes/NotesHome.jsx - COMPACT & LIGHT COLORS
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Plus, BookOpen, Sparkles, Zap, 
  Shield, ArrowRight, Star, TrendingUp
} from 'lucide-react';

const NotesHome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50/50 via-cyan-50/50 to-teal-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      
      {/* Soft Animated Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-blue-200/40 to-cyan-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-float"></div>
        <div className="absolute top-20 -left-20 w-60 h-60 bg-gradient-to-br from-cyan-200/40 to-teal-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-float animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/2 w-60 h-60 bg-gradient-to-br from-teal-200/40 to-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-float animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        
        {/* Compact Hero */}
        <div className="text-center mb-12">
          
          {/* Small Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-white/80 rounded-full mb-4 shadow-lg shadow-blue-500/10">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping absolute"></div>
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
            <span className="text-xs font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              ✨ AI Powered
            </span>
          </div>

          {/* Smaller Title */}
          <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight">
            <span className="inline-block bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
              Notes Organizer
            </span>
          </h1>
          
          {/* Compact Subtitle */}
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-4">
            Your intelligent companion for smart learning
          </p>
          
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1.5 bg-gradient-to-r from-blue-400/80 to-cyan-400/80 text-white text-sm rounded-full font-medium shadow-md">
              📝 Smart Notes
            </span>
            <span className="px-3 py-1.5 bg-gradient-to-r from-cyan-400/80 to-teal-400/80 text-white text-sm rounded-full font-medium shadow-md">
              🤖 AI Insights
            </span>
            <span className="px-3 py-1.5 bg-gradient-to-r from-teal-400/80 to-blue-400/80 text-white text-sm rounded-full font-medium shadow-md">
              ⚡ Quick Search
            </span>
          </div>
        </div>

        {/* Compact Cards */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          
          {/* Create Note Card - Compact */}
          <div
            onClick={() => navigate('/notes-organizer/create')}
            className="group relative cursor-pointer transform transition-all duration-300 hover:-translate-y-2"
          >
            {/* Soft Glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/50 to-cyan-400/50 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-all"></div>
            
            {/* Card */}
            <div className="relative h-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-2xl p-8 border border-white/90 dark:border-slate-700/50 shadow-xl overflow-hidden">
              
              {/* Soft Pattern */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-300/10 to-cyan-300/10 rounded-full blur-2xl"></div>
              
              <div className="relative">
                {/* Smaller Icon */}
                <div className="mb-4 inline-flex">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-3 transition-all">
                    <Plus className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </div>
                </div>

                {/* Compact Content */}
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  Create Note
                  <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
                </h3>
                
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                  Start with a blank canvas. Write, upload PDFs, and let AI enhance your notes.
                </p>

                {/* Small Pills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-100/70 dark:bg-blue-900/30 rounded-full">
                    <Zap className="w-3 h-3 text-blue-500" />
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">AI Powered</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-cyan-100/70 dark:bg-cyan-900/30 rounded-full">
                    <Shield className="w-3 h-3 text-cyan-500" />
                    <span className="text-xs font-medium text-cyan-600 dark:text-cyan-400">Auto-save</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-2 text-blue-500 dark:text-blue-400 font-semibold group-hover:gap-3 transition-all">
                  <span className="text-sm">Start Creating</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          {/* My Library Card - Compact */}
          <div
            onClick={() => navigate('/notes-organizer/library')}
            className="group relative cursor-pointer transform transition-all duration-300 hover:-translate-y-2"
          >
            {/* Soft Glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400/50 to-teal-400/50 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-all"></div>
            
            {/* Card */}
            <div className="relative h-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-2xl p-8 border border-white/90 dark:border-slate-700/50 shadow-xl overflow-hidden">
              
              {/* Soft Pattern */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-300/10 to-teal-300/10 rounded-full blur-2xl"></div>
              
              <div className="relative">
                {/* Smaller Icon */}
                <div className="mb-4 inline-flex">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-teal-400 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:-rotate-3 transition-all">
                    <BookOpen className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </div>
                </div>

                {/* Compact Content */}
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  My Library
                  <FileText className="w-5 h-5 text-cyan-400" />
                </h3>
                
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                  Access your collection. Search by tags, filter subjects, and continue learning.
                </p>

                {/* Small Pills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-cyan-100/70 dark:bg-cyan-900/30 rounded-full">
                    <Star className="w-3 h-3 text-cyan-500" />
                    <span className="text-xs font-medium text-cyan-600 dark:text-cyan-400">Smart Search</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-teal-100/70 dark:bg-teal-900/30 rounded-full">
                    <TrendingUp className="w-3 h-3 text-teal-500" />
                    <span className="text-xs font-medium text-teal-600 dark:text-teal-400">Quick Access</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-2 text-cyan-500 dark:text-cyan-400 font-semibold group-hover:gap-3 transition-all">
                  <span className="text-sm">Browse Library</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-xl border border-white/80 shadow-lg">
            <div className="text-3xl font-black bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent mb-1">
              10x
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Faster Notes</p>
          </div>
          <div className="text-center p-5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-xl border border-white/80 shadow-lg">
            <div className="text-3xl font-black bg-gradient-to-r from-cyan-500 to-teal-500 bg-clip-text text-transparent mb-1">
              AI
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Powered</p>
          </div>
          <div className="text-center p-5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-xl border border-white/80 shadow-lg">
            <div className="text-3xl font-black bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent mb-1">
              100%
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Organized</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default NotesHome;
