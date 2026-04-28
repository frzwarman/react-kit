import type { ReactNode } from 'react';
import { useAuthContext } from '../providers/AuthProvider';

/**
 * Component that shows children only when authenticated.
 */
export function ShowWhenAuthenticated({ children }: { children: ReactNode }) {
  const { status } = useAuthContext();
  return status === 'authenticated' ? children : null;
}
