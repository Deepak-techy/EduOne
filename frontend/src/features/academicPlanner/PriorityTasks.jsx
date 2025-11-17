// // src/features/academicPlanner/PriorityTasks.jsx
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Calendar, Flame, Zap, Leaf, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
// import plannerService from '../../services/plannerService';
// import { toast } from 'react-toastify';

// const PriorityTasks = () => {
//   const navigate = useNavigate();
//   const [tasks, setTasks] = useState({ high: [], medium: [], low: [] });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   const fetchTasks = async () => {
//     try {
//       const res = await plannerService.getAllTasks();
//       const allTasks = res.data.tasks || [];
      
//       setTasks({
//         high: allTasks.filter(t => t.priority === 'High'),
//         medium: allTasks.filter(t => t.priority === 'Medium'),
//         low: allTasks.filter(t => t.priority === 'Low')
//       });
//     } catch (error) {
//       console.error('Fetch error:', error);
//       toast.error('Failed to load tasks');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (taskId) => {
//     if (!window.confirm('Are you sure you want to delete this task?')) return;
    
//     try {
//       await plannerService.deleteTask(taskId);
//       toast.success('Task deleted successfully!');
//       fetchTasks();
//     } catch (error) {
//       toast.error('Failed to delete task');
//     }
//   };

//   const handleMarkComplete = async (taskId, task) => {
//     try {
//       await plannerService.markComplete(taskId, task);
//       toast.success('Task marked as completed!');
//       fetchTasks();
//     } catch (error) {
//       toast.error('Failed to update task');
//     }
//   };

//   const PrioritySection = ({ title, tasks, icon: Icon, color, bgColor, borderColor }) => (
//     <div className="space-y-4">
//       <div className="flex items-center gap-3 mb-4">
//         <div className={`${bgColor} p-3 rounded-xl`}>
//           <Icon className={`w-6 h-6 ${color}`} />
//         </div>
//         <div>
//           <h3 className="text-xl font-bold text-gray-900">{title}</h3>
//           <p className="text-sm text-gray-500">{tasks.length} tasks</p>
//         </div>
//       </div>

//       {tasks.length === 0 ? (
//         <div className={`${bgColor} border-2 ${borderColor} rounded-2xl p-6 text-center`}>
//           <p className="text-gray-500">No {title.toLowerCase()} priority tasks</p>
//         </div>
//       ) : (
//         <div className="space-y-3">
//           {tasks.map((task) => (
//             <div
//               key={task._id}
//               className={`group bg-white border-2 ${borderColor} rounded-2xl p-5 hover:shadow-lg transition-all duration-300`}
//             >
//               <div className="flex items-start justify-between">
//                 <div className="flex-1">
//                   <div className="flex items-center gap-3 mb-2">
//                     <h4 className="text-lg font-bold text-gray-900">{task.subject}</h4>
//                     {task.isCompleted && (
//                       <span className="px-3 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-full">
//                         Completed
//                       </span>
//                     )}
//                   </div>
//                   <p className="text-gray-600 mb-3">{task.task}</p>
//                   <div className="flex items-center gap-4 text-sm text-gray-500">
//                     <span className="flex items-center gap-1">
//                       <Calendar className="w-4 h-4" />
//                       {new Date(task.dueDate).toLocaleDateString('en-GB', {
//                         day: 'numeric',
//                         month: 'short',
//                         year: 'numeric'
//                       })}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-2 ml-4">
//                   {!task.isCompleted && (
//                     <button
//                       onClick={() => handleMarkComplete(task._id, task)}
//                       className="p-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-all"
//                       title="Mark as completed"
//                     >
//                       <CheckCircle2 className="w-5 h-5" />
//                     </button>
//                   )}
//                   <button
//                     onClick={() => handleDelete(task._id)}
//                     className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all opacity-0 group-hover:opacity-100"
//                     title="Delete task"
//                   >
//                     <Trash2 className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );

//   if (loading) return <div className="p-8">Loading...</div>;

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
//       <div className="mb-8">
//         <h2 className="text-3xl font-bold text-gray-900 mb-2">Priority Overview</h2>
//         <p className="text-gray-600">Organize your tasks by priority level</p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-4 gap-6 mb-8">
//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-gray-500 font-semibold text-sm">Total Tasks</p>
//             <AlertCircle className="w-5 h-5 text-blue-500" />
//           </div>
//           <p className="text-3xl font-bold text-gray-900">
//             {tasks.high.length + tasks.medium.length + tasks.low.length}
//           </p>
//         </div>

