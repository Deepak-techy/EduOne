// // src/features/academicPlanner/WeeklyView.jsx
// import { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { Calendar, ChevronDown, Trash2, ChevronLeft, ChevronRight, Edit2, X, Check, AlertCircle } from 'lucide-react';
// import plannerService from '../../services/plannerService';

// // ✅ Toast Notification Component
// const Toast = ({ message, onClose }) => {
//   useEffect(() => {
//     const timer = setTimeout(onClose, 3000);
//     return () => clearTimeout(timer);
//   }, [onClose]);

//   return (
//     <div className="fixed top-24 right-8 z-50 animate-slide-in">
//       <div className="bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
//         <Check className="w-5 h-5" />
//         <p className="font-semibold">{message}</p>
//       </div>
//     </div>
//   );
// };

// // ✅ Delete Confirmation Modal - BLUR ONLY (No Black Overlay)
// const DeleteModal = ({ isOpen, onConfirm, onCancel }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       {/* ✅ FIXED: Blur background WITHOUT darkening */}
//       <div 
//         className="absolute inset-0 backdrop-blur-md"
//         onClick={onCancel}
//       ></div>
      
//       {/* Modal Card */}
//       <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 z-10 animate-scale-in">
//         <div className="flex flex-col items-center text-center">
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
//             <AlertCircle className="w-8 h-8 text-red-600" />
//           </div>
          
//           <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Task?</h3>
//           <p className="text-gray-600 mb-6">
//             Are you sure you want to delete this task? This action cannot be undone.
//           </p>
          
//           <div className="flex gap-3 w-full">
//             <button
//               onClick={onCancel}
//               className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-all"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={onConfirm}
//               className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all"
//             >
//               Delete
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ✅ TaskCard Component with Edit functionality
// const TaskCard = ({ task, onMarkComplete, onDelete, onUpdate }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedTask, setEditedTask] = useState({
//     subject: task.subject,
//     task: task.task,
//     dueDate: new Date(task.dueDate).toISOString().split('T')[0],
//     priority: task.priority
//   });

//   const getPriorityBadge = (priority) => {
//     if (priority === 'High') return 'bg-red-100 text-red-600';
//     if (priority === 'Medium') return 'bg-yellow-100 text-yellow-600';
//     return 'bg-green-100 text-green-600';
//   };

//   const getTaskCardColor = (priority) => {
//     if (priority === 'High') return 'bg-pink-50 border-pink-300';
//     if (priority === 'Medium') return 'bg-yellow-50 border-yellow-300';
//     return 'bg-green-50 border-green-300';
//   };

//   const handleSaveEdit = () => {
//     onUpdate(task._id, editedTask);
//     setIsEditing(false);
//   };

//   const handleCancelEdit = () => {
//     setEditedTask({
//       subject: task.subject,
//       task: task.task,
//       dueDate: new Date(task.dueDate).toISOString().split('T')[0],
//       priority: task.priority
//     });
//     setIsEditing(false);
//   };

//   // Edit Mode View
//   if (isEditing) {
//     return (
//       <div className="rounded-2xl p-6 shadow-md border-2 border-blue-400 bg-blue-50">
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
//             <input
//               type="text"
//               value={editedTask.subject}
//               onChange={(e) => setEditedTask({ ...editedTask, subject: e.target.value })}
//               className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-1">Task Description</label>
//             <textarea
//               value={editedTask.task}
//               onChange={(e) => setEditedTask({ ...editedTask, task: e.target.value })}
//               rows={3}
//               className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-1">Due Date</label>
//             <input
//               type="date"
//               value={editedTask.dueDate}
//               onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
//               className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
//             <select
//               value={editedTask.priority}
//               onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
//               className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
//             >
//               <option value="Low">Low</option>
//               <option value="Medium">Medium</option>
//               <option value="High">High</option>
//             </select>
//           </div>

