// // src/features/academicPlanner/MonthlyView.jsx
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Calendar, ChevronUp } from 'lucide-react';
// import plannerService from '../../services/plannerService';

// const MonthlyView = () => {
//   const navigate = useNavigate();
//   const today = new Date();
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [monthTasks, setMonthTasks] = useState({});

//   useEffect(() => {
//     fetchMonthTasks();
//   }, [currentMonth]);

//   const fetchMonthTasks = async () => {
//     try {
//       const monthDays = getMonthDays();
//       const startDate = monthDays[0].date.toISOString().split('T')[0];
//       const lastDay = monthDays[monthDays.length - 1].date.toISOString().split('T')[0];
//       const res = await plannerService.getTasksByRange(startDate, lastDay);
      
//       const tasksByDate = {};
//       (res.data.tasks || []).forEach(task => {
//         const date = new Date(task.dueDate).toDateString();
//         if (!tasksByDate[date]) tasksByDate[date] = [];
//         tasksByDate[date].push(task);
//       });
//       setMonthTasks(tasksByDate);
//     } catch (error) {
//       console.error('Month tasks error:', error);
//     }
//   };

//   const getMonthDays = () => {
//     const year = currentMonth.getFullYear();
//     const month = currentMonth.getMonth();
//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);
//     const days = [];
    
//     const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    
//     for (let i = startDay - 1; i >= 0; i--) {
//       days.push({ date: new Date(year, month, -i), isCurrentMonth: false });
//     }
    
//     for (let i = 1; i <= lastDay.getDate(); i++) {
//       days.push({ date: new Date(year, month, i), isCurrentMonth: true });
//     }
    
//     return days;
//   };

//   const monthDays = getMonthDays();
//   const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
//   const isSameDay = (d1, d2) => d1.toDateString() === d2.toDateString();

//   const getTaskColor = (tasks) => {
//     if (!tasks || tasks.length === 0) return '';
//     const highPriority = tasks.some(t => t.priority === 'High');
//     if (highPriority) return 'bg-pink-100 border-pink-300';
//     const mediumPriority = tasks.some(t => t.priority === 'Medium');
//     if (mediumPriority) return 'bg-yellow-100 border-yellow-300';
//     return 'bg-green-100 border-green-300';
//   };

//   const getTaskTextColor = (tasks) => {
//     if (!tasks || tasks.length === 0) return '';
//     const highPriority = tasks.some(t => t.priority === 'High');
//     if (highPriority) return 'text-pink-600';
//     const mediumPriority = tasks.some(t => t.priority === 'Medium');
//     if (mediumPriority) return 'text-yellow-700';
//     return 'text-green-600';
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-8">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-8">
//         <div className="flex items-center gap-3">
//           <div className="bg-white p-2 rounded-lg shadow-sm">
//             <Calendar className="w-6 h-6 text-red-500" />
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900">Academic planner</h1>
//         </div>

//         {/* Navigation Buttons */}
//         <div className="flex gap-3">
//           <button
//             onClick={() => navigate('/academic-planner/dashboard')}
//             className="px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-blue-400 transition-all"
//           >
//             Dashboard
//           </button>
//           <button className="px-6 py-2.5 bg-blue-500 text-white font-semibold rounded-lg shadow-md">
//             View Tasks
//           </button>
//           <button
//             onClick={() => navigate('/academic-planner/create-task')}
//             className="px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-blue-400 transition-all"
//           >
//             + Create Tasks
//           </button>
//           <button
//             onClick={() => navigate('/academic-planner/priority-tasks')}
//             className="px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-blue-400 transition-all"
//           >
//             Priority Tasks
//           </button>
//         </div>
//       </div>

//       {/* Page Title with Today's Date */}
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-blue-900">Tasks in Calendar View</h2>
//         <p className="text-red-600 font-semibold text-lg">
//           {today.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/')}
//         </p>
//       </div>

//       {/* Monthly Calendar */}
//       <div className="bg-white rounded-3xl shadow-lg p-6">
//         {/* Day Names */}
//         <div className="grid grid-cols-7 gap-4 mb-4">
//           {dayNames.map((day) => (
//             <div key={day} className="text-center font-bold text-purple-600 text-sm">
//               {day}
//             </div>
//           ))}
//         </div>

