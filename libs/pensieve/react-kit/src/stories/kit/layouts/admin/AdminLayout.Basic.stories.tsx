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
import { Home, ShoppingCart, Settings } from 'lucide-react';

const meta: Meta<typeof AdminLayout> = {
  title: 'Kit/Layouts/Admin',
  component: AdminLayout,
};
export default meta;

type Story = StoryObj<typeof AdminLayout>;

function RegisterMenus() {
  const { registerGroup, registerItem, clear } =
    useAdminSidebarMenuRegistration();
  useEffect(() => {
    clear();
    registerGroup({ id: 'main', label: 'Main' });
    registerItem('main', {
      id: 'dashboard',
      title: 'Dashboard',
      url: '/',
      icon: Home,
    });

    registerGroup({ id: 'commerce', label: 'Commerce' });
    registerItem('commerce', {
      id: 'orders',
      title: 'Orders',
      url: '/orders',
      icon: ShoppingCart,
      badge: 12,
    });

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

type AdminLayoutStoryProps = React.ComponentProps<typeof AdminLayout>;

function App(props: AdminLayoutStoryProps) {
  const rootRoute = createRootRoute({
    component: () => (
      <ThemeProvider>
        <AdminLayout {...props}>
          <RegisterMenus />
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
        <h2 className="text-xl font-semibold mb-2">Dashboard</h2>
        <p className="text-muted-foreground">Welcome to the admin dashboard.</p>
      </div>
    ),
  });

  const ordersRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/orders',
    component: () => (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">Orders</h2>
        <p className="text-muted-foreground">Manage your store orders here.</p>
      </div>
    ),
  });

  const settingsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/settings',
    component: () => (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">Settings</h2>
        <p className="text-muted-foreground">
          Update your application settings.
        </p>
      </div>
    ),
  });

  const routeTree = rootRoute.addChildren([
    indexRoute,
    ordersRoute,
    settingsRoute,
  ]);
  const router = createRouter({ routeTree, basepath: '/iframe.html' });

  return <RouterProvider router={router} />;
}

export const Basic: Story = {
  name: 'Basic (non-collapsible by default)',
  render: () => <App />,
};
