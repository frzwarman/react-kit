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
import { BarChart3, Home } from 'lucide-react';

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

export const CustomSidebarTitleAndIcon: Story = {
  name: 'Custom sidebar title and icon',
  render: () => (
    <App sidebarHeaderIcon={BarChart3} sidebarHeaderTitle={<span>Custom Title</span>} />
  ),
};
