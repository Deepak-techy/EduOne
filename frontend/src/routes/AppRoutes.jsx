import { Routes, Route } from "react-router-dom";

// Auth Pages
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ForgetPassword from "../pages/auth/ForgetPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// Home Page (Your landing page)
import Home from "../pages/Home/Home";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Home Route - Shows landing page */}
      <Route path="/" element={<Home />} />

      {/* Auth Routes */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/signup" element={<Signup />} />
      <Route path="/auth/forget-password" element={<ForgetPassword />} />
      <Route path="/auth/reset-password/:token" element={<ResetPassword />} />

      {/* 404 - Redirect to home */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
};

export default AppRoutes;
