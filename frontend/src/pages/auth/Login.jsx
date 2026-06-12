
// src/pages/auth/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.identifier) newErrors.identifier = "Username or email is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError('');

    try {
      const isEmail = formData.identifier.includes('@');
      const payload = isEmail
        ? { email: formData.identifier, password: formData.password }
        : { userName: formData.identifier, password: formData.password };

      // ✅ Backend sets httpOnly cookies automatically
      const loginRes = await authService.login(payload);

      // ✅ Determine user role for redirect
      const loggedUser = loginRes?.data?.user || loginRes?.user || loginRes?.data;
      const userRole = loggedUser?.role;

      // Role-specific welcome messages
      const toastMessages = {
        Admin: 'Welcome back, Admin! 🛡️',
        Teacher: 'Welcome back, Educator! 📚',
        Student: 'Login successful! Welcome back! 🎉',
      };

      toast.success(toastMessages[userRole] || 'Login successful!', {
        position: 'top-right',
        autoClose: 2000,
      });

      // ✅ Role-based redirect
      const redirectPaths = {
        Admin: '/admin/dashboard',
        Teacher: '/',
        Student: '/',
      };

      setTimeout(() => {
        window.location.href = redirectPaths[userRole] || '/';
      }, 1000);
      
    } catch (error) {
      setApiError(error.message || 'Login failed. Please try again.');
      toast.error(error.message || 'Login failed. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden bg-gradient-to-br from-blue-100 via-cyan-100 to-blue-200">
      {/* Bubbles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full opacity-30 animate-float bg-blue-300"></div>
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full opacity-40 animate-float-delay-1 bg-cyan-300"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 rounded-full opacity-20 animate-float-delay-2 bg-blue-200"></div>
        <div className="absolute bottom-40 right-1/3 w-20 h-20 rounded-full opacity-50 animate-float bg-cyan-400"></div>
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Branding */}
        <div className="hidden lg:flex flex-col items-start space-y-4 animate-fade-in">
          <h2 className="text-xl font-medium tracking-wide text-gray-600">WELCOME TO</h2>
          <h1 className="text-7xl font-bold text-[#2196F3] drop-shadow-lg">EDUONE</h1>
        </div>

        {/* Login Card */}
        <div className="backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md mx-auto animate-slide-up bg-white/90 border border-white/50">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">LOG IN</h2>
          {apiError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm animate-shake">
              {apiError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username/Email */}
            <div>
              <input
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                placeholder="Username or Email"
                className={`w-full px-4 py-3 rounded-xl border transition-all ${
                  errors.identifier 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-[#2196F3] focus:ring-[#2196F3]'
                } focus:outline-none focus:ring-2`}
              />
              {errors.identifier && (
                <p className="text-red-500 text-xs mt-1 animate-fade-in">{errors.identifier}</p>
              )}
            </div>
            {/* Password */}
            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`w-full px-4 py-3 rounded-xl border transition-all ${
                  errors.password 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-[#2196F3] focus:ring-[#2196F3]'
                } focus:outline-none focus:ring-2`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 animate-fade-in">{errors.password}</p>
              )}
            </div>
            {/* Forgot Password */}
            <div className="text-right">
              <Link to="/auth/forget-password" className="text-sm text-[#2196F3] hover:text-[#1976D2] transition-colors">
                Forgot Password?
              </Link>
            </div>
            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2196F3] text-white py-3 rounded-full font-semibold hover:bg-[#1976D2] transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Logging in...
                </span>
              ) : 'LOG IN'}
            </button>
          </form>
          {/* Sign Up Link */}
          <p className="text-center text-sm mt-6 text-gray-600">
            Don't have an account?{' '}
            <Link to="/auth/signup" className="text-[#2196F3] font-medium hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes float { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-20px) scale(1.05); } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delay-1 { animation: float 8s ease-in-out infinite 2s; }
        .animate-float-delay-2 { animation: float 7s ease-in-out infinite 4s; }
        .animate-slide-up { animation: slide-up 0.6s ease-out; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .animate-fade-in { animation: slide-up 0.8s ease-out; }
      `}</style>
    </div>
  );
};

export default Login;
