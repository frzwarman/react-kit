// ============================================================================
// Core
// ============================================================================

export { createAuthAdapter } from "./utils/auth-adapter";
export { AuthProvider, useAuthContext } from "./providers/AuthProvider";

// ============================================================================
// Storage
// ============================================================================

export {
  createStorage,
  createMemoryStorage,
  createNativeStorage,
} from "./utils/storage";

// ============================================================================
// Utilities
// ============================================================================

export { createTokenManager } from "./utils/token-manager";
export {
  expandPermissions,
  expandRoles,
  checkPermissions,
  checkRoles,
  evaluatePermissionRule,
} from "./utils/permission-checker";

// ============================================================================
// Client Adapters
// ============================================================================

export {
  createGraphQLAuthAdapter,
  createRESTAuthAdapter,
  createAxiosAuthInterceptor,
  createAuthFetch,
} from "./utils/client-adapters";

export type {
  GraphQLClientAdapterOptions,
  RESTClientAdapterOptions,
} from "./utils/client-adapters";

// ============================================================================
// Hooks
// ============================================================================

export {
  useAuth,
  useAuthStatus,
  useIsAuthenticated,
  useAuthSession,
  useAuthUser,
  useAuthRoles,
  useAuthPermissions,
  useAuthError,
  usePermission,
  useRole,
  useCan,
  useAuthToken,
  useIsTokenExpired,
  useTimeUntilExpiry,
  useLogin,
  useLogout,
  useRefresh,
  useSetSession,
} from "./hooks";

// ============================================================================
// Components
// ============================================================================

export { RequireAuth } from "./components/RequireAuth";
export { Can } from "./components/Can";
export { withPermission } from "./components/withPermission";
export { ShowWhenAuthenticated } from "./components/ShowWhenAuthenticated";
export { ShowWhenUnauthenticated } from "./components/ShowWhenUnauthenticated";
export { ShowWhenLoading } from "./components/ShowWhenLoading";
export { ShowWhenError } from "./components/ShowWhenError";

// ============================================================================
// Types
// ============================================================================

export type {
  // Core types
  AuthStatus,
  TokenType,
  RefreshStrategy,
  AuthSession,
  // Permission types
  PermissionOperator,
  PermissionPolicy,
  PermissionRule,
  PermissionHierarchy,
  RoleHierarchy,
  // State types
  AuthAdapterState,
  AuthAdapterSubscriber,
  // Storage types
  AuthStorage,
  StorageType,
  StorageOptions,
  // Middleware types
  AuthMiddleware,
  // Token manager types
  TokenManager,
  // Adapter types
  AuthAdapterConfig,
  AuthAdapter,
  // Context types
  AuthContextValue,
  // Component prop types
  RequireAuthProps,
  CanProps,
  WithPermissionOptions,
  // Client adapter types
  GraphQLAuthClient,
  RESTAuthClient,
  ClientAdapter,
  // Utility types
  InferSession,
  InferUser,
  InferRole,
  InferPermission,
  InferCredentials,
} from "./types";
