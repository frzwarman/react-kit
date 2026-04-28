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
  const { registerGroup, registerItem, clear } =
    useAdminSidebarMenuRegistration();
  useEffect(() => {
    clear();
    registerGroup({ id: 'overview', label: 'Overview' });
    registerItem('overview', {
      id: 'home',
      title: 'Home',
      url: '/',
      icon: Home,
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

export const HeaderSlots: Story = {
  name: 'Header slots (after trigger/theme)',
  render: () => (
    <App
      headerAfterTrigger={
        <input
          className="h-8 w-64 rounded-md border px-3 text-sm"
          placeholder="Search…"
        />
      }
      headerAfterTheme={
        <div className="flex items-center gap-2">
          <button type="button" className="h-8 rounded-md border px-3 text-sm">
            Invite
          </button>
          <button
            type="button"
            className="h-8 rounded-md bg-primary px-3 text-sm text-primary-foreground"
          >
            New
          </button>
        </div>
      }
    />
  ),
};
