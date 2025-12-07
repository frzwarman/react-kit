import type { AuthSession, RefreshStrategy } from './core';
import type { PermissionHierarchy, RoleHierarchy } from './permissions';
import type { AuthAdapterState } from './state';
import type { AuthMiddleware } from './middleware';
import type { TokenManager } from './token-manager';
import type { AuthStorage } from './storage';

export type AuthAdapterConfig<
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
  storage?: AuthStorage<TSession>;
  loadSession?: () => Promise<TSession | null>;
  login?: (credentials: TCredentials) => Promise<TSession>;
  logout?: (session: TSession | null) => Promise<void> | void;
  refresh?: (session: TSession) => Promise<TSession>;
  resolveUser?: (session: TSession | null) => TUser | null;
  resolveRoles?: (session: TSession | null) => TRole[];
  resolvePermissions?: (session: TSession | null) => TPermission[];
  shouldRefresh?: (session: TSession) => boolean;
  onStateChange?: (
    state: AuthAdapterState<TSession, TUser, TRole, TPermission>,
  ) => void;

  refreshStrategy?: RefreshStrategy;
  refreshThreshold?: number;
  autoRefresh?: boolean;
  permissionHierarchy?: PermissionHierarchy<TPermission>;
  roleHierarchy?: RoleHierarchy<TRole>;
  middleware?: AuthMiddleware<TSession, TUser, TRole, TPermission>[];
  tokenManager?: TokenManager;
  retryConfig?: {
    maxRetries?: number;
    retryDelay?: number;
    retryOn?: (error: unknown) => boolean;
  };
};
