// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";

// Auth Pages
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ForgetPassword from "../pages/auth/ForgetPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// Home Page
import Home from "../pages/Home/Home";

// Feature Routes
import PdfQARoutes from "./PdfQARoutes";

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

      {/* PDF Q&A Feature Routes */}
      <Route path="/pdf-qa/*" element={<PdfQARoutes />} />

      {/* 404 */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
};

export default AppRoutes;
