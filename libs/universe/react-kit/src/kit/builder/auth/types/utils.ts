// ============================================================================
// Utility Types
// ============================================================================

import type { AuthAdapter } from "./adapter";

export type InferSession<T> = T extends AuthAdapter<
  infer _User,
  infer _Role extends string,
  infer _Permission extends string,
  infer TSession,
  infer _Credentials
>
  ? TSession
  : never;

export type InferUser<T> = T extends AuthAdapter<
  infer TUser,
  infer _Role extends string,
  infer _Permission extends string,
  infer _Session,
  infer _Credentials
>
  ? TUser
  : never;

export type InferRole<T> = T extends AuthAdapter<
  infer _User,
  infer TRole extends string,
  infer _Permission extends string,
  infer _Session,
  infer _Credentials
>
  ? TRole
  : never;

export type InferPermission<T> = T extends AuthAdapter<
  infer _User,
  infer _Role extends string,
  infer TPermission extends string,
  infer _Session,
  infer _Credentials
>
  ? TPermission
  : never;

export type InferCredentials<T> = T extends AuthAdapter<
  infer _User,
  infer _Role extends string,
  infer _Permission extends string,
  infer _Session,
  infer TCredentials
>
  ? TCredentials
  : never;
