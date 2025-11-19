// // src/features/academicPlanner/PriorityTasks.jsx
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Calendar, Flame, Zap, Leaf, Trash2, Edit2, X, Check, AlertCircle } from 'lucide-react';
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

// // ✅ Delete Confirmation Modal
// const DeleteModal = ({ isOpen, onConfirm, onCancel }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       <div className="absolute inset-0 backdrop-blur-md" onClick={onCancel}></div>
      
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

// // ✅ TaskCard Component - Same as WeeklyView
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

//   // Edit Mode
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
//           className="px-5 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2"
//         >
//           <Edit2 className="w-4 h-4" />
//           Edit
//         </button>

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

// // ✅ Main Component
// const PriorityTasks = () => {
//   const navigate = useNavigate();
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [deleteModal, setDeleteModal] = useState({ isOpen: false, taskId: null });
//   const [toast, setToast] = useState({ show: false, message: '' });

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   // ✅ FIXED: Use AI Prioritized Endpoint
//   const fetchTasks = async () => {
//     try {
//       console.log('📡 Fetching AI-prioritized tasks...');
//       const res = await plannerService.getAIPrioritized();
      
//       console.log('✅ AI tasks response:', res);
      
//       // Backend returns: { data: { tasks: [...], message: "..." } }
//       const aiTasks = res.data?.tasks || res.tasks || res.data || [];
      
//       console.log('🤖 AI prioritized tasks:', aiTasks.length, aiTasks);
      
//       setTasks(aiTasks);
//     } catch (error) {
//       console.error('❌ Fetch error:', error);
//       setToast({ show: true, message: 'Failed to load AI-prioritized tasks' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMarkComplete = async (taskId, currentStatus) => {
//     try {
//       await plannerService.markComplete(taskId, currentStatus);
//       await fetchTasks();
      
//       setToast({ 
//         show: true, 
//         message: currentStatus ? 'Task marked as pending!' : 'Task marked as completed!' 
//       });
//     } catch (error) {
//       console.error('Mark complete error:', error);
//       setToast({ show: true, message: 'Failed to update task status' });
//     }
//   };

//   const handleDelete = (taskId) => {
//     setDeleteModal({ isOpen: true, taskId });
//   };

//   const confirmDelete = async () => {
//     try {
//       await plannerService.deleteTask(deleteModal.taskId);
//       setDeleteModal({ isOpen: false, taskId: null });
//       await fetchTasks();
      
//       setToast({ show: true, message: 'Task deleted successfully!' });
//     } catch (error) {
//       console.error('Delete error:', error);
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
//       console.error('Update task error:', error);
//       setToast({ show: true, message: 'Failed to update task' });
//     }
//   };

//   // Group by priority
//   const groupedTasks = {
//     high: tasks.filter(t => t.priority === 'High'),
//     medium: tasks.filter(t => t.priority === 'Medium'),
//     low: tasks.filter(t => t.priority === 'Low')
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading AI-prioritized tasks...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-8">
//       {/* Toast */}
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

//       {/* Header */}
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
//           <button
//             onClick={() => navigate('/academic-planner/view-tasks')}
//             className="px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-blue-400 transition-all"
//           >
//             View Tasks
//           </button>
//           <button
//             onClick={() => navigate('/academic-planner/create-task')}
//             className="px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-blue-400 transition-all"
//           >
//             + Create Tasks
//           </button>
//           <button className="px-6 py-2.5 bg-blue-500 text-white font-semibold rounded-lg shadow-md">
//             Priority Tasks
//           </button>
//         </div>
//       </div>

//       {/* Page Title */}
//       <div className="mb-6">
//         <h2 className="text-2xl font-bold text-blue-900">AI-Prioritized Tasks</h2>
//         <p className="text-gray-600 text-sm mt-1">Top 10 upcoming tasks intelligently sorted by AI based on priority and deadline</p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-4 gap-6 mb-8">
//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-gray-500 font-semibold text-sm">Total Tasks</p>
//             <AlertCircle className="w-5 h-5 text-blue-500" />
//           </div>
//           <p className="text-3xl font-bold text-gray-900">{tasks.length}</p>
//         </div>

//         <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 shadow-sm border-2 border-red-200">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-red-700 font-semibold text-sm">High Priority</p>
//             <Flame className="w-5 h-5 text-red-500" />
//           </div>
//           <p className="text-3xl font-bold text-red-600">{groupedTasks.high.length}</p>
//         </div>

//         <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 shadow-sm border-2 border-yellow-200">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-yellow-700 font-semibold text-sm">Medium Priority</p>
//             <Zap className="w-5 h-5 text-yellow-500" />
//           </div>
//           <p className="text-3xl font-bold text-yellow-600">{groupedTasks.medium.length}</p>
//         </div>

//         <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-sm border-2 border-green-200">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-green-700 font-semibold text-sm">Low Priority</p>
//             <Leaf className="w-5 h-5 text-green-500" />
//           </div>
//           <p className="text-3xl font-bold text-green-600">{groupedTasks.low.length}</p>
//         </div>
//       </div>

