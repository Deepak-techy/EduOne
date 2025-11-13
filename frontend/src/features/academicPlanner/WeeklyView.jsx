// // src/features/academicPlanner/WeeklyView.jsx
// import { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { Calendar, ChevronDown } from 'lucide-react';
// import plannerService from '../../services/plannerService';

// const WeeklyView = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   // Get passed date from monthly view or use today
//   const passedDate = location.state?.selectedDate ? new Date(location.state.selectedDate) : new Date();
  
//   const today = new Date();
//   const [selectedDate, setSelectedDate] = useState(passedDate);
//   const [tasks, setTasks] = useState([]);
//   const [weekTasks, setWeekTasks] = useState({});

//   useEffect(() => {
//     fetchTasksForDate(selectedDate);
//     fetchWeekTasks();
//   }, [selectedDate]);

// // ADD THIS NEW useEffect RIGHT AFTER THE ABOVE ONE:
// useEffect(() => {
//   // When coming from monthly view, auto-fetch tasks for that date
//   if (location.state?.selectedDate) {
//     const dateFromMonthly = new Date(location.state.selectedDate);
//     setSelectedDate(dateFromMonthly);
//     fetchTasksForDate(dateFromMonthly);
//   }
// }, [location.state]);




//   const fetchTasksForDate = async (date) => {
//     try {
//       const dateStr = date.toISOString().split('T')[0];
//       const res = await plannerService.getTasksByDate(dateStr);
//       setTasks(res.data.tasks || []);
//     } catch (error) {
//       console.error('Fetch error:', error);
//       setTasks([]);
//     }
//   };

//   const fetchWeekTasks = async () => {
//     try {
//       const week = getWeekDays();
//       const startDate = week[0].toISOString().split('T')[0];
//       const endDate = week[6].toISOString().split('T')[0];
//       const res = await plannerService.getTasksByRange(startDate, endDate);
      
//       const tasksByDate = {};
//       (res.data.tasks || []).forEach(task => {
//         const date = new Date(task.dueDate).toDateString();
//         if (!tasksByDate[date]) tasksByDate[date] = [];
//         tasksByDate[date].push(task);
//       });
//       setWeekTasks(tasksByDate);
//     } catch (error) {
//       console.error('Week tasks error:', error);
//     }
//   };

//   const handleMarkComplete = async (taskId, task) => {
//     try {
//       await plannerService.markComplete(taskId, task);
//       fetchTasksForDate(selectedDate);
//       fetchWeekTasks();
//     } catch (error) {
//       console.error('Mark complete error:', error);
//     }
//   };

//   const getWeekDays = () => {
//     const curr = new Date(selectedDate); // Use selectedDate to get the week
//     const week = [];
//     const day = curr.getDay();
//     const diff = curr.getDate() - day + (day === 0 ? -6 : 1);
//     curr.setDate(diff);
    
//     for (let i = 0; i < 7; i++) {
//       week.push(new Date(curr));
//       curr.setDate(curr.getDate() + 1);
//     }
//     return week;
//   };

//   const weekDays = getWeekDays();
//   const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
//   const isSameDay = (d1, d2) => d1.toDateString() === d2.toDateString();

//   const getPriorityBadge = (priority) => {
//     if (priority === 'High') return 'bg-red-100 text-red-600';
//     if (priority === 'Medium') return 'bg-yellow-100 text-yellow-600';
//     return 'bg-green-100 text-green-600';
//   };

//   const getTaskCardColor = (priority) => {
//     if (priority === 'High') return 'bg-pink-50 border-pink-300';
//     if (priority === 'Medium') return 'bg-pink-50 border-pink-300';
//     return 'bg-pink-50 border-pink-300';
//   };

//   const getTaskDotColor = (tasks) => {
//     if (!tasks || tasks.length === 0) return '';
//     const highPriority = tasks.some(t => t.priority === 'High');
//     if (highPriority) return 'text-red-500 bg-red-50';
//     const mediumPriority = tasks.some(t => t.priority === 'Medium');
//     if (mediumPriority) return 'text-yellow-600 bg-yellow-50';
//     return 'text-green-600 bg-green-50';
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

//       {/* Weekly Calendar */}
//       <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
//         {/* Day Names */}
//         <div className="grid grid-cols-7 gap-4 mb-4">
//           {dayNames.map((day) => (
//             <div key={day} className="text-center font-bold text-purple-600 text-sm">
//               {day}
//             </div>
//           ))}
//         </div>

