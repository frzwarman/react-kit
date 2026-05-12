// Dependency helpers
export const createDependency = {
  showWhen: (field: string, condition: (value: any) => boolean) => ({
    field,
    condition,
    action: 'show' as const,
  }),

  hideWhen: (field: string, condition: (value: any) => boolean) => ({
    field,
    condition,
    action: 'hide' as const,
  }),

  enableWhen: (field: string, condition: (value: any) => boolean) => ({
    field,
    condition,
    action: 'enable' as const,
  }),

  disableWhen: (field: string, condition: (value: any) => boolean) => ({
    field,
    condition,
    action: 'disable' as const,
  }),

  setValueWhen: (
    field: string,
    condition: (value: any) => boolean,
    value: any,
  ) => ({
    field,
    condition,
    action: 'setValue' as const,
    value,
  }),
};

// Common condition helpers
export const conditions = {
  equals: (value: any) => (fieldValue: any) => fieldValue === value,
  notEquals: (value: any) => (fieldValue: any) => fieldValue !== value,
  includes: (value: any) => (fieldValue: any) =>
    Array.isArray(fieldValue) && fieldValue.includes(value),
  notIncludes: (value: any) => (fieldValue: any) =>
    Array.isArray(fieldValue) && !fieldValue.includes(value),
  isEmpty: () => (fieldValue: any) =>
    !fieldValue || (Array.isArray(fieldValue) && fieldValue.length === 0),
  isNotEmpty: () => (fieldValue: any) =>
    fieldValue && (!Array.isArray(fieldValue) || fieldValue.length > 0),
  greaterThan: (value: number) => (fieldValue: any) =>
    Number(fieldValue) > value,
  lessThan: (value: number) => (fieldValue: any) => Number(fieldValue) < value,
  isTrue: () => (fieldValue: any) => fieldValue === true,
  isFalse: () => (fieldValue: any) => fieldValue === false,
};
