// src/features/admin/AdminRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider } from '../../contexts/AdminAuthContext';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import AdminLayout from './layout/AdminLayout';
import AdminLogin from './pages/AdminLogin';
import DashboardOverview from './pages/DashboardOverview';
import UserManagement from './pages/UserManagement';
import CommunityModeration from './pages/CommunityModeration';
import ReportsManagement from './pages/ReportsManagement';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import NotesManagement from './pages/NotesManagement';
import ResumeManagement from './pages/ResumeManagement';
import TasksMonitoring from './pages/TasksMonitoring';
import AnnouncementsPage from './pages/AnnouncementsPage';
import AdminSettings from './pages/AdminSettings';
import LiveRooms from './pages/LiveRooms';

const AdminRoutes = () => {
  return (
    <AdminAuthProvider>
      <Routes>
        {/* Public admin login */}
        <Route path="/login" element={<AdminLogin />} />

        {/* Protected admin routes — all wrapped in AdminLayout */}
        <Route
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardOverview />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="community" element={<CommunityModeration />} />
          <Route path="reports" element={<ReportsManagement />} />
          <Route path="analytics" element={<AnalyticsDashboard />} />
          <Route path="notes" element={<NotesManagement />} />
          <Route path="resumes" element={<ResumeManagement />} />
          <Route path="tasks" element={<TasksMonitoring />} />
          <Route path="announcements" element={<AnnouncementsPage />} />
          <Route path="live-rooms" element={<LiveRooms />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
      </Routes>
    </AdminAuthProvider>
  );
};

export default AdminRoutes;
