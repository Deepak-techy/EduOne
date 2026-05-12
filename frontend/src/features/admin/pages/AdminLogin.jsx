// src/features/admin/pages/AdminLogin.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../../contexts/AdminAuthContext';
import { toast } from 'react-toastify';
import { ShieldCheck, Loader2, Eye, EyeOff } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, isAdminAuthenticated } = useAdminAuth();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showPw, setShowPw] = useState(false);

  if (isAdminAuthenticated) {
    navigate('/admin/dashboard', { replace: true });
    return null;
  }

  const validate = () => {
    const e = {};
    if (!form.identifier.trim()) e.identifier = 'Email or username is required';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError('');
    try {
      const isEmail = form.identifier.includes('@');
      const payload = isEmail
        ? { email: form.identifier, password: form.password }
        : { userName: form.identifier, password: form.password };
      await login(payload);
      toast.success('Welcome back, Admin! 🎉');
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      const msg = err.message || 'Login failed';
      setApiError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[#f5f7fa]">
      {/* Subtle decorative blobs */}
      <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-cyan-200/20 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2196F3] to-[#00BCD4] shadow-lg shadow-blue-500/20 mb-4">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-gray-400 text-sm mt-1">EduOne Management Console</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-xl shadow-gray-200/50">
          {apiError && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">{apiError}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email or Username</label>
              <input
                type="text"
                value={form.identifier}
                onChange={e => { setForm(f => ({ ...f, identifier: e.target.value })); setErrors({}); setApiError(''); }}
                placeholder="admin@eduone.com"
                className={`w-full px-4 py-3 rounded-xl bg-gray-50 border text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition ${errors.identifier ? 'border-red-300 focus:ring-red-300' : 'border-gray-200 focus:ring-blue-500/30 focus:border-blue-300'}`}
              />
              {errors.identifier && <p className="text-red-500 text-xs mt-1">{errors.identifier}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors({}); setApiError(''); }}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 pr-12 rounded-xl bg-gray-50 border text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition ${errors.password ? 'border-red-300 focus:ring-red-300' : 'border-gray-200 focus:ring-blue-500/30 focus:border-blue-300'}`}
                />
                <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#2196F3] to-[#00BCD4] text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Authenticating…</> : 'Sign In to Admin Panel'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-5">
            Only authorized administrators can access this portal.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
