import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { validateEmail } from '../../utils/validation';

const ForgetPassword = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      const response = await authService.forgetPassword(email);
      console.log('Password reset email sent:', response);
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/auth/login');
      }, 3000);
    } catch (error) {
      setApiError(error.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
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

        {/* Right - Forget Password Card */}
        <div className="backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md mx-auto animate-slide-up bg-white/90 border border-white/50">
          
          {success ? (
            // Success Message
            <div className="text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Email Sent!
              </h2>
              <p className="text-gray-600">
                We've sent password reset instructions to your email. Please check your inbox.
              </p>
              <p className="text-sm text-[#2196F3]">
                Redirecting to login...
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
                Forget password?
              </h2>
              
              <p className="text-center text-sm mb-6 text-gray-600">
                No worries! We will send you a reset instructions email.
              </p>

              {/* Error Alert */}
              {apiError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm animate-shake">
                  {apiError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className={`w-full px-4 py-3 rounded-xl border transition-all ${
                      error 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500 focus:border-[#2196F3] focus:ring-[#2196F3]'
                    } focus:outline-none focus:ring-2`}
                  />
                  {error && (
                    <p className="text-red-500 text-xs mt-1 animate-fade-in">{error}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#2196F3] text-white py-3 rounded-full font-semibold hover:bg-[#1976D2] transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Sending...
                    </span>
                  ) : 'Send login link'}
                </button>
              </form>

              {/* Back to Login Link */}
              <div className="text-center mt-6">
                <Link
                  to="/auth/login"
                  className="text-sm text-gray-600 hover:text-[#2196F3] transition-colors flex items-center justify-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Login
                </Link>
              </div>
            </>
          )}
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

export default ForgetPassword;
