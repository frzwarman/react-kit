import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '../../../../shadcn/ui/sidebar';
import { Separator } from '../../../../shadcn/ui/separator';
import {
  Package,
  LogOut,
  ChevronRight,
  ChevronDown,
  Circle,
} from 'lucide-react';

import { useLocation, Link } from '@tanstack/react-router';
import { Fragment, useState, useCallback } from 'react';
import ThemeToggle from './ThemeToggle';
import { useAdminSidebarMenu } from '../hooks/menu';
import type { AdminMenuItem } from '../types';
import { AdminMenuProvider } from '../providers/AdminMenuProvider';

type AdminLayoutProps = {
  children?: React.ReactNode;
  defaultItemIcon?: React.ComponentType<{ className?: string }>;
  // When false, the sidebar cannot be collapsed and the trigger will be hidden
  sidebarCollapsible?: boolean;
  // Sidebar header customization
  sidebarHeader?: React.ReactNode;
  sidebarHeaderTitle?: React.ReactNode;
  sidebarHeaderIcon?: React.ComponentType<{ className?: string }>;
  // Header bar customization
  headerAfterTrigger?: React.ReactNode; // renders right after the collapsible icon trigger
  headerAfterTheme?: React.ReactNode; // renders right after the ThemeToggle on the right
};

