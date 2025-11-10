// // src/pages/profile/EditProfile.jsx
// import { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ArrowLeft, Upload, Loader, Camera } from 'lucide-react';
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


//       const response = await authService.updateAvatar(formDataObj);
      
//       const user = JSON.parse(localStorage.getItem('user'));
//       user.avatarUrl = response.data.avatar;
//       localStorage.setItem('user', JSON.stringify(user));
      
//       window.dispatchEvent(new CustomEvent('profileUpdated', { 
//         detail: user 
//       }));
      
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


//       const response = await authService.updateProfile({
//         fullName: formData.fullName,
//         userName: formData.userName,
//         email: formData.email,
//       });


//       const user = JSON.parse(localStorage.getItem('user'));
//       user.fullName = response.data.fullName;
//       user.userName = response.data.userName;
//       user.email = response.data.email;
//       localStorage.setItem('user', JSON.stringify(user));


//       window.dispatchEvent(new CustomEvent('profileUpdated', { 
//         detail: user 
//       }));


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
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 dark:from-[#1a1b1e] dark:to-[#23272f]">
//         <div className="flex items-center gap-3">
//           <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//           <span className="text-gray-700 dark:text-gray-300 font-medium">Loading profile...</span>
//         </div>
//       </div>
//     );
//   }


//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 dark:from-[#1a1b1e] dark:via-[#1e2530] dark:to-[#23272f] py-16 relative overflow-hidden">
//       {/* Modern Stylish Background with Light Blue Gradients */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         {/* Animated Wave SVG - Light Blue Gradient */}
//         <svg className="absolute bottom-0 left-0 w-full h-64" viewBox="0 0 1440 320" preserveAspectRatio="none">
//           <defs>
//             <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
//               <stop offset="0%" style={{ stopColor: '#dbeafe', stopOpacity: 0.4 }} />
//               <stop offset="50%" style={{ stopColor: '#bfdbfe', stopOpacity: 0.3 }} />
//               <stop offset="100%" style={{ stopColor: '#93c5fd', stopOpacity: 0.2 }} />
//             </linearGradient>
//             <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
//               <stop offset="0%" style={{ stopColor: '#a5f3fc', stopOpacity: 0.3 }} />
//               <stop offset="50%" style={{ stopColor: '#67e8f9', stopOpacity: 0.2 }} />
//               <stop offset="100%" style={{ stopColor: '#22d3ee', stopOpacity: 0.15 }} />
//             </linearGradient>
//           </defs>
//           <path fill="url(#waveGradient1)" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" className="animate-wave"></path>
//           <path fill="url(#waveGradient2)" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,218.7C672,235,768,245,864,234.7C960,224,1056,192,1152,181.3C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" className="animate-wave-delay"></path>
//         </svg>


//         {/* Geometric Shapes - Light Blue Gradients with Shadow */}
//         <div className="absolute top-20 right-20 w-32 h-32 border-2 rounded-2xl rotate-12 animate-float shadow-lg" style={{ borderColor: 'rgba(147, 197, 253, 0.5)', background: 'linear-gradient(135deg, rgba(219, 234, 254, 0.3), rgba(191, 219, 254, 0.2))' }}></div>
//         <div className="absolute bottom-40 left-20 w-24 h-24 border-2 rounded-full animate-float-delay shadow-lg" style={{ borderColor: 'rgba(165, 243, 252, 0.5)', background: 'linear-gradient(135deg, rgba(207, 250, 254, 0.3), rgba(165, 243, 252, 0.2))' }}></div>
//         <div className="absolute top-1/2 left-10 w-16 h-16 rounded-lg rotate-45 animate-pulse-slow shadow-md" style={{ background: 'linear-gradient(135deg, rgba(191, 219, 254, 0.4), rgba(147, 197, 253, 0.2))' }}></div>


//         {/* Soft Gradient Orbs - Enhanced Light Blue */}
//         <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-float-slow" style={{ background: 'radial-gradient(circle, rgba(191, 219, 254, 0.4) 0%, rgba(147, 197, 253, 0.2) 50%, transparent 100%)' }}></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl animate-float" style={{ background: 'radial-gradient(circle, rgba(165, 243, 252, 0.4) 0%, rgba(34, 211, 238, 0.2) 50%, transparent 100%)' }}></div>


//         {/* Diagonal Lines Pattern */}
//         <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(-45deg,rgba(6,182,212,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(45deg,rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(-45deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:80px_80px]"></div>


//         {/* Corner Accent Lines - Light Blue Gradient */}
//         <div className="absolute top-0 left-0 w-40 h-40">
//           <div className="absolute top-0 left-0 w-full h-1 shadow-sm" style={{ background: 'linear-gradient(to right, rgba(147, 197, 253, 0.6), transparent)' }}></div>
//           <div className="absolute top-0 left-0 w-1 h-full shadow-sm" style={{ background: 'linear-gradient(to bottom, rgba(147, 197, 253, 0.6), transparent)' }}></div>
//         </div>
//         <div className="absolute bottom-0 right-0 w-40 h-40">
//           <div className="absolute bottom-0 right-0 w-full h-1 shadow-sm" style={{ background: 'linear-gradient(to left, rgba(34, 211, 238, 0.6), transparent)' }}></div>
//           <div className="absolute bottom-0 right-0 w-1 h-full shadow-sm" style={{ background: 'linear-gradient(to top, rgba(34, 211, 238, 0.6), transparent)' }}></div>
//         </div>
//       </div>


//       <div className="max-w-2xl mx-auto px-4 relative z-10">
//         {/* Back Button */}
//         <button
//           onClick={() => navigate('/')}
//           className="group flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4 transition-all duration-300 font-medium"
//         >
//           <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
//           <span>Back to Home</span>
//         </button>


//         {/* Edit Profile Card - 3D Effect BIG - Fits One Page */}
//         <div className="card-3d-glow relative bg-white/80 dark:bg-[#23272f]/80 backdrop-blur-xl p-8" style={{
//           borderRadius: '24px',
//           background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, rgba(147, 197, 253, 0.8), rgba(34, 211, 238, 0.6)) border-box',
//           border: '2px solid transparent',
//           boxShadow: `
//             0 0 30px rgba(147, 197, 253, 0.4),
//             0 10px 40px -10px rgba(147, 197, 253, 0.3),
//             0 20px 60px -15px rgba(59, 130, 246, 0.3),
//             0 30px 80px -20px rgba(34, 211, 238, 0.25),
//             inset 0 1px 0 rgba(255, 255, 255, 0.5),
//             inset 0 -1px 0 rgba(147, 197, 253, 0.1)
//           `
//         }}>
//           {/* Avatar Section - Bigger */}
//           <div className="mb-6">
//             <div className="flex flex-col items-center gap-3">
//               <div className="relative group">
//                 {previewImage ? (
//                   <img
//                     src={previewImage}
//                     alt="Preview"
//                     className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover shadow-2xl group-hover:scale-110 transition-transform duration-300"
//                   />
//                 ) : (
//                   <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-5xl font-bold shadow-2xl group-hover:scale-110 transition-transform duration-300">
//                     {(profile?.userName || profile?.fullName || 'U')[0].toUpperCase()}
//                   </div>
//                 )}
//                 <div className="absolute -bottom-1 -right-1 bg-blue-500 w-6 h-6 rounded-full border-4 border-white dark:border-[#23272f] flex items-center justify-center shadow-lg cursor-pointer hover:bg-blue-600 transition">
//                   <Upload className="w-3 h-3 text-white" />
//                 </div>
//               </div>


//               <div className="flex gap-3">
//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   accept="image/*"
//                   onChange={handleAvatarChange}
//                   className="hidden"
//                 />
//                 <button
//                   onClick={() => fileInputRef.current?.click()}
//                   className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:scale-105 transition-all shadow-md font-semibold"
//                 >
//                   Choose Image
//                 </button>


//                 {previewImage && fileInputRef.current?.files?.[0] && (
//                   <button
//                     onClick={handleUpdateAvatar}
//                     disabled={updating}
//                     className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg disabled:opacity-50 hover:scale-105 transition-all shadow-md font-semibold"
//                   >
//                     {updating ? <Loader className="w-4 h-4 animate-spin inline mr-1" /> : ''}
//                     Upload
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>


//           {/* Form Fields - Grid (Compact but big inputs) */}
//           <div className="grid grid-cols-2 gap-4 mb-6">
//             {/* Full Name */}
//             <div className="col-span-2">
//               <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">Full Name</label>
//               <input
//                 type="text"
//                 name="fullName"
//                 value={formData.fullName}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2d3748] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-medium"
//                 placeholder="Enter your full name"
//               />
//             </div>


//             {/* Username */}
//             <div>
//               <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">Username</label>
//               <input
//                 type="text"
//                 name="userName"
//                 value={formData.userName}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2d3748] text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-sm font-medium"
//                 placeholder="Username"
//               />
//             </div>


//             {/* Email */}
//             <div>
//               <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2d3748] text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm font-medium"
//                 placeholder="Email"
//               />
//             </div>
//           </div>


//           {/* Save Button */}
//           <button
//             onClick={handleUpdateProfile}
//             disabled={updating}
//             className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 text-white font-bold rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105"
//           >
//             {updating ? 'Saving Changes...' : 'Save Changes'}
//           </button>
//         </div>
//       </div>


//     {/* Stylish Animations with 3D Effects - NO BLUR */}
//     <style jsx>{`
//       @keyframes wave {
//         0% { transform: translateX(0) translateY(0); }
//         50% { transform: translateX(-25%) translateY(-5%); }
//         100% { transform: translateX(0) translateY(0); }
//       }
//       @keyframes wave-delay {
//         0% { transform: translateX(0) translateY(0); }
//         50% { transform: translateX(25%) translateY(5%); }
//         100% { transform: translateX(0) translateY(0); }
//       }
//       @keyframes float { 0%, 100% { transform: translateY(0px) rotate(12deg); } 50% { transform: translateY(-20px) rotate(18deg); } }
//       @keyframes float-delay { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
//       @keyframes float-slow { 0%, 100% { transform: translateY(0px) scale(1); } 50% { transform: translateY(-25px) scale(1.05); } }
//       @keyframes pulse-slow { 0%, 100% { opacity: 0.3; transform: rotate(45deg); } 50% { opacity: 0.6; transform: rotate(50deg); } }
      
//       @keyframes glow-pulse {
//         0%, 100% { 
//           box-shadow: 
//             0 0 30px rgba(147, 197, 253, 0.4),
//             0 10px 40px -10px rgba(147, 197, 253, 0.3),
//             0 20px 60px -15px rgba(59, 130, 246, 0.3),
//             0 30px 80px -20px rgba(34, 211, 238, 0.25),
//             inset 0 1px 0 rgba(255, 255, 255, 0.5),
//             inset 0 -1px 0 rgba(147, 197, 253, 0.1);
//         }
//         50% { 
//           box-shadow: 
//             0 0 40px rgba(147, 197, 253, 0.6),
//             0 15px 50px -10px rgba(147, 197, 253, 0.5),
//             0 25px 70px -15px rgba(59, 130, 246, 0.4),
//             0 35px 90px -20px rgba(34, 211, 238, 0.35),
//             inset 0 1px 0 rgba(255, 255, 255, 0.6),
//             inset 0 -1px 0 rgba(147, 197, 253, 0.2);
//         }
//       }
      
//       .animate-wave { animation: wave 20s ease-in-out infinite; }
//       .animate-wave-delay { animation: wave-delay 25s ease-in-out infinite; }
//       .animate-float { animation: float 8s ease-in-out infinite; }
//       .animate-float-delay { animation: float-delay 10s ease-in-out infinite; }
//       .animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
//       .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
      
//       .card-3d-glow {
//         animation: glow-pulse 4s ease-in-out infinite;
//         transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
//       }
      
//       .card-3d-glow:hover {
//         transform: translateY(-8px) scale(1.02) !important;
//         box-shadow: 
//           0 0 50px rgba(147, 197, 253, 0.7),
//           0 20px 60px -10px rgba(147, 197, 253, 0.5),
//           0 30px 80px -15px rgba(59, 130, 246, 0.4),
//           0 40px 100px -20px rgba(34, 211, 238, 0.3),
//           inset 0 1px 0 rgba(255, 255, 255, 0.6),
//           inset 0 -1px 0 rgba(147, 197, 253, 0.3) !important;
//       }
//     `}</style>


//     </div>
//   );
// };


// export default EditProfile;













































// src/pages/profile/EditProfile.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext'; // ✅ Import AuthContext
import authService from '../../services/authService';

const EditProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { user, setUser } = useAuth(); // ✅ Get user and setUser from AuthContext
  
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
      const userData = response.data;
      
      setFormData({
        fullName: userData.fullName || '',
        userName: userData.userName || '',
        email: userData.email || '',
      });
      setPreviewImage(userData.avatar || userData.avatarUrl || null);
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
      
      // ✅ Update AuthContext with new avatar
      const updatedUser = {
        ...user,
        avatar: response.data.avatar,
        avatarUrl: response.data.avatar
      };
      setUser(updatedUser);
      
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

      // ✅ Update AuthContext with new data
      const updatedUser = {
        ...user,
        fullName: response.data.fullName,
        userName: response.data.userName,
        email: response.data.email,
      };
      setUser(updatedUser);

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 dark:from-[#1a1b1e] dark:to-[#23272f]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-700 dark:text-gray-300 font-medium">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 dark:from-[#1a1b1e] dark:via-[#1e2530] dark:to-[#23272f] py-16 relative overflow-hidden">
      {/* Modern Stylish Background with Light Blue Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Wave SVG - Light Blue Gradient */}
        <svg className="absolute bottom-0 left-0 w-full h-64" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#dbeafe', stopOpacity: 0.4 }} />
              <stop offset="50%" style={{ stopColor: '#bfdbfe', stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: '#93c5fd', stopOpacity: 0.2 }} />
            </linearGradient>
            <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#a5f3fc', stopOpacity: 0.3 }} />
              <stop offset="50%" style={{ stopColor: '#67e8f9', stopOpacity: 0.2 }} />
              <stop offset="100%" style={{ stopColor: '#22d3ee', stopOpacity: 0.15 }} />
            </linearGradient>
          </defs>
          <path fill="url(#waveGradient1)" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" className="animate-wave"></path>
          <path fill="url(#waveGradient2)" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,218.7C672,235,768,245,864,234.7C960,224,1056,192,1152,181.3C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" className="animate-wave-delay"></path>
        </svg>

        {/* Geometric Shapes - Light Blue Gradients with Shadow */}
        <div className="absolute top-20 right-20 w-32 h-32 border-2 rounded-2xl rotate-12 animate-float shadow-lg" style={{ borderColor: 'rgba(147, 197, 253, 0.5)', background: 'linear-gradient(135deg, rgba(219, 234, 254, 0.3), rgba(191, 219, 254, 0.2))' }}></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 border-2 rounded-full animate-float-delay shadow-lg" style={{ borderColor: 'rgba(165, 243, 252, 0.5)', background: 'linear-gradient(135deg, rgba(207, 250, 254, 0.3), rgba(165, 243, 252, 0.2))' }}></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 rounded-lg rotate-45 animate-pulse-slow shadow-md" style={{ background: 'linear-gradient(135deg, rgba(191, 219, 254, 0.4), rgba(147, 197, 253, 0.2))' }}></div>

        {/* Soft Gradient Orbs - Enhanced Light Blue */}
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-float-slow" style={{ background: 'radial-gradient(circle, rgba(191, 219, 254, 0.4) 0%, rgba(147, 197, 253, 0.2) 50%, transparent 100%)' }}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl animate-float" style={{ background: 'radial-gradient(circle, rgba(165, 243, 252, 0.4) 0%, rgba(34, 211, 238, 0.2) 50%, transparent 100%)' }}></div>

        {/* Diagonal Lines Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(-45deg,rgba(6,182,212,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(45deg,rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(-45deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:80px_80px]"></div>

        {/* Corner Accent Lines - Light Blue Gradient */}
        <div className="absolute top-0 left-0 w-40 h-40">
          <div className="absolute top-0 left-0 w-full h-1 shadow-sm" style={{ background: 'linear-gradient(to right, rgba(147, 197, 253, 0.6), transparent)' }}></div>
          <div className="absolute top-0 left-0 w-1 h-full shadow-sm" style={{ background: 'linear-gradient(to bottom, rgba(147, 197, 253, 0.6), transparent)' }}></div>
        </div>
        <div className="absolute bottom-0 right-0 w-40 h-40">
          <div className="absolute bottom-0 right-0 w-full h-1 shadow-sm" style={{ background: 'linear-gradient(to left, rgba(34, 211, 238, 0.6), transparent)' }}></div>
          <div className="absolute bottom-0 right-0 w-1 h-full shadow-sm" style={{ background: 'linear-gradient(to top, rgba(34, 211, 238, 0.6), transparent)' }}></div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="group flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4 transition-all duration-300 font-medium"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>

        {/* Edit Profile Card - 3D Effect BIG - Fits One Page */}
        <div className="card-3d-glow relative bg-white/80 dark:bg-[#23272f]/80 backdrop-blur-xl p-8" style={{
          borderRadius: '24px',
          background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, rgba(147, 197, 253, 0.8), rgba(34, 211, 238, 0.6)) border-box',
          border: '2px solid transparent',
          boxShadow: `
            0 0 30px rgba(147, 197, 253, 0.4),
            0 10px 40px -10px rgba(147, 197, 253, 0.3),
            0 20px 60px -15px rgba(59, 130, 246, 0.3),
            0 30px 80px -20px rgba(34, 211, 238, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.5),
            inset 0 -1px 0 rgba(147, 197, 253, 0.1)
          `
        }}>
          {/* Avatar Section - Bigger */}
          <div className="mb-6">
            <div className="flex flex-col items-center gap-3">
              <div className="relative group">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover shadow-2xl group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-5xl font-bold shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    {(user?.userName || user?.fullName || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 bg-blue-500 w-6 h-6 rounded-full border-4 border-white dark:border-[#23272f] flex items-center justify-center shadow-lg cursor-pointer hover:bg-blue-600 transition">
                  <Upload className="w-3 h-3 text-white" />
                </div>
              </div>

              <div className="flex gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:scale-105 transition-all shadow-md font-semibold"
                >
                  Choose Image
                </button>

                {previewImage && fileInputRef.current?.files?.[0] && (
                  <button
                    onClick={handleUpdateAvatar}
                    disabled={updating}
                    className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg disabled:opacity-50 hover:scale-105 transition-all shadow-md font-semibold"
                  >
                    {updating ? <Loader className="w-4 h-4 animate-spin inline mr-1" /> : ''}
                    Upload
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Form Fields - Grid (Compact but big inputs) */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Full Name */}
            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2d3748] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-medium"
                placeholder="Enter your full name"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">Username</label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2d3748] text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-sm font-medium"
                placeholder="Username"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2d3748] text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm font-medium"
                placeholder="Email"
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleUpdateProfile}
            disabled={updating}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 text-white font-bold rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105"
          >
            {updating ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </div>

    {/* Stylish Animations with 3D Effects - NO BLUR */}
    <style jsx>{`
      @keyframes wave {
        0% { transform: translateX(0) translateY(0); }
        50% { transform: translateX(-25%) translateY(-5%); }
        100% { transform: translateX(0) translateY(0); }
      }
      @keyframes wave-delay {
        0% { transform: translateX(0) translateY(0); }
        50% { transform: translateX(25%) translateY(5%); }
        100% { transform: translateX(0) translateY(0); }
      }
      @keyframes float { 0%, 100% { transform: translateY(0px) rotate(12deg); } 50% { transform: translateY(-20px) rotate(18deg); } }
      @keyframes float-delay { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
      @keyframes float-slow { 0%, 100% { transform: translateY(0px) scale(1); } 50% { transform: translateY(-25px) scale(1.05); } }
      @keyframes pulse-slow { 0%, 100% { opacity: 0.3; transform: rotate(45deg); } 50% { opacity: 0.6; transform: rotate(50deg); } }
      
      @keyframes glow-pulse {
        0%, 100% { 
          box-shadow: 
            0 0 30px rgba(147, 197, 253, 0.4),
            0 10px 40px -10px rgba(147, 197, 253, 0.3),
            0 20px 60px -15px rgba(59, 130, 246, 0.3),
            0 30px 80px -20px rgba(34, 211, 238, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.5),
            inset 0 -1px 0 rgba(147, 197, 253, 0.1);
        }
        50% { 
          box-shadow: 
            0 0 40px rgba(147, 197, 253, 0.6),
            0 15px 50px -10px rgba(147, 197, 253, 0.5),
            0 25px 70px -15px rgba(59, 130, 246, 0.4),
            0 35px 90px -20px rgba(34, 211, 238, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.6),
            inset 0 -1px 0 rgba(147, 197, 253, 0.2);
        }
      }
      
      .animate-wave { animation: wave 20s ease-in-out infinite; }
      .animate-wave-delay { animation: wave-delay 25s ease-in-out infinite; }
      .animate-float { animation: float 8s ease-in-out infinite; }
      .animate-float-delay { animation: float-delay 10s ease-in-out infinite; }
      .animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
      .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
      
      .card-3d-glow {
        animation: glow-pulse 4s ease-in-out infinite;
        transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
      }
      
      .card-3d-glow:hover {
        transform: translateY(-8px) scale(1.02) !important;
        box-shadow: 
          0 0 50px rgba(147, 197, 253, 0.7),
          0 20px 60px -10px rgba(147, 197, 253, 0.5),
          0 30px 80px -15px rgba(59, 130, 246, 0.4),
          0 40px 100px -20px rgba(34, 211, 238, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.6),
          inset 0 -1px 0 rgba(147, 197, 253, 0.3) !important;
      }
    `}</style>

    </div>
  );
};

export default EditProfile;
