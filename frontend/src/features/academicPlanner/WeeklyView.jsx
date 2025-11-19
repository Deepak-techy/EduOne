// // src/features/academicPlanner/WeeklyView.jsx
// import { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { Calendar, ChevronDown, Trash2, ChevronLeft, ChevronRight, Edit2, X, Check, AlertCircle } from 'lucide-react';
// import plannerService from '../../services/plannerService';

// // =====================================================
// // TOAST NOTIFICATION COMPONENT
// // =====================================================
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

// // =====================================================
// // DELETE CONFIRMATION MODAL
// // =====================================================
// const DeleteModal = ({ isOpen, onConfirm, onCancel }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       {/* Blur Backdrop */}
//       <div 
//         className="absolute inset-0 backdrop-blur-md cursor-pointer"
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
//               className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-all cursor-pointer transform hover:scale-105"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={onConfirm}
//               className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all cursor-pointer transform hover:scale-105"
//             >
//               Delete
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // =====================================================
// // TASK CARD COMPONENT
// // =====================================================
// const TaskCard = ({ task, onMarkComplete, onDelete, onUpdate }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedTask, setEditedTask] = useState({
//     subject: task.subject,
//     task: task.task,
//     dueDate: new Date(task.dueDate).toISOString().split('T')[0],
//     priority: task.priority
//   });

//   // Get priority badge color
//   const getPriorityBadge = (priority) => {
//     if (priority === 'High') return 'bg-red-100 text-red-600';
//     if (priority === 'Medium') return 'bg-yellow-100 text-yellow-600';
//     return 'bg-green-100 text-green-600';
//   };

//   // Get task card background color
//   const getTaskCardColor = (priority) => {
//     if (priority === 'High') return 'bg-pink-50 border-pink-300';
//     if (priority === 'Medium') return 'bg-yellow-50 border-yellow-300';
//     return 'bg-green-50 border-green-300';
//   };

//   // Save edited task
//   const handleSaveEdit = () => {
//     onUpdate(task._id, editedTask);
//     setIsEditing(false);
//   };

//   // Cancel editing
//   const handleCancelEdit = () => {
//     setEditedTask({
//       subject: task.subject,
//       task: task.task,
//       dueDate: new Date(task.dueDate).toISOString().split('T')[0],
//       priority: task.priority
//     });
//     setIsEditing(false);
//   };

//   // ========== EDIT MODE VIEW ==========
//   if (isEditing) {
//     return (
//       <div className="rounded-2xl p-6 shadow-md border-2 border-blue-400 bg-blue-50 animate-scale-in">
//         <div className="space-y-4">
//           {/* Subject Input */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
//             <input
//               type="text"
//               value={editedTask.subject}
//               onChange={(e) => setEditedTask({ ...editedTask, subject: e.target.value })}
//               className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-all"
//             />
//           </div>

//           {/* Task Description */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-1">Task Description</label>
//             <textarea
//               value={editedTask.task}
//               onChange={(e) => setEditedTask({ ...editedTask, task: e.target.value })}
//               rows={3}
//               className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-all"
//             />
//           </div>

//           {/* Due Date */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-1">Due Date</label>
//             <input
//               type="date"
//               value={editedTask.dueDate}
//               onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
//               className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none cursor-pointer transition-all"
//             />
//           </div>

//           {/* Priority */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
//             <select
//               value={editedTask.priority}
//               onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
//               className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none cursor-pointer transition-all"
//             >
//               <option value="Low">Low</option>
//               <option value="Medium">Medium</option>
//               <option value="High">High</option>
//             </select>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-3">
//             <button
//               onClick={handleSaveEdit}
//               className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:scale-105"
//             >
//               <Check className="w-5 h-5" />
//               Save Changes
//             </button>
//             <button
//               onClick={handleCancelEdit}
//               className="flex-1 px-6 py-3 bg-gray-400 text-white font-semibold rounded-xl hover:bg-gray-500 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:scale-105"
//             >
//               <X className="w-5 h-5" />
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ========== NORMAL VIEW ==========
//   return (
//     <div className={`rounded-2xl p-6 flex justify-between items-center shadow-md border-2 ${getTaskCardColor(task.priority)} transform transition-all duration-200 hover:scale-102 hover:shadow-lg`}>
//       {/* Task Info */}
//       <div className="flex-1">
//         <div className="flex items-center gap-4 mb-2">
//           <h4 className="text-xl font-bold text-gray-900">{task.subject}</h4>
          
