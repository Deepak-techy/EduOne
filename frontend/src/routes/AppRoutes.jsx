
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
import NotesRoutes from "./NotesRoutes";

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

      {/* ✅ Profile Routes - NEW */}
      <Route path="/profile" element={<ViewProfile />} />
      <Route path="/profile/edit" element={<EditProfile />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/help" element={<HelpSupport />} />

      {/* PDF Q&A Feature Routes */}
      <Route path="/pdf-qa/*" element={<PdfQARoutes />} />
      
      {/* Note Organizer Feature Routes */}
      <Route path="/notes-organizer/*" element={<NotesRoutes />} />

      {/* 404 */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
};

export default AppRoutes;
