import { useState, useCallback, useMemo } from "react";
import { AdminMenuGroup, AdminMenuContextValue } from "../types";
import { AdminMenuContext } from "../hooks/menu";

export type AdminMenuProviderProps = {
  initialGroups?: AdminMenuGroup[];
  children: React.ReactNode;
};

export function AdminMenuProvider({ initialGroups = [], children }: AdminMenuProviderProps) {
  const [groups, setGroups] = useState<AdminMenuGroup[]>(initialGroups);

  const registerGroup = useCallback<AdminMenuContextValue['registerGroup']>((group) => {
    setGroups((prev) => {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.log('[AdminMenuProvider] registerGroup', group);
      }
      const exists = prev.some((g) => g.id === group.id);
      if (exists) return prev;
      return [...prev, { id: group.id, label: group.label, items: group.items ?? [] }];
    });
  }, []);

  const registerItem = useCallback<AdminMenuContextValue['registerItem']>((groupId, item) => {
    setGroups((prev) => {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.log('[AdminMenuProvider] registerItem', groupId, item);
      }
      // if group exists, append or replace item by id
      const idx = prev.findIndex((g) => g.id === groupId);
      if (idx >= 0) {
        const group = prev[idx];
        const items = [...group.items];
        const existingIdx = items.findIndex((it) => it.id === item.id);
        if (existingIdx >= 0) items[existingIdx] = item; else items.push(item);
        const next = [...prev];
        next[idx] = { ...group, items };
        return next;
      }
      // create group if missing
      return [...prev, { id: groupId, label: groupId, items: [item] }];
    });
  }, []);

  const clear = useCallback(() => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log('[AdminMenuProvider] clear');
    }
    setGroups([]);
  }, []);

  const value = useMemo<AdminMenuContextValue>(() => ({ groups, setGroups, registerGroup, registerItem, clear }), [groups, registerGroup, registerItem, clear]);

  return <AdminMenuContext.Provider value={value}>{children}</AdminMenuContext.Provider>;
}