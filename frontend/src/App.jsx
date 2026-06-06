// src/App.jsx
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // <-- Added useAuth import
import { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import AppRoutes from './routes/AppRoutes';
import AnnouncementBanner from './features/communityPost/components/AnnouncementBanner';

function AppContent() {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [bannerVisible, setBannerVisible] = useState(false);

  const isAuthPage = location.pathname.startsWith('/auth');
  const isAdminPage = location.pathname.startsWith('/admin');

  const isFeaturePage = location.pathname.startsWith('/pdf-qa') ||
                        location.pathname.startsWith('/notes-organizer') ||
                        location.pathname.startsWith('/academic-planner') ||
                        location.pathname.startsWith('/resume-analyzer') ||
                        location.pathname.startsWith('/community') ||
                        location.pathname.startsWith('/admin');

  const isHomePage = location.pathname === '/';

  const showBanner = user && !isAuthPage && !isAdminPage;

  return (
    <div className="min-h-screen flex flex-col dark:bg-[#1a1b1e]">
      {showBanner && <AnnouncementBanner onVisibilityChange={setBannerVisible} />}
      {!isAuthPage && !isAdminPage && <Navbar />}
      <div className="flex flex-1">
        {user && !isAuthPage && !isAdminPage && <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} bannerVisible={bannerVisible} />}

        <main 
          className="flex-1 transition-all duration-300 ease-in-out"
          style={{
            marginLeft: user && !isAuthPage && !isAdminPage ? (sidebarOpen ? '250px' : '70px') : '0'
          }}
        >
          <AppRoutes />
        </main>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        theme="colored"
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
