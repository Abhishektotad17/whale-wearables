import { useAppSelector } from './useAppSelector';
import type { UserRole } from '../features/auth/authSlice';

interface UseRoleReturn {
  roles: UserRole[];
  isAuthenticated: boolean;
  isUser: boolean;
  isSeller: boolean;
  isAdmin: boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (...roles: UserRole[]) => boolean;
}

export const useRole = (): UseRoleReturn => {
  const user = useAppSelector((state) => state.auth.user);
  const roles: UserRole[] = user?.roles ?? [];

  return {
    roles,
    isAuthenticated: user !== null,
    isUser:          roles.includes('USER'),
    isSeller:        roles.includes('SELLER'),
    isAdmin:         roles.includes('ADMIN'),
    hasRole:         (role) => roles.includes(role),
    hasAnyRole:      (...r) => r.some((role) => roles.includes(role)),
  };
};