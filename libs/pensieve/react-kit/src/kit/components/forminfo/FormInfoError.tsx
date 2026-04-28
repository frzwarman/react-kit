import { AlertCircle } from 'lucide-react';
import type { FieldErrors, FieldValues } from 'react-hook-form';
import type { ReactNode } from 'react';

import { cn } from '../../../shadcn/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '../../../shadcn/ui/alert';

type ErrorMessage = {
  path: string;
  message: string;
};

type FormInfoErrorProps<TFieldValues extends FieldValues = FieldValues> = {
  errors: FieldErrors<TFieldValues> | undefined;
  title?: ReactNode;
  description?: ReactNode;
  className?: string;
  showFieldPath?: boolean;
};

const ignoredKeys = new Set(['message', 'type', 'types', 'ref']);

function collectMessages(
  errors: FieldErrors<FieldValues> | undefined,
  parentPath: string[] = [],
): ErrorMessage[] {
  if (!errors) return [];

  const entries = Array.isArray(errors)
    ? errors.map((value, index) => [String(index), value])
    : Object.entries(errors as Record<string, unknown>);

  const messages: ErrorMessage[] = [];

  for (const [key, value] of entries) {
    if (!value) continue;

    const currentPath =
      typeof key === 'string' && key === 'root'
        ? parentPath
        : [...parentPath, String(key)];

    if (typeof value === 'object') {
      if ('message' in value && value.message) {
        messages.push({
          path: currentPath.filter(Boolean).join('.'),
          message: String(value.message),
        });
      }

      if ('types' in value && value.types) {
        for (const msg of Object.values(value.types)) {
          if (!msg) continue;
          messages.push({
            path: currentPath.filter(Boolean).join('.'),
            message: String(msg),
          });
        }
      }

      if (value && typeof value === 'object') {
        const source = Array.isArray(value)
          ? value.map((nestedValue, index) => [String(index), nestedValue])
          : Object.entries(value);

        const nestedEntries = source.filter(
          ([nestedKey]) => !ignoredKeys.has(nestedKey),
        );

        if (nestedEntries.length > 0) {
          const nested: Record<string, unknown> =
            Object.fromEntries(nestedEntries);
          messages.push(
            ...collectMessages(nested as FieldErrors<FieldValues>, currentPath),
          );
        }
      }
    }
  }

  return messages;
}

export function FormInfoError<TFieldValues extends FieldValues = FieldValues>({
  errors,
  title,
  description,
  className,
  showFieldPath = true,
}: FormInfoErrorProps<TFieldValues>) {
  const messages = collectMessages(
    errors as FieldErrors<FieldValues> | undefined,
  );

  if (messages.length === 0) {
    return null;
  }

  const keyOccurrences = new Map<string, number>();
  const getMessageKey = (path: string, message: string) => {
    const baseKey = [path, message].filter(Boolean).join(':') || message;
    const occurrence = keyOccurrences.get(baseKey) ?? 0;
    keyOccurrences.set(baseKey, occurrence + 1);
    return occurrence === 0 ? baseKey : `${baseKey}:${occurrence}`;
  };

  return (
    <Alert variant="destructive" className={cn('gap-2', className)}>
      <AlertCircle className="mt-1" />
      <div className="flex flex-col gap-2">
        <div>
          <AlertTitle>
            {title ?? 'Please review the following issues'}
          </AlertTitle>
          <AlertDescription>
            {description ??
              'Some fields need your attention before continuing.'}
          </AlertDescription>
        </div>
        <ul className="grid gap-1 text-sm text-destructive">
          {messages.map(({ path, message }) => (
            <li key={getMessageKey(path, message)} className="leading-snug">
              {showFieldPath && path ? (
                <span className="font-medium">{path}: </span>
              ) : null}
              <span>{message}</span>
            </li>
          ))}
        </ul>
      </div>
    </Alert>
  );
}

export default FormInfoError;
