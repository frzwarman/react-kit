import React, { createContext, useContext } from 'react';
import { AdminMenuContextValue, AdminMenuGroup } from '../types';

export const AdminMenuContext = createContext<AdminMenuContextValue | null>(null);

export function useAdminSidebarMenu() {
  const ctx = useContext(AdminMenuContext);
  if (!ctx) {
    // Provide a non-throwing fallback to allow usage without explicit provider
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const noop = () => {};
    return {
      groups: [] as AdminMenuGroup[],
      setGroups: noop as unknown as React.Dispatch<React.SetStateAction<AdminMenuGroup[]>>,
      registerGroup: noop as AdminMenuContextValue['registerGroup'],
      registerItem: noop as AdminMenuContextValue['registerItem'],
      clear: noop,
    } satisfies AdminMenuContextValue;
  }
  return ctx;
}

export function useAdminSidebarMenuRegistration() {
  const { setGroups, registerGroup, registerItem, clear } = useAdminSidebarMenu();
  return { setGroups, registerGroup, registerItem, clear };
}
