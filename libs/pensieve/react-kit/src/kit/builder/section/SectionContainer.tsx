import { Fragment, type ReactNode } from 'react';

import { cn } from '../../../shadcn/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../shadcn/ui/card';
import { Separator } from '../../../shadcn/ui/separator';
import type { SectionNode } from './types';

export type SectionContainerProps = {
  title?: ReactNode;
  description?: ReactNode;
  variant?: SectionNode['variant'];
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  children: ReactNode;
};

const SectionContainer = ({
  title,
  description,
  variant = 'card',
  className,
  headerClassName,
  contentClassName,
  children,
}: SectionContainerProps) => {
  const renderHeader = () => {
    if (!title && !description) return null;

    return (
      <div className={cn('space-y-1', headerClassName)}>
        {title && <h3 className="text-lg font-medium leading-none">{title}</h3>}
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    );
  };

  const renderContent = () => (
    <div className={cn('space-y-4', contentClassName)}>{children}</div>
  );

  switch (variant) {
    case 'card':
      return (
        <Card className={className}>
          {(title || description) && (
            <CardHeader>
              {title && <CardTitle>{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
          )}
          <CardContent>{renderContent()}</CardContent>
        </Card>
      );
    case 'separator':
      return (
        <div className={cn('space-y-6', className)}>
          {(title || description) && (
            <Fragment>
              {renderHeader()}
              <Separator />
            </Fragment>
          )}
          {renderContent()}
        </div>
      );
    default:
      return (
        <div className={cn('space-y-6', className)}>
          {renderHeader()}
          {renderContent()}
        </div>
      );
  }
};

export default SectionContainer;
