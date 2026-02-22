// src/routes/admindashboardroutes.jsx
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../features/admin/dashboard/pages/AdminDashboard';

const AdminDashboardRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/*" element={<AdminDashboard />} />
        </Routes>
    );
};

export default AdminDashboardRoutes;