//           {/* Priority Badge */}
//           <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityBadge(task.priority)}`}>
//             {task.priority}
//           </span>
          
//           {/* Status Badge */}
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
      
//       {/* Action Buttons */}
//       <div className="flex items-center gap-3 ml-4">
//         {/* Edit Button */}
//         <button
//           onClick={() => setIsEditing(true)}
//           className="px-5 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 cursor-pointer transform hover:scale-105"
//         >
//           <Edit2 className="w-4 h-4" />
//           Edit
//         </button>

//         {/* Mark Complete/Uncomplete Button */}
//         <button
//           onClick={() => onMarkComplete(task._id, task.isCompleted)}
//           className={`px-5 py-3 rounded-xl font-semibold transition-all cursor-pointer transform hover:scale-105 ${
//             task.isCompleted 
//               ? 'bg-orange-500 text-white hover:bg-orange-600' 
//               : 'bg-green-600 text-white hover:bg-green-700'
//           }`}
//         >
//           {task.isCompleted ? 'Mark Uncomplete' : 'Mark Completed'}
//         </button>

//         {/* Delete Button */}
//         <button
//           onClick={() => onDelete(task._id)}
//           className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all cursor-pointer transform hover:scale-110"
//           title="Delete task"
//         >
//           <Trash2 className="w-5 h-5" />
//         </button>
//       </div>
//     </div>
//   );
// };

// // =====================================================
// // MAIN WEEKLY VIEW COMPONENT
// // =====================================================
// const WeeklyView = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   // ========== STATE MANAGEMENT ==========
//   const passedDate = location.state?.selectedDate ? new Date(location.state.selectedDate) : new Date();
//   const today = new Date();
//   const [selectedDate, setSelectedDate] = useState(passedDate);
//   const [tasks, setTasks] = useState([]);
//   const [weekTasks, setWeekTasks] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [deleteModal, setDeleteModal] = useState({ isOpen: false, taskId: null });
//   const [toast, setToast] = useState({ show: false, message: '' });

//   // ========== FETCH DATA ON MOUNT ==========
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

//   // ========== HELPER FUNCTIONS ==========
  
//   // Convert Date to YYYY-MM-DD format
//   const formatDateForAPI = (date) => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   };

//   // ✅ Sort tasks by priority (High → Medium → Low)
//   const sortTasksByPriority = (tasksArray) => {
//     const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
//     return [...tasksArray].sort((a, b) => {
//       return priorityOrder[a.priority] - priorityOrder[b.priority];
//     });
//   };

//   // ========== API FUNCTIONS ==========
  
//   // Fetch tasks for specific date
//   const fetchTasksForDate = async (date) => {
//     try {
//       setLoading(true);
//       const dateStr = formatDateForAPI(date);
      
//       console.log('🔍 Fetching tasks for:', dateStr);
      
//       const res = await plannerService.getTasksByDate(dateStr);
      
//       const taskData = res.data?.tasks || res.tasks || res.data || [];
//       console.log('✅ Tasks received:', taskData.length);
      
//       // ✅ Sort tasks by priority before setting state
//       const sortedTasks = sortTasksByPriority(taskData);
//       setTasks(sortedTasks);
//     } catch (error) {
//       console.error('❌ Fetch error:', error);
//       setTasks([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch tasks for the entire week
//   const fetchWeekTasks = async () => {
//     try {
//       const week = getWeekDays();
//       const startDate = formatDateForAPI(week[0]);
//       const endDate = formatDateForAPI(week[6]);
      
//       console.log('📅 Fetching week range:', startDate, 'to', endDate);
      
//       const res = await plannerService.getTasksByRange(startDate, endDate);
      
//       const allTasks = res.data?.tasks || res.tasks || res.data || [];
//       console.log('✅ Week tasks received:', allTasks.length);
      
//       // Group tasks by date
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

//   // Mark Complete/Uncomplete
//   const handleMarkComplete = async (taskId, currentStatus) => {
//     try {
//       if (currentStatus) {
//         await plannerService.markUncomplete(taskId);
//         setToast({ show: true, message: 'Task marked as pending!' });
//       } else {
//         await plannerService.markComplete(taskId);
//         setToast({ show: true, message: 'Task marked as completed!' });
//       }
      
//       // Refresh data
//       await fetchTasksForDate(selectedDate);
//       await fetchWeekTasks();
//     } catch (error) {
//       console.error('❌ Mark complete error:', error);
//       setToast({ show: true, message: 'Failed to update task status' });
//     }
//   };

