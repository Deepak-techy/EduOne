// src/features/academicPlanner/CreateTask.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, BookOpen, FileText, CalendarDays, Flag } from 'lucide-react';
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePrioritySelect = (priority) => {
    setFormData(prev => ({
      ...prev,
      priority
    }));
  };

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
      console.error('Error:', error);
      toast.error(error.message || 'Failed to create task');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 p-2.5 rounded-xl">
            <Calendar className="w-6 h-6 text-white" />
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

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left - Form */}
        <div className="col-span-7 bg-white rounded-3xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-100 p-3 rounded-xl">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Create New Task</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subject */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g., DSA, OS, DBMS"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
              />
            </div>

            {/* Task Description */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FileText className="w-4 h-4 text-blue-500" />
                Task Description
              </label>
              <textarea
                name="task"
                value={formData.task}
                onChange={handleChange}
                placeholder="e.g., Complete Assignment 3"
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all resize-none"
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <CalendarDays className="w-4 h-4 text-blue-500" />
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
              />
            </div>

            {/* Priority Level */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Flag className="w-4 h-4 text-blue-500" />
                Priority Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handlePrioritySelect('High')}
                  className={`py-3 px-4 rounded-xl font-semibold transition-all border-2 ${
                    formData.priority === 'High'
                      ? 'bg-red-500 text-white border-red-500'
                      : 'bg-red-50 text-red-600 border-red-200 hover:border-red-400'
                  }`}
                >
                  High
                </button>
                <button
                  type="button"
                  onClick={() => handlePrioritySelect('Medium')}
                  className={`py-3 px-4 rounded-xl font-semibold transition-all border-2 ${
                    formData.priority === 'Medium'
                      ? 'bg-yellow-500 text-white border-yellow-500'
                      : 'bg-yellow-50 text-yellow-600 border-yellow-200 hover:border-yellow-400'
                  }`}
                >
                  Medium
                </button>
                <button
                  type="button"
                  onClick={() => handlePrioritySelect('Low')}
                  className={`py-3 px-4 rounded-xl font-semibold transition-all border-2 ${
                    formData.priority === 'Low'
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-green-50 text-green-600 border-green-200 hover:border-green-400'
                  }`}
                >
                  Low
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg"
            >
              Create Task
            </button>
          </form>
        </div>

        {/* Right - Preview */}
        <div className="col-span-5">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-3xl shadow-lg p-8 text-white sticky top-8">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5" />
              <h3 className="text-xl font-bold">Task Preview</h3>
            </div>

            <div className="space-y-5">
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-sm text-white/80 mb-1">Subject</p>
                <p className="text-lg font-semibold">
                  {formData.subject || 'Enter subject name'}
                </p>
              </div>

              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-sm text-white/80 mb-1">Task</p>
                <p className="text-lg font-semibold">
                  {formData.task || 'Enter task description'}
                </p>
              </div>

              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-sm text-white/80 mb-1">Due Date</p>
                <p className="text-lg font-semibold">
                  {formData.dueDate 
                    ? new Date(formData.dueDate).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })
                    : 'Select a date'}
                </p>
              </div>

              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-sm text-white/80 mb-2">Priority</p>
                {formData.priority ? (
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
                    formData.priority === 'High' ? 'bg-red-500' :
                    formData.priority === 'Medium' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}>
                    <Flag className="w-4 h-4" />
                    {formData.priority}
                  </div>
                ) : (
                  <p className="text-lg font-semibold">Select priority level</p>
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