//           <div className="flex gap-3">
//             <button
//               onClick={handleSaveEdit}
//               className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all flex items-center justify-center gap-2"
//             >
//               <Check className="w-5 h-5" />
//               Save Changes
//             </button>
//             <button
//               onClick={handleCancelEdit}
//               className="flex-1 px-6 py-3 bg-gray-400 text-white font-semibold rounded-xl hover:bg-gray-500 transition-all flex items-center justify-center gap-2"
//             >
//               <X className="w-5 h-5" />
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Normal View
//   return (
//     <div className={`rounded-2xl p-6 flex justify-between items-center shadow-md border-2 ${getTaskCardColor(task.priority)}`}>
//       <div className="flex-1">
//         <div className="flex items-center gap-4 mb-2">
//           <h4 className="text-xl font-bold text-gray-900">{task.subject}</h4>
//           <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityBadge(task.priority)}`}>
//             {task.priority}
//           </span>
//           {/* ✅ FIXED: Always show status badge */}
//           <span className={`px-3 py-1 rounded-full text-xs font-bold ${
//             task.isCompleted 
//               ? 'bg-green-100 text-green-600' 
//               : 'bg-orange-100 text-orange-600'
//           }`}>
//             {task.isCompleted ? '✓ Completed' : '⏳ Pending'}
//           </span>
//         </div>
//         <p className="text-gray-700 mb-1">{task.task}</p>
//         <p className="text-sm text-gray-600">
//           Due: {new Date(task.dueDate).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')}
//         </p>
//       </div>
      
//       <div className="flex items-center gap-3 ml-4">
//         {/* ✅ Edit Button */}
//         <button
//           onClick={() => setIsEditing(true)}
//           className="px-5 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2"
//         >
//           <Edit2 className="w-4 h-4" />
//           Edit
//         </button>

//         {/* ✅ Mark Complete/Uncomplete Button */}
//         <button
//           onClick={() => onMarkComplete(task._id, task.isCompleted)}
//           className={`px-5 py-3 rounded-xl font-semibold transition-all ${
//             task.isCompleted 
//               ? 'bg-orange-500 text-white hover:bg-orange-600' 
//               : 'bg-green-600 text-white hover:bg-green-700'
//           }`}
//         >
//           {task.isCompleted ? 'Mark Uncomplete' : 'Mark Completed'}
//         </button>

//         {/* ✅ Delete Button */}
//         <button
//           onClick={() => onDelete(task._id)}
//           className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
//           title="Delete task"
//         >
//           <Trash2 className="w-5 h-5" />
//         </button>
//       </div>
//     </div>
//   );
// };

// // ✅ Main WeeklyView Component
// const WeeklyView = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   const passedDate = location.state?.selectedDate ? new Date(location.state.selectedDate) : new Date();
//   const today = new Date();
//   const [selectedDate, setSelectedDate] = useState(passedDate);
//   const [tasks, setTasks] = useState([]);
//   const [weekTasks, setWeekTasks] = useState({});
//   const [loading, setLoading] = useState(false);
  
//   // ✅ Delete Modal State
//   const [deleteModal, setDeleteModal] = useState({ isOpen: false, taskId: null });
  
//   // ✅ Toast State
//   const [toast, setToast] = useState({ show: false, message: '' });

//   useEffect(() => {
//     fetchTasksForDate(selectedDate);
//     fetchWeekTasks();
//   }, [selectedDate]);

//   useEffect(() => {
//     if (location.state?.selectedDate) {
//       const dateFromMonthly = new Date(location.state.selectedDate);
//       setSelectedDate(dateFromMonthly);
//     }
//   }, [location.state]);

//   // ✅ Convert Date to YYYY-MM-DD format
//   const formatDateForAPI = (date) => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   };

//   const fetchTasksForDate = async (date) => {
//     try {
//       setLoading(true);
//       const dateStr = formatDateForAPI(date);
      
//       console.log('🔍 Fetching tasks for:', dateStr);
      
//       const res = await plannerService.getTasksByDate(dateStr);
      
//       const taskData = res.data?.tasks || res.tasks || res.data || [];
//       console.log('✅ Tasks received:', taskData.length, taskData);
      
//       setTasks(taskData);
//     } catch (error) {
//       console.error('❌ Fetch error:', error);
//       setTasks([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchWeekTasks = async () => {
//     try {
//       const week = getWeekDays();
//       const startDate = formatDateForAPI(week[0]);
//       const endDate = formatDateForAPI(week[6]);
      
//       console.log('📅 Fetching week range:', startDate, 'to', endDate);
      
