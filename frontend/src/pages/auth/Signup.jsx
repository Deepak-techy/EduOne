import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { validateEmail, validatePassword, validateName, validateUsername, validateRole } from '../../utils/validation';
import { toast } from 'react-toastify';


const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    userName: '',
    email: '',
    // phone: '',
    role: '',
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

    const nameError = validateName(formData.fullName);
    if (nameError) newErrors.fullName = nameError;

    const usernameError = validateUsername(formData.userName);
    if (usernameError) newErrors.userName = usernameError;

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    // const phoneError = validatePhone(formData.phone);
    // if (phoneError) newErrors.phone = phoneError;

    const roleError = validateRole(formData.role);
    if (roleError) newErrors.role = roleError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError('');

    try {
      const response = await authService.register(formData);
      toast.success('Registered successfully! Please log in.');
      navigate('/auth/login');
    } catch (error) {
      setApiError(error.message || 'Registration failed. Please try again.');
      toast.error(error.message || 'Registration failed. Please try again.');
    }
    finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    alert('Google signup will be implemented with backend integration');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden bg-gradient-to-br from-blue-100 via-cyan-100 to-blue-200">

      {/* Animated Bubbles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full opacity-30 animate-float bg-blue-300"></div>
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full opacity-40 animate-float-delay-1 bg-cyan-300"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 rounded-full opacity-20 animate-float-delay-2 bg-blue-200"></div>
        <div className="absolute bottom-40 right-1/3 w-20 h-20 rounded-full opacity-50 animate-float bg-cyan-400"></div>
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center relative z-10">

        {/* Left - Branding */}
        <div className="hidden lg:flex flex-col items-start space-y-4 animate-fade-in">
          <h2 className="text-xl font-medium tracking-wide text-gray-600">
            WELCOME TO
          </h2>
          <h1 className="text-7xl font-bold text-[#2196F3] drop-shadow-lg">
            EDUONE
          </h1>
        </div>

        {/* Right - Signup Card */}
        <div className="backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md mx-auto animate-slide-up bg-white/90 border border-white/50">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Sign Up
          </h2>

          {/* Error Alert */}
          {apiError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm animate-shake">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name & Username Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className={`w-full px-4 py-3 rounded-xl border transition-all ${errors.fullName
                      ? 'border-red-500 focus:ring-red-500'
                      : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-[#2196F3] focus:ring-[#2196F3]'
                    } focus:outline-none focus:ring-2`}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder="Username"
                  className={`w-full px-4 py-3 rounded-xl border transition-all ${errors.userName
                      ? 'border-red-500 focus:ring-red-500'
                      : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-[#2196F3] focus:ring-[#2196F3]'
                    } focus:outline-none focus:ring-2`}
                />
                {errors.userName && (
                  <p className="text-red-500 text-xs mt-1">{errors.userName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className={`w-full px-4 py-3 rounded-xl border transition-all ${errors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-[#2196F3] focus:ring-[#2196F3]'
                  } focus:outline-none focus:ring-2`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>


            {/* Role Dropdown */}
            <div>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border transition-all ${errors.role
                    ? 'border-red-500 focus:ring-red-500'
                    : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-[#2196F3] focus:ring-[#2196F3]'
                  } focus:outline-none focus:ring-2`}
              >
                <option value="" disabled>Select Role</option>
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-xs mt-1">{errors.role}</p>
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
                className={`w-full px-4 py-3 rounded-xl border transition-all ${errors.password
                    ? 'border-red-500 focus:ring-red-500'
                    : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-[#2196F3] focus:ring-[#2196F3]'
                  } focus:outline-none focus:ring-2`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-sm text-gray-500">OR</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              className="w-full py-3 rounded-xl border bg-white border-gray-300 text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 font-medium"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2196F3] text-white py-3 rounded-full font-semibold hover:bg-[#1976D2] transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing up...
                </span>
              ) : 'Sign Up'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm mt-6 text-gray-600">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-[#2196F3] font-medium hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
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

export default Signup;
