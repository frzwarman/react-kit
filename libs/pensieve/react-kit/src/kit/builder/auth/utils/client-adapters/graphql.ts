import type { AuthAdapterConfig, AuthSession, GraphQLAuthClient } from '../../types'

export type GraphQLClientAdapterOptions<
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
  client: GraphQLAuthClient<TSession, TCredentials>
  resolveUser?: (session: TSession | null) => TUser | null
  resolveRoles?: (session: TSession | null) => TRole[]
  resolvePermissions?: (session: TSession | null) => TPermission[]
}

export function createGraphQLAuthAdapter<
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
  options: GraphQLClientAdapterOptions<
    TUser,
    TRole,
    TPermission,
    TSession,
    TCredentials
  >,
): Partial<
  AuthAdapterConfig<TUser, TRole, TPermission, TSession, TCredentials>
> {
  return {
    login: options.client.login,
    logout: options.client.logout,
    refresh: options.client.refresh
      ? async (session: TSession) => {
          if (!session.refreshToken) {
            throw new Error('No refresh token available')
          }
          if (!options.client.refresh) {
            throw new Error('Refresh function not provided')
          }
          return await options.client.refresh(session.refreshToken)
        }
      : undefined,
    loadSession: options.client.getCurrentUser,
    resolveUser: options.resolveUser,
    resolveRoles: options.resolveRoles,
    resolvePermissions: options.resolvePermissions,
  }
}
