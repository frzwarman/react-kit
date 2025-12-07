import type {
  PermissionHierarchy,
  PermissionPolicy,
  PermissionRule,
  RoleHierarchy,
} from '../types';

/**
 * Expands permissions based on hierarchy
 * e.g., if user has 'admin' and hierarchy defines admin: ['read', 'write'],
 * user effectively has ['admin', 'read', 'write']
 */
export function expandPermissions<T extends string>(
  permissions: T[],
  hierarchy?: PermissionHierarchy<T>,
): T[] {
  if (!hierarchy) return permissions;

  const expanded = new Set<T>(permissions);
  const queue = [...permissions];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;
    const children = hierarchy[current];

    if (children) {
      for (const child of children) {
        if (!expanded.has(child)) {
          expanded.add(child);
          queue.push(child);
        }
      }
    }
  }

  return Array.from(expanded);
}

/**
 * Expands roles based on hierarchy
 * e.g., if user has 'admin' and hierarchy defines admin: ['moderator', 'user'],
 * user effectively has ['admin', 'moderator', 'user']
 */
export function expandRoles<T extends string>(
  roles: T[],
  hierarchy?: RoleHierarchy<T>,
): T[] {
  if (!hierarchy) return roles;

  const expanded = new Set<T>(roles);
  const queue = [...roles];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;
    const children = hierarchy[current];

    if (children) {
      for (const child of children) {
        if (!expanded.has(child)) {
          expanded.add(child);
          queue.push(child);
        }
      }
    }
  }

  return Array.from(expanded);
}

/**
 * Checks if target permissions match against user permissions
 * Supports both array of permissions and permission policies (AND/OR operations)
 */
export function checkPermissions<T extends string>(
  userPermissions: T[],
  target: T | T[] | PermissionPolicy<T>,
  options?: { requireAll?: boolean },
): boolean {
  // Handle permission policy (with AND/OR operator)
  if (typeof target === 'object' && 'permissions' in target) {
    const policy = target as PermissionPolicy<T>;
    const operator = policy.operator ?? 'AND';

    if (operator === 'AND') {
      return policy.permissions.every((p) => userPermissions.includes(p));
    } else {
      return policy.permissions.some((p) => userPermissions.includes(p));
    }
  }

  // Handle simple string or array
  const targets = Array.isArray(target) ? target : [target];
  const requireAll = options?.requireAll ?? true;

  if (targets.length === 0) return true;

  return requireAll
    ? targets.every((p) => userPermissions.includes(p))
    : targets.some((p) => userPermissions.includes(p));
}

/**
 * Checks if target roles match against user roles
 */
export function checkRoles<T extends string>(
  userRoles: T[],
  target: T | T[],
  options?: { requireAll?: boolean },
): boolean {
  const targets = Array.isArray(target) ? target : [target];
  const requireAll = options?.requireAll ?? true;

  if (targets.length === 0) return true;

  return requireAll
    ? targets.every((r) => userRoles.includes(r))
    : targets.some((r) => userRoles.includes(r));
}

/**
 * Evaluates a permission rule (combination of roles and permissions)
 */
export function evaluatePermissionRule<
  TRole extends string = string,
  TPermission extends string = string,
>(
  userRoles: TRole[],
  userPermissions: TPermission[],
  rule: PermissionRule<TRole, TPermission>,
): boolean {
  if (!rule.roles && !rule.permissions) {
    return true;
  }

  const requireAll = rule.requireAll ?? true;

  const roleAllowed = rule.roles
    ? checkRoles(userRoles, rule.roles, { requireAll })
    : true;

  const permissionAllowed = rule.permissions
    ? checkPermissions(userPermissions, rule.permissions, { requireAll })
    : true;

  return requireAll
    ? roleAllowed && permissionAllowed
    : roleAllowed || permissionAllowed;
}