//       const res = await plannerService.getTasksByRange(startDate, endDate);
      
//       const allTasks = res.data?.tasks || res.tasks || res.data || [];
//       console.log('✅ Week tasks received:', allTasks.length);
      
//       // ✅ Group tasks by YYYY-MM-DD format
//       const tasksByDate = {};
//       allTasks.forEach(task => {
//         const taskDate = new Date(task.dueDate);
//         const dateKey = formatDateForAPI(taskDate);
//         if (!tasksByDate[dateKey]) tasksByDate[dateKey] = [];
//         tasksByDate[dateKey].push(task);
//       });
      
//       console.log('📊 Tasks grouped:', tasksByDate);
      
//       setWeekTasks(tasksByDate);
//     } catch (error) {
//       console.error('❌ Week tasks error:', error);
//     }
//   };

//   // ✅ FIXED: Mark Complete/Uncomplete with Toast
//   const handleMarkComplete = async (taskId, currentStatus) => {
//     try {
//       await plannerService.markComplete(taskId, currentStatus);
      
//       // ✅ Refresh data
//       await fetchTasksForDate(selectedDate);
//       await fetchWeekTasks();
      
//       // ✅ Show toast based on action
//       if (currentStatus) {
//         // Was completed, now marking as uncomplete
//         setToast({ show: true, message: 'Task marked as pending!' });
//       } else {
//         // Was pending, now marking as complete
//         setToast({ show: true, message: 'Task marked as completed!' });
//       }
//     } catch (error) {
//       console.error('Mark complete error:', error);
//       setToast({ show: true, message: 'Failed to update task status' });
//     }
//   };

//   // ✅ Delete Task with Modal
//   const handleDelete = (taskId) => {
//     setDeleteModal({ isOpen: true, taskId });
//   };

//   const confirmDelete = async () => {
//     try {
//       await plannerService.deleteTask(deleteModal.taskId);
//       setDeleteModal({ isOpen: false, taskId: null });
//       await fetchTasksForDate(selectedDate);
//       await fetchWeekTasks();
      
//       // ✅ Show success toast
//       setToast({ show: true, message: 'Task deleted successfully!' });
//     } catch (error) {
//       console.error('Delete error:', error);
//       setToast({ show: true, message: 'Failed to delete task' });
//     }
//   };

//   const cancelDelete = () => {
//     setDeleteModal({ isOpen: false, taskId: null });
//   };

//   // ✅ Update Task
//   const handleUpdateTask = async (taskId, updates) => {
//     try {
//       await plannerService.updateTask(taskId, updates);
//       await fetchTasksForDate(selectedDate);
//       await fetchWeekTasks();
      
//       // ✅ Show toast
//       setToast({ show: true, message: 'Task updated successfully!' });
//     } catch (error) {
//       console.error('Update task error:', error);
//       setToast({ show: true, message: 'Failed to update task' });
//     }
//   };

//   const getWeekDays = () => {
//     const curr = new Date(selectedDate);
//     const week = [];
//     const day = curr.getDay();
//     const diff = curr.getDate() - day;
//     curr.setDate(diff);
    
//     for (let i = 0; i < 7; i++) {
//       week.push(new Date(curr));
//       curr.setDate(curr.getDate() + 1);
//     }
//     return week;
//   };

//   const weekDays = getWeekDays();
//   const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
//   const isSameDay = (d1, d2) => {
//     return formatDateForAPI(d1) === formatDateForAPI(d2);
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
//       {/* ✅ Toast Notification */}
//       {toast.show && (
//         <Toast 
//           message={toast.message} 
//           onClose={() => setToast({ show: false, message: '' })} 
//         />
//       )}

//       {/* ✅ Delete Modal */}
//       <DeleteModal 
//         isOpen={deleteModal.isOpen}
//         onConfirm={confirmDelete}
//         onCancel={cancelDelete}
//       />

//       <div className="flex items-center justify-between mb-8">
//         <div className="flex items-center gap-3">
//           <div className="bg-white p-2 rounded-lg shadow-sm">
//             <Calendar className="w-6 h-6 text-red-500" />
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900">Academic planner</h1>
//         </div>

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

