import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../../../shadcn/ui/card';
import { cn } from '../../../../../shadcn/lib/utils';
import type { FieldRenderProps } from './types';
import { FormBuilderField } from '../FormBuilderField';

export function ObjectField({ field, control, fieldPath }: FieldRenderProps) {
  if (!field.fields) return null;
  return (
    <Card className={cn(field.className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{field.label}</CardTitle>
        {field.description && (
          <p className="text-sm text-muted-foreground">{field.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          {field.fields.map((subField) => (
            <FormBuilderField
              key={subField.name}
              field={subField}
              control={control}
              parentPath={fieldPath}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
