import type { Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import AdminLayout from '../../../../kit/layouts/admin/components/AdminLayout';
import { ThemeProvider } from '../../../../kit/providers/ThemeProvider';
import { useAdminSidebarMenuRegistration } from '../../../../kit/layouts/admin/hooks/menu';
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import {
  Home,
  ShoppingCart,
  Settings,
  Users,
  BarChart3,
  FileText,
  Shield,
  Bell,
  LifeBuoy,
} from 'lucide-react';

const meta: Meta<typeof AdminLayout> = {
  title: 'Kit/Layouts/Admin',
  component: AdminLayout,
};
export default meta;

type Story = StoryObj<typeof AdminLayout>;

type AdminLayoutStoryProps = React.ComponentProps<typeof AdminLayout>;

function RegisterComplexMenus() {
  const { registerGroup, registerItem, clear } =
    useAdminSidebarMenuRegistration();
  useEffect(() => {
    clear();
    // Overview
    registerGroup({ id: 'overview', label: 'Overview' });
    registerItem('overview', {
      id: 'home',
      title: 'Home',
      url: '/',
      icon: Home,
    });
    registerItem('overview', {
      id: 'reports',
      title: 'Reports',
      url: '/reports',
      icon: BarChart3,
      badge: 'New',
    });

    // Management
    registerGroup({ id: 'management', label: 'Management' });
    registerItem('management', {
      id: 'users',
      title: 'Users',
      icon: Users,
      badge: 3,
      children: [
        { id: 'users-all', title: 'All Users', url: '/users' },
        {
          id: 'users-teams',
          title: 'Teams',
          children: [
            {
              id: 'team-alpha',
              title: 'Team Alpha',
              url: '/users/teams/alpha',
              children: [
                {
                  id: 'team-alpha-members',
                  title: 'Members',
                  url: '/users/teams/alpha/members',
                },
                {
                  id: 'team-alpha-settings',
                  title: 'Settings',
                  url: '/users/teams/alpha/settings',
                },
              ],
            },
            { id: 'team-beta', title: 'Team Beta', url: '/users/teams/beta' },
          ],
        },
      ],
    });
    registerItem('management', {
      id: 'orders',
      title: 'Orders',
      icon: ShoppingCart,
      children: [
        { id: 'orders-all', title: 'All Orders', url: '/orders' },
        {
          id: 'orders-pending',
          title: 'Pending',
          url: '/orders/pending',
          badge: 5,
        },
        {
          id: 'orders-completed',
          title: 'Completed',
          url: '/orders/completed',
        },
      ],
    });
    // Action-only item
    registerItem('management', {
      id: 'export',
      title: 'Export CSV',
      onClick: () => console.log('Export CSV'),
    });

    // Content
    registerGroup({ id: 'content', label: 'Content' });
    registerItem('content', {
      id: 'articles',
      title: 'Articles',
      icon: FileText,
      children: [
        { id: 'articles-published', title: 'Published', url: '/articles' },
        {
          id: 'articles-archived',
          title: 'Archived',
          url: '/articles/archived',
        },
      ],
    });
    registerItem('content', {
      id: 'drafts',
      title: 'Drafts',
      url: '/drafts',
      icon: FileText,
      badge: 7,
    });

    // System
    registerGroup({ id: 'system', label: 'System' });
    registerItem('system', {
      id: 'alerts',
      title: 'Alerts',
      url: '/alerts',
      icon: Bell,
    });
    registerItem('system', {
      id: 'security',
      title: 'Security',
      url: '/security',
      icon: Shield,
      disabled: true,
    });
    registerItem('system', {
      id: 'support',
      title: 'Support',
      url: '/support',
      icon: LifeBuoy,
    });

    // Settings
    registerGroup({ id: 'settings', label: 'Settings' });
    registerItem('settings', {
      id: 'general',
      title: 'General',
      url: '/settings',
      icon: Settings,
    });
  }, [registerGroup, registerItem, clear]);
  return null;
}

function App(props: AdminLayoutStoryProps) {
  const rootRoute = createRootRoute({
    component: () => (
      <ThemeProvider>
        <AdminLayout {...props}>
          <RegisterComplexMenus />
          <Outlet />
        </AdminLayout>
      </ThemeProvider>
    ),
  });

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">Home</h2>
        <p className="text-muted-foreground">Overview of your admin panel.</p>
      </div>
    ),
  });

  const extraRoutes = [
    { path: '/reports', title: 'Reports' },
    { path: '/users', title: 'Users' },
    { path: '/users/teams/alpha', title: 'Team Alpha' },
    { path: '/users/teams/alpha/members', title: 'Team Alpha Members' },
    { path: '/users/teams/alpha/settings', title: 'Team Alpha Settings' },
    { path: '/users/teams/beta', title: 'Team Beta' },
    { path: '/orders', title: 'Orders' },
    { path: '/orders/pending', title: 'Orders Pending' },
    { path: '/orders/completed', title: 'Orders Completed' },
    { path: '/articles', title: 'Articles' },
    { path: '/articles/archived', title: 'Articles Archived' },
    { path: '/drafts', title: 'Drafts' },
    { path: '/alerts', title: 'Alerts' },
    { path: '/security', title: 'Security' },
    { path: '/support', title: 'Support' },
    { path: '/settings', title: 'Settings' },
  ].map(({ path, title }) =>
    createRoute({
      getParentRoute: () => rootRoute,
      path,
      component: () => (
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-2">{title}</h2>
          <p className="text-muted-foreground">This is the {title} page.</p>
        </div>
      ),
    }),
  );

  const routeTree = rootRoute.addChildren([indexRoute, ...extraRoutes]);
  const router = createRouter({ routeTree, basepath: '/iframe.html' });
  return <RouterProvider router={router} />;
}

export const Complex: Story = {
  name: 'Complex menu',
  render: () => (
    <App
      sidebarHeaderIcon={Home}
      sidebarHeaderTitle={<span>Admin App</span>}
      headerAfterTrigger={
        <input
          className="h-8 w-64 rounded-md border px-3 text-sm"
          placeholder="Quick search…"
        />
      }
      headerAfterTheme={
        <button type="button" className="h-8 rounded-md border px-3 text-sm">
          Help
        </button>
      }
    />
  ),
};
