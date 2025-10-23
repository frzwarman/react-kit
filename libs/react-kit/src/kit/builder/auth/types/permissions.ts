export type PermissionOperator = 'AND' | 'OR';

export type PermissionPolicy<TPermission extends string = string> = {
  operator?: PermissionOperator;
  permissions: TPermission[];
};

export type PermissionRule<
  TRole extends string = string,
  TPermission extends string = string,
> = {
  roles?: TRole | TRole[];
  permissions?: TPermission | TPermission[] | PermissionPolicy<TPermission>;
  requireAll?: boolean;
};

export type PermissionHierarchy<TPermission extends string = string> = {
  [key in TPermission]?: TPermission[];
};

export type RoleHierarchy<TRole extends string = string> = {
  [key in TRole]?: TRole[];
};
