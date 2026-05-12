import { z } from 'zod';

// Validation helpers
export const validators = {
  // Create conditional validation
  when: (condition: (data: any) => boolean, schema: z.ZodType<any>) =>
    z.any().refine(condition, { message: 'Condition not met' }).pipe(schema),

  // Cross-field validation - returns a refinement function to be used on object schemas
  matchField:
    (fieldName: string, targetField: string) => (data: Record<string, any>) =>
      data[fieldName] === data[targetField],

  // Array validation
  minItems: (min: number, message?: string) =>
    z.array(z.any()).min(min, message || `Must have at least ${min} items`),

  maxItems: (max: number, message?: string) =>
    z.array(z.any()).max(max, message || `Must have at most ${max} items`),
};