//         {/* Week Days */}
//         <div className="grid grid-cols-7 gap-4 mb-4">
//           {weekDays.map((day, idx) => {
//             const isToday = isSameDay(day, today);
//             const isSelected = isSameDay(day, selectedDate);
//             const dayTasks = weekTasks[day.toDateString()] || [];
//             const taskCount = dayTasks.length;
            
//             return (
//               <div
//                 key={idx}
//                 onClick={() => setSelectedDate(day)}
//                 className={`
//                   rounded-2xl p-4 cursor-pointer transition-all border-2 min-h-[90px] flex flex-col items-center justify-center
//                   ${isSelected ? 'border-pink-400 bg-pink-100' : 'border-gray-200 bg-white hover:border-blue-300'}
//                   ${isToday && !isSelected ? 'border-red-400 bg-red-50' : ''}
//                 `}
//               >
//                 <p className={`text-2xl font-bold ${
//                   isSelected ? 'text-pink-600' : 
//                   isToday ? 'text-red-600' : 
//                   'text-gray-800'
//                 }`}>
//                   {day.getDate()}
//                 </p>
                
//                 {taskCount > 0 && (
//                   <p className={`text-xs font-semibold mt-2 px-2 py-1 rounded ${
//                     isSelected 
//                       ? 'text-pink-600' 
//                       : getTaskDotColor(dayTasks)
//                   }`}>
//                     {isSelected ? `TASK: ${taskCount}` : dayTasks[0].subject}
//                   </p>
//                 )}
//               </div>
//             );
//           })}
//         </div>

//         {/* Dropdown Icon */}
//         <div className="flex justify-end">
//           <button
//             onClick={() => navigate('/academic-planner/monthly-view')}
//             className="text-gray-600 hover:text-blue-600 transition-all"
//           >
//             <ChevronDown className="w-8 h-8" />
//           </button>
//         </div>
//       </div>

//       {/* Selected Date Badge */}
//       <div className="bg-pink-200 rounded-2xl px-6 py-3 inline-block mb-5">
//         <p className="font-bold text-pink-800">
//           {selectedDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/')}
//         </p>
//       </div>

//       {/* Tasks Section */}
//       <h3 className="text-2xl font-bold text-purple-700 mb-5">TASKS</h3>

//       <div className="space-y-4">
//         {tasks.length === 0 ? (
//           <div className="bg-white rounded-2xl p-6 text-center text-gray-500 shadow-sm">
//             No tasks for this date
//           </div>
//         ) : (
//           tasks.map((task) => (
//             <div
//               key={task._id}
//               className={`rounded-2xl p-6 flex justify-between items-center shadow-md border-2 ${getTaskCardColor(task.priority)}`}
//             >
//               <div className="flex-1">
//                 <div className="flex items-center gap-4 mb-2">
//                   <h4 className="text-xl font-bold text-gray-900">{task.subject}</h4>
//                   <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityBadge(task.priority)}`}>
//                     {task.priority}
//                   </span>
//                 </div>
//                 <p className="text-gray-700 mb-1">{task.task}</p>
//                 <p className="text-sm text-gray-600">
//                   {new Date(task.dueDate).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')}
//                 </p>
//               </div>
              
//               <button
//                 onClick={() => handleMarkComplete(task._id, task)}
//                 className={`px-6 py-3 rounded-xl font-semibold transition-all ${
//                   task.isCompleted 
//                     ? 'bg-green-600 text-white' 
//                     : 'bg-gray-800 text-white hover:bg-gray-900'
//                 }`}
//               >
//                 {task.isCompleted ? '✓ Completed' : 'Mark Completed'}
//               </button>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default WeeklyView;






































































// // src/features/academicPlanner/WeeklyView.jsx
// import { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { Calendar, ChevronDown } from 'lucide-react';
// import plannerService from '../../services/plannerService';

// const WeeklyView = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   const passedDate = location.state?.selectedDate ? new Date(location.state.selectedDate) : new Date();
//   const today = new Date();
//   const [selectedDate, setSelectedDate] = useState(passedDate);
//   const [tasks, setTasks] = useState([]);
//   const [weekTasks, setWeekTasks] = useState({});

//   useEffect(() => {
//     fetchTasksForDate(selectedDate);
//     fetchWeekTasks();
//   }, [selectedDate]);

//   useEffect(() => {
//     if (location.state?.selectedDate) {
//       const dateFromMonthly = new Date(location.state.selectedDate);
//       setSelectedDate(dateFromMonthly);
//       fetchTasksForDate(dateFromMonthly);
//     }
//   }, [location.state]);

