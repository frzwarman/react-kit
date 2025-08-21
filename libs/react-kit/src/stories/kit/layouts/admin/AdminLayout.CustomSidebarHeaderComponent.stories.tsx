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
import { Home } from 'lucide-react';

const meta: Meta<typeof AdminLayout> = {
  title: 'Kit/Layouts/Admin',
  component: AdminLayout,
};
export default meta;

type Story = StoryObj<typeof AdminLayout>;

type AdminLayoutStoryProps = React.ComponentProps<typeof AdminLayout>;

function RegisterMenus() {
  const { registerGroup, registerItem, clear } = useAdminSidebarMenuRegistration();
  useEffect(() => {
    clear();
    registerGroup({ id: 'overview', label: 'Overview' });
    registerItem('overview', { id: 'home', title: 'Home', url: '/', icon: Home });
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
  const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: () => <div className="p-6">Home</div> });
  const routeTree = rootRoute.addChildren([indexRoute]);
  const router = createRouter({ routeTree, basepath: '/iframe.html' });
  return <RouterProvider router={router} />;
}

export const CustomSidebarHeaderComponent: Story = {
  name: 'Custom sidebar header component',
  render: () => (
    <App
      sidebarHeader={
        <div className="px-4 py-3">
          <div className="flex items-center gap-2">
            <img src="https://dummyimage.com/32x32/000/fff.png&text=A" alt="Logo" className="h-8 w-8 rounded" />
            <span className="font-semibold">My Admin</span>
          </div>
        </div>
      }
    />
  ),
};
