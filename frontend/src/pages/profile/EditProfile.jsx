// // src/pages/profile/EditProfile.jsx

// import { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ArrowLeft, Upload, Loader } from 'lucide-react';
// import { toast } from 'react-toastify';
// import authService from '../../services/authService';

// const EditProfile = () => {
//   const navigate = useNavigate();
//   const fileInputRef = useRef(null);
  
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState(false);
//   const [previewImage, setPreviewImage] = useState(null);
  
//   const [formData, setFormData] = useState({
//     fullName: '',
//     userName: '',
//     email: '',
//   });

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       setLoading(true);
//       // ✅ GET /api/users/view-profile
//       const response = await authService.getProfile();
//       setProfile(response.data);
//       setFormData({
//         fullName: response.data.fullName || '',
//         userName: response.data.userName || '',
//         email: response.data.email || '',
//       });
//       setPreviewImage(response.data.avatar || null);
//     } catch (error) {
//       console.error('Error fetching profile:', error);
//       toast.error('Failed to load profile');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleAvatarChange = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       // Show preview
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreviewImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleUpdateAvatar = async () => {
//     if (!fileInputRef.current?.files?.[0]) {
//       toast.error('Please select an avatar first');
//       return;
//     }

//     try {
//       setUpdating(true);
//       const file = fileInputRef.current.files[0];
//       const formDataObj = new FormData();
//       formDataObj.append('avatar', file);

//       // ✅ PATCH /api/users/update-avatar (multipart/form-data)
//       const response = await authService.updateAvatar(formDataObj);
      
//       // Update localStorage
//       const user = JSON.parse(localStorage.getItem('user'));
//       user.avatarUrl = response.data.avatar;
//       localStorage.setItem('user', JSON.stringify(user));
      
//       toast.success('Avatar updated successfully!');
//       fileInputRef.current.value = '';
//     } catch (error) {
//       console.error('Error updating avatar:', error);
//       toast.error('Failed to update avatar');
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const handleUpdateProfile = async () => {
//     try {
//       setUpdating(true);

//       // ✅ PATCH /api/users/update-profile (JSON body)
//       const response = await authService.updateProfile({
//         fullName: formData.fullName,
//         userName: formData.userName,
//         email: formData.email,
//       });

//       // Update localStorage
//       const user = JSON.parse(localStorage.getItem('user'));
//       user.fullName = response.data.fullName;
//       user.userName = response.data.userName;
//       user.email = response.data.email;
//       localStorage.setItem('user', JSON.stringify(user));

//       toast.success('Profile updated successfully!');
//       setTimeout(() => navigate('/profile'), 1500);
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       toast.error(error?.message || 'Failed to update profile');
//     } finally {
//       setUpdating(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-gray-600 dark:text-gray-300">Loading profile...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-[#1a1b1e] dark:to-[#23272f] pt-24 pb-12">
//       <div className="max-w-2xl mx-auto px-6">
//         {/* Header */}
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:opacity-80 mb-6 transition"
//         >
//           <ArrowLeft className="w-5 h-5" />
//           <span>Back</span>
//         </button>

//         {/* Edit Form Card */}
//         <div className="bg-white dark:bg-[#23272f] rounded-2xl shadow-xl p-8">
//           <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Edit Profile</h2>

//           {/* Avatar Section */}
//           <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
//             <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide mb-4">
//               Profile Picture
//             </p>
            
//             <div className="flex flex-col items-center gap-4">
//               {previewImage ? (
//                 <img
//                   src={previewImage}
//                   alt="Preview"
//                   className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
//                 />
//               ) : (
//                 <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500">
//                   No image
//                 </div>
//               )}

//               <div className="flex gap-2">
//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   accept="image/*"
//                   onChange={handleAvatarChange}
//                   className="hidden"
//                 />
//                 <button
//                   onClick={() => fileInputRef.current?.click()}
//                   className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
//                 >
//                   <Upload className="w-4 h-4" />
//                   Choose Image
//                 </button>

//                 {previewImage && fileInputRef.current?.files?.[0] && (
//                   <button
//                     onClick={handleUpdateAvatar}
//                     disabled={updating}
//                     className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
//                   >
//                     {updating && <Loader className="w-4 h-4 animate-spin" />}
//                     Upload
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Form Fields */}
//           <div className="space-y-6 mb-8">
//             {/* Full Name */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                 Full Name
//               </label>
//               <input
//                 type="text"
//                 name="fullName"
//                 value={formData.fullName}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2d3748] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//                 placeholder="Enter your full name"
//               />
//             </div>

//             {/* Username */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                 Username
//               </label>
//               <input
//                 type="text"
//                 name="userName"
//                 value={formData.userName}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2d3748] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//                 placeholder="Enter your username"
//               />
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2d3748] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//                 placeholder="Enter your email"
//               />
//             </div>
//           </div>

