// src/pages/profile/ViewProfile.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, User, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import authService from '../../services/authService';

const ViewProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      // ✅ GET /api/users/view-profile
      const response = await authService.getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-300">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-300">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-[#1a1b1e] dark:to-[#23272f] pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:opacity-80 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Profile Card */}
        <div className="bg-white dark:bg-[#23272f] rounded-2xl shadow-xl p-8 mb-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt="Avatar"
                className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-6xl font-bold shadow-lg">
                {(profile.userName || profile.fullName || 'U')[0].toUpperCase()}
              </div>
            )}
          </div>

          {/* Profile Details */}
          <div className="space-y-6">
            {/* Full Name */}
            <div className="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <User className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Full Name
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                  {profile.fullName || 'Not set'}
                </p>
              </div>
            </div>

            {/* Username */}
            <div className="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <User className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Username
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                  {profile.userName || 'Not set'}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <Mail className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Email
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                  {profile.email}
                </p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <User className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Role
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                  {profile.role || 'User'}
                </p>
              </div>
            </div>

            {/* Account Status */}
            <div className="flex items-start gap-4">
              <Calendar className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Account Status
                </p>
                <p className="text-lg font-semibold text-green-600 dark:text-green-400 mt-1">
                  {profile.accountStatus || 'Active'}
                </p>
              </div>
            </div>

            {/* Member Since */}
            {profile.createdAt && (
              <div className="flex items-start gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Calendar className="w-6 h-6 text-gray-500 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Member Since
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Edit Button */}
          <div className="mt-8">
            <button
              onClick={() => navigate('/profile/edit')}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
