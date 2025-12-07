import type { AuthSession } from './core';
import type { PermissionPolicy, PermissionRule } from './permissions';
import type { AuthAdapterState, AuthAdapterSubscriber } from './state';

export type AuthAdapter<
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
  getState: () => AuthAdapterState<TSession, TUser, TRole, TPermission>;
  subscribe: (
    listener: AuthAdapterSubscriber<TSession, TUser, TRole, TPermission>,
  ) => () => void;
  sync: () => Promise<AuthAdapterState<TSession, TUser, TRole, TPermission>>;
  login?: (
    credentials: TCredentials,
  ) => Promise<AuthAdapterState<TSession, TUser, TRole, TPermission>>;
  logout: () => Promise<void>;
  refresh: () => Promise<AuthAdapterState<TSession, TUser, TRole, TPermission>>;
  setSession: (
    session: TSession | null,
  ) => Promise<AuthAdapterState<TSession, TUser, TRole, TPermission>>;
  hasRole: (
    target: TRole | TRole[],
    options?: { requireAll?: boolean },
  ) => boolean;
  hasPermission: (
    target: TPermission | TPermission[] | PermissionPolicy<TPermission>,
    options?: { requireAll?: boolean },
  ) => boolean;
  can: (rule: PermissionRule<TRole, TPermission>) => boolean;
  getToken: () => string | null;
  isTokenExpired: () => boolean;
  getTimeUntilExpiry: () => number;
  scheduleAutoRefresh?: () => () => void;
};

export type AuthContextValue<
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
  state: AuthAdapterState<TSession, TUser, TRole, TPermission>;
  status: AuthAdapterState<TSession, TUser, TRole, TPermission>['status'];
  session: TSession | null;
  user: TUser | null;
  roles: TRole[];
  permissions: TPermission[];
  error?: unknown;
  login?: (
    credentials: TCredentials,
  ) => Promise<AuthAdapterState<TSession, TUser, TRole, TPermission>>;
  logout: () => Promise<void>;
  refresh: () => Promise<AuthAdapterState<TSession, TUser, TRole, TPermission>>;
  setSession: (
    session: TSession | null,
  ) => Promise<AuthAdapterState<TSession, TUser, TRole, TPermission>>;
  hasRole: (
    target: TRole | TRole[],
    options?: { requireAll?: boolean },
  ) => boolean;
  hasPermission: (
    target: TPermission | TPermission[] | PermissionPolicy<TPermission>,
    options?: { requireAll?: boolean },
  ) => boolean;
  can: (rule: PermissionRule<TRole, TPermission>) => boolean;
  getToken: () => string | null;
  isTokenExpired: () => boolean;
  getTimeUntilExpiry: () => number;
};

export type RequireAuthProps<
  TRole extends string = string,
  TPermission extends string = string,
> = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loadingFallback?: React.ReactNode;
  roles?: TRole | TRole[];
  permissions?: TPermission | TPermission[] | PermissionPolicy<TPermission>;
  requireAll?: boolean;
};

export type CanProps<
  TRole extends string = string,
  TPermission extends string = string,
> = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  roles?: TRole | TRole[];
  permissions?: TPermission | TPermission[] | PermissionPolicy<TPermission>;
  requireAll?: boolean;
};

export type WithPermissionOptions<
  TRole extends string = string,
  TPermission extends string = string,
> = {
  roles?: TRole | TRole[];
  permissions?: TPermission | TPermission[] | PermissionPolicy<TPermission>;
  requireAll?: boolean;
};

export type GraphQLAuthClient<TSession = unknown, TCredentials = unknown> = {
  login: (credentials: TCredentials) => Promise<TSession>;
  logout?: () => Promise<void>;
  refresh?: (refreshToken: string) => Promise<TSession>;
  getCurrentUser?: () => Promise<TSession>;
};

export type RESTAuthClient<TSession = unknown, TCredentials = unknown> = {
  login: (credentials: TCredentials) => Promise<TSession>;
  logout?: () => Promise<void>;
  refresh?: (refreshToken: string) => Promise<TSession>;
  getCurrentUser?: () => Promise<TSession>;
};

export type ClientAdapter<TSession = unknown, TCredentials = unknown> =
  | GraphQLAuthClient<TSession, TCredentials>
  | RESTAuthClient<TSession, TCredentials>;