//         <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 shadow-sm border-2 border-red-200">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-red-700 font-semibold text-sm">High Priority</p>
//             <Flame className="w-5 h-5 text-red-500" />
//           </div>
//           <p className="text-3xl font-bold text-red-600">{tasks.high.length}</p>
//         </div>

//         <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 shadow-sm border-2 border-yellow-200">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-yellow-700 font-semibold text-sm">Medium Priority</p>
//             <Zap className="w-5 h-5 text-yellow-500" />
//           </div>
//           <p className="text-3xl font-bold text-yellow-600">{tasks.medium.length}</p>
//         </div>

//         <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-sm border-2 border-green-200">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-green-700 font-semibold text-sm">Low Priority</p>
//             <Leaf className="w-5 h-5 text-green-500" />
//           </div>
//           <p className="text-3xl font-bold text-green-600">{tasks.low.length}</p>
//         </div>
//       </div>

//       {/* Priority Sections */}
//       <div className="space-y-8">
//         <PrioritySection
//           title="High Priority"
//           tasks={tasks.high}
//           icon={Flame}
//           color="text-red-500"
//           bgColor="bg-red-50"
//           borderColor="border-red-200"
//         />

//         <PrioritySection
//           title="Medium Priority"
//           tasks={tasks.medium}
//           icon={Zap}
//           color="text-yellow-500"
//           bgColor="bg-yellow-50"
//           borderColor="border-yellow-200"
//         />

//         <PrioritySection
//           title="Low Priority"
//           tasks={tasks.low}
//           icon={Leaf}
//           color="text-green-500"
//           bgColor="bg-green-50"
//           borderColor="border-green-200"
//         />
//       </div>
//     </div>
//   );
// };

// export default PriorityTasks;








// // src/features/academicPlanner/PriorityTasks.jsx
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Calendar, Flame, Zap, Leaf, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
// import plannerService from '../../services/plannerService';
// import { toast } from 'react-toastify';

// const PriorityTasks = () => {
//   const navigate = useNavigate();
//   const [tasks, setTasks] = useState({ high: [], medium: [], low: [] });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   const fetchTasks = async () => {
//     try {
//       const res = await plannerService.getAllTasks();
//       const allTasks = res.data.tasks || [];
      
//       // Get current week date range
//       const today = new Date();
//       const dayOfWeek = today.getDay();
//       const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
//       const monday = new Date(today);
//       monday.setDate(today.getDate() + mondayOffset);
//       monday.setHours(0, 0, 0, 0);
      
//       const sunday = new Date(monday);
//       sunday.setDate(monday.getDate() + 6);
//       sunday.setHours(23, 59, 59, 999);

//       // Filter: only PENDING tasks from CURRENT WEEK
//       const pendingThisWeek = allTasks.filter(task => {
//         if (task.isCompleted) return false; // Skip completed
//         const dueDate = new Date(task.dueDate);
//         return dueDate >= monday && dueDate <= sunday;
//       });

//       // Group by priority and take top 10 from each
//       const highPriority = pendingThisWeek.filter(t => t.priority === 'High').slice(0, 10);
//       const mediumPriority = pendingThisWeek.filter(t => t.priority === 'Medium').slice(0, 10);
//       const lowPriority = pendingThisWeek.filter(t => t.priority === 'Low').slice(0, 10);

//       setTasks({
//         high: highPriority,
//         medium: mediumPriority,
//         low: lowPriority
//       });
//     } catch (error) {
//       console.error('Fetch error:', error);
//       toast.error('Failed to load tasks');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (taskId) => {
//     if (!window.confirm('Are you sure you want to delete this task?')) return;
    
//     try {
//       await plannerService.deleteTask(taskId);
//       toast.success('Task deleted successfully!');
//       fetchTasks();
//     } catch (error) {
//       toast.error('Failed to delete task');
//     }
//   };

//   const handleMarkComplete = async (taskId, task) => {
//     try {
//       await plannerService.markComplete(taskId, task);
//       toast.success('Task marked as completed!');
//       fetchTasks();
//     } catch (error) {
//       toast.error('Failed to update task');
//     }
//   };

