export type AdminMenuItem = {
  id: string;
  title: string;
  url?: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  onClick?: () => void;
  disabled?: boolean;
  children?: AdminMenuItem[];
};

export type AdminMenuGroup = {
  id: string;
  label: string;
  items: AdminMenuItem[];
};

export type AdminMenuContextValue = {
  groups: AdminMenuGroup[];
  setGroups: React.Dispatch<React.SetStateAction<AdminMenuGroup[]>>;
  registerGroup: (
    group: Omit<AdminMenuGroup, 'items'> & { items?: AdminMenuItem[] },
  ) => void;
  registerItem: (groupId: string, item: AdminMenuItem) => void;
  clear: () => void;
};
