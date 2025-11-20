// // =====================================================
// // IMPORTS
// // =====================================================
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Calendar, Flame, Zap, Leaf, Trash2, Edit2, X, Check, AlertCircle } from 'lucide-react';
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
//       <div 
//         className="absolute inset-0 backdrop-blur-md cursor-pointer" 
//         onClick={onCancel}
//       ></div>
      
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

//   if (isEditing) {
//     return (
//       <div className="rounded-2xl p-6 shadow-md border-2 border-blue-400 bg-blue-50 animate-scale-in">
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
//             <input
//               type="text"
//               value={editedTask.subject}
//               onChange={(e) => setEditedTask({ ...editedTask, subject: e.target.value })}
//               className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-all"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-1">Task Description</label>
//             <textarea
//               value={editedTask.task}
//               onChange={(e) => setEditedTask({ ...editedTask, task: e.target.value })}
//               rows={3}
//               className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-all"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-1">Due Date</label>
//             <input
//               type="date"
//               value={editedTask.dueDate}
//               onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
//               className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none cursor-pointer transition-all"
//             />
//           </div>

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

//   return (
//     <div className={`rounded-2xl p-6 flex justify-between items-center shadow-md border-2 ${getTaskCardColor(task.priority)} transform transition-all duration-200 hover:scale-102 hover:shadow-lg`}>
//       <div className="flex-1">
//         <div className="flex items-center gap-4 mb-2">
//           <h4 className="text-xl font-bold text-gray-900">{task.subject}</h4>
//           <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityBadge(task.priority)}`}>
//             {task.priority}
//           </span>
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
//         <button
//           onClick={() => setIsEditing(true)}
//           className="px-5 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 cursor-pointer transform hover:scale-105"
//         >
//           <Edit2 className="w-4 h-4" />
//           Edit
//         </button>

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
// // PRIORITY SECTION COMPONENT
// // =====================================================
// const PrioritySection = ({ title, icon: Icon, color, bgColor, tasks, onMarkComplete, onDelete, onUpdate }) => {
//   if (tasks.length === 0) return null;

//   return (
//     <div className="space-y-4 animate-fade-in">
//       <div className="flex items-center gap-3">
//         <div className={`${bgColor} p-3 rounded-xl`}>
//           <Icon className={`w-6 h-6 ${color}`} />
//         </div>
//         <div>
//           <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
//           <p className="text-sm text-gray-600">
//             {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} in this priority level
//           </p>
//         </div>
//       </div>

//       <div className="space-y-4">
//         {tasks.map((task, index) => (
//           <div 
//             key={task._id} 
//             className="relative animate-slide-up"
//             style={{ animationDelay: `${index * 0.1}s` }}
//           >
//             <div className="absolute -left-4 top-6 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10">
//               {index + 1}
//             </div>
            
