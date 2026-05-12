import type { ReactNode } from 'react';
import { useAuthContext } from '../providers/AuthProvider';

/**
 * Component that shows children only when NOT authenticated.
 */
export function ShowWhenUnauthenticated({ children }: { children: ReactNode }) {
  const { status } = useAuthContext();
  return status === 'unauthenticated' ? children : null;
}