//   const PrioritySection = ({ title, tasks, icon: Icon, color, bgColor, borderColor }) => (
//     <div className="space-y-4">
//       <div className="flex items-center gap-3 mb-4">
//         <div className={`${bgColor} p-3 rounded-xl`}>
//           <Icon className={`w-6 h-6 ${color}`} />
//         </div>
//         <div>
//           <h3 className="text-xl font-bold text-gray-900">{title}</h3>
//           <p className="text-sm text-gray-500">{tasks.length} tasks</p>
//         </div>
//       </div>

//       {tasks.length === 0 ? (
//         <div className={`${bgColor} border-2 ${borderColor} rounded-2xl p-6 text-center`}>
//           <p className="text-gray-500">No {title.toLowerCase()} priority tasks this week</p>
//         </div>
//       ) : (
//         <div className="space-y-3">
//           {tasks.map((task) => (
//             <div
//               key={task._id}
//               className={`group bg-white border-2 ${borderColor} rounded-2xl p-5 hover:shadow-lg transition-all duration-300`}
//             >
//               <div className="flex items-start justify-between">
//                 <div className="flex-1">
//                   <div className="flex items-center gap-3 mb-2">
//                     <h4 className="text-lg font-bold text-gray-900">{task.subject}</h4>
//                     {/* Pending Badge */}
//                     <span className="px-3 py-1 bg-orange-100 text-orange-600 text-xs font-semibold rounded-full">
//                       Pending
//                     </span>
//                   </div>
//                   <p className="text-gray-600 mb-3">{task.task}</p>
//                   <div className="flex items-center gap-4 text-sm text-gray-500">
//                     <span className="flex items-center gap-1">
//                       <Calendar className="w-4 h-4" />
//                       {new Date(task.dueDate).toLocaleDateString('en-GB', {
//                         day: 'numeric',
//                         month: 'short',
//                         year: 'numeric'
//                       })}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-2 ml-4">
//                   <button
//                     onClick={() => handleMarkComplete(task._id, task)}
//                     className="p-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-all"
//                     title="Mark as completed"
//                   >
//                     <CheckCircle2 className="w-5 h-5" />
//                   </button>
//                   <button
//                     onClick={() => handleDelete(task._id)}
//                     className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all opacity-0 group-hover:opacity-100"
//                     title="Delete task"
//                   >
//                     <Trash2 className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );

//   if (loading) return <div className="p-8">Loading...</div>;

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
//       <div className="mb-8">
//         <h2 className="text-3xl font-bold text-gray-900 mb-2">Priority Overview</h2>
//         <p className="text-gray-600">Top 10 pending tasks from this week by priority</p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-4 gap-6 mb-8">
//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-gray-500 font-semibold text-sm">Total Pending</p>
//             <AlertCircle className="w-5 h-5 text-blue-500" />
//           </div>
//           <p className="text-3xl font-bold text-gray-900">
//             {tasks.high.length + tasks.medium.length + tasks.low.length}
//           </p>
//         </div>

//         <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 shadow-sm border-2 border-red-200">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-red-700 font-semibold text-sm">High Priority</p>
//             <Flame className="w-5 h-5 text-red-500" />
//           </div>
//           <p className="text-3xl font-bold text-red-600">{tasks.high.length}</p>
//         </div>

//         <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 shadow-sm border-2 border-yellow-200">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-yellow-700 font-semibold text-sm">Medium Priority</p>
//             <Zap className="w-5 h-5 text-yellow-500" />
//           </div>
//           <p className="text-3xl font-bold text-yellow-600">{tasks.medium.length}</p>
//         </div>

//         <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-sm border-2 border-green-200">
//           <div className="flex items-center justify-between mb-2">
//             <p className="text-green-700 font-semibold text-sm">Low Priority</p>
//             <Leaf className="w-5 h-5 text-green-500" />
//           </div>
//           <p className="text-3xl font-bold text-green-600">{tasks.low.length}</p>
//         </div>
//       </div>

//       {/* Priority Sections */}
//       <div className="space-y-8">
//         <PrioritySection
//           title="High Priority"
//           tasks={tasks.high}
//           icon={Flame}
//           color="text-red-500"
//           bgColor="bg-red-50"
//           borderColor="border-red-200"
//         />

