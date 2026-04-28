import type {
  PermissionPolicy,
  PermissionRule,
  WithPermissionOptions,
} from '../types';
import { useAuthContext } from '../providers/AuthProvider';

/**
 * Hook to check if user has specific permission(s).
 */
export function usePermission<TPermission extends string = string>(
  permission: TPermission | TPermission[] | PermissionPolicy<TPermission>,
  options?: { requireAll?: boolean },
) {
  const { hasPermission } = useAuthContext();
  return hasPermission(permission, options);
}

/**
 * Hook to check if user has specific role(s).
 */
export function useRole<TRole extends string = string>(
  roles: TRole | TRole[],
  options?: { requireAll?: boolean },
) {
  const { hasRole } = useAuthContext();
  return hasRole(roles, options);
}

/**
 * Hook to check complex permission rules.
 */
export function useCan<
  TRole extends string = string,
  TPermission extends string = string,
>(
  rule:
    | WithPermissionOptions<TRole, TPermission>
    | PermissionRule<TRole, TPermission>,
) {
  const { can } = useAuthContext();
  return can(rule as PermissionRule<TRole, TPermission>);
}
