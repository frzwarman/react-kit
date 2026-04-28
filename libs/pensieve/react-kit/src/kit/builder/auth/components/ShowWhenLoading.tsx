import type { ReactNode } from 'react';
import { useAuthContext } from '../providers/AuthProvider';

/**
 * Component that shows children only while loading.
 */
export function ShowWhenLoading({ children }: { children: ReactNode }) {
  const { status } = useAuthContext();
  return status === 'loading' ? children : null;
}
