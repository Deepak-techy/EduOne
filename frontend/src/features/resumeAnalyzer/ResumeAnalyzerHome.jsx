// src/features/pdfQA/PdfQAHome.jsx
import { useNavigate } from 'react-router-dom';
import { BookOpen, Upload, Sparkles, ArrowRight } from 'lucide-react';

const ResumeAnalyzerHome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-teal-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 blur-3xl"></div>
          <div className="relative">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-600 to-teal-600 rounded-2xl mb-4 shadow-2xl">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-3">
              Resume Analyzer
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Choose how you want to learn today
            </p>
          </div>
        </div>

        {/* Options Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          
          {/* View History Section */}
          <button
            onClick={() => navigate('/resume-analyzer/history')}
            className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-cyan-500 dark:hover:border-cyan-500 transition-all hover:shadow-cyan-500/20 hover:-translate-y-2 duration-300"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-teal-100 dark:from-cyan-900/30 dark:to-teal-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
              <BookOpen className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 text-left">
              View History
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 text-left">
              View last resume analyse report 
            </p>
            <div className="flex items-center text-cyan-600 dark:text-cyan-400 font-semibold">
              <span>View History</span>
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </div>
          </button>

          {/* Upload Resume Card */}
          <button
            onClick={() => navigate('/resume-analyzer/analyzer')}
            className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-500 transition-all hover:shadow-teal-500/20 hover:-translate-y-2 duration-300"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
              <Upload className="w-8 h-8 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 text-left">
              Upload Resume
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 text-left">
              get instantly scores, highlights improvements, and helps optimize them.
            </p>
            <div className="flex items-center text-teal-600 dark:text-teal-400 font-semibold">
              <span>Upload Now</span>
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </div>
          </button>
        </div>

        {/* Features Section */}
        {/* <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-slate-200/50 dark:border-slate-800/50">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-cyan-600" />
            Why Use Resume Analyzer?
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="text-4xl mb-3">⚡</div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Instant Answers</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Get AI-powered responses in seconds with high accuracy</p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-3">🎯</div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Contextual Results</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Answers are derived from your specific content</p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-3">🔒</div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Secure & Private</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Your documents are processed securely and safely</p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ResumeAnalyzerHome;
