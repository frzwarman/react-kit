import { get } from 'lodash';

export function dotAccessor<TData, TValue = unknown>(path: string) {
  return (row: TData) =>
    get(row as unknown as Record<string, unknown>, path) as TValue;
}