//       {/* Tasks List */}
//       {tasks.length === 0 ? (
//         <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
//           <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//           <h3 className="text-xl font-bold text-gray-900 mb-2">No Upcoming Tasks</h3>
//           <p className="text-gray-600 mb-6">Create your first task to see AI-powered prioritization!</p>
//           <button
//             onClick={() => navigate('/academic-planner/create-task')}
//             className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-all"
//           >
//             + Create Task
//           </button>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           <div className="flex items-center gap-2 mb-4">
//             <div className="bg-purple-100 p-2 rounded-lg">
//               <Flame className="w-5 h-5 text-purple-600" />
//             </div>
//             <h3 className="text-xl font-bold text-gray-900">Upcoming Tasks (AI Sorted)</h3>
//           </div>

//           {tasks.map((task, index) => (
//             <div key={task._id} className="relative">
//               {/* Task Number Badge */}
//               <div className="absolute -left-4 top-6 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10">
//                 {index + 1}
//               </div>
              
//               <TaskCard
//                 task={task}
//                 onMarkComplete={handleMarkComplete}
//                 onDelete={handleDelete}
//                 onUpdate={handleUpdateTask}
//               />
//             </div>
//           ))}
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
//         .animate-slide-in { animation: slide-in 0.3s ease-out; }
//         .animate-scale-in { animation: scale-in 0.2s ease-out; }
//       `}</style>
//     </div>
//   );
// };

// export default PriorityTasks;



















// src/features/academicPlanner/PriorityTasks.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Flame, Zap, Leaf, Trash2, Edit2, X, Check, AlertCircle } from 'lucide-react';
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

// ✅ Delete Confirmation Modal
const DeleteModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 backdrop-blur-md" onClick={onCancel}></div>
      
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

// ✅ TaskCard Component
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

  // Edit Mode
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
          className="px-5 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <Edit2 className="w-4 h-4" />
          Edit
        </button>

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

// ✅ Priority Section Component
const PrioritySection = ({ title, icon: Icon, color, bgColor, tasks, onMarkComplete, onDelete, onUpdate }) => {
  if (tasks.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className={`${bgColor} p-3 rounded-xl`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} in this priority level</p>
        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <div key={task._id} className="relative">
            {/* Task Number Badge */}
            <div className="absolute -left-4 top-6 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10">
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

// ✅ Main Component
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
      
      console.log('✅ AI tasks response:', res);
      
      const aiTasks = res.data?.tasks || res.tasks || res.data || [];
      
      console.log('🤖 AI prioritized tasks:', aiTasks.length, aiTasks);
      
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
      await plannerService.markComplete(taskId, currentStatus);
      await fetchTasks();
      
      setToast({ 
        show: true, 
        message: currentStatus ? 'Task marked as pending!' : 'Task marked as completed!' 
      });
    } catch (error) {
      console.error('Mark complete error:', error);
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
      await fetchTasks();
      
      setToast({ show: true, message: 'Task deleted successfully!' });
    } catch (error) {
      console.error('Delete error:', error);
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
      console.error('Update task error:', error);
      setToast({ show: true, message: 'Failed to update task' });
    }
  };

  // ✅ Group by priority
  const groupedTasks = {
    high: tasks.filter(t => t.priority === 'High'),
    medium: tasks.filter(t => t.priority === 'Medium'),
    low: tasks.filter(t => t.priority === 'Low')
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AI-prioritized tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-8">
      {/* Toast */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          onClose={() => setToast({ show: false, message: '' })} 
        />
      )}

      {/* Delete Modal */}
      <DeleteModal 
        isOpen={deleteModal.isOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      {/* Header */}
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
          <button className="px-6 py-2.5 bg-blue-500 text-white font-semibold rounded-lg shadow-md">
            Priority Tasks
          </button>
        </div>
      </div>

      {/* Page Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-900">AI-Prioritized Tasks</h2>
        <p className="text-gray-600 text-sm mt-1">Your top 10 upcoming tasks intelligently sorted by AI based on priority and deadline</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-500 font-semibold text-sm">Total Tasks</p>
            <AlertCircle className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{tasks.length}</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 shadow-sm border-2 border-red-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-red-700 font-semibold text-sm">High Priority</p>
            <Flame className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-red-600">{groupedTasks.high.length}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 shadow-sm border-2 border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-yellow-700 font-semibold text-sm">Medium Priority</p>
            <Zap className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-yellow-600">{groupedTasks.medium.length}</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-sm border-2 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-green-700 font-semibold text-sm">Low Priority</p>
            <Leaf className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">{groupedTasks.low.length}</p>
        </div>
      </div>

      {/* Tasks Sections */}
      {tasks.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Upcoming Tasks</h3>
          <p className="text-gray-600 mb-6">Create your first task to see AI-powered prioritization!</p>
          <button
            onClick={() => navigate('/academic-planner/create-task')}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-all"
          >
            + Create Task
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* High Priority Section */}
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

          {/* Medium Priority Section */}
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

          {/* Low Priority Section */}
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
          to { transform: scale(1); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
        .animate-scale-in { animation: scale-in 0.2s ease-out; }
      `}</style>
    </div>
  );
};

export default PriorityTasks;