//   // Delete Task
//   const handleDelete = (taskId) => {
//     setDeleteModal({ isOpen: true, taskId });
//   };

//   const confirmDelete = async () => {
//     try {
//       await plannerService.deleteTask(deleteModal.taskId);
//       setDeleteModal({ isOpen: false, taskId: null });
//       await fetchTasksForDate(selectedDate);
//       await fetchWeekTasks();
      
//       setToast({ show: true, message: 'Task deleted successfully!' });
//     } catch (error) {
//       console.error('❌ Delete error:', error);
//       setToast({ show: true, message: 'Failed to delete task' });
//     }
//   };

//   const cancelDelete = () => {
//     setDeleteModal({ isOpen: false, taskId: null });
//   };

//   // Update Task
//   const handleUpdateTask = async (taskId, updates) => {
//     try {
//       await plannerService.updateTask(taskId, updates);
//       await fetchTasksForDate(selectedDate);
//       await fetchWeekTasks();
      
//       setToast({ show: true, message: 'Task updated successfully!' });
//     } catch (error) {
//       console.error('❌ Update task error:', error);
//       setToast({ show: true, message: 'Failed to update task' });
//     }
//   };

//   // Get week days
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

//   // ========== MAIN RENDER ==========
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-8">
//       {/* Toast Notification */}
//       {toast.show && (
//         <Toast 
//           message={toast.message} 
//           onClose={() => setToast({ show: false, message: '' })} 
//         />
//       )}

//       {/* Delete Modal */}
//       <DeleteModal 
//         isOpen={deleteModal.isOpen}
//         onConfirm={confirmDelete}
//         onCancel={cancelDelete}
//       />

//       {/* ========== HEADER ========== */}
//       <div className="flex items-center justify-between mb-8 animate-fade-in">
//         {/* Logo & Title */}
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
//             className="px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-blue-400 transition-all cursor-pointer transform hover:scale-105"
//           >
//             Dashboard
//           </button>
//           <button className="px-6 py-2.5 bg-blue-500 text-white font-semibold rounded-lg shadow-md cursor-default">
//             View Tasks
//           </button>
//           <button
//             onClick={() => navigate('/academic-planner/create-task')}
//             className="px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-blue-400 transition-all cursor-pointer transform hover:scale-105"
//           >
//             + Create Tasks
//           </button>
//           <button
//             onClick={() => navigate('/academic-planner/priority-tasks')}
//             className="px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-blue-400 transition-all cursor-pointer transform hover:scale-105"
//           >
//             Priority Tasks
//           </button>
//         </div>
//       </div>

//       {/* ========== PAGE TITLE ========== */}
//       <div className="flex items-center justify-between mb-6 animate-fade-in-delay">
//         <h2 className="text-2xl font-bold text-blue-900">Tasks in Calendar View</h2>
//         <p className="text-red-600 font-semibold text-lg">
//           {today.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/')}
//         </p>
//       </div>

//       {/* ========== WEEKLY CALENDAR ========== */}
//       <div className="bg-white rounded-2xl shadow-md p-5 mb-6 animate-slide-up">
//         <div className="flex items-center justify-between mb-4">
//           {/* Previous Week Button */}
//           <button
//             onClick={() => {
//               const newDate = new Date(selectedDate);
//               newDate.setDate(newDate.getDate() - 7);
//               setSelectedDate(newDate);
//             }}
//             className="p-2 hover:bg-gray-100 rounded-lg transition-all cursor-pointer transform hover:scale-110"
//             title="Previous week"
//           >
//             <ChevronLeft className="w-5 h-5 text-gray-600" />
//           </button>
          
//           {/* Week Range */}
//           <h3 className="text-lg font-bold text-gray-900">
//             {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
//           </h3>
          
//           {/* Next Week Button */}
//           <button
//             onClick={() => {
//               const newDate = new Date(selectedDate);
//               newDate.setDate(newDate.getDate() + 7);
//               setSelectedDate(newDate);
//             }}
//             className="p-2 hover:bg-gray-100 rounded-lg transition-all cursor-pointer transform hover:scale-110"
//             title="Next week"
//           >
//             <ChevronRight className="w-5 h-5 text-gray-600" />
//           </button>
//         </div>

//         {/* Day Names */}
//         <div className="grid grid-cols-7 gap-2 mb-3">
//           {dayNames.map((day) => (
//             <div key={day} className="text-center font-semibold text-purple-600 text-xs">
//               {day}
//             </div>
//           ))}
//         </div>