//         <PrioritySection
//           title="Medium Priority"
//           tasks={tasks.medium}
//           icon={Zap}
//           color="text-yellow-500"
//           bgColor="bg-yellow-50"
//           borderColor="border-yellow-200"
//         />

//         <PrioritySection
//           title="Low Priority"
//           tasks={tasks.low}
//           icon={Leaf}
//           color="text-green-500"
//           bgColor="bg-green-50"
//           borderColor="border-green-200"
//         />
//       </div>
//     </div>
//   );
// };

// export default PriorityTasks;
























// src/features/academicPlanner/PriorityTasks.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Flame, Zap, Leaf, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import plannerService from '../../services/plannerService';
import { toast } from 'react-toastify';

const PriorityTasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState({ high: [], medium: [], low: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await plannerService.getAllTasks();
      
      const allTasks = res.data?.tasks || res.tasks || res.data || [];
      
      const today = new Date();
      const dayOfWeek = today.getDay();
      const sunday = new Date(today);
      sunday.setDate(today.getDate() - dayOfWeek);
      sunday.setHours(0, 0, 0, 0);
      
      const saturday = new Date(sunday);
      saturday.setDate(sunday.getDate() + 6);
      saturday.setHours(23, 59, 59, 999);

      const pendingThisWeek = allTasks.filter(task => {
        if (task.isCompleted) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate >= sunday && dueDate <= saturday;
      });

      setTasks({
        high: pendingThisWeek.filter(t => t.priority === 'High').slice(0, 10),
        medium: pendingThisWeek.filter(t => t.priority === 'Medium').slice(0, 10),
        low: pendingThisWeek.filter(t => t.priority === 'Low').slice(0, 10)
      });
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await plannerService.deleteTask(taskId);
      toast.success('Task deleted successfully!');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleMarkComplete = async (taskId, task) => {
    try {
      await plannerService.markComplete(taskId, task);
      toast.success('Task marked as completed!');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const PrioritySection = ({ title, tasks, icon: Icon, color, bgColor, borderColor }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className={`${bgColor} p-3 rounded-xl`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{tasks.length} tasks</p>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className={`${bgColor} border-2 ${borderColor} rounded-2xl p-6 text-center`}>
          <p className="text-gray-500">No {title.toLowerCase()} priority tasks this week</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task._id}
              className={`group bg-white border-2 ${borderColor} rounded-2xl p-5 hover:shadow-lg transition-all duration-300`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-bold text-gray-900">{task.subject}</h4>
                    <span className="px-3 py-1 bg-orange-100 text-orange-600 text-xs font-semibold rounded-full">
                      Pending
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{task.task}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(task.dueDate).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleMarkComplete(task._id, task)}
                    className="p-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-all"
                    title="Mark as completed"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all opacity-0 group-hover:opacity-100"
                    title="Delete task"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (loading) return <div className="p-8">Loading...</div>;

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

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Priority Overview</h2>
        <p className="text-gray-600">Top 10 pending tasks from this week by priority</p>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-500 font-semibold text-sm">Total Pending</p>
            <AlertCircle className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {tasks.high.length + tasks.medium.length + tasks.low.length}
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 shadow-sm border-2 border-red-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-red-700 font-semibold text-sm">High Priority</p>
            <Flame className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-red-600">{tasks.high.length}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 shadow-sm border-2 border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-yellow-700 font-semibold text-sm">Medium Priority</p>
            <Zap className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-yellow-600">{tasks.medium.length}</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-sm border-2 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-green-700 font-semibold text-sm">Low Priority</p>
            <Leaf className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">{tasks.low.length}</p>
        </div>
      </div>

      <div className="space-y-8">
        <PrioritySection
          title="High Priority"
          tasks={tasks.high}
          icon={Flame}
          color="text-red-500"
          bgColor="bg-red-50"
          borderColor="border-red-200"
        />

        <PrioritySection
          title="Medium Priority"
          tasks={tasks.medium}
          icon={Zap}
          color="text-yellow-500"
          bgColor="bg-yellow-50"
          borderColor="border-yellow-200"
        />

        <PrioritySection
          title="Low Priority"
          tasks={tasks.low}
          icon={Leaf}
          color="text-green-500"
          bgColor="bg-green-50"
          borderColor="border-green-200"
        />
      </div>
    </div>
  );
};

export default PriorityTasks;
