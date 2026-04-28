import type { AuthSession } from '../types';
import { useAuthContext } from '../providers/AuthProvider';

/**
 * Hook to access the entire auth context
 */
export function useAuth() {
  return useAuthContext();
}

/**
 * Hook to get the current auth status
 */
export function useAuthStatus() {
  const { status } = useAuthContext();
  return status;
}

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated() {
  const { status } = useAuthContext();
  return status === 'authenticated';
}

/**
 * Hook to get the current session
 */
export function useAuthSession<TSession extends AuthSession>() {
  const { session } = useAuthContext();
  return session as TSession | null;
}

/**
 * Hook to get the current user
 */
export function useAuthUser<TUser>() {
  const { user } = useAuthContext();
  return user as TUser | null;
}

/**
 * Hook to get user roles
 */
export function useAuthRoles<TRole extends string = string>() {
  const { roles } = useAuthContext();
  return roles as TRole[];
}

/**
 * Hook to get user permissions
 */
export function useAuthPermissions<TPermission extends string = string>() {
  const { permissions } = useAuthContext();
  return permissions as TPermission[];
}

/**
 * Hook to get authentication error
 */
export function useAuthError() {
  const { error } = useAuthContext();
  return error;
}
