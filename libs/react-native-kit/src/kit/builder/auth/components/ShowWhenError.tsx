import type { ReactNode } from 'react';
import { useAuthContext } from '../providers/AuthProvider';

/**
 * Component that shows children only when there's an error.
 */
export function ShowWhenError({ children }: { children: ReactNode }) {
  const { status } = useAuthContext();
  return status === 'error' ? children : null;
}