//         {/* Calendar Days */}
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
//                   rounded-xl p-2 cursor-pointer transition-all duration-200 border-2 min-h-[65px] flex flex-col items-center justify-center transform hover:scale-105
//                   ${isSelected ? 'border-pink-400 bg-pink-100 shadow-md' : 'border-gray-200 bg-white hover:border-blue-300'}
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

//         {/* Monthly View Button */}
//         <div className="flex justify-end">
//           <button
//             onClick={() => navigate('/academic-planner/monthly-view')}
//             className="text-gray-600 hover:text-blue-600 transition-all cursor-pointer transform hover:scale-110"
//           >
//             <ChevronDown className="w-6 h-6" />
//           </button>
//         </div>
//       </div>

//       {/* ========== SELECTED DATE ========== */}
//       <div className="bg-pink-200 rounded-2xl px-6 py-3 inline-block mb-5 animate-fade-in">
//         <p className="font-bold text-pink-800">
//           {selectedDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/')}
//         </p>
//       </div>

//       {/* ========== TASKS SECTION ========== */}
//       <h3 className="text-2xl font-bold text-purple-700 mb-5 animate-fade-in">TASKS</h3>

//       {/* Task Cards */}
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
//           tasks.map((task, index) => (
//             <div 
//               key={task._id}
//               className="animate-slide-up"
//               style={{ animationDelay: `${index * 0.1}s` }}
//             >
//               <TaskCard
//                 task={task}
//                 onMarkComplete={handleMarkComplete}
//                 onDelete={handleDelete}
//                 onUpdate={handleUpdateTask}
//               />
//             </div>
//           ))
//         )}
//       </div>

//       {/* ========== CSS ANIMATIONS ========== */}
//       <style>{`
//         @keyframes slide-in {
//           from { transform: translateX(100%); opacity: 0; }
//           to { transform: translateX(0); opacity: 1; }
//         }

//         @keyframes scale-in {
//           from { transform: scale(0.9); opacity: 0; }
//           to { transform: scale(1); opacity: 1; }
//         }

//         @keyframes fade-in {
//           from { opacity: 0; transform: translateY(-10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }

//         @keyframes fade-in-delay {
//           from { opacity: 0; transform: translateY(-10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }

//         @keyframes slide-up {
//           from { opacity: 0; transform: translateY(20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }

//         .animate-slide-in {
//           animation: slide-in 0.3s ease-out;
//         }

//         .animate-scale-in {
//           animation: scale-in 0.2s ease-out;
//         }

//         .animate-fade-in {
//           animation: fade-in 0.6s ease-out;
//         }

//         .animate-fade-in-delay {
//           animation: fade-in-delay 0.6s ease-out 0.2s backwards;
//         }

//         .animate-slide-up {
//           animation: slide-up 0.6s ease-out backwards;
//         }

//         .hover\\:scale-102:hover {
//           transform: scale(1.02);
//         }
//       `}</style>
//     </div>
//   );
// };

// export default WeeklyView;

































// =====================================================
// IMPORTS
// =====================================================
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  ChevronDown, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Edit2, 
  X, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import plannerService from '../../services/plannerService';

// =====================================================
// TOAST NOTIFICATION COMPONENT
// =====================================================
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

