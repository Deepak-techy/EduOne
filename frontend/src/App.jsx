// src/App.jsx - COMPLETE GAP FIX
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import { useState } from 'react';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import AppRoutes from './routes/AppRoutes';

function AppContent() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const isAuthPage = location.pathname.startsWith('/auth');
  
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
      {/* Navbar */}
      {!isAuthPage && <Navbar />}
      
      <div className="flex flex-1">
        {/* Sidebar */}
        {isFeaturePage && <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />}
        
        {/* Main Content - REMOVED ALL MARGIN-TOP */}
        <main 
          className="flex-1 transition-all duration-300 ease-in-out"
          style={{
            marginLeft: isFeaturePage ? (sidebarOpen ? '250px' : '70px') : '0'
            // ↑ REMOVED marginTop completely - no more 80px gap!
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
