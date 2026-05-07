// src/App.jsx
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // <-- Added useAuth import
import { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import AppRoutes from './routes/AppRoutes';

function AppContent() {
  const { user } = useAuth(); // <-- ADDED: Get user from context
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isAuthPage = location.pathname.startsWith('/auth');
  const isAdminPage = location.pathname.startsWith('/admin');

  const isFeaturePage = location.pathname.startsWith('/pdf-qa') ||
                        location.pathname.startsWith('/notes-organizer') ||
                        location.pathname.startsWith('/academic-planner') ||
                        location.pathname.startsWith('/resume-analyzer') ||
                        location.pathname.startsWith('/interview-ai') ||
                        location.pathname.startsWith('/community') ||
                        location.pathname.startsWith('/admin');

  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col dark:bg-[#1a1b1e]">
      {!isAuthPage && !isAdminPage && <Navbar />}
      <div className="flex flex-1">
        {/* CHANGED: Show sidebar if user logged in and not on auth page */}
        {user && !isAuthPage && !isAdminPage && <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />}

        <main 
          className="flex-1 transition-all duration-300 ease-in-out"
          style={{
            marginLeft: user && !isAuthPage && !isAdminPage ? (sidebarOpen ? '250px' : '70px') : '0' // <-- UPDATED
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
