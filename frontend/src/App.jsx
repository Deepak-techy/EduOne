import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';

function AppContent() {
  const location = useLocation();
  
  // Hide Navbar/Sidebar/Footer on auth pages
  const isAuthPage = location.pathname.startsWith('/auth');

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#1a1b1e]">
      {/* Navbar - Hidden on /auth/* pages */}
      {!isAuthPage && <Navbar />}

      {/* Main Content */}
      <main className="flex-1">
        <AppRoutes />
      </main>

      {/* Footer - Hidden on /auth/* pages */}
      {!isAuthPage && <Footer />}

      {/* Toast Notifications */}
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
