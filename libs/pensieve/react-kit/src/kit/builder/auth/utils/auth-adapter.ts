import { createMemoryStorage } from './storage';
import { createTokenManager } from './token-manager';
import {
  checkPermissions,
  checkRoles,
  evaluatePermissionRule,
  expandPermissions,
  expandRoles,
} from './permission-checker';
import type {
  AuthAdapter,
  AuthAdapterConfig,
  AuthAdapterState,
  AuthAdapterSubscriber,
  AuthSession,
  AuthStatus,
  PermissionPolicy,
  PermissionRule,
} from '../types';

const unique = <T>(values: T[]): T[] => {
  return Array.from(new Set(values));
};

/**
 * Enhanced Authentication Adapter
 *
 * Features:
 * - Token management with auto-refresh
 * - Permission and role hierarchies
 * - Middleware support
 * - Retry logic
 * - Advanced permission checking (AND/OR policies)
 * - Session persistence
 */
export function createAuthAdapter<
  TUser = unknown,
  TRole extends string = string,
  TPermission extends string = string,
  TSession extends AuthSession<TUser, TRole, TPermission> = AuthSession<
    TUser,
    TRole,
    TPermission
  >,
  TCredentials = unknown,
>(
  config: AuthAdapterConfig<TUser, TRole, TPermission, TSession, TCredentials>,
): AuthAdapter<TUser, TRole, TPermission, TSession, TCredentials> {
  // ============================================================================
  // Configuration & State
  // ============================================================================

  const storage = config.storage ?? createMemoryStorage<TSession>();
  const tokenManager =
    config.tokenManager ??
    createTokenManager({
      refreshThreshold: config.refreshThreshold ?? 300,
    });

  const subscribers = new Set<
    AuthAdapterSubscriber<TSession, TUser, TRole, TPermission>
  >();

  const resolveUser =
    config.resolveUser ?? ((session: TSession | null) => session?.user ?? null);
  const resolveRoles =
    config.resolveRoles ??
    ((session: TSession | null) =>
      session?.roles?.filter((role): role is TRole => role != null) ?? []);
  const resolvePermissions =
    config.resolvePermissions ??
    ((session: TSession | null) =>
      session?.permissions?.filter(
        (permission): permission is TPermission => permission != null,
      ) ?? []);

  let state: AuthAdapterState<TSession, TUser, TRole, TPermission> = {
    status: 'idle',
    session: null,
    user: null,
    roles: [],
    permissions: [],
  };

  let autoRefreshCleanup: (() => void) | null = null;

  // ============================================================================
  // Middleware Execution
  // ============================================================================

  const executeMiddleware = async <
    T extends keyof NonNullable<typeof config.middleware>[number],
  >(
    hook: T,
    ...args: Parameters<
      NonNullable<NonNullable<typeof config.middleware>[number][T]>
    >
  ): Promise<void> => {
    if (!config.middleware) return;

    for (const middleware of config.middleware) {
      const fn = middleware[hook];
      if (fn) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (fn as any)(...args);
        } catch (error) {
          console.error(`[auth2] Middleware error in ${String(hook)}:`, error);
          if (middleware.onError) {
            await middleware.onError(error);
          }
        }
      }
    }
  };

  // ============================================================================
  // State Management
  // ============================================================================

  const notify = () => {
    for (const listener of subscribers) listener(state);
    config.onStateChange?.(state);
  };

  const setState = (
    next: AuthAdapterState<TSession, TUser, TRole, TPermission>,
  ) => {
    state = next;
    notify();
  };

  const computeState = (
    session: TSession | null,
    status: AuthStatus,
    error?: unknown,
  ): AuthAdapterState<TSession, TUser, TRole, TPermission> => {
    const user = resolveUser(session);
    const baseRoles = resolveRoles(session);
    const basePermissions = resolvePermissions(session);

    // Apply hierarchies
    const roles = unique(expandRoles(baseRoles, config.roleHierarchy));
    const permissions = unique(
      expandPermissions(basePermissions, config.permissionHierarchy),
    );

    const tokenExpiresIn = session?.expiresAt
      ? tokenManager.getTimeUntilExpiry(session.expiresAt)
      : undefined;

    return {
      status,
      session,
      user,
      roles,
      permissions,
      error,
      lastRefresh: Date.now(),
      tokenExpiresIn,
    };
  };

  // ============================================================================
  // Storage Operations
  // ============================================================================

  const readStorage = async () => {
    const stored = await Promise.resolve(storage.get());
    return stored ?? null;
  };

  const writeStorage = async (next: TSession | null) => {
    if (next === null) {
      await Promise.resolve(storage.clear());
    } else {
      await Promise.resolve(storage.set(next));
    }
  };

  // ============================================================================
  // Auto-Refresh Management
  // ============================================================================

  const setupAutoRefresh = () => {
    if (autoRefreshCleanup) {
      autoRefreshCleanup();
      autoRefreshCleanup = null;
    }

    if (!config.autoRefresh || !config.refresh || !state.session?.expiresAt) {
      return;
    }

    if (tokenManager.scheduleRefresh) {
      autoRefreshCleanup = tokenManager.scheduleRefresh(() => {
        refresh().catch((error) => {
          console.error('[auth2] Auto-refresh failed:', error);
        });
      }, state.session.expiresAt);
    }
  };

  // ============================================================================
  // Session Management
  // ============================================================================

  const setSession = async (
    session: TSession | null,
    statusOverride?: AuthStatus,
    error?: unknown,
  ) => {
    await writeStorage(session);
    const status: AuthStatus =
      statusOverride ?? (session ? 'authenticated' : 'unauthenticated');
    const nextState = computeState(session, status, error);
    setState(nextState);

    setupAutoRefresh();

    return nextState;
  };

  const sync = async () => {
    setState({ ...state, status: 'loading' });
    try {
      const session =
        (await config.loadSession?.()) ?? (await readStorage()) ?? null;

      // Check if session is expired
      if (session?.expiresAt && tokenManager.isExpired(session.expiresAt)) {
        // Try to refresh if possible
        if (config.refresh && session.refreshToken) {
          try {
            const refreshed = await config.refresh(session);
            return await setSession(refreshed, 'authenticated');
          } catch {
            // Refresh failed, session is expired
            await executeMiddleware('onSessionExpired');
            return await setSession(null, 'unauthenticated');
          }
        }

        await executeMiddleware('onSessionExpired');
        return await setSession(null, 'unauthenticated');
      }

      return await setSession(
        session,
        session ? 'authenticated' : 'unauthenticated',
      );
    } catch (error) {
      await executeMiddleware('onError', error);
      return await setSession(null, 'error', error);
    }
  };

  // ============================================================================
  // Retry Logic
  // ============================================================================

  const withRetry = async <T>(
    fn: () => Promise<T>,
    context: string,
  ): Promise<T> => {
    const maxRetries = config.retryConfig?.maxRetries ?? 0;
    const retryDelay = config.retryConfig?.retryDelay ?? 1000;
    const shouldRetry = config.retryConfig?.retryOn;

    let lastError: unknown;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        const isLastAttempt = attempt === maxRetries;
        const shouldRetryError = shouldRetry ? shouldRetry(error) : false;

        if (isLastAttempt || !shouldRetryError) {
          throw error;
        }

        console.warn(
          `[auth2] ${context} failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying...`,
        );
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }

    throw lastError;
  };

  // ============================================================================
  // Authentication Operations
  // ============================================================================

  const refresh = async () => {
    const refreshFn = config.refresh;
    const currentSession = state.session;

    if (!refreshFn) return state;
    if (!currentSession) return state;

    try {
      const refreshed = await withRetry(
        () => refreshFn(currentSession),
        'refresh',
      );
      const nextState = await setSession(refreshed, 'authenticated');
      await executeMiddleware('onRefresh', nextState);
      return nextState;
    } catch (error) {
      await executeMiddleware('onError', error);
      return await setSession(state.session, 'error', error);
    }
  };

  const login = async (credentials: TCredentials) => {
    const loginFn = config.login;
    if (!loginFn) throw new Error('Auth adapter login is not configured');

    setState({ ...state, status: 'loading' });

    try {
      await executeMiddleware('onBeforeLogin', credentials);

      const session = await withRetry(() => loginFn(credentials), 'login');

      const nextState = await setSession(session, 'authenticated');
      await executeMiddleware('onAfterLogin', nextState);

      return nextState;
    } catch (error) {
      await executeMiddleware('onError', error);
      await setSession(null, 'error', error);
      throw error;
    }
  };

  const logout = async () => {
    const current = state.session;

    try {
      await executeMiddleware('onBeforeLogout');
      await config.logout?.(current ?? null);
    } finally {
      if (autoRefreshCleanup) {
        autoRefreshCleanup();
        autoRefreshCleanup = null;
      }
      await setSession(null, 'unauthenticated');
      await executeMiddleware('onAfterLogout');
    }
  };

  // ============================================================================
  // Permission Checking
  // ============================================================================

  const hasRole = (
    target: TRole | TRole[],
    options?: { requireAll?: boolean },
  ): boolean => {
    return checkRoles(state.roles, target, options);
  };

  const hasPermission = (
    target: TPermission | TPermission[] | PermissionPolicy<TPermission>,
    options?: { requireAll?: boolean },
  ): boolean => {
    return checkPermissions(state.permissions, target, options);
  };

  const can = (rule: PermissionRule<TRole, TPermission>): boolean => {
    return evaluatePermissionRule(state.roles, state.permissions, rule);
  };

  // ============================================================================
  // Token Management
  // ============================================================================

  const getToken = (): string | null => {
    return state.session?.accessToken ?? null;
  };

  const isTokenExpired = (): boolean => {
    return tokenManager.isExpired(state.session?.expiresAt);
  };

  const getTimeUntilExpiry = (): number => {
    return tokenManager.getTimeUntilExpiry(state.session?.expiresAt);
  };

  const scheduleAutoRefresh = (): (() => void) => {
    setupAutoRefresh();
    return () => {
      if (autoRefreshCleanup) {
        autoRefreshCleanup();
        autoRefreshCleanup = null;
      }
    };
  };

  // ============================================================================
  // API
  // ============================================================================

  const api: AuthAdapter<TUser, TRole, TPermission, TSession, TCredentials> = {
    getState: () => state,
    subscribe: (listener) => {
      subscribers.add(listener);
      return () => {
        subscribers.delete(listener);
      };
    },
    sync,
    login: config.login ? login : undefined,
    logout,
    refresh: async () => {
      return await refresh();
    },
    setSession: async (session) => {
      return await setSession(session);
    },
    hasRole,
    hasPermission,
    can,
    getToken,
    isTokenExpired,
    getTimeUntilExpiry,
    scheduleAutoRefresh,
  };

  return api;
}
