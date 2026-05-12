import { useAuthContext } from '../providers/AuthProvider';

/**
 * Hook to get the current auth token.
 */
export function useAuthToken() {
  const { getToken } = useAuthContext();
  return getToken();
}

/**
 * Hook to check if token is expired.
 */
export function useIsTokenExpired() {
  const { isTokenExpired } = useAuthContext();
  return isTokenExpired();
}

/**
 * Hook to get time until token expiry in milliseconds.
 */
export function useTimeUntilExpiry() {
  const { getTimeUntilExpiry } = useAuthContext();
  return getTimeUntilExpiry();
}
