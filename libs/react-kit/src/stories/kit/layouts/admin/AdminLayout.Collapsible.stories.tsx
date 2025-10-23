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

type AdminLayoutStoryProps = React.ComponentProps<typeof AdminLayout>;

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
    component: () => <div className="p-6">Home</div>,
  });
  const routeTree = rootRoute.addChildren([indexRoute]);
  const router = createRouter({ routeTree, basepath: '/iframe.html' });
  return <RouterProvider router={router} />;
}

export const Collapsible: Story = {
  name: 'Collapsible sidebar',
  render: () => <App sidebarCollapsible />,
};