//             <TaskCard
//               task={task}
//               onMarkComplete={onMarkComplete}
//               onDelete={onDelete}
//               onUpdate={onUpdate}
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // =====================================================
// // MAIN COMPONENT
// // =====================================================
// const PriorityTasks = () => {
//   const navigate = useNavigate();
  
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [deleteModal, setDeleteModal] = useState({ isOpen: false, taskId: null });
//   const [toast, setToast] = useState({ show: false, message: '' });

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   const fetchTasks = async () => {
//     try {
//       console.log('📡 Fetching AI-prioritized tasks...');
//       const res = await plannerService.getAIPrioritized();
//       const aiTasks = res.data?.tasks || res.tasks || res.data || [];
//       console.log('✅ AI prioritized tasks:', aiTasks.length);
//       setTasks(aiTasks);
//     } catch (error) {
//       console.error('❌ Fetch error:', error);
//       setToast({ show: true, message: 'Failed to load AI-prioritized tasks' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ FIXED: Instant card removal when marking complete
//   const handleMarkComplete = async (taskId, currentStatus) => {
//     try {
//       if (currentStatus) {
//         // Marking as UNCOMPLETE - Update UI
//         setTasks(prevTasks => 
//           prevTasks.map(task => 
//             task._id === taskId 
//               ? { ...task, isCompleted: false }
//               : task
//           )
//         );
//         setToast({ show: true, message: 'Task marked as pending!' });
//         await plannerService.markUncomplete(taskId);
//       } else {
//         // Marking as COMPLETE - REMOVE from list immediately
//         setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
//         setToast({ show: true, message: 'Task marked as completed!' });
//         await plannerService.markComplete(taskId);
//       }
      
//       // Refresh data in background after short delay
//       setTimeout(() => fetchTasks(), 500);
//     } catch (error) {
//       console.error('❌ Mark complete error:', error);
//       await fetchTasks(); // Rollback: Fetch fresh data
//       setToast({ show: true, message: 'Failed to update task status' });
//     }
//   };

//   const handleDelete = (taskId) => {
//     setDeleteModal({ isOpen: true, taskId });
//   };

//   const confirmDelete = async () => {
//     try {
//       // ✅ INSTANT: Remove from UI immediately
//       setTasks(prevTasks => prevTasks.filter(task => task._id !== deleteModal.taskId));
//       setDeleteModal({ isOpen: false, taskId: null });
//       setToast({ show: true, message: 'Task deleted successfully!' });
      
//       // Delete in background
//       await plannerService.deleteTask(deleteModal.taskId);
//       setTimeout(() => fetchTasks(), 500);
//     } catch (error) {
//       console.error('❌ Delete error:', error);
//       await fetchTasks(); // Rollback
//       setToast({ show: true, message: 'Failed to delete task' });
//     }
//   };

//   const cancelDelete = () => {
//     setDeleteModal({ isOpen: false, taskId: null });
//   };

//   const handleUpdateTask = async (taskId, updates) => {
//     try {
//       await plannerService.updateTask(taskId, updates);
//       await fetchTasks();
//       setToast({ show: true, message: 'Task updated successfully!' });
//     } catch (error) {
//       console.error('❌ Update task error:', error);
//       setToast({ show: true, message: 'Failed to update task' });
//     }
//   };

//   const groupedTasks = {
//     high: tasks.filter(t => t.priority === 'High'),
//     medium: tasks.filter(t => t.priority === 'Medium'),
//     low: tasks.filter(t => t.priority === 'Low')
//   };

//   if (loading) {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex items-center justify-center p-8">
//       <div className="text-center">
//         {/* ✨ Animated Spinner Container */}
//         <div className="relative mb-8 h-32 flex items-center justify-center">
//           {/* Outer spinning ring */}
//           <div className="absolute inset-0 flex items-center justify-center">
//             <div className="w-32 h-32 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
//           </div>
          
//           {/* Inner spinning ring (opposite direction) */}
//           <div className="absolute inset-0 flex items-center justify-center">
//             <div className="w-24 h-24 border-4 border-cyan-200 border-t-cyan-500 rounded-full animate-spin-reverse"></div>
//           </div>
          
//           {/* Center pulsing calendar icon */}
//           <div className="relative">
//             <div className="bg-white rounded-2xl p-4 shadow-lg animate-pulse-slow">
//               <Calendar className="w-12 h-12 text-blue-600" />
//             </div>
//           </div>
//         </div>

//         {/* Loading Text */}
//         <h3 className="text-2xl font-bold text-gray-900 mb-2 animate-fade-in">
//           Loading AI-Prioritized Tasks
//         </h3>
//         <p className="text-gray-600 animate-fade-in-delay">
//           Analyzing and sorting your tasks...
//         </p>

//         {/* Bouncing Progress Dots */}
//         <div className="flex items-center justify-center gap-2 mt-6">
//           <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce-1"></div>
//           <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce-2"></div>
//           <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce-3"></div>
//         </div>
//       </div>
//     </div>
//   );
// }


//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-8">
//       {toast.show && (
//         <Toast 
//           message={toast.message} 
//           onClose={() => setToast({ show: false, message: '' })} 
//         />
//       )}

//       <DeleteModal 
//         isOpen={deleteModal.isOpen}
//         onConfirm={confirmDelete}
//         onCancel={cancelDelete}
//       />

//       {/* Header */}
//       <div className="flex items-center justify-between mb-8 animate-fade-in">
//         <div className="flex items-center gap-3">
//           <div className="bg-white p-2 rounded-lg shadow-sm">
//             <Calendar className="w-6 h-6 text-red-500" />
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900">Academic planner</h1>
//         </div>

//         <div className="flex gap-3">
//           <button
//             onClick={() => navigate('/academic-planner/dashboard')}
//             className="px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-blue-400 transition-all cursor-pointer transform hover:scale-105"
//           >
//             Dashboard
//           </button>
//           <button
//             onClick={() => navigate('/academic-planner/view-tasks')}
//             className="px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-blue-400 transition-all cursor-pointer transform hover:scale-105"
//           >
//             View Tasks
//           </button>
//           <button
//             onClick={() => navigate('/academic-planner/create-task')}
//             className="px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-blue-400 transition-all cursor-pointer transform hover:scale-105"
//           >
//             + Create Tasks
//           </button>
//           <button className="px-6 py-2.5 bg-blue-500 text-white font-semibold rounded-lg shadow-md cursor-default">
//             Priority Tasks
//           </button>
//         </div>
//       </div>

//       {/* Page Title */}
//       <div className="mb-6 animate-fade-in-delay">
//         <h2 className="text-2xl font-bold text-blue-900">AI-Prioritized Tasks</h2>
//         <p className="text-gray-600 text-sm mt-1">
//           Your top 10 upcoming tasks intelligently sorted by AI based on priority and deadline
//         </p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-4 gap-6 mb-8">
//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transform transition-all duration-300 hover:scale-105 animate-slide-up">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-gray-500 font-semibold text-sm">Total Tasks</p>
//             <AlertCircle className="w-5 h-5 text-blue-500" />
//           </div>
//           <p className="text-3xl font-bold text-gray-900">{tasks.length}</p>
//         </div>

//         <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 shadow-sm border-2 border-red-200 transform transition-all duration-300 hover:scale-105 animate-slide-up" style={{ animationDelay: '0.1s' }}>
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-red-700 font-semibold text-sm">High Priority</p>
//             <Flame className="w-5 h-5 text-red-500" />
//           </div>
//           <p className="text-3xl font-bold text-red-600">{groupedTasks.high.length}</p>
//         </div>

//         <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 shadow-sm border-2 border-yellow-200 transform transition-all duration-300 hover:scale-105 animate-slide-up" style={{ animationDelay: '0.2s' }}>
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-yellow-700 font-semibold text-sm">Medium Priority</p>
//             <Zap className="w-5 h-5 text-yellow-500" />
//           </div>
//           <p className="text-3xl font-bold text-yellow-600">{groupedTasks.medium.length}</p>
//         </div>

//         <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-sm border-2 border-green-200 transform transition-all duration-300 hover:scale-105 animate-slide-up" style={{ animationDelay: '0.3s' }}>
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-green-700 font-semibold text-sm">Low Priority</p>
//             <Leaf className="w-5 h-5 text-green-500" />
//           </div>
//           <p className="text-3xl font-bold text-green-600">{groupedTasks.low.length}</p>
//         </div>
//       </div>

//       {/* Tasks Sections */}
//       {tasks.length === 0 ? (
//         <div className="bg-white rounded-2xl p-12 text-center shadow-sm animate-fade-in">
//           <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//           <h3 className="text-xl font-bold text-gray-900 mb-2">No Upcoming Tasks</h3>
//           <p className="text-gray-600 mb-6">Create your first task to see AI-powered prioritization!</p>
//           <button
//             onClick={() => navigate('/academic-planner/create-task')}
//             className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-all cursor-pointer transform hover:scale-105"
//           >
//             + Create Task
//           </button>
//         </div>
//       ) : (
//         <div className="space-y-8">
//           <PrioritySection
//             title="High Priority Tasks"
//             icon={Flame}
//             color="text-red-500"
//             bgColor="bg-red-50"
//             tasks={groupedTasks.high}
//             onMarkComplete={handleMarkComplete}
//             onDelete={handleDelete}
//             onUpdate={handleUpdateTask}
//           />

//           <PrioritySection
//             title="Medium Priority Tasks"
//             icon={Zap}
//             color="text-yellow-500"
//             bgColor="bg-yellow-50"
//             tasks={groupedTasks.medium}
//             onMarkComplete={handleMarkComplete}
//             onDelete={handleDelete}
//             onUpdate={handleUpdateTask}
//           />

//           <PrioritySection
//             title="Low Priority Tasks"
//             icon={Leaf}
//             color="text-green-500"
//             bgColor="bg-green-50"
//             tasks={groupedTasks.low}
//             onMarkComplete={handleMarkComplete}
//             onDelete={handleDelete}
//             onUpdate={handleUpdateTask}
//           />
//         </div>
//       )}

//       {/* CSS Animations */}
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
//         @keyframes spin-slow {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(-360deg); }
//         }
//         @keyframes spin-reverse {
//           from { transform: rotate(360deg); }
//           to { transform: rotate(0deg); }
//         }
//         @keyframes pulse-slow {
//           0%, 100% { transform: scale(1); opacity: 1; }
//           50% { transform: scale(1.05); opacity: 0.9; }
//         }
//         @keyframes bounce-1 {
//           0%, 80%, 100% { transform: translateY(0); }
//           40% { transform: translateY(-10px); }
//         }
//         @keyframes bounce-2 {
//           0%, 80%, 100% { transform: translateY(0); }
//           40% { transform: translateY(-10px); }
//         }
//         @keyframes bounce-3 {
//           0%, 80%, 100% { transform: translateY(0); }
//           40% { transform: translateY(-10px); }
//         }
//         .animate-slide-in { animation: slide-in 0.3s ease-out; }
//         .animate-scale-in { animation: scale-in 0.2s ease-out; }
//         .animate-fade-in { animation: fade-in 0.6s ease-out; }
//         .animate-fade-in-delay { animation: fade-in-delay 0.6s ease-out 0.2s backwards; }
//         .animate-slide-up { animation: slide-up 0.6s ease-out backwards; }
//         .animate-spin-slow { animation: spin-slow 3s linear infinite; }
//         .animate-spin-reverse { animation: spin-reverse 2s linear infinite; }
//         .animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }
//         .animate-bounce-1 { animation: bounce-1 1.4s ease-in-out infinite; }
//         .animate-bounce-2 { animation: bounce-2 1.4s ease-in-out 0.2s infinite; }
//         .animate-bounce-3 { animation: bounce-3 1.4s ease-in-out 0.4s infinite; }
//         .hover\\:scale-102:hover { transform: scale(1.02); }
//       `}</style>

//     </div>
//   );
// };

// export default PriorityTasks;


































// =====================================================
// IMPORTS
// =====================================================
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Flame, Zap, Leaf, Trash2, Edit2, X, Check, AlertCircle } from 'lucide-react';
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
// DELETE CONFIRMATION MODAL
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
// PRIORITY SECTION COMPONENT
// =====================================================
const PrioritySection = ({ title, icon: Icon, color, bgColor, tasks, onMarkComplete, onDelete, onUpdate }) => {
  if (tasks.length === 0) return null;


  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className={`${bgColor} p-3 rounded-xl`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} in this priority level
          </p>
        </div>
      </div>


      <div className="space-y-4">
        {tasks.map((task, index) => (
          <div 
            key={task._id} 
            className="relative pl-12 animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="absolute left-0 top-6 bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-base shadow-lg z-20 pointer-events-none">
              {index + 1}
            </div>
            
            <TaskCard
              task={task}
              onMarkComplete={onMarkComplete}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          </div>
        ))}
      </div>
    </div>
  );
};