function AdminLayoutContent({
  children,
  defaultItemIcon,
  sidebarCollapsible = false,
  sidebarHeader,
  sidebarHeaderTitle,
  sidebarHeaderIcon,
  headerAfterTrigger,
  headerAfterTheme,
}: AdminLayoutProps) {
  const { groups: sidebarGroups } = useAdminSidebarMenu();
  const location = useLocation();
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});
  const FallbackIcon = defaultItemIcon ?? Circle;
  const SidebarHeaderIcon = sidebarHeaderIcon ?? Package;
  const sidebarTitle = sidebarHeaderTitle ?? 'Application';

  // Function to check if menu item is active
  const isMenuItemActive = (itemUrl: string | undefined) => {
    if (!itemUrl) return false;
    return location.pathname === itemUrl || location.pathname.startsWith(itemUrl + '/');
  };

  const setOpen = useCallback((id: string, val?: boolean) => {
    setOpenMap((prev) => ({ ...prev, [id]: val ?? !prev[id] }));
  }, []);

  const hasActiveDescendant = (item: AdminMenuItem): boolean => {
    if (!item.children || item.children.length === 0) return false;
    return item.children.some((c) => isMenuItemActive(c.url) || hasActiveDescendant(c));
  };

  const renderItem = (item: AdminMenuItem, level = 0) => {
    const hasChildren = Array.isArray(item.children) && item.children.length > 0;
    const isActive = isMenuItemActive(item.url);
    const isOpen = openMap[item.id] ?? (hasChildren && hasActiveDescendant(item));

    const indentClassMap = ['','pl-6','pl-10','pl-14'] as const;
    const indent = indentClassMap[Math.min(level, 3)];

    const content = (
      <SidebarMenuItem key={item.id} className={`mb-1 ${level > 0 ? 'ml-1' : ''}`}>
        <SidebarMenuButton
          asChild={!!item.url && !hasChildren}
          isActive={isActive}
          tooltip={item.title}
          onClick={() => {
            if (hasChildren) setOpen(item.id);
          }}
          disabled={item.disabled}
          className={`group relative overflow-hidden rounded-lg transition-all duration-200 hover:bg-sidebar-accent/70 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground ${indent}`}
        >
          {item.url && !hasChildren ? (
            <Link to={item.url} className="flex items-center gap-3 px-3">
              {item.icon && (
                <item.icon
                  className={`h-4 w-4 transition-colors ${isActive ? 'text-primary-foreground' : 'text-sidebar-foreground group-hover:text-sidebar-accent-foreground'}`}
                />
              )}
              <span className={`font-medium transition-colors ${isActive ? 'text-primary-foreground' : 'text-sidebar-foreground group-hover:text-sidebar-accent-foreground'}`}>{item.title}</span>
              {item.badge && (
                <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ) : (
            <div className="flex items-center gap-3 px-3 py-2.5 w-full">
              {hasChildren && (
                isOpen ? (
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                )
              )}
              {item.icon ? (
                <item.icon className="h-4 w-4 text-sidebar-foreground group-hover:text-sidebar-accent-foreground" />
              ) : (
                <FallbackIcon className="h-3.5 w-3.5 text-muted-foreground" />
              )}
              {item.url ? (
                <Link to={item.url} className="flex-1 text-left">
                  <span className="font-medium text-sidebar-foreground group-hover:text-sidebar-accent-foreground">{item.title}</span>
                </Link>
              ) : (
                <span className="font-medium text-sidebar-foreground group-hover:text-sidebar-accent-foreground flex-1">{item.title}</span>
              )}
              {item.badge && (
                <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
          )}
        </SidebarMenuButton>
        {hasChildren && isOpen && (
          <div className="mt-1 flex flex-col">
            {(item.children ?? []).map((child: AdminMenuItem) => renderItem(child, Math.min(level + 1, 3)))}
          </div>
        )}
      </SidebarMenuItem>
    );

    return content;
  };

  return (
      <div className="flex min-h-dvh w-full">
      <Sidebar className="bg-sidebar border-r border-sidebar-border" collapsible={sidebarCollapsible ? "icon" : "none"}>
        <SidebarHeader className="bg-sidebar border-b border-sidebar-border">
          {sidebarHeader ? (
            sidebarHeader
          ) : (
            <div className="sidebar-header-content flex items-center justify-center px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <SidebarHeaderIcon className="h-4 w-4" />
                </div>
                <span className="font-semibold text-sidebar-foreground">{sidebarTitle}</span>
              </div>
            </div>
          )}
        </SidebarHeader>
        <SidebarContent className="bg-sidebar px-2 py-4">
          {sidebarGroups.map((group, idx) => (
            <Fragment key={group.id}>
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2 group-data-[collapsible=icon]:hidden">{group.label}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="group-data-[collapsible=icon]:items-center">
                    {group.items.map((item) => renderItem(item, 0))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              {idx < sidebarGroups.length - 1 && (
                <Separator orientation="horizontal" className="bg-sidebar-border group-data-[collapsible=icon]:hidden" />
              )}
            </Fragment>
          ))}
        </SidebarContent>
        <SidebarFooter className="bg-sidebar border-t border-sidebar-border px-2 py-3">
          <SidebarMenu>
            <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center">
              <SidebarMenuButton
                tooltip="Logout"
                className="group relative overflow-hidden rounded-lg mx-1 transition-all duration-200 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:!justify-center group-data-[collapsible=icon]:!px-0 group-data-[collapsible=icon]:!gap-0"
              >
                <div className="flex items-center gap-3 px-3 py-2.5 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:!justify-center group-data-[collapsible=icon]:!gap-0 group-data-[collapsible=icon]:!px-0">
                  <LogOut className="h-4 w-4 text-sidebar-foreground group-hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:mr-0" />
                  <span className="font-medium text-sidebar-foreground group-hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden">Logout</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
          <div className="flex items-center gap-4">
            {sidebarCollapsible && (
              <SidebarTrigger className="h-8 w-8 text-foreground hover:bg-accent hover:text-accent-foreground rounded-md" />
            )}
            {headerAfterTrigger}
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {headerAfterTheme}
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
          {children}
        </main>
      </SidebarInset>
      </div>
  );
}

export default function AdminLayout({
  children,
  defaultItemIcon,
  sidebarCollapsible,
  sidebarHeader,
  sidebarHeaderTitle,
  sidebarHeaderIcon,
  headerAfterTrigger,
  headerAfterTheme,
}: AdminLayoutProps) {
  return (
    <AdminMenuProvider>
      <SidebarProvider>
        <AdminLayoutContent
          defaultItemIcon={defaultItemIcon}
          sidebarCollapsible={sidebarCollapsible}
          sidebarHeader={sidebarHeader}
          sidebarHeaderTitle={sidebarHeaderTitle}
          sidebarHeaderIcon={sidebarHeaderIcon}
          headerAfterTrigger={headerAfterTrigger}
          headerAfterTheme={headerAfterTheme}
        >
          {children}
        </AdminLayoutContent>
      </SidebarProvider>
    </AdminMenuProvider>
  );
}
