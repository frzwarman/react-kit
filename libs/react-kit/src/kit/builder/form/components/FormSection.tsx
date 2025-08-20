import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../shadcn/ui/card';
import { Separator } from '../../../../shadcn/ui/separator';
import { cn } from '../../../../shadcn/lib/utils';

export interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  variant?: 'card' | 'separator' | 'plain';
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export interface FormSectionConfig extends FormSectionProps {
  id: string;
}

export function FormSection({
  title,
  description,
  children,
  variant = 'card',
  className,
  headerClassName,
  contentClassName,
}: FormSectionProps) {
  const renderHeader = () => {
    if (!title && !description) return null;

    return (
      <div className={cn('space-y-1', headerClassName)}>
        {title && (
          <h3 className="text-lg font-medium leading-none">{title}</h3>
        )}
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    );
  };

  const renderContent = () => (
    <div className={cn('space-y-4', contentClassName)}>
      {children}
    </div>
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
          <CardContent className={cn(!title && !description && 'pt-6')}>
            {renderContent()}
          </CardContent>
        </Card>
      );

    case 'separator':
      return (
        <div className={cn('space-y-6', className)}>
          {(title || description) && (
            <>
              {renderHeader()}
              <Separator />
            </>
          )}
          {renderContent()}
        </div>
      );

    case 'plain':
    default:
      return (
        <div className={cn('space-y-6', className)}>
          {renderHeader()}
          {renderContent()}
        </div>
      );
  }
}
