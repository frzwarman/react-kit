import type { ComponentType } from 'react';
import type { WithPermissionOptions } from '../types';
import { useCan } from '../hooks';

/**
 * Higher-order component that wraps a component with permission checks.
 */
export function withPermission<
  TRole extends string = string,
  TPermission extends string = string,
  TProps extends Record<string, unknown> = Record<string, unknown>,
>(
  Component: ComponentType<TProps>,
  options: WithPermissionOptions<TRole, TPermission>,
): ComponentType<TProps> {
  const WithPermissionWrapper = (props: TProps) => {
    const allowed = useCan(options);
    if (!allowed) return null;
    return <Component {...props} />;
  };
  WithPermissionWrapper.displayName = `WithPermission(${Component.displayName ?? Component.name ?? 'Component'})`;
  return WithPermissionWrapper as ComponentType<TProps>;
}