//   const fetchTasksForDate = async (date) => {
//     try {
//       const dateStr = date.toISOString().split('T')[0];
//       const res = await plannerService.getTasksByDate(dateStr);
//       setTasks(res.data.tasks || []);
//     } catch (error) {
//       console.error('Fetch error:', error);
//       setTasks([]);
//     }
//   };

//   const fetchWeekTasks = async () => {
//     try {
//       const week = getWeekDays();
//       const startDate = week[0].toISOString().split('T')[0];
//       const endDate = week[6].toISOString().split('T')[0];
//       const res = await plannerService.getTasksByRange(startDate, endDate);
      
//       const tasksByDate = {};
//       (res.data.tasks || []).forEach(task => {
//         const date = new Date(task.dueDate).toDateString();
//         if (!tasksByDate[date]) tasksByDate[date] = [];
//         tasksByDate[date].push(task);
//       });
//       setWeekTasks(tasksByDate);
//     } catch (error) {
//       console.error('Week tasks error:', error);
//     }
//   };

//   const handleMarkComplete = async (taskId, task) => {
//     try {
//       await plannerService.markComplete(taskId, task);
//       fetchTasksForDate(selectedDate);
//       fetchWeekTasks();
//     } catch (error) {
//       console.error('Mark complete error:', error);
//     }
//   };

//   // ✅ FIXED: SUN-SAT week
//   const getWeekDays = () => {
//     const curr = new Date(selectedDate);
//     const week = [];
//     const day = curr.getDay(); // 0=Sunday, 6=Saturday
//     const diff = curr.getDate() - day; // Move to Sunday
//     curr.setDate(diff);
    
//     for (let i = 0; i < 7; i++) {
//       week.push(new Date(curr));
//       curr.setDate(curr.getDate() + 1);
//     }
//     return week;
//   };

//   const weekDays = getWeekDays();
//   const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']; // ✅ FIXED
//   const isSameDay = (d1, d2) => d1.toDateString() === d2.toDateString();

//   const getPriorityBadge = (priority) => {
//     if (priority === 'High') return 'bg-red-100 text-red-600';
//     if (priority === 'Medium') return 'bg-yellow-100 text-yellow-600';
//     return 'bg-green-100 text-green-600';
//   };

//   const getTaskCardColor = (priority) => {
//     if (priority === 'High') return 'bg-pink-50 border-pink-300';
//     if (priority === 'Medium') return 'bg-pink-50 border-pink-300';
//     return 'bg-pink-50 border-pink-300';
//   };

//   const getTaskDotColor = (tasks) => {
//     if (!tasks || tasks.length === 0) return '';
//     const highPriority = tasks.some(t => t.priority === 'High');
//     if (highPriority) return 'text-red-500 bg-red-50';
//     const mediumPriority = tasks.some(t => t.priority === 'Medium');
//     if (mediumPriority) return 'text-yellow-600 bg-yellow-50';
//     return 'text-green-600 bg-green-50';
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

//       {/* Weekly Calendar */}
//       <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
//         {/* Day Names */}
//         <div className="grid grid-cols-7 gap-4 mb-4">
//           {dayNames.map((day) => (
//             <div key={day} className="text-center font-bold text-purple-600 text-sm">
//               {day}
//             </div>
//           ))}
//         </div>

//         {/* Week Days */}
//         <div className="grid grid-cols-7 gap-4 mb-4">
//           {weekDays.map((day, idx) => {
//             const isToday = isSameDay(day, today);
//             const isSelected = isSameDay(day, selectedDate);
//             const dayTasks = weekTasks[day.toDateString()] || [];
//             const taskCount = dayTasks.length;
            
//             return (
//               <div
//                 key={idx}
//                 onClick={() => setSelectedDate(day)}
//                 className={`
//                   rounded-2xl p-4 cursor-pointer transition-all border-2 min-h-[90px] flex flex-col items-center justify-center
//                   ${isSelected ? 'border-pink-400 bg-pink-100' : 'border-gray-200 bg-white hover:border-blue-300'}
//                   ${isToday && !isSelected ? 'border-red-400 bg-red-50' : ''}
//                 `}
//               >
//                 <p className={`text-2xl font-bold ${
//                   isSelected ? 'text-pink-600' : 
//                   isToday ? 'text-red-600' : 
//                   'text-gray-800'
//                 }`}>
//                   {day.getDate()}
//                 </p>
                
