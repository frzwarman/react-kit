import type { CanProps } from '../types';
import { useCan } from '../hooks';

/**
 * Component for conditional rendering based on permissions.
 *
 * @example
 * ```tsx
 * <Can permissions="post:edit" fallback={<ReadOnlyView />}>
 *   <EditButton />
 * </Can>
 * ```
 */
export function Can<
  TRole extends string = string,
  TPermission extends string = string,
>({
  children,
  fallback = null,
  roles,
  permissions,
  requireAll = true,
}: CanProps<TRole, TPermission>) {
  const allowed = useCan({ roles, permissions, requireAll });
  if (!allowed) return fallback;
  return children;
}
