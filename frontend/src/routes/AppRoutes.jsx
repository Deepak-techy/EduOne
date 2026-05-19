
// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";

// Auth Pages
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ForgetPassword from "../pages/auth/ForgetPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// Home Page
import Home from "../pages/Home/Home";

// ✅ PROFILE PAGES - NEW
import ViewProfile from "../pages/profile/ViewProfile";
import EditProfile from "../pages/profile/EditProfile";
import Notifications from "../pages/profile/Notifications";

// ✅ HELP PAGE - NEW
import HelpSupport from "../pages/help/HelpSupport";

// Feature Routes
import PdfQARoutes from "./PdfQARoutes";
import ResumeAnalyzerRoutes from "./ResumeAnalyzerRoutes";
import NotesRoutes from "./NotesRoutes";
import PlannerRoutes from "./PlannerRoutes";
import AdminDashboardRoutes from "./admindashboardroutes";
import CommunityRoutes from "./CommunityRoutes";

// Protected Route Component
import ProtectedRoute from "../components/common/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Home Route */}
      <Route path="/" element={<Home />} />

      {/* Auth Routes */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/signup" element={<Signup />} />
      <Route path="/auth/forget-password" element={<ForgetPassword />} />
      <Route path="/auth/reset-password/:token" element={<ResetPassword />} />

      {/* ✅ Profile Routes — any authenticated user */}
      <Route path="/profile" element={
        <ProtectedRoute allowedRoles={["Student", "Teacher", "Admin"]}>
          <ViewProfile />
        </ProtectedRoute>
      } />
      <Route path="/profile/edit" element={
        <ProtectedRoute allowedRoles={["Student", "Teacher", "Admin"]}>
          <EditProfile />
        </ProtectedRoute>
      } />
      <Route path="/notifications" element={
        <ProtectedRoute allowedRoles={["Student", "Teacher", "Admin"]}>
          <Notifications />
        </ProtectedRoute>
      } />
      <Route path="/help" element={<HelpSupport />} />

      {/* PDF Q&A Feature Routes — Student + Teacher */}
      <Route path="/pdf-qa/*" element={
        <ProtectedRoute allowedRoles={["Student", "Teacher"]}>
          <PdfQARoutes />
        </ProtectedRoute>
      } />

      {/* Note Organizer Feature Routes — Student + Teacher */}
      <Route path="/notes-organizer/*" element={
        <ProtectedRoute allowedRoles={["Student", "Teacher"]}>
          <NotesRoutes />
        </ProtectedRoute>
      } />

      {/* Academic Planner Feature Routes — Student + Teacher */}
      <Route path="/academic-planner/*" element={
        <ProtectedRoute allowedRoles={["Student", "Teacher"]}>
          <PlannerRoutes />
        </ProtectedRoute>
      } />

      {/* Resume Analyzer Feature Routes — Student only */}
      <Route path="/resume-analyzer/*" element={
        <ProtectedRoute allowedRoles={["Student"]}>
          <ResumeAnalyzerRoutes />
        </ProtectedRoute>
      } />

      {/* Admin Dashboard Routes — Admin only (has its own internal auth) */}
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRoles={["Admin"]} redirectTo="/">
          <AdminDashboardRoutes />
        </ProtectedRoute>
      } />

      {/* Community Post Feature Routes — Student + Teacher */}
      <Route path="/community/*" element={
        <ProtectedRoute allowedRoles={["Student", "Teacher"]}>
          <CommunityRoutes />
        </ProtectedRoute>
      } />

      {/* 404 */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
};

export default AppRoutes;