//                 {taskCount > 0 && (
//                   <p className={`text-xs font-semibold mt-2 px-2 py-1 rounded ${
//                     isSelected 
//                       ? 'text-pink-600' 
//                       : getTaskDotColor(dayTasks)
//                   }`}>
//                     {isSelected ? `TASK: ${taskCount}` : dayTasks[0].subject}
//                   </p>
//                 )}
//               </div>
//             );
//           })}
//         </div>

//         {/* Dropdown Icon */}
//         <div className="flex justify-end">
//           <button
//             onClick={() => navigate('/academic-planner/monthly-view')}
//             className="text-gray-600 hover:text-blue-600 transition-all"
//           >
//             <ChevronDown className="w-8 h-8" />
//           </button>
//         </div>
//       </div>

//       {/* Selected Date Badge */}
//       <div className="bg-pink-200 rounded-2xl px-6 py-3 inline-block mb-5">
//         <p className="font-bold text-pink-800">
//           {selectedDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/')}
//         </p>
//       </div>

//       {/* Tasks Section */}
//       <h3 className="text-2xl font-bold text-purple-700 mb-5">TASKS</h3>

//       <div className="space-y-4">
//         {tasks.length === 0 ? (
//           <div className="bg-white rounded-2xl p-6 text-center text-gray-500 shadow-sm">
//             No tasks for this date
//           </div>
//         ) : (
//           tasks.map((task) => (
//             <div
//               key={task._id}
//               className={`rounded-2xl p-6 flex justify-between items-center shadow-md border-2 ${getTaskCardColor(task.priority)}`}
//             >
//               <div className="flex-1">
//                 <div className="flex items-center gap-4 mb-2">
//                   <h4 className="text-xl font-bold text-gray-900">{task.subject}</h4>
//                   <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityBadge(task.priority)}`}>
//                     {task.priority}
//                   </span>
//                 </div>
//                 <p className="text-gray-700 mb-1">{task.task}</p>
//                 <p className="text-sm text-gray-600">
//                   {new Date(task.dueDate).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')}
//                 </p>
//               </div>
              
//               <button
//                 onClick={() => handleMarkComplete(task._id, task)}
//                 className={`px-6 py-3 rounded-xl font-semibold transition-all ${
//                   task.isCompleted 
//                     ? 'bg-green-600 text-white' 
//                     : 'bg-gray-800 text-white hover:bg-gray-900'
//                 }`}
//               >
//                 {task.isCompleted ? '✓ Completed' : 'Mark Completed'}
//               </button>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default WeeklyView;






































// src/features/academicPlanner/WeeklyView.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, ChevronDown } from 'lucide-react';
import plannerService from '../../services/plannerService';