//         {/* Month Days Grid */}
//         <div className="grid grid-cols-7 gap-3 mb-6">
//           {monthDays.map((dayObj, idx) => {
//             const isToday = isSameDay(dayObj.date, today);
//             const dayTasks = monthTasks[dayObj.date.toDateString()] || [];
//             const taskCount = dayTasks.length;
            
//             return (
//               <div
//                 key={idx}
//                 onClick={() => dayObj.isCurrentMonth && navigate('/academic-planner/view-tasks', { 
//                   state: { selectedDate: dayObj.date.toISOString() } 
//                 })}
//                 className={`
//                   rounded-2xl p-4 min-h-[85px] flex flex-col items-center justify-center border-2 transition-all
//                   ${dayObj.isCurrentMonth ? 'cursor-pointer hover:border-blue-400' : 'cursor-default'}
//                   ${!dayObj.isCurrentMonth ? 'opacity-30 bg-gray-50 border-gray-100' : ''}
//                   ${dayObj.isCurrentMonth && taskCount === 0 ? 'bg-white border-gray-200' : ''}
//                   ${dayObj.isCurrentMonth && taskCount > 0 ? getTaskColor(dayTasks) + ' border-2' : ''}
//                   ${isToday && dayObj.isCurrentMonth ? 'border-red-400' : ''}
//                 `}
//               >
//                 <p className={`text-2xl font-bold ${
//                   isToday ? 'text-red-600' : 
//                   !dayObj.isCurrentMonth ? 'text-gray-400' : 
//                   'text-gray-900'
//                 }`}>
//                   {dayObj.date.getDate()}
//                 </p>
                
//                 {taskCount > 0 && dayObj.isCurrentMonth && (
//                   <p className={`text-xs font-semibold mt-2 ${getTaskTextColor(dayTasks)}`}>
//                     {taskCount === 1 ? dayTasks[0].subject : `TASK: ${taskCount}`}
//                   </p>
//                 )}
//               </div>
//             );
//           })}
//         </div>

//         {/* Dropdown Icon (Up Arrow) */}
//         <div className="flex justify-end">
//           <button
//             onClick={() => navigate('/academic-planner/view-tasks')}
//             className="text-gray-600 hover:text-blue-600 transition-all"
//           >
//             <ChevronUp className="w-8 h-8" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MonthlyView;




























// // src/features/academicPlanner/MonthlyView.jsx
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Calendar, ChevronUp } from 'lucide-react';
// import plannerService from '../../services/plannerService';

// const MonthlyView = () => {
//   const navigate = useNavigate();
//   const today = new Date();
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [monthTasks, setMonthTasks] = useState({});

//   useEffect(() => {
//     fetchMonthTasks();
//   }, [currentMonth]);

//   const fetchMonthTasks = async () => {
//     try {
//       const monthDays = getMonthDays();
//       const startDate = monthDays[0].date.toISOString().split('T')[0];
//       const lastDay = monthDays[monthDays.length - 1].date.toISOString().split('T')[0];
//       const res = await plannerService.getTasksByRange(startDate, lastDay);
      
//       const tasksByDate = {};
//       (res.data.tasks || []).forEach(task => {
//         const date = new Date(task.dueDate).toDateString();
//         if (!tasksByDate[date]) tasksByDate[date] = [];
//         tasksByDate[date].push(task);
//       });
//       setMonthTasks(tasksByDate);
//     } catch (error) {
//       console.error('Month tasks error:', error);
//     }
//   };

//   // ✅ FIXED: SUN-SAT month grid
//   const getMonthDays = () => {
//     const year = currentMonth.getFullYear();
//     const month = currentMonth.getMonth();
//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);
//     const days = [];
    
//     const startDay = firstDay.getDay(); // Sunday = 0, no adjustment needed
    
//     // Add previous month days if month doesn't start on Sunday
//     for (let i = startDay - 1; i >= 0; i--) {
//       days.push({ date: new Date(year, month, -i), isCurrentMonth: false });
//     }
    
//     // Add current month days
//     for (let i = 1; i <= lastDay.getDate(); i++) {
//       days.push({ date: new Date(year, month, i), isCurrentMonth: true });
//     }
    
//     return days;
//   };

//   const monthDays = getMonthDays();
//   const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']; // ✅ FIXED
//   const isSameDay = (d1, d2) => d1.toDateString() === d2.toDateString();