//           {/* Save Button */}
//           <button
//             onClick={handleUpdateProfile}
//             disabled={updating}
//             className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
//           >
//             {updating && <Loader className="w-5 h-5 animate-spin" />}
//             Save Changes
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditProfile;

















import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import authService from '../../services/authService';

const EditProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    userName: '',
    email: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await authService.getProfile();
      setProfile(response.data);
      setFormData({
        fullName: response.data.fullName || '',
        userName: response.data.userName || '',
        email: response.data.email || '',
      });
      setPreviewImage(response.data.avatar || null);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateAvatar = async () => {
    if (!fileInputRef.current?.files?.[0]) {
      toast.error('Please select an avatar first');
      return;
    }

    try {
      setUpdating(true);
      const file = fileInputRef.current.files[0];
      const formDataObj = new FormData();
      formDataObj.append('avatar', file);

      const response = await authService.updateAvatar(formDataObj);
      
      // Update localStorage immediately
      const user = JSON.parse(localStorage.getItem('user'));
      user.avatarUrl = response.data.avatar;
      localStorage.setItem('user', JSON.stringify(user));
      
      // Dispatch custom event for Navbar to listen
      window.dispatchEvent(new CustomEvent('profileUpdated', { 
        detail: user 
      }));
      
      toast.success('Avatar updated successfully!');
      fileInputRef.current.value = '';
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast.error('Failed to update avatar');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setUpdating(true);

      const response = await authService.updateProfile({
        fullName: formData.fullName,
        userName: formData.userName,
        email: formData.email,
      });

      // Update localStorage immediately with new data
      const user = JSON.parse(localStorage.getItem('user'));
      user.fullName = response.data.fullName;
      user.userName = response.data.userName;
      user.email = response.data.email;
      localStorage.setItem('user', JSON.stringify(user));

      // Dispatch custom event for Navbar to listen and update instantly
      window.dispatchEvent(new CustomEvent('profileUpdated', { 
        detail: user 
      }));

      toast.success('Profile updated successfully!');
      
      setTimeout(() => navigate('/profile'), 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-300">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-[#1a1b1e] dark:to-[#23272f] pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:opacity-80 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-white dark:bg-[#23272f] rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Edit Profile</h2>

          <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide mb-4">
              Profile Picture
            </p>
            
            <div className="flex flex-col items-center gap-4">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                  No image
                </div>
              )}

              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  <Upload className="w-4 h-4" />
                  Choose Image
                </button>

                {previewImage && fileInputRef.current?.files?.[0] && (
                  <button
                    onClick={handleUpdateAvatar}
                    disabled={updating}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
                  >
                    {updating && <Loader className="w-4 h-4 animate-spin" />}
                    Upload
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2d3748] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2d3748] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2d3748] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <button
            onClick={handleUpdateProfile}
            disabled={updating}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            {updating && <Loader className="w-5 h-5 animate-spin" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
