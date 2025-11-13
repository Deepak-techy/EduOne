// src/features/academicPlanner/CreateTask.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Plus, Tag, FileText, CalendarDays } from 'lucide-react';
import plannerService from '../../services/plannerService';
import { toast } from 'react-toastify';

const CreateTask = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    task: '',
    dueDate: '',
    priority: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.task || !formData.dueDate || !formData.priority) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      await plannerService.createTask(formData);
      toast.success('Task created successfully!');
      setFormData({ subject: '', task: '', dueDate: '', priority: '' });
      navigate('/academic-planner/view-tasks');
    } catch (error) {
      toast.error(error.message || 'Failed to create task');
    }
  };

  const priorityOptions = [
    { label: 'High', color: 'bg-red-500', ring: 'ring-red-200', text: 'text-red-600' },
    { label: 'Medium', color: 'bg-yellow-500', ring: 'ring-yellow-200', text: 'text-yellow-600' },
    { label: 'Low', color: 'bg-green-500', ring: 'ring-green-200', text: 'text-green-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-10">
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
          <button
            onClick={() => navigate('/academic-planner/view-tasks')}
            className="px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-blue-400 transition-all"
          >
            View Tasks
          </button>
          <button className="px-6 py-2.5 bg-blue-500 text-white font-semibold rounded-lg shadow-md">
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

      {/* Main Content - Split Layout */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left Side - Form */}
        <div className="col-span-7">
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Create New Task</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Subject Input */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                  <FileText className="w-5 h-5 text-blue-500" />
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g., DSA, OS, DBMS"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* Task Input */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                  <Tag className="w-5 h-5 text-blue-500" />
                  Task Description
                </label>
                <input
                  type="text"
                  placeholder="e.g., Complete Assignment 3"
                  value={formData.task}
                  onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                  className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* Date Input */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                  <CalendarDays className="w-5 h-5 text-blue-500" />
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all text-gray-900"
                />
              </div>

              {/* Priority Selection */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                  <Tag className="w-5 h-5 text-blue-500" />
                  Priority Level
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {priorityOptions.map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => setFormData({ ...formData, priority: option.label })}
                      className={`
                        px-5 py-4 rounded-xl font-semibold transition-all border-2
                        ${formData.priority === option.label 
                          ? `${option.color} text-white border-transparent shadow-lg ring-4 ${option.ring}` 
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${formData.priority === option.label ? 'bg-white' : option.color}`} />
                        {option.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold text-lg px-8 py-5 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Create Task
              </button>
            </form>
          </div>
        </div>

        {/* Right Side - Preview Card */}
        <div className="col-span-5">
          <div className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-3xl shadow-lg p-8 text-white sticky top-8">
            <h3 className="text-2xl font-bold mb-6">Task Preview</h3>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
              <p className="text-blue-100 text-sm mb-2">Subject</p>
              <p className="text-xl font-semibold">
                {formData.subject || 'Enter subject name'}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
              <p className="text-blue-100 text-sm mb-2">Task</p>
              <p className="text-xl font-semibold">
                {formData.task || 'Enter task description'}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
              <p className="text-blue-100 text-sm mb-2">Due Date</p>
              <p className="text-xl font-semibold">
                {formData.dueDate 
                  ? new Date(formData.dueDate).toLocaleDateString('en-GB', { 
                      day: '2-digit', 
                      month: 'short', 
                      year: 'numeric' 
                    })
                  : 'Select a date'
                }
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <p className="text-blue-100 text-sm mb-2">Priority</p>
              <div className="flex items-center gap-3">
                {formData.priority ? (
                  <>
                    <div className={`w-4 h-4 rounded-full ${
                      formData.priority === 'High' ? 'bg-red-400' :
                      formData.priority === 'Medium' ? 'bg-yellow-400' :
                      'bg-green-400'
                    }`} />
                    <p className="text-xl font-semibold">{formData.priority}</p>
                  </>
                ) : (
                  <p className="text-xl font-semibold">Choose priority</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;