//   const getTaskColor = (tasks) => {
//     if (!tasks || tasks.length === 0) return '';
//     const highPriority = tasks.some(t => t.priority === 'High');
//     if (highPriority) return 'bg-pink-100 border-pink-300';
//     const mediumPriority = tasks.some(t => t.priority === 'Medium');
//     if (mediumPriority) return 'bg-yellow-100 border-yellow-300';
//     return 'bg-green-100 border-green-300';
//   };

//   const getTaskTextColor = (tasks) => {
//     if (!tasks || tasks.length === 0) return '';
//     const highPriority = tasks.some(t => t.priority === 'High');
//     if (highPriority) return 'text-pink-600';
//     const mediumPriority = tasks.some(t => t.priority === 'Medium');
//     if (mediumPriority) return 'text-yellow-700';
//     return 'text-green-600';
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-8">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-8">
//         <div className="flex items-center gap-3">
//           <div className="bg-white p-2 rounded-lg shadow-sm">
//             <Calendar className="w-6 h-6 text-red-500" />
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900">Academic planner</h1>
//         </div>

//         {/* Navigation Buttons */}
//         <div className="flex gap-3">
//           <button
//             onClick={() => navigate('/academic-planner/dashboard')}
//             className="px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-blue-400 transition-all"
//           >
//             Dashboard
//           </button>
//           <button className="px-6 py-2.5 bg-blue-500 text-white font-semibold rounded-lg shadow-md">
//             View Tasks
//           </button>
//           <button
//             onClick={() => navigate('/academic-planner/create-task')}
//             className="px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-blue-400 transition-all"
//           >
//             + Create Tasks
//           </button>
//           <button
//             onClick={() => navigate('/academic-planner/priority-tasks')}
//             className="px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-blue-400 transition-all"
//           >
//             Priority Tasks
//           </button>
//         </div>
//       </div>

//       {/* Page Title with Today's Date */}
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-blue-900">Tasks in Calendar View</h2>
//         <p className="text-red-600 font-semibold text-lg">
//           {today.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/')}
//         </p>
//       </div>

//       {/* Monthly Calendar */}
//       <div className="bg-white rounded-3xl shadow-lg p-6">
//         {/* Day Names */}
//         <div className="grid grid-cols-7 gap-4 mb-4">
//           {dayNames.map((day) => (
//             <div key={day} className="text-center font-bold text-purple-600 text-sm">
//               {day}
//             </div>
//           ))}
//         </div>

//         {/* Month Days Grid */}
//         <div className="grid grid-cols-7 gap-3 mb-6">
//           {monthDays.map((dayObj, idx) => {
//             const isToday = isSameDay(dayObj.date, today);
//             const dayTasks = monthTasks[dayObj.date.toDateString()] || [];
//             const taskCount = dayTasks.length;
            
//             return (
//               <div
//                 key={idx}
//                 onClick={() => dayObj.isCurrentMonth && navigate('/academic-planner/view-tasks', { 
//                   state: { selectedDate: dayObj.date.toISOString() } 
//                 })}
//                 className={`
//                   rounded-2xl p-4 min-h-[85px] flex flex-col items-center justify-center border-2 transition-all
//                   ${dayObj.isCurrentMonth ? 'cursor-pointer hover:border-blue-400' : 'cursor-default'}
//                   ${!dayObj.isCurrentMonth ? 'opacity-30 bg-gray-50 border-gray-100' : ''}
//                   ${dayObj.isCurrentMonth && taskCount === 0 ? 'bg-white border-gray-200' : ''}
//                   ${dayObj.isCurrentMonth && taskCount > 0 ? getTaskColor(dayTasks) + ' border-2' : ''}
//                   ${isToday && dayObj.isCurrentMonth ? 'border-red-400' : ''}
//                 `}
//               >
//                 <p className={`text-2xl font-bold ${
//                   isToday ? 'text-red-600' : 
//                   !dayObj.isCurrentMonth ? 'text-gray-400' : 
//                   'text-gray-900'
//                 }`}>
//                   {dayObj.date.getDate()}
//                 </p>
                
//                 {taskCount > 0 && dayObj.isCurrentMonth && (
//                   <p className={`text-xs font-semibold mt-2 ${getTaskTextColor(dayTasks)}`}>
//                     {taskCount === 1 ? dayTasks[0].subject : `TASK: ${taskCount}`}
//                   </p>
//                 )}
//               </div>
//             );
//           })}
//         </div>

