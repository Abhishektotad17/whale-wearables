import { useRole } from '../../hooks/useRole';
import type { UserRole } from '../../features/auth/authSlice';

interface Props {
  roles: UserRole[];           // required roles to see the children
  children: React.ReactNode;
  fallback?: React.ReactNode;  // optional — what to show if no access
}

// Usage: <RoleGuard roles={['ADMIN']}><AdminButton /></RoleGuard>
const RoleGuard = ({ roles, children, fallback = null }: Props) => {
  const { hasAnyRole } = useRole();
  return hasAnyRole(...roles) ? <>{children}</> : <>{fallback}</>;
};

export default RoleGuard;