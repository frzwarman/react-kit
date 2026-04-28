import type { AuthStatus } from './core';

export type AuthAdapterState<TSession, TUser, TRole, TPermission> = {
  status: AuthStatus;
  session: TSession | null;
  user: TUser | null;
  roles: TRole[];
  permissions: TPermission[];
  error?: unknown;
  lastRefresh?: number;
  tokenExpiresIn?: number;
};

export type AuthAdapterSubscriber<TSession, TUser, TRole, TPermission> = (
  state: AuthAdapterState<TSession, TUser, TRole, TPermission>,
) => void;
