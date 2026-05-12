export type AuthStatus =
  | 'idle'
  | 'loading'
  | 'authenticated'
  | 'unauthenticated'
  | 'error';

export type TokenType = 'bearer' | 'jwt' | 'custom';

export type RefreshStrategy = 'auto' | 'manual' | 'sliding';

export type AuthSession<
  TUser = unknown,
  TRole = string,
  TPermission = string,
> = {
  user?: TUser | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  tokenType?: TokenType;
  roles?: TRole[] | null;
  permissions?: TPermission[] | null;
  expiresAt?: number | null;
  refreshExpiresAt?: number | null;
  issuedAt?: number | null;
  meta?: Record<string, unknown> | null;
};
