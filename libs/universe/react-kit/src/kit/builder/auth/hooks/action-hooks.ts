import type { AuthSession } from '../types';
import { useAuthContext } from '../providers/AuthProvider';

/**
 * Hook to get the login function.
 */
export function useLogin<TCredentials = unknown>() {
  const { login } = useAuthContext();
  return login as ((credentials: TCredentials) => Promise<unknown>) | undefined;
}

/**
 * Hook to get the logout function.
 */
export function useLogout() {
  const { logout } = useAuthContext();
  return logout;
}

/**
 * Hook to get the refresh function.
 */
export function useRefresh() {
  const { refresh } = useAuthContext();
  return refresh;
}

/**
 * Hook to get the setSession function.
 */
export function useSetSession<TSession extends AuthSession>() {
  const { setSession } = useAuthContext();
  return setSession as (session: TSession | null) => Promise<unknown>;
}