//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-blue-900">Tasks in Calendar View</h2>
//         <p className="text-red-600 font-semibold text-lg">
//           {today.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/')}
//         </p>
//       </div>

//       {/* Weekly Calendar */}
//       <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
//         <div className="flex items-center justify-between mb-4">
//           <button
//             onClick={() => {
//               const newDate = new Date(selectedDate);
//               newDate.setDate(newDate.getDate() - 7);
//               setSelectedDate(newDate);
//             }}
//             className="p-2 hover:bg-gray-100 rounded-lg transition-all"
//             title="Previous week"
//           >
//             <ChevronLeft className="w-5 h-5 text-gray-600" />
//           </button>
          
//           <h3 className="text-lg font-bold text-gray-900">
//             {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
//           </h3>
          
//           <button
//             onClick={() => {
//               const newDate = new Date(selectedDate);
//               newDate.setDate(newDate.getDate() + 7);
//               setSelectedDate(newDate);
//             }}
//             className="p-2 hover:bg-gray-100 rounded-lg transition-all"
//             title="Next week"
//           >
//             <ChevronRight className="w-5 h-5 text-gray-600" />
//           </button>
//         </div>

//         <div className="grid grid-cols-7 gap-2 mb-3">
//           {dayNames.map((day) => (
//             <div key={day} className="text-center font-semibold text-purple-600 text-xs">
//               {day}
//             </div>
//           ))}
//         </div>

//         <div className="grid grid-cols-7 gap-2 mb-3">
//           {weekDays.map((day, idx) => {
//             const isToday = isSameDay(day, today);
//             const isSelected = isSameDay(day, selectedDate);
//             const dayKey = formatDateForAPI(day);
//             const dayTasks = weekTasks[dayKey] || [];
//             const taskCount = dayTasks.length;
            
//             return (
//               <div
//                 key={idx}
//                 onClick={() => setSelectedDate(day)}
//                 className={`
//                   rounded-xl p-2 cursor-pointer transition-all border-2 min-h-[65px] flex flex-col items-center justify-center
//                   ${isSelected ? 'border-pink-400 bg-pink-100' : 'border-gray-200 bg-white hover:border-blue-300'}
//                   ${isToday && !isSelected ? 'border-red-400 bg-red-50' : ''}
//                 `}
//               >
//                 <p className={`text-lg font-bold ${
//                   isSelected ? 'text-pink-600' : 
//                   isToday ? 'text-red-600' : 
//                   'text-gray-800'
//                 }`}>
//                   {day.getDate()}
//                 </p>
                
//                 {taskCount > 0 && (
//                   <p className={`text-[10px] font-semibold mt-1 px-1.5 py-0.5 rounded ${
//                     isSelected 
//                       ? 'text-pink-600' 
//                       : getTaskDotColor(dayTasks)
//                   }`}>
//                     {taskCount}
//                   </p>
//                 )}
//               </div>
//             );
//           })}
//         </div>

//         <div className="flex justify-end">
//           <button
//             onClick={() => navigate('/academic-planner/monthly-view')}
//             className="text-gray-600 hover:text-blue-600 transition-all"
//           >
//             <ChevronDown className="w-6 h-6" />
//           </button>
//         </div>
//       </div>

//       <div className="bg-pink-200 rounded-2xl px-6 py-3 inline-block mb-5">
//         <p className="font-bold text-pink-800">
//           {selectedDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/')}
//         </p>
//       </div>

//       <h3 className="text-2xl font-bold text-purple-700 mb-5">TASKS</h3>

//       {/* ✅ Task Cards with Edit functionality */}
//       <div className="space-y-4">
//         {loading ? (
//           <div className="bg-white rounded-2xl p-6 text-center text-gray-500 shadow-sm">
//             Loading tasks...
//           </div>
//         ) : tasks.length === 0 ? (
//           <div className="bg-white rounded-2xl p-6 text-center text-gray-500 shadow-sm">
//             No tasks for this date
//           </div>
//         ) : (
//           tasks.map((task) => (
//             <TaskCard
//               key={task._id}
//               task={task}
//               onMarkComplete={handleMarkComplete}
//               onDelete={handleDelete}
//               onUpdate={handleUpdateTask}
//             />
//           ))
//         )}
//       </div>