// =====================================================
// DELETE CONFIRMATION MODAL COMPONENT
// =====================================================
const DeleteModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 backdrop-blur-md cursor-pointer"
        onClick={onCancel}
      ></div>
      
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
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-all cursor-pointer transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all cursor-pointer transform hover:scale-105"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// TASK CARD COMPONENT
// =====================================================
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

  if (isEditing) {
    return (
      <div className="rounded-2xl p-6 shadow-md border-2 border-blue-400 bg-blue-50 animate-scale-in">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              value={editedTask.subject}
              onChange={(e) => setEditedTask({ ...editedTask, subject: e.target.value })}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Task Description</label>
            <textarea
              value={editedTask.task}
              onChange={(e) => setEditedTask({ ...editedTask, task: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              value={editedTask.dueDate}
              onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none cursor-pointer transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
            <select
              value={editedTask.priority}
              onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none cursor-pointer transition-all"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSaveEdit}
              className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:scale-105"
            >
              <Check className="w-5 h-5" />
              Save Changes
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex-1 px-6 py-3 bg-gray-400 text-white font-semibold rounded-xl hover:bg-gray-500 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:scale-105"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl p-6 flex justify-between items-center shadow-md border-2 ${getTaskCardColor(task.priority)} transform transition-all duration-200 hover:scale-102 hover:shadow-lg`}>
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-2">
          <h4 className="text-xl font-bold text-gray-900">{task.subject}</h4>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityBadge(task.priority)}`}>
            {task.priority}
          </span>
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
        <button
          onClick={() => setIsEditing(true)}
          className="px-5 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 cursor-pointer transform hover:scale-105"
        >
          <Edit2 className="w-4 h-4" />
          Edit
        </button>

        <button
          onClick={() => onMarkComplete(task._id, task.isCompleted)}
          className={`px-5 py-3 rounded-xl font-semibold transition-all cursor-pointer transform hover:scale-105 ${
            task.isCompleted 
              ? 'bg-orange-500 text-white hover:bg-orange-600' 
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {task.isCompleted ? 'Mark Uncomplete' : 'Mark Completed'}
        </button>

        <button
          onClick={() => onDelete(task._id)}
          className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all cursor-pointer transform hover:scale-110"
          title="Delete task"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// =====================================================
// MAIN WEEKLY VIEW COMPONENT
// =====================================================
const WeeklyView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const passedDate = location.state?.selectedDate ? new Date(location.state.selectedDate) : new Date();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(passedDate);
  const [tasks, setTasks] = useState([]);
  const [weekTasks, setWeekTasks] = useState({});
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, taskId: null });
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

  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const sortTasksByPriority = (tasksArray) => {
    const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
    return [...tasksArray].sort((a, b) => {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  };

  const fetchTasksForDate = async (date) => {
    try {
      setLoading(true);
      const dateStr = formatDateForAPI(date);
      const res = await plannerService.getTasksByDate(dateStr);
      const taskData = res.data?.tasks || res.tasks || res.data || [];
      const sortedTasks = sortTasksByPriority(taskData);
      setTasks(sortedTasks);
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
      const res = await plannerService.getTasksByRange(startDate, endDate);
      const allTasks = res.data?.tasks || res.tasks || res.data || [];
      
      const tasksByDate = {};
      allTasks.forEach(task => {
        const taskDate = new Date(task.dueDate);
        const dateKey = formatDateForAPI(taskDate);
        if (!tasksByDate[dateKey]) tasksByDate[dateKey] = [];
        tasksByDate[dateKey].push(task);
      });
      
      setWeekTasks(tasksByDate);
    } catch (error) {
      console.error('❌ Week tasks error:', error);
    }
  };

  const handleMarkComplete = async (taskId, currentStatus) => {
    try {
      if (currentStatus) {
        await plannerService.markUncomplete(taskId);
        setToast({ show: true, message: 'Task marked as pending!' });
      } else {
        await plannerService.markComplete(taskId);
        setToast({ show: true, message: 'Task marked as completed!' });
      }
      await fetchTasksForDate(selectedDate);
      await fetchWeekTasks();
    } catch (error) {
      console.error('❌ Mark complete error:', error);
      setToast({ show: true, message: 'Failed to update task status' });
    }
  };

  const handleDelete = (taskId) => {
    setDeleteModal({ isOpen: true, taskId });
  };

  const confirmDelete = async () => {
    try {
      await plannerService.deleteTask(deleteModal.taskId);
      setDeleteModal({ isOpen: false, taskId: null });
      await fetchTasksForDate(selectedDate);
      await fetchWeekTasks();
      setToast({ show: true, message: 'Task deleted successfully!' });
    } catch (error) {
      console.error('❌ Delete error:', error);
      setToast({ show: true, message: 'Failed to delete task' });
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, taskId: null });
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      await plannerService.updateTask(taskId, updates);
      await fetchTasksForDate(selectedDate);
      await fetchWeekTasks();
      setToast({ show: true, message: 'Task updated successfully!' });
    } catch (error) {
      console.error('❌ Update task error:', error);
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
      {toast.show && (
        <Toast 
          message={toast.message} 
          onClose={() => setToast({ show: false, message: '' })} 
        />
      )}

      <DeleteModal 
        isOpen={deleteModal.isOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <Calendar className="w-6 h-6 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Academic planner</h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate('/academic-planner/dashboard')}
            className="px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-blue-400 transition-all cursor-pointer transform hover:scale-105"
          >
            Dashboard
          </button>
          <button className="px-6 py-2.5 bg-blue-500 text-white font-semibold rounded-lg shadow-md cursor-default">
            View Tasks
          </button>
          <button
            onClick={() => navigate('/academic-planner/create-task')}
            className="px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-blue-400 transition-all cursor-pointer transform hover:scale-105"
          >
            + Create Tasks
          </button>
          <button
            onClick={() => navigate('/academic-planner/priority-tasks')}
            className="px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-blue-400 transition-all cursor-pointer transform hover:scale-105"
          >
            Priority Tasks
          </button>
        </div>
      </div>

      {/* Page Title */}
      <div className="flex items-center justify-between mb-6 animate-fade-in-delay">
        <h2 className="text-2xl font-bold text-blue-900">Tasks in Calendar View</h2>
        <p className="text-red-600 font-semibold text-lg">
          {today.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/')}
        </p>
      </div>

      {/* Weekly Calendar */}
      <div className="bg-white rounded-2xl shadow-md p-5 mb-6 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setDate(newDate.getDate() - 7);
              setSelectedDate(newDate);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all cursor-pointer transform hover:scale-110"
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
            className="p-2 hover:bg-gray-100 rounded-lg transition-all cursor-pointer transform hover:scale-110"
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
                  rounded-xl p-2 cursor-pointer transition-all duration-200 border-2 min-h-[65px] flex flex-col items-center justify-center transform hover:scale-105
                  ${isSelected ? 'border-pink-400 bg-pink-100 shadow-md' : 'border-gray-200 bg-white hover:border-blue-300'}
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
            className="text-gray-600 hover:text-blue-600 transition-all cursor-pointer transform hover:scale-110"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Selected Date */}
      <div className="bg-pink-200 rounded-2xl px-6 py-3 inline-block mb-5 animate-fade-in">
        <p className="font-bold text-pink-800">
          {selectedDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/')}
        </p>
      </div>

      {/* Tasks Section */}
      <h3 className="text-2xl font-bold text-purple-700 mb-5 animate-fade-in">TASKS</h3>

      <div className="space-y-8">
        {loading ? (
          <div className="bg-white rounded-2xl p-6 text-center text-gray-500 shadow-sm">
            Loading tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center text-gray-500 shadow-sm">
            No tasks for this date
          </div>
        ) : (
          <>
            {/* High Priority Section */}
            {(() => {
              const highPriorityTasks = tasks.filter(t => t.priority === 'High');
              if (highPriorityTasks.length === 0) return null;
              
              return (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-50 p-2 rounded-lg">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    </div>
                    <h4 className="text-xl font-bold text-red-600">High Priority</h4>
                    <span className="text-sm text-gray-500">({highPriorityTasks.length} {highPriorityTasks.length === 1 ? 'task' : 'tasks'})</span>
                  </div>
                  
                  {highPriorityTasks.map((task, index) => (
                    <div 
                      key={task._id}
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <TaskCard
                        task={task}
                        onMarkComplete={handleMarkComplete}
                        onDelete={handleDelete}
                        onUpdate={handleUpdateTask}
                      />
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Medium Priority Section */}
            {(() => {
              const mediumPriorityTasks = tasks.filter(t => t.priority === 'Medium');
              if (mediumPriorityTasks.length === 0) return null;
              
              return (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-50 p-2 rounded-lg">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    </div>
                    <h4 className="text-xl font-bold text-yellow-600">Medium Priority</h4>
                    <span className="text-sm text-gray-500">({mediumPriorityTasks.length} {mediumPriorityTasks.length === 1 ? 'task' : 'tasks'})</span>
                  </div>
                  
                  {mediumPriorityTasks.map((task, index) => (
                    <div 
                      key={task._id}
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <TaskCard
                        task={task}
                        onMarkComplete={handleMarkComplete}
                        onDelete={handleDelete}
                        onUpdate={handleUpdateTask}
                      />
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Low Priority Section */}
            {(() => {
              const lowPriorityTasks = tasks.filter(t => t.priority === 'Low');
              if (lowPriorityTasks.length === 0) return null;
              
              return (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-50 p-2 rounded-lg">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <h4 className="text-xl font-bold text-green-600">Low Priority</h4>
                    <span className="text-sm text-gray-500">({lowPriorityTasks.length} {lowPriorityTasks.length === 1 ? 'task' : 'tasks'})</span>
                  </div>
                  
                  {lowPriorityTasks.map((task, index) => (
                    <div 
                      key={task._id}
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <TaskCard
                        task={task}
                        onMarkComplete={handleMarkComplete}
                        onDelete={handleDelete}
                        onUpdate={handleUpdateTask}
                      />
                    </div>
                  ))}
                </div>
              );
            })()}
          </>
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

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

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in-delay 0.6s ease-out 0.2s backwards;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out backwards;
        }

        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default WeeklyView;
