import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from 'react';
import type { ReactNode } from 'react';
import type { AuthAdapter, AuthContextValue, AuthSession } from '../types';

type AnyAuthContextValue = AuthContextValue<
  unknown,
  string,
  string,
  AuthSession<unknown, string, string>,
  unknown
>;

const AuthContext = createContext<AnyAuthContextValue | undefined>(undefined);

type AuthProviderProps<
  TUser = unknown,
  TRole extends string = string,
  TPermission extends string = string,
  TSession extends AuthSession<TUser, TRole, TPermission> = AuthSession<
    TUser,
    TRole,
    TPermission
  >,
  TCredentials = unknown,
> = {
  adapter: AuthAdapter<TUser, TRole, TPermission, TSession, TCredentials>;
  children: ReactNode;
  autoSync?: boolean;
};

/**
 * AuthProvider component - wraps your app with authentication context
 *
 * @example
 * ```tsx
 * import { AuthProvider, createAuthAdapter } from '@k3mart/react-kit/auth2';
 *
 * const authAdapter = createAuthAdapter({
 *   // ... configuration
 * });
 *
 * function App() {
 *   return (
 *     <AuthProvider adapter={authAdapter}>
 *       <YourApp />
 *     </AuthProvider>
 *   );
 * }
 * ```
 */
export function AuthProvider<
  TUser = unknown,
  TRole extends string = string,
  TPermission extends string = string,
  TSession extends AuthSession<TUser, TRole, TPermission> = AuthSession<
    TUser,
    TRole,
    TPermission
  >,
  TCredentials = unknown,
>({
  adapter,
  children,
  autoSync = true,
}: AuthProviderProps<TUser, TRole, TPermission, TSession, TCredentials>) {
  // Sync on mount to restore persisted session before rendering
  useEffect(() => {
    if (!autoSync) return;
    adapter.sync().catch(() => undefined);
  }, [adapter, autoSync]);

  const state = useSyncExternalStore(
    adapter.subscribe,
    adapter.getState,
    adapter.getState,
  );

  const value = useMemo<
    AuthContextValue<TUser, TRole, TPermission, TSession, TCredentials>
  >(() => {
    const login = adapter.login
      ? async (credentials: TCredentials) => {
          if (!adapter.login) {
            throw new Error('Login is not configured');
          }
          return await adapter.login(credentials);
        }
      : undefined;

    return {
      state,
      status: state.status,
      session: state.session,
      user: state.user,
      roles: state.roles,
      permissions: state.permissions,
      error: state.error,
      login,
      logout: adapter.logout,
      refresh: adapter.refresh,
      setSession: adapter.setSession,
      hasRole: adapter.hasRole,
      hasPermission: adapter.hasPermission,
      can: adapter.can,
      getToken: adapter.getToken,
      isTokenExpired: adapter.isTokenExpired,
      getTimeUntilExpiry: adapter.getTimeUntilExpiry,
    };
  }, [adapter, state]);

  const contextValue = value as unknown as AnyAuthContextValue;

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

/**
 * Hook to access auth context
 * Must be used within AuthProvider
 */
export function useAuthContext(): AnyAuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