//       {/* ✅ CSS Animations */}
//       <style>{`
//         @keyframes slide-in {
//           from {
//             transform: translateX(100%);
//             opacity: 0;
//           }
//           to {
//             transform: translateX(0);
//             opacity: 1;
//           }
//         }

//         @keyframes scale-in {
//           from {
//             transform: scale(0.9);
//             opacity: 0;
//           }
//           to {
//             transform: scale(1);
//             opacity: 1;
//           }
//         }

//         .animate-slide-in {
//           animation: slide-in 0.3s ease-out;
//         }

//         .animate-scale-in {
//           animation: scale-in 0.2s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default WeeklyView;
















































// src/features/academicPlanner/WeeklyView.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, ChevronDown, Trash2, ChevronLeft, ChevronRight, Edit2, X, Check, AlertCircle } from 'lucide-react';
import plannerService from '../../services/plannerService';


// ✅ Toast Notification Component
const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);


  return (
    <div className="fixed top-24 right-8 z-50 animate-slide-in">
      <div className="bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
        <Check className="w-5 h-5" />
        <p className="font-semibold">{message}</p>
      </div>
    </div>
  );
};


// ✅ Delete Confirmation Modal - BLUR ONLY (No Black Overlay)
const DeleteModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* ✅ FIXED: Blur background WITHOUT darkening */}
      <div 
        className="absolute inset-0 backdrop-blur-md"
        onClick={onCancel}
      ></div>
      
      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 z-10 animate-scale-in">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Task?</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this task? This action cannot be undone.
          </p>
          
          <div className="flex gap-3 w-full">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


