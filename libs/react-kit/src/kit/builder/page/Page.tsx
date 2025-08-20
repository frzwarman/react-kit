import React from 'react';
import { Button, buttonVariants } from '../../../shadcn/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../../../shadcn/ui/dropdown-menu';
import { cn } from '../../../shadcn/lib/utils';

export type PageContainerWidth = 'full' | 'sm' | 'md' | 'lg' | 'xl';

export type PageButtonAction = {
  type: 'button';
  key?: string;
  label: React.ReactNode;
  onClick?: () => void;
  variant?: React.ComponentProps<typeof Button>['variant'];
  size?: React.ComponentProps<typeof Button>['size'];
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
};

export type PageDropdownActionItem = {
  key?: string;
  label: React.ReactNode;
  onSelect?: () => void;
  destructive?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export type PageDropdownAction = {
  type: 'dropdown';
  key?: string;
  trigger: Omit<PageButtonAction, 'type'>;
  items: (PageDropdownActionItem | { type: 'separator'; key?: string; })[];
};

export type PageAction = PageButtonAction | PageDropdownAction;

export type PageProps = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: PageAction[];
  containerWidth?: PageContainerWidth;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerLeft?: React.ReactNode;
  footerRight?: React.ReactNode;
  children?: React.ReactNode;
};

const widthToClass: Record<PageContainerWidth, string> = {
  full: 'max-w-none',
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
};

function renderAction(action: PageAction) {
  if (action.type === 'button') {
    const { label, onClick, variant, size, leftIcon, rightIcon, disabled, className } = action;
    return (
      <Button
        key={action.key ?? String(label)}
        onClick={onClick}
        variant={variant}
        size={size}
        disabled={disabled}
        className={className}
      >
        {leftIcon}
        <span>{label}</span>
        {rightIcon}
      </Button>
    );
  }

  const { trigger, items } = action;
  return (
    <DropdownMenu key={action.key ?? String(trigger.label)}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            buttonVariants({ variant: trigger.variant, size: trigger.size }),
            trigger.className
          )}
          onClick={trigger.onClick}
          disabled={trigger.disabled}
        >
          {trigger.leftIcon}
          <span>{trigger.label}</span>
          {trigger.rightIcon}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {items.map((item, idx) => {
          // Narrow the union: if the object has a `type` key, it's a separator variant
          if ('type' in item) {
            return <DropdownMenuSeparator key={item.key ?? `sep-${idx}`} />;
          }
          // Otherwise it's a normal dropdown action item
          return (
            <DropdownMenuItem
              key={item.key ?? String(item.label)}
              onSelect={(e) => {
                e.preventDefault();
                item.onSelect?.();
              }}
              variant={item.destructive ? 'destructive' : 'default'}
            >
              <div className="flex items-center gap-2">
                {item.leftIcon}
                <span>{item.label}</span>
                {item.rightIcon}
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Page({
  title,
  subtitle,
  actions,
  containerWidth = 'lg',
  className,
  headerClassName,
  contentClassName,
  footerLeft,
  footerRight,
  children,
}: PageProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className={cn('px-4 sm:px-6 lg:px-8', widthToClass[containerWidth], 'mx-auto')}>
        <header className={cn('flex items-start justify-between gap-3 py-6', headerClassName)}>
          <div className="flex min-w-0 flex-col gap-1">
            <h1 className="text-2xl font-semibold leading-none tracking-tight text-foreground">
              {title}
            </h1>
            {subtitle ? (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
          {actions && actions.length > 0 ? (
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
              {actions.map(renderAction)}
            </div>
          ) : null}
        </header>

        <main className={cn('pb-8', contentClassName)}>{children}</main>

        {(footerLeft || footerRight) && (
          <footer className="border-t pt-4 pb-8">
            <div className={cn('px-0', widthToClass[containerWidth])}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {footerLeft}
                </div>
                <div className="flex items-center gap-2">{footerRight}</div>
              </div>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}

export default Page;