// =====================================================
// MAIN COMPONENT
// =====================================================
const PriorityTasks = () => {
  const navigate = useNavigate();
  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, taskId: null });
  const [toast, setToast] = useState({ show: false, message: '' });


  useEffect(() => {
    fetchTasks();
  }, []);


  const fetchTasks = async () => {
    try {
      console.log('📡 Fetching AI-prioritized tasks...');
      const res = await plannerService.getAIPrioritized();
      const aiTasks = res.data?.tasks || res.tasks || res.data || [];
      console.log('✅ AI prioritized tasks:', aiTasks.length);
      setTasks(aiTasks);
    } catch (error) {
      console.error('❌ Fetch error:', error);
      setToast({ show: true, message: 'Failed to load AI-prioritized tasks' });
    } finally {
      setLoading(false);
    }
  };


  const handleMarkComplete = async (taskId, currentStatus) => {
    try {
      if (currentStatus) {
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task._id === taskId 
              ? { ...task, isCompleted: false }
              : task
          )
        );
        setToast({ show: true, message: 'Task marked as pending!' });
        await plannerService.markUncomplete(taskId);
      } else {
        setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
        setToast({ show: true, message: 'Task marked as completed!' });
        await plannerService.markComplete(taskId);
      }
      
      setTimeout(() => fetchTasks(), 500);
    } catch (error) {
      console.error('❌ Mark complete error:', error);
      await fetchTasks();
      setToast({ show: true, message: 'Failed to update task status' });
    }
  };


  const handleDelete = (taskId) => {
    setDeleteModal({ isOpen: true, taskId });
  };


  const confirmDelete = async () => {
    try {
      setTasks(prevTasks => prevTasks.filter(task => task._id !== deleteModal.taskId));
      setDeleteModal({ isOpen: false, taskId: null });
      setToast({ show: true, message: 'Task deleted successfully!' });
      
      await plannerService.deleteTask(deleteModal.taskId);
      setTimeout(() => fetchTasks(), 500);
    } catch (error) {
      console.error('❌ Delete error:', error);
      await fetchTasks();
      setToast({ show: true, message: 'Failed to delete task' });
    }
  };


  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, taskId: null });
  };


  const handleUpdateTask = async (taskId, updates) => {
    try {
      await plannerService.updateTask(taskId, updates);
      await fetchTasks();
      setToast({ show: true, message: 'Task updated successfully!' });
    } catch (error) {
      console.error('❌ Update task error:', error);
      setToast({ show: true, message: 'Failed to update task' });
    }
  };


  const groupedTasks = {
    high: tasks.filter(t => t.priority === 'High'),
    medium: tasks.filter(t => t.priority === 'Medium'),
    low: tasks.filter(t => t.priority === 'Low')
  };


 







