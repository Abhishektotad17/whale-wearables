import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useRole } from '../../hooks/useRole';
import type { UserRole } from '../../features/auth/authSlice';

interface Props {
  allowedRoles?: UserRole[];  // omit = just needs login, no role check
  redirectTo?: string;
}

const ProtectedRoute = ({ allowedRoles, redirectTo = '/login' }: Props) => {
  const { isAuthenticated, hasAnyRole } = useRole();
  const status = useAppSelector((state) => state.auth.status);
  const location = useLocation();

  // Still fetching user on app load — render nothing (avoid flash redirect)
  if (status === 'loading' || status === 'idle') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent 
                        rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Logged in but missing required role
  if (allowedRoles && !hasAnyRole(...allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;