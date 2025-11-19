
// src/features/academicPlanner/MonthlyView.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import plannerService from '../../services/plannerService';

const MonthlyView = () => {
  const navigate = useNavigate();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthTasks, setMonthTasks] = useState({});
  
  // Year/Month selector state
  const [showSelector, setShowSelector] = useState(false);
  const [selectedYear, setSelectedYear] = useState(currentMonth.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.getMonth());

  useEffect(() => {
    fetchMonthTasks();
  }, [currentMonth]);

  // ✅ Convert Date to YYYY-MM-DD format
  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchMonthTasks = async () => {
    try {
      const monthDays = getMonthDays();
      const startDate = formatDateForAPI(monthDays[0].date);
      const lastDay = formatDateForAPI(monthDays[monthDays.length - 1].date);
      
      console.log('📅 Fetching month range:', startDate, 'to', lastDay);
      
      const res = await plannerService.getTasksByRange(startDate, lastDay);
      
      const allTasks = res.data?.tasks || res.tasks || res.data || [];
      console.log('✅ Month tasks received:', allTasks.length);
      
      // ✅ Group tasks by YYYY-MM-DD format
      const tasksByDate = {};
      allTasks.forEach(task => {
        const taskDate = new Date(task.dueDate);
        const dateKey = formatDateForAPI(taskDate);
        if (!tasksByDate[dateKey]) tasksByDate[dateKey] = [];
        tasksByDate[dateKey].push(task);
      });
      
      console.log('📊 Tasks grouped:', tasksByDate);
      
      setMonthTasks(tasksByDate);
    } catch (error) {
      console.error('❌ Month tasks error:', error);
    }
  };

  const getMonthDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    const startDay = firstDay.getDay();
    
    // Previous month days
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({ date: new Date(year, month, -i), isCurrentMonth: false });
    }
    
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    
    return days;
  };

  // Apply selected year/month
  const applyDateSelection = () => {
    const newDate = new Date(selectedYear, selectedMonth, 1);
    setCurrentMonth(newDate);
    setShowSelector(false);
  };

  // Generate year options (10 years back to 10 years forward)
  const yearOptions = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear - 10; i <= currentYear + 10; i++) {
    yearOptions.push(i);
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthDays = getMonthDays();
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
  const isSameDay = (d1, d2) => {
    return formatDateForAPI(d1) === formatDateForAPI(d2);
  };

  const getTaskColor = (tasks) => {
    if (!tasks || tasks.length === 0) return '';
    const highPriority = tasks.some(t => t.priority === 'High');
    if (highPriority) return 'bg-pink-100 border-pink-300';
    const mediumPriority = tasks.some(t => t.priority === 'Medium');
    if (mediumPriority) return 'bg-yellow-100 border-yellow-300';
    return 'bg-green-100 border-green-300';
  };

  const getTaskTextColor = (tasks) => {
    if (!tasks || tasks.length === 0) return '';
    const highPriority = tasks.some(t => t.priority === 'High');
    if (highPriority) return 'text-pink-600';
    const mediumPriority = tasks.some(t => t.priority === 'Medium');
    if (mediumPriority) return 'text-yellow-700';
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-8">
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
            className="px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-blue-400 transition-all"
          >
            Dashboard
          </button>
          <button className="px-6 py-2.5 bg-blue-500 text-white font-semibold rounded-lg shadow-md">
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

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-900">Tasks in Calendar View</h2>
        <p className="text-red-600 font-semibold text-lg">
          {today.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/')}
        </p>
      </div>

      {/* Monthly Calendar */}
      <div className="bg-white rounded-2xl shadow-md p-5">
        {/* Month Navigation Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
              const newMonth = new Date(currentMonth);
              newMonth.setMonth(newMonth.getMonth() - 1);
              setCurrentMonth(newMonth);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            title="Previous month"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          {/* Clickable month/year with dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSelector(!showSelector)}
              className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              <span className="ml-2 text-sm">▼</span>
            </button>

            {/* Year/Month Selector Dropdown */}
            {showSelector && (
              <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl border-2 border-gray-200 p-4 z-50 min-w-[280px]">
                <div className="mb-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Month</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    {monthNames.map((month, idx) => (
                      <option key={idx} value={idx}>{month}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    {yearOptions.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={applyDateSelection}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => setShowSelector(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={() => {
              const newMonth = new Date(currentMonth);
              newMonth.setMonth(newMonth.getMonth() + 1);
              setCurrentMonth(newMonth);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            title="Next month"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-3">
          {dayNames.map((day) => (
            <div key={day} className="text-center font-semibold text-purple-600 text-xs">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {monthDays.map((dayObj, idx) => {
            const isToday = isSameDay(dayObj.date, today);
            const dayKey = formatDateForAPI(dayObj.date);
            const dayTasks = monthTasks[dayKey] || [];
            const taskCount = dayTasks.length;
            
            return (
              <div
                key={idx}
                onClick={() => dayObj.isCurrentMonth && navigate('/academic-planner/view-tasks', { 
                  state: { selectedDate: dayObj.date.toISOString() } 
                })}
                className={`
                  rounded-xl p-2 min-h-[60px] flex flex-col items-center justify-center border-2 transition-all
                  ${dayObj.isCurrentMonth ? 'cursor-pointer hover:border-blue-400' : 'cursor-default'}
                  ${!dayObj.isCurrentMonth ? 'opacity-30 bg-gray-50 border-gray-100' : ''}
                  ${dayObj.isCurrentMonth && taskCount === 0 ? 'bg-white border-gray-200' : ''}
                  ${dayObj.isCurrentMonth && taskCount > 0 ? getTaskColor(dayTasks) + ' border-2' : ''}
                  ${isToday && dayObj.isCurrentMonth ? 'border-red-400' : ''}
                `}
              >
                <p className={`text-lg font-bold ${
                  isToday ? 'text-red-600' : 
                  !dayObj.isCurrentMonth ? 'text-gray-400' : 
                  'text-gray-900'
                }`}>
                  {dayObj.date.getDate()}
                </p>
                
                {taskCount > 0 && dayObj.isCurrentMonth && (
                  <p className={`text-[10px] font-semibold mt-1 ${getTaskTextColor(dayTasks)}`}>
                    {taskCount}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => navigate('/academic-planner/view-tasks')}
            className="text-gray-600 hover:text-blue-600 transition-all"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MonthlyView;