//         {/* Dropdown Icon (Up Arrow) */}
//         <div className="flex justify-end">
//           <button
//             onClick={() => navigate('/academic-planner/view-tasks')}
//             className="text-gray-600 hover:text-blue-600 transition-all"
//           >
//             <ChevronUp className="w-8 h-8" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MonthlyView;































// src/features/academicPlanner/MonthlyView.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronUp } from 'lucide-react';
import plannerService from '../../services/plannerService';

const MonthlyView = () => {
  const navigate = useNavigate();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthTasks, setMonthTasks] = useState({});

  useEffect(() => {
    fetchMonthTasks();
  }, [currentMonth]);

  const fetchMonthTasks = async () => {
    try {
      const monthDays = getMonthDays();
      const startDate = monthDays[0].date.toISOString().split('T')[0];
      const lastDay = monthDays[monthDays.length - 1].date.toISOString().split('T')[0];
      const res = await plannerService.getTasksByRange(startDate, lastDay);
      
      // Handle multiple response formats
      const allTasks = res.data?.tasks || res.tasks || res.data || [];
      
      const tasksByDate = {};
      allTasks.forEach(task => {
        const date = new Date(task.dueDate).toDateString();
        if (!tasksByDate[date]) tasksByDate[date] = [];
        tasksByDate[date].push(task);
      });
      setMonthTasks(tasksByDate);
    } catch (error) {
      console.error('Month tasks error:', error);
    }
  };

  // SUN-SAT month grid
  const getMonthDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    const startDay = firstDay.getDay();
    
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({ date: new Date(year, month, -i), isCurrentMonth: false });
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    
    return days;
  };

  const monthDays = getMonthDays();
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const isSameDay = (d1, d2) => d1.toDateString() === d2.toDateString();

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
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <Calendar className="w-6 h-6 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Academic planner</h1>
        </div>

        {/* Navigation Buttons */}
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

      {/* Page Title with Today's Date */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-900">Tasks in Calendar View</h2>
        <p className="text-red-600 font-semibold text-lg">
          {today.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/')}
        </p>
      </div>

      {/* Monthly Calendar */}
      <div className="bg-white rounded-3xl shadow-lg p-6">
        {/* Day Names */}
        <div className="grid grid-cols-7 gap-4 mb-4">
          {dayNames.map((day) => (
            <div key={day} className="text-center font-bold text-purple-600 text-sm">
              {day}
            </div>
          ))}
        </div>

        {/* Month Days Grid */}
        <div className="grid grid-cols-7 gap-3 mb-6">
          {monthDays.map((dayObj, idx) => {
            const isToday = isSameDay(dayObj.date, today);
            const dayTasks = monthTasks[dayObj.date.toDateString()] || [];
            const taskCount = dayTasks.length;
            
            return (
              <div
                key={idx}
                onClick={() => dayObj.isCurrentMonth && navigate('/academic-planner/view-tasks', { 
                  state: { selectedDate: dayObj.date.toISOString() } 
                })}
                className={`
                  rounded-2xl p-4 min-h-[85px] flex flex-col items-center justify-center border-2 transition-all
                  ${dayObj.isCurrentMonth ? 'cursor-pointer hover:border-blue-400' : 'cursor-default'}
                  ${!dayObj.isCurrentMonth ? 'opacity-30 bg-gray-50 border-gray-100' : ''}
                  ${dayObj.isCurrentMonth && taskCount === 0 ? 'bg-white border-gray-200' : ''}
                  ${dayObj.isCurrentMonth && taskCount > 0 ? getTaskColor(dayTasks) + ' border-2' : ''}
                  ${isToday && dayObj.isCurrentMonth ? 'border-red-400' : ''}
                `}
              >
                <p className={`text-2xl font-bold ${
                  isToday ? 'text-red-600' : 
                  !dayObj.isCurrentMonth ? 'text-gray-400' : 
                  'text-gray-900'
                }`}>
                  {dayObj.date.getDate()}
                </p>
                
                {taskCount > 0 && dayObj.isCurrentMonth && (
                  <p className={`text-xs font-semibold mt-2 ${getTaskTextColor(dayTasks)}`}>
                    {taskCount === 1 ? dayTasks[0].subject : `TASK: ${taskCount}`}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Dropdown Icon (Up Arrow) */}
        <div className="flex justify-end">
          <button
            onClick={() => navigate('/academic-planner/view-tasks')}
            className="text-gray-600 hover:text-blue-600 transition-all"
          >
            <ChevronUp className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MonthlyView;
