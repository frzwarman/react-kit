// -----------------------------
// KIT: builders
// -----------------------------
export * from './kit/builder/data-table';
export * from './kit/builder/dialog';
export * from './kit/builder/form';
export * from './kit/builder/section';
export * from './kit/builder/page';
export * from './kit/builder/stack-dialog';
// Ensure default export for Page at root
export { default as Page } from './kit/builder/page/Page';

// -----------------------------
// KIT: components
// -----------------------------
export * from './kit/components/autocomplete';
export * from './kit/components/login';
// Ensure default export for Login at root
export { default as Login } from './kit/components/login/Login';

// -----------------------------
// KIT: layouts (admin)
// -----------------------------
export { default as AdminLayout } from './kit/layouts/admin/components/AdminLayout';
export { default as ThemeToggle } from './kit/layouts/admin/components/ThemeToggle';
export * from './kit/layouts/admin/hooks/menu';
export * from './kit/layouts/admin/providers/AdminMenuProvider';
export * from './kit/layouts/admin/types';

// -----------------------------
// KIT: providers
// -----------------------------
export * from './kit/providers/ThemeProvider';

// -----------------------------
// SHADCN: hooks and utils
// -----------------------------
export * from './shadcn/hooks/use-mobile';
export * from './shadcn/lib/utils';

// -----------------------------
// SHADCN: UI components
// -----------------------------
export * from './shadcn/ui/accordion';
export * from './shadcn/ui/alert-dialog';
export * from './shadcn/ui/alert';
export * from './shadcn/ui/aspect-ratio';
export * from './shadcn/ui/avatar';
export * from './shadcn/ui/badge';
export * from './shadcn/ui/breadcrumb';
export * from './shadcn/ui/button';
export * from './shadcn/ui/calendar';
export * from './shadcn/ui/card';
export * from './shadcn/ui/carousel';
export * from './shadcn/ui/chart';
export * from './shadcn/ui/checkbox';
export * from './shadcn/ui/collapsible';
export * from './shadcn/ui/command';
export * from './shadcn/ui/context-menu';
export * from './shadcn/ui/dialog';
export * from './shadcn/ui/drawer';
export * from './shadcn/ui/dropdown-menu';
export * from './shadcn/ui/form';
export * from './shadcn/ui/hover-card';
export * from './shadcn/ui/input-otp';
export * from './shadcn/ui/input';
export * from './shadcn/ui/label';
export * from './shadcn/ui/menubar';
export * from './shadcn/ui/navigation-menu';
export * from './shadcn/ui/pagination';
export * from './shadcn/ui/popover';
export * from './shadcn/ui/progress';
export * from './shadcn/ui/radio-group';
export * from './shadcn/ui/resizable';
export * from './shadcn/ui/scroll-area';
export * from './shadcn/ui/select';
export * from './shadcn/ui/separator';
export * from './shadcn/ui/sheet';
export * from './shadcn/ui/sidebar';
export * from './shadcn/ui/skeleton';
export * from './shadcn/ui/slider';
export * from './shadcn/ui/sonner';
export * from './shadcn/ui/switch';
export * from './shadcn/ui/table';
export * from './shadcn/ui/tabs';
export * from './shadcn/ui/textarea';
export * from './shadcn/ui/toggle-group';
export * from './shadcn/ui/toggle';
export * from './shadcn/ui/tooltip';