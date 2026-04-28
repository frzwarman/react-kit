import type { AuthAdapterState } from './state';

export type AuthMiddleware<
  TSession = unknown,
  TUser = unknown,
  TRole extends string = string,
  TPermission extends string = string,
> = {
  onBeforeLogin?: (credentials: unknown) => Promise<void> | void;
  onAfterLogin?: (
    state: AuthAdapterState<TSession, TUser, TRole, TPermission>,
  ) => Promise<void> | void;
  onBeforeLogout?: () => Promise<void> | void;
  onAfterLogout?: () => Promise<void> | void;
  onRefresh?: (
    state: AuthAdapterState<TSession, TUser, TRole, TPermission>,
  ) => Promise<void> | void;
  onError?: (error: unknown) => Promise<void> | void;
  onSessionExpired?: () => Promise<void> | void;
};