const WeeklyView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const passedDate = location.state?.selectedDate ? new Date(location.state.selectedDate) : new Date();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(passedDate);
  const [tasks, setTasks] = useState([]);
  const [weekTasks, setWeekTasks] = useState({});

  useEffect(() => {
    fetchTasksForDate(selectedDate);
    fetchWeekTasks();
  }, [selectedDate]);

  useEffect(() => {
    if (location.state?.selectedDate) {
      const dateFromMonthly = new Date(location.state.selectedDate);
      setSelectedDate(dateFromMonthly);
      fetchTasksForDate(dateFromMonthly);
    }
  }, [location.state]);

  const fetchTasksForDate = async (date) => {
    try {
      const dateStr = date.toISOString().split('T')[0];
      const res = await plannerService.getTasksByDate(dateStr);
      
      // Handle multiple response formats
      const taskData = res.data?.tasks || res.tasks || res.data || [];
      setTasks(taskData);
    } catch (error) {
      console.error('Fetch error:', error);
      setTasks([]);
    }
  };

  const fetchWeekTasks = async () => {
    try {
      const week = getWeekDays();
      const startDate = week[0].toISOString().split('T')[0];
      const endDate = week[6].toISOString().split('T')[0];
      const res = await plannerService.getTasksByRange(startDate, endDate);
      
      // Handle multiple response formats
      const allTasks = res.data?.tasks || res.tasks || res.data || [];
      
      const tasksByDate = {};
      allTasks.forEach(task => {
        const date = new Date(task.dueDate).toDateString();
        if (!tasksByDate[date]) tasksByDate[date] = [];
        tasksByDate[date].push(task);
      });
      setWeekTasks(tasksByDate);
    } catch (error) {
      console.error('Week tasks error:', error);
    }
  };

  const handleMarkComplete = async (taskId, task) => {
    try {
      await plannerService.markComplete(taskId, task);
      fetchTasksForDate(selectedDate);
      fetchWeekTasks();
    } catch (error) {
      console.error('Mark complete error:', error);
    }
  };

  // SUN-SAT week
  const getWeekDays = () => {
    const curr = new Date(selectedDate);
    const week = [];
    const day = curr.getDay();
    const diff = curr.getDate() - day;
    curr.setDate(diff);
    
    for (let i = 0; i < 7; i++) {
      week.push(new Date(curr));
      curr.setDate(curr.getDate() + 1);
    }
    return week;
  };

  const weekDays = getWeekDays();
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const isSameDay = (d1, d2) => d1.toDateString() === d2.toDateString();

  const getPriorityBadge = (priority) => {
    if (priority === 'High') return 'bg-red-100 text-red-600';
    if (priority === 'Medium') return 'bg-yellow-100 text-yellow-600';
    return 'bg-green-100 text-green-600';
  };

  const getTaskCardColor = (priority) => {
    if (priority === 'High') return 'bg-pink-50 border-pink-300';
    if (priority === 'Medium') return 'bg-pink-50 border-pink-300';
    return 'bg-pink-50 border-pink-300';
  };

  const getTaskDotColor = (tasks) => {
    if (!tasks || tasks.length === 0) return '';
    const highPriority = tasks.some(t => t.priority === 'High');
    if (highPriority) return 'text-red-500 bg-red-50';
    const mediumPriority = tasks.some(t => t.priority === 'Medium');
    if (mediumPriority) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
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

      {/* Weekly Calendar */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
        {/* Day Names */}
        <div className="grid grid-cols-7 gap-4 mb-4">
          {dayNames.map((day) => (
            <div key={day} className="text-center font-bold text-purple-600 text-sm">
              {day}
            </div>
          ))}
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 gap-4 mb-4">
          {weekDays.map((day, idx) => {
            const isToday = isSameDay(day, today);
            const isSelected = isSameDay(day, selectedDate);
            const dayTasks = weekTasks[day.toDateString()] || [];
            const taskCount = dayTasks.length;
            
            return (
              <div
                key={idx}
                onClick={() => setSelectedDate(day)}
                className={`
                  rounded-2xl p-4 cursor-pointer transition-all border-2 min-h-[90px] flex flex-col items-center justify-center
                  ${isSelected ? 'border-pink-400 bg-pink-100' : 'border-gray-200 bg-white hover:border-blue-300'}
                  ${isToday && !isSelected ? 'border-red-400 bg-red-50' : ''}
                `}
              >
                <p className={`text-2xl font-bold ${
                  isSelected ? 'text-pink-600' : 
                  isToday ? 'text-red-600' : 
                  'text-gray-800'
                }`}>
                  {day.getDate()}
                </p>
                
                {taskCount > 0 && (
                  <p className={`text-xs font-semibold mt-2 px-2 py-1 rounded ${
                    isSelected 
                      ? 'text-pink-600' 
                      : getTaskDotColor(dayTasks)
                  }`}>
                    {isSelected ? `TASK: ${taskCount}` : dayTasks[0].subject}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Dropdown Icon */}
        <div className="flex justify-end">
          <button
            onClick={() => navigate('/academic-planner/monthly-view')}
            className="text-gray-600 hover:text-blue-600 transition-all"
          >
            <ChevronDown className="w-8 h-8" />
          </button>
        </div>
      </div>

      {/* Selected Date Badge */}
      <div className="bg-pink-200 rounded-2xl px-6 py-3 inline-block mb-5">
        <p className="font-bold text-pink-800">
          {selectedDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/')}
        </p>
      </div>

      {/* Tasks Section */}
      <h3 className="text-2xl font-bold text-purple-700 mb-5">TASKS</h3>

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center text-gray-500 shadow-sm">
            No tasks for this date
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className={`rounded-2xl p-6 flex justify-between items-center shadow-md border-2 ${getTaskCardColor(task.priority)}`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h4 className="text-xl font-bold text-gray-900">{task.subject}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityBadge(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                <p className="text-gray-700 mb-1">{task.task}</p>
                <p className="text-sm text-gray-600">
                  {new Date(task.dueDate).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')}
                </p>
              </div>
              
              <button
                onClick={() => handleMarkComplete(task._id, task)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  task.isCompleted 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-800 text-white hover:bg-gray-900'
                }`}
              >
                {task.isCompleted ? '✓ Completed' : 'Mark Completed'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WeeklyView;
