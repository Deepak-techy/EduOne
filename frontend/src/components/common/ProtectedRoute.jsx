// src/components/common/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Role-based route protection component.
 *
 * @param {string[]} allowedRoles - Array of roles allowed to access the route
 * @param {string}   redirectTo   - Where to redirect unauthorized users (default: '/')
 * @param {JSX}      children     - The protected content
 */
const ProtectedRoute = ({ allowedRoles, redirectTo = '/', children }) => {
  const { user, loading } = useAuth();

  // Still loading auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-cyan-100 to-blue-200">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          <p className="text-gray-700 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Role check — if allowedRoles is provided, enforce it
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to={redirectTo} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
