import type { RequireAuthProps } from '../types';
import { useAuthContext } from '../providers/AuthProvider';

/**
 * Component that requires authentication
 * Optionally checks for specific roles and permissions
 *
 * @example
 * ```tsx
 * // Basic authentication check
 * <RequireAuth fallback={<Login />}>
 *   <Dashboard />
 * </RequireAuth>
 *
 * // With role check
 * <RequireAuth
 *   roles="admin"
 *   fallback={<Forbidden />}
 *   loadingFallback={<Spinner />}
 * >
 *   <AdminPanel />
 * </RequireAuth>
 *
 * // With permission check
 * <RequireAuth
 *   permissions={['post:edit', 'post:delete']}
 *   fallback={<Forbidden />}
 * >
 *   <PostEditor />
 * </RequireAuth>
 *
 * // Complex rule
 * <RequireAuth
 *   roles={['admin', 'moderator']}
 *   permissions={{
 *     operator: 'OR',
 *     permissions: ['post:edit', 'post:delete']
 *   }}
 *   requireAll={false}
 *   fallback={<Forbidden />}
 * >
 *   <ContentManager />
 * </RequireAuth>
 * ```
 */
export function RequireAuth<
  TRole extends string = string,
  TPermission extends string = string,
>({
  children,
  fallback = null,
  loadingFallback = null,
  roles,
  permissions,
  requireAll = true,
}: RequireAuthProps<TRole, TPermission>) {
  const { status, can } = useAuthContext();

  if (status === 'loading' || status === 'idle') {
    return loadingFallback;
  }

  if (status !== 'authenticated') {
    return fallback;
  }

  if (!roles && !permissions) {
    return children;
  }

  const allowed = can({ roles, permissions, requireAll });

  if (!allowed) {
    return fallback;
  }

  return children;
}