// ✅ TaskCard Component with Edit functionality
const TaskCard = ({ task, onMarkComplete, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({
    subject: task.subject,
    task: task.task,
    dueDate: new Date(task.dueDate).toISOString().split('T')[0],
    priority: task.priority
  });


  const getPriorityBadge = (priority) => {
    if (priority === 'High') return 'bg-red-100 text-red-600';
    if (priority === 'Medium') return 'bg-yellow-100 text-yellow-600';
    return 'bg-green-100 text-green-600';
  };


  const getTaskCardColor = (priority) => {
    if (priority === 'High') return 'bg-pink-50 border-pink-300';
    if (priority === 'Medium') return 'bg-yellow-50 border-yellow-300';
    return 'bg-green-50 border-green-300';
  };


  const handleSaveEdit = () => {
    onUpdate(task._id, editedTask);
    setIsEditing(false);
  };


  const handleCancelEdit = () => {
    setEditedTask({
      subject: task.subject,
      task: task.task,
      dueDate: new Date(task.dueDate).toISOString().split('T')[0],
      priority: task.priority
    });
    setIsEditing(false);
  };


  // Edit Mode View
  if (isEditing) {
    return (
      <div className="rounded-2xl p-6 shadow-md border-2 border-blue-400 bg-blue-50">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              value={editedTask.subject}
              onChange={(e) => setEditedTask({ ...editedTask, subject: e.target.value })}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>


          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Task Description</label>
            <textarea
              value={editedTask.task}
              onChange={(e) => setEditedTask({ ...editedTask, task: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>


          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              value={editedTask.dueDate}
              onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>


          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
            <select
              value={editedTask.priority}
              onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>


          <div className="flex gap-3">
            <button
              onClick={handleSaveEdit}
              className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Save Changes
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex-1 px-6 py-3 bg-gray-400 text-white font-semibold rounded-xl hover:bg-gray-500 transition-all flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }


  // Normal View
  return (
    <div className={`rounded-2xl p-6 flex justify-between items-center shadow-md border-2 ${getTaskCardColor(task.priority)}`}>
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-2">
          <h4 className="text-xl font-bold text-gray-900">{task.subject}</h4>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityBadge(task.priority)}`}>
            {task.priority}
          </span>
          {/* ✅ FIXED: Always show status badge */}
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            task.isCompleted 
              ? 'bg-green-100 text-green-600' 
              : 'bg-orange-100 text-orange-600'
          }`}>
            {task.isCompleted ? '✓ Completed' : '⏳ Pending'}
          </span>
        </div>
        <p className="text-gray-700 mb-1">{task.task}</p>
        <p className="text-sm text-gray-600">
          Due: {new Date(task.dueDate).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')}
        </p>
      </div>
      
      <div className="flex items-center gap-3 ml-4">
        {/* ✅ Edit Button */}
        <button
          onClick={() => setIsEditing(true)}
          className="px-5 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <Edit2 className="w-4 h-4" />
          Edit
        </button>


        {/* ✅ Mark Complete/Uncomplete Button */}
        <button
          onClick={() => onMarkComplete(task._id, task.isCompleted)}
          className={`px-5 py-3 rounded-xl font-semibold transition-all ${
            task.isCompleted 
              ? 'bg-orange-500 text-white hover:bg-orange-600' 
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {task.isCompleted ? 'Mark Uncomplete' : 'Mark Completed'}
        </button>


        {/* ✅ Delete Button */}
        <button
          onClick={() => onDelete(task._id)}
          className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
          title="Delete task"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};


// ✅ Main WeeklyView Component
const WeeklyView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const passedDate = location.state?.selectedDate ? new Date(location.state.selectedDate) : new Date();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(passedDate);
  const [tasks, setTasks] = useState([]);
  const [weekTasks, setWeekTasks] = useState({});
  const [loading, setLoading] = useState(false);
  
  // ✅ Delete Modal State
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, taskId: null });
  
  // ✅ Toast State
  const [toast, setToast] = useState({ show: false, message: '' });


  useEffect(() => {
    fetchTasksForDate(selectedDate);
    fetchWeekTasks();
  }, [selectedDate]);


  useEffect(() => {
    if (location.state?.selectedDate) {
      const dateFromMonthly = new Date(location.state.selectedDate);
      setSelectedDate(dateFromMonthly);
    }
  }, [location.state]);


  // ✅ Convert Date to YYYY-MM-DD format
  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  const fetchTasksForDate = async (date) => {
    try {
      setLoading(true);
      const dateStr = formatDateForAPI(date);
      
      console.log('🔍 Fetching tasks for:', dateStr);
      
      const res = await plannerService.getTasksByDate(dateStr);
      
      const taskData = res.data?.tasks || res.tasks || res.data || [];
      console.log('✅ Tasks received:', taskData.length, taskData);
      
      setTasks(taskData);
    } catch (error) {
      console.error('❌ Fetch error:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };


  const fetchWeekTasks = async () => {
    try {
      const week = getWeekDays();
      const startDate = formatDateForAPI(week[0]);
      const endDate = formatDateForAPI(week[6]);
      
      console.log('📅 Fetching week range:', startDate, 'to', endDate);
      
      const res = await plannerService.getTasksByRange(startDate, endDate);
      
      const allTasks = res.data?.tasks || res.tasks || res.data || [];
      console.log('✅ Week tasks received:', allTasks.length);
      
      // ✅ Group tasks by YYYY-MM-DD format
      const tasksByDate = {};
      allTasks.forEach(task => {
        const taskDate = new Date(task.dueDate);
        const dateKey = formatDateForAPI(taskDate);
        if (!tasksByDate[dateKey]) tasksByDate[dateKey] = [];
        tasksByDate[dateKey].push(task);
      });
      
      console.log('📊 Tasks grouped:', tasksByDate);
      
      setWeekTasks(tasksByDate);
    } catch (error) {
      console.error('❌ Week tasks error:', error);
    }
  };


  // ✅ ONLY CHANGE: Mark Complete/Uncomplete with separate endpoints

  const handleMarkComplete = async (taskId, currentStatus) => {
  try {
    if (currentStatus) {
      // Task is completed, mark as uncomplete
      await plannerService.markUncomplete(taskId);
      setToast({ show: true, message: 'Task marked as pending!' });
    } else {
      // Task is pending, mark as complete
      await plannerService.markComplete(taskId);  // ✅ REMOVED currentStatus
      setToast({ show: true, message: 'Task marked as completed!' });
    }
    
    // ✅ Refresh data
    await fetchTasksForDate(selectedDate);
    await fetchWeekTasks();
  } catch (error) {
    console.error('Mark complete/uncomplete error:', error);
    setToast({ show: true, message: 'Failed to update task status' });
  }
};

  // ✅ Delete Task with Modal
  const handleDelete = (taskId) => {
    setDeleteModal({ isOpen: true, taskId });
  };


  const confirmDelete = async () => {
    try {
      await plannerService.deleteTask(deleteModal.taskId);
      setDeleteModal({ isOpen: false, taskId: null });
      await fetchTasksForDate(selectedDate);
      await fetchWeekTasks();
      
      // ✅ Show success toast
      setToast({ show: true, message: 'Task deleted successfully!' });
    } catch (error) {
      console.error('Delete error:', error);
      setToast({ show: true, message: 'Failed to delete task' });
    }
  };


  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, taskId: null });
  };


  // ✅ Update Task
  const handleUpdateTask = async (taskId, updates) => {
    try {
      await plannerService.updateTask(taskId, updates);
      await fetchTasksForDate(selectedDate);
      await fetchWeekTasks();
      
      // ✅ Show toast
      setToast({ show: true, message: 'Task updated successfully!' });
    } catch (error) {
      console.error('Update task error:', error);
      setToast({ show: true, message: 'Failed to update task' });
    }
  };


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
  
  const isSameDay = (d1, d2) => {
    return formatDateForAPI(d1) === formatDateForAPI(d2);
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
      {/* ✅ Toast Notification */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          onClose={() => setToast({ show: false, message: '' })} 
        />
      )}


      {/* ✅ Delete Modal */}
      <DeleteModal 
        isOpen={deleteModal.isOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />


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


      {/* Weekly Calendar */}
      <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setDate(newDate.getDate() - 7);
              setSelectedDate(newDate);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            title="Previous week"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <h3 className="text-lg font-bold text-gray-900">
            {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </h3>
          
          <button
            onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setDate(newDate.getDate() + 7);
              setSelectedDate(newDate);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            title="Next week"
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


        <div className="grid grid-cols-7 gap-2 mb-3">
          {weekDays.map((day, idx) => {
            const isToday = isSameDay(day, today);
            const isSelected = isSameDay(day, selectedDate);
            const dayKey = formatDateForAPI(day);
            const dayTasks = weekTasks[dayKey] || [];
            const taskCount = dayTasks.length;
            
            return (
              <div
                key={idx}
                onClick={() => setSelectedDate(day)}
                className={`
                  rounded-xl p-2 cursor-pointer transition-all border-2 min-h-[65px] flex flex-col items-center justify-center
                  ${isSelected ? 'border-pink-400 bg-pink-100' : 'border-gray-200 bg-white hover:border-blue-300'}
                  ${isToday && !isSelected ? 'border-red-400 bg-red-50' : ''}
                `}
              >
                <p className={`text-lg font-bold ${
                  isSelected ? 'text-pink-600' : 
                  isToday ? 'text-red-600' : 
                  'text-gray-800'
                }`}>
                  {day.getDate()}
                </p>
                
                {taskCount > 0 && (
                  <p className={`text-[10px] font-semibold mt-1 px-1.5 py-0.5 rounded ${
                    isSelected 
                      ? 'text-pink-600' 
                      : getTaskDotColor(dayTasks)
                  }`}>
                    {taskCount}
                  </p>
                )}
              </div>
            );
          })}
        </div>


        <div className="flex justify-end">
          <button
            onClick={() => navigate('/academic-planner/monthly-view')}
            className="text-gray-600 hover:text-blue-600 transition-all"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>
      </div>


      <div className="bg-pink-200 rounded-2xl px-6 py-3 inline-block mb-5">
        <p className="font-bold text-pink-800">
          {selectedDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/')}
        </p>
      </div>


      <h3 className="text-2xl font-bold text-purple-700 mb-5">TASKS</h3>


      {/* ✅ Task Cards with Edit functionality */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-2xl p-6 text-center text-gray-500 shadow-sm">
            Loading tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center text-gray-500 shadow-sm">
            No tasks for this date
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onMarkComplete={handleMarkComplete}
              onDelete={handleDelete}
              onUpdate={handleUpdateTask}
            />
          ))
        )}
      </div>


      {/* ✅ CSS Animations */}
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }


        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }


        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }


        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};


export default WeeklyView;