if (loading) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex items-center justify-center p-8 overflow-hidden relative">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[10%] left-[15%] w-2 h-2 bg-blue-400 rounded-full animate-float-particle-1 opacity-60"></div>
        <div className="absolute top-[60%] left-[25%] w-3 h-3 bg-cyan-400 rounded-full animate-float-particle-2 opacity-50"></div>
        <div className="absolute top-[30%] right-[20%] w-2 h-2 bg-purple-400 rounded-full animate-float-particle-3 opacity-60"></div>
        <div className="absolute bottom-[25%] right-[30%] w-3 h-3 bg-pink-400 rounded-full animate-float-particle-4 opacity-50"></div>
        <div className="absolute top-[80%] left-[40%] w-2 h-2 bg-blue-500 rounded-full animate-float-particle-5 opacity-60"></div>
      </div>

      <div className="text-center relative z-10">
        {/* Neural Network Animation */}
        <div className="relative mb-16 h-48 w-48 mx-auto">
          {/* Outer pulsing rings */}
          <div className="absolute inset-0 border-4 border-blue-400/30 rounded-full animate-ping-slow"></div>
          <div className="absolute inset-4 border-4 border-cyan-400/40 rounded-full animate-ping-medium"></div>
          <div className="absolute inset-8 border-4 border-purple-400/50 rounded-full animate-ping-fast"></div>
          
          {/* Empty center - NO ICON */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-cyan-500 to-purple-500 rounded-full blur-xl opacity-60 animate-pulse"></div>
          </div>
          
          {/* 4 Rotating Orbiting Balls */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-lg"></div>
          </div>
          
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s', animationDelay: '0.75s' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full shadow-lg"></div>
          </div>
          
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s', animationDelay: '1.5s' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg"></div>
          </div>
          
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s', animationDelay: '2.25s' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-5 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full shadow-lg"></div>
          </div>
          
          {/* Corner connection nodes */}
          <div className="absolute top-8 left-8 w-4 h-4 bg-blue-500 rounded-full shadow-lg animate-pulse-node"></div>
          <div className="absolute top-8 right-8 w-4 h-4 bg-cyan-500 rounded-full shadow-lg animate-pulse-node [animation-delay:0.2s]"></div>
          <div className="absolute bottom-8 left-8 w-4 h-4 bg-purple-500 rounded-full shadow-lg animate-pulse-node [animation-delay:0.4s]"></div>
          <div className="absolute bottom-8 right-8 w-4 h-4 bg-pink-500 rounded-full shadow-lg animate-pulse-node [animation-delay:0.6s]"></div>
        </div>

        {/* Animated Gradient Text */}
        <div className="mb-4">
          <h3 className="text-4xl font-black mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
            AI Analyzing Tasks
          </h3>
          <p className="text-gray-700 text-lg font-medium animate-fade-in-up">
            Prioritizing with artificial intelligence
          </p>
        </div>

        {/* Continuous Loading Progress Bar */}
        <div className="w-80 mx-auto mb-8 animate-fade-in-up [animation-delay:0.2s]">
          <div className="relative h-2.5 overflow-hidden rounded-full bg-white/60 shadow-inner">
            {/* moving blue chunk */}
            <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-full animate-loading-chunk"></div>
          </div>
        </div>

        {/* Typing Effect Dots */}
        <div className="flex items-center justify-center gap-2.5 h-6 animate-fade-in-up [animation-delay:0.4s]">
          <div className="w-3 h-3 bg-blue-500 rounded-full shadow-md animate-type-1"></div>
          <div className="w-3 h-3 bg-cyan-500 rounded-full shadow-md animate-type-2"></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full shadow-md animate-type-3"></div>
        </div>

        {/* Status Text */}
        <p className="mt-6 text-sm text-gray-500 font-medium animate-pulse">
          Processing your priorities...
        </p>

      </div>
    </div>
  );
}


















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
          <button
            onClick={() => navigate('/academic-planner/view-tasks')}
            className="px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-blue-400 transition-all cursor-pointer transform hover:scale-105"
          >
            View Tasks
          </button>
          <button
            onClick={() => navigate('/academic-planner/create-task')}
            className="px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-blue-400 transition-all cursor-pointer transform hover:scale-105"
          >
            + Create Tasks
          </button>
          <button className="px-6 py-2.5 bg-blue-500 text-white font-semibold rounded-lg shadow-md cursor-default">
            Priority Tasks
          </button>
        </div>
      </div>


      {/* Page Title */}
      <div className="mb-6 animate-fade-in-delay">
        <h2 className="text-2xl font-bold text-blue-900">AI-Prioritized Tasks</h2>
        <p className="text-gray-600 text-sm mt-1">
          Your top 10 upcoming tasks intelligently sorted by AI based on priority and deadline
        </p>
      </div>


      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transform transition-all duration-300 hover:scale-105 animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-500 font-semibold text-sm">Total Tasks</p>
            <AlertCircle className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{tasks.length}</p>
        </div>


        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 shadow-sm border-2 border-red-200 transform transition-all duration-300 hover:scale-105 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-red-700 font-semibold text-sm">High Priority</p>
            <Flame className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-red-600">{groupedTasks.high.length}</p>
        </div>


        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 shadow-sm border-2 border-yellow-200 transform transition-all duration-300 hover:scale-105 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-yellow-700 font-semibold text-sm">Medium Priority</p>
            <Zap className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-yellow-600">{groupedTasks.medium.length}</p>
        </div>


        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-sm border-2 border-green-200 transform transition-all duration-300 hover:scale-105 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-green-700 font-semibold text-sm">Low Priority</p>
            <Leaf className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">{groupedTasks.low.length}</p>
        </div>
      </div>


      {/* Tasks Sections */}
      {tasks.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm animate-fade-in">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Upcoming Tasks</h3>
          <p className="text-gray-600 mb-6">Create your first task to see AI-powered prioritization!</p>
          <button
            onClick={() => navigate('/academic-planner/create-task')}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-all cursor-pointer transform hover:scale-105"
          >
            + Create Task
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <PrioritySection
            title="High Priority Tasks"
            icon={Flame}
            color="text-red-500"
            bgColor="bg-red-50"
            tasks={groupedTasks.high}
            onMarkComplete={handleMarkComplete}
            onDelete={handleDelete}
            onUpdate={handleUpdateTask}
          />


          <PrioritySection
            title="Medium Priority Tasks"
            icon={Zap}
            color="text-yellow-500"
            bgColor="bg-yellow-50"
            tasks={groupedTasks.medium}
            onMarkComplete={handleMarkComplete}
            onDelete={handleDelete}
            onUpdate={handleUpdateTask}
          />


          <PrioritySection
            title="Low Priority Tasks"
            icon={Leaf}
            color="text-green-500"
            bgColor="bg-green-50"
            tasks={groupedTasks.low}
            onMarkComplete={handleMarkComplete}
            onDelete={handleDelete}
            onUpdate={handleUpdateTask}
          />
        </div>
      )}


      {/* CSS Animations */}
     <style>{`
  @keyframes slide-in {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes scale-in {
    from { transform: scale(0.9); opacity: 0; }
    to   { transform: scale(1); opacity: 1; }
  }
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fade-in-delay {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes slide-up {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  
  /* AI Loading Animations */
  @keyframes ping-slow {
    0%, 100% { transform: scale(1); opacity: 0.3; }
    50%      { transform: scale(1.05); opacity: 0.1; }
  }
  @keyframes ping-medium {
    0%, 100% { transform: scale(1); opacity: 0.4; }
    50%      { transform: scale(1.08); opacity: 0.15; }
  }
  @keyframes ping-fast {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50%      { transform: scale(1.12); opacity: 0.2; }
  }
  @keyframes pulse-node {
    0%, 100% { transform: scale(1); opacity: 1; }
    50%      { transform: scale(1.3); opacity: 0.8; }
  }
  @keyframes gradient-x {
    0%, 100% { background-position: 0% 50%; }
    50%      { background-position: 100% 50%; }
  }
  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  
  /* Continuous Loading Bar - moving chunk */
  @keyframes loading-chunk {
    0%   { transform: translateX(-120%); }
    50%  { transform: translateX(20%); }
    100% { transform: translateX(220%); }
  }
  
  /* Typing Effect - dots 1 -> 2 -> 3 -> repeat */
  @keyframes type-1 {
    0%, 75%, 100% { transform: scale(0.3); opacity: 0.2; }
    25%          { transform: scale(1.2); opacity: 1; }
  }
  @keyframes type-2 {
    0%, 25%, 100% { transform: scale(0.3); opacity: 0.2; }
    50%          { transform: scale(1.2); opacity: 1; }
  }
  @keyframes type-3 {
    0%, 50%, 100% { transform: scale(0.3); opacity: 0.2; }
    75%          { transform: scale(1.2); opacity: 1; }
  }
  
  /* Floating background particles */
  @keyframes float-particle-1 {
    0%, 100% { transform: translate(0, 0); }
    50%      { transform: translate(-30px, -50px); }
  }
  @keyframes float-particle-2 {
    0%, 100% { transform: translate(0, 0); }
    50%      { transform: translate(40px, -60px); }
  }
  @keyframes float-particle-3 {
    0%, 100% { transform: translate(0, 0); }
    50%      { transform: translate(-50px, 40px); }
  }
  @keyframes float-particle-4 {
    0%, 100% { transform: translate(0, 0); }
    50%      { transform: translate(35px, 55px); }
  }
  @keyframes float-particle-5 {
    0%, 100% { transform: translate(0, 0); }
    50%      { transform: translate(-40px, -45px); }
  }
  
  .animate-slide-in        { animation: slide-in 0.3s ease-out; }
  .animate-scale-in        { animation: scale-in 0.2s ease-out; }
  .animate-fade-in         { animation: fade-in 0.6s ease-out; }
  .animate-fade-in-delay   { animation: fade-in-delay 0.6s ease-out 0.2s backwards; }
  .animate-slide-up        { animation: slide-up 0.6s ease-out backwards; }
  .animate-ping-slow       { animation: ping-slow 3s ease-out infinite; }
  .animate-ping-medium     { animation: ping-medium 3s ease-out 0.4s infinite; }
  .animate-ping-fast       { animation: ping-fast 3s ease-out 0.8s infinite; }
  .animate-pulse-node      { animation: pulse-node 2s ease-in-out infinite; }
  .animate-gradient-x      { animation: gradient-x 3s ease infinite; background-size: 200% auto; }
  .animate-fade-in-up      { animation: fade-in-up 0.8s ease-out backwards; }
  .animate-loading-chunk   { animation: loading-chunk 1.8s ease-in-out infinite; }
  .animate-type-1          { animation: type-1 1.5s ease-in-out infinite; }
  .animate-type-2          { animation: type-2 1.5s ease-in-out infinite; }
  .animate-type-3          { animation: type-3 1.5s ease-in-out infinite; }
  .animate-float-particle-1{ animation: float-particle-1 6s ease-in-out infinite; }
  .animate-float-particle-2{ animation: float-particle-2 7s ease-in-out infinite; }
  .animate-float-particle-3{ animation: float-particle-3 5s ease-in-out infinite; }
  .animate-float-particle-4{ animation: float-particle-4 8s ease-in-out infinite; }
  .animate-float-particle-5{ animation: float-particle-5 6.5s ease-in-out infinite; }
  .hover\\:scale-102:hover { transform: scale(1.02); }
`}</style>




    </div>
  );
};


export default PriorityTasks;
