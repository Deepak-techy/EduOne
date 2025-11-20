// src/features/academicPlanner/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Target, TrendingUp, Clock, CheckCircle, AlertCircle, Flame } from 'lucide-react';
import plannerService from '../../services/plannerService';

// =====================================================
// MAIN DASHBOARD COMPONENT
// =====================================================
const Dashboard = () => {
  const navigate = useNavigate();
  
  // ========== STATE MANAGEMENT ==========
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // ========== FETCH DASHBOARD DATA ==========
  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      console.log('📡 Fetching dashboard data...');
      const res = await plannerService.getDashboard();
      
      console.log('✅ Dashboard response:', res);
      
      // Extract dashboard data
      const dashboardData = res.data || res;
      const todayTasks = dashboardData.today?.tasks || [];
      const weekTasks = dashboardData.week?.tasks || [];
      
      console.log('📊 Today tasks:', todayTasks.length);
      console.log('📊 Week tasks:', weekTasks.length);
      
      // Combine unique tasks
      const allTasksMap = new Map();
      [...todayTasks, ...weekTasks].forEach(task => {
        allTasksMap.set(task._id, task);
      });
      const allTasks = Array.from(allTasksMap.values());
      
      const completed = allTasks.filter(t => t.isCompleted);
      const pending = allTasks.filter(t => !t.isCompleted);
      
      setStats({
        total: allTasks.length,
        completed: completed.length,
        pending: pending.length
      });
      setCompletedTasks(completed);
    } catch (error) {
      console.error('❌ Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate progress percentage
  const progressPercent = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  // ========== LOADING STATE ==========
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          {/* Animated Spinner */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <div className="relative flex items-center justify-center w-20 h-20 mx-auto">
              <Calendar className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-600 font-semibold">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // ========== MAIN RENDER ==========
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-8">
      {/* ========== HEADER ========== */}
      <div className="flex items-center justify-between mb-8">
        {/* Logo & Title */}
        <div className="flex items-center gap-3 animate-fade-in">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <Calendar className="w-6 h-6 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Academic planner</h1>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 animate-fade-in">
          <button
            onClick={() => navigate('/academic-planner/dashboard')}
            className="px-6 py-2.5 bg-blue-500 text-white font-semibold rounded-lg shadow-md cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate('/academic-planner/view-tasks')}
            className="px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-blue-400 cursor-pointer transform transition-all duration-200 hover:scale-105"
          >
            View Tasks
          </button>
          <button
            onClick={() => navigate('/academic-planner/create-task')}
            className="px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-blue-400 cursor-pointer transform transition-all duration-200 hover:scale-105"
          >
            + Create Tasks
          </button>
          <button
            onClick={() => navigate('/academic-planner/priority-tasks')}
            className="px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-blue-400 cursor-pointer transform transition-all duration-200 hover:scale-105"
          >
            Priority Tasks
          </button>
        </div>
      </div>

      {/* ========== PAGE TITLE ========== */}
      <div className="mb-6 animate-fade-in-delay">
        <h2 className="text-2xl font-bold text-blue-900">This Week's Overview</h2>
        <p className="text-gray-600 text-sm mt-1">Track your academic progress and achievements</p>
      </div>

      {/* ========== MAIN GRID ========== */}
      <div className="grid grid-cols-12 gap-6">
        {/* ========== LEFT SECTION - STATS & TASKS ========== */}
        <div className="col-span-8 space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-6">
            {/* Total Tasks Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xs font-semibold text-gray-400 uppercase">Total</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</h3>
              <p className="text-sm text-gray-500">All Tasks</p>
            </div>

            {/* Completed Tasks Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-slide-up-delay-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-3 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-xs font-semibold text-gray-400 uppercase">Done</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.completed}</h3>
              <p className="text-sm text-gray-500">Completed</p>
            </div>

            {/* Pending Tasks Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-slide-up-delay-2">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-orange-100 p-3 rounded-xl">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-xs font-semibold text-gray-400 uppercase">Pending</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.pending}</h3>
              <p className="text-sm text-gray-500">To Do</p>
            </div>
          </div>

          {/* ========== COMPLETED TASKS LIST ========== */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-slide-up-delay-3">
            <h3 className="text-lg font-bold text-gray-900 mb-5">Recent Completed Tasks</h3>
            <div className="space-y-3">
              {completedTasks.length === 0 ? (
                // Empty State
                <div className="text-center py-8 text-gray-400">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No completed tasks yet</p>
                  <p className="text-sm mt-1">Complete your first task to see it here!</p>
                </div>
              ) : (
                // Completed Tasks List
                completedTasks.slice(0, 5).map((task, index) => (
                  <div
                    key={task._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transform transition-all duration-200 hover:scale-102 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{task.subject}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{task.task}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      {new Date(task.completedAt || task.dueDate).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ========== RIGHT SECTION - PROGRESS & INSIGHTS ========== */}
        <div className="col-span-4 space-y-6">
          {/* ========== PROGRESS CARD ========== */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105 animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-white" />
              <h3 className="text-white font-semibold">Progress</h3>
            </div>
            
            {/* Circular Progress */}
            <div className="text-center mb-6">
              <div className="relative inline-flex items-center justify-center w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="white"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - progressPercent / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute">
                  <p className="text-4xl font-bold text-white">{progressPercent.toFixed(0)}%</p>
                </div>
              </div>
            </div>

            {/* Progress Info */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-white/80 text-sm mb-1">Completion Rate</p>
              <p className="text-white text-lg font-semibold">
                {stats.completed} of {stats.total} tasks done
              </p>
            </div>
          </div>

{/* ========== WEEKLY INSIGHTS CARD (Week Range + Today + Motivation) ========== */}

<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transform transition-all duration-300 hover:scale-105 animate-slide-up-delay-1">
  <div className="flex items-center gap-2 mb-4">
    <Calendar className="w-5 h-5 text-blue-500" />
    <h3 className="font-semibold text-gray-900">Weekly Overview</h3>
  </div>

  <div className="space-y-3">
    {/* Week Range */}
    {(() => {
      const today = new Date();
      const firstDayOfWeek = new Date(today);
      const dayOfWeek = today.getDay();
      firstDayOfWeek.setDate(today.getDate() - dayOfWeek);
      
      const lastDayOfWeek = new Date(firstDayOfWeek);
      lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
      
      const formatDate = (date) => {
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      };
      
      return (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <p className="text-xs font-semibold text-blue-900 uppercase tracking-wide">This Week</p>
          </div>
          <p className="text-lg font-bold text-blue-900">
            {formatDate(firstDayOfWeek)} - {formatDate(lastDayOfWeek)}
          </p>
          <p className="text-xs text-blue-700 mt-1">
            {firstDayOfWeek.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      );
    })()}

    {/* Motivational Quote */}
    {(() => {
      const motivationalQuotes = [
        { text: "Focus on progress, not perfection!", emoji: "🎯" },
        { text: "Every task completed is a step forward!", emoji: "✨" },
        { text: "You're doing amazing! Keep going!", emoji: "💪" },
        { text: "Small steps lead to big achievements!", emoji: "🌟" },
        { text: "Believe in yourself and stay focused!", emoji: "🚀" }
      ];
      
      const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
      
      return (
        <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-100">
          <div className="flex items-start gap-3">
            <div className="text-2xl">{randomQuote.emoji}</div>
            <div>
              <p className="text-xs font-semibold text-orange-900 uppercase tracking-wide mb-1">Motivation</p>
              <p className="text-sm font-medium text-orange-900">{randomQuote.text}</p>
            </div>
          </div>
        </div>
      );
    })()}

    </div>
    </div>   
  </div>
</div>
    

      {/* ========== CSS ANIMATIONS ========== */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fade-in-delay {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in-delay 0.6s ease-out 0.2s backwards;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .animate-slide-up-delay-1 {
          animation: slide-up 0.6s ease-out 0.1s backwards;
        }

        .animate-slide-up-delay-2 {
          animation: slide-up 0.6s ease-out 0.2s backwards;
        }

        .animate-slide-up-delay-3 {
          animation: slide-up 0.6s ease-out 0.3s backwards;
        }

        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
