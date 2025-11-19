// src/features/academicPlanner/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Target, TrendingUp, Award, CheckCircle, Clock } from 'lucide-react';
import plannerService from '../../services/plannerService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      console.log('📡 Fetching dashboard data...');
      const res = await plannerService.getDashboard();
      
      console.log('✅ Dashboard response:', res);
      
      // ✅ Your backend returns: { data: { today: {...}, week: {...} } }
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

  const progressPercent = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-8">
      {/* ✅ FIXED: Header - Matching Design with Other Pages */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <Calendar className="w-6 h-6 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Academic planner</h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate('/academic-planner/dashboard')}
            className="px-6 py-2.5 bg-blue-500 text-white font-semibold rounded-lg shadow-md"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate('/academic-planner/view-tasks')}
            className="px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-blue-400 transition-all"
          >
            View Tasks
          </button>
          <button
            onClick={() => navigate('/academic-planner/create-task')}
            className="px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-blue-400 transition-all"
          >
            + Create Tasks
          </button>
          <button
            onClick={() => navigate('/academic-planner/priority-tasks')}
            className="px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-blue-400 transition-all"
          >
            Priority Tasks
          </button>
        </div>
      </div>

      {/* ✅ NEW: Subtitle - This Week's Overview */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-900">This Week's Overview</h2>
        <p className="text-gray-600 text-sm mt-1">Track your academic progress and achievements</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left - Stats */}
        <div className="col-span-8 space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xs font-semibold text-gray-400 uppercase">Total</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</h3>
              <p className="text-sm text-gray-500">All Tasks</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-3 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-xs font-semibold text-gray-400 uppercase">Done</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.completed}</h3>
              <p className="text-sm text-gray-500">Completed</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
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

          {/* Completed Tasks */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-5">Recent Completed Tasks</h3>
            <div className="space-y-3">
              {completedTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No completed tasks yet</p>
                  <p className="text-sm mt-1">Complete your first task to see it here!</p>
                </div>
              ) : (
                completedTasks.slice(0, 5).map((task) => (
                  <div
                    key={task._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
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

        {/* Right - Progress */}
        <div className="col-span-4 space-y-6">
          {/* Progress Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-white" />
              <h3 className="text-white font-semibold">Progress</h3>
            </div>
            
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
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute">
                  <p className="text-4xl font-bold text-white">{progressPercent.toFixed(0)}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-white/80 text-sm mb-1">Completion Rate</p>
              <p className="text-white text-lg font-semibold">
                {stats.completed} of {stats.total} tasks done
              </p>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-amber-500" />
              <h3 className="font-semibold text-gray-900">Achievements</h3>
            </div>
            
            <div className="space-y-3">
              {stats.completed > 0 && (
                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                  <div className="bg-amber-100 p-2 rounded-lg">
                    <Award className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Task Master</p>
                    <p className="text-xs text-gray-500">{stats.completed} tasks completed</p>
                  </div>
                </div>
              )}

              {progressPercent >= 50 && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Half Way There!</p>
                    <p className="text-xs text-gray-500">50%+ completion</p>
                  </div>
                </div>
              )}

              {progressPercent === 100 && stats.total > 0 && (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Perfect Score!</p>
                    <p className="text-xs text-gray-500">100% completion</p>
                  </div>
                </div>
              )}

              {stats.completed === 0 && stats.total > 0 && (
                <div className="text-center py-4 text-gray-400">
                  <Award className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Complete tasks to unlock achievements!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
