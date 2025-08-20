// Form data transformation helpers
export const transformers = {
  // Transform form data before submission
  cleanEmptyStrings: (data: Record<string, any>): Record<string, any> => {
    const clean = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj
          .map(clean)
          .filter(item => item !== null && item !== undefined);
      }

      if (obj && typeof obj === 'object') {
        const cleaned: Record<string, any> = {};
        Object.keys(obj).forEach((key) => {
          const value = clean(obj[key]);
          if (value !== '' && value !== null && value !== undefined) {
            cleaned[key] = value;
          }
        });
        return cleaned;
      }

      return obj === '' ? undefined : obj;
    };

    return clean(data);
  },

  // Convert string numbers to actual numbers
  parseNumbers: (
    data: Record<string, any>,
    numberFields: string[],
  ): Record<string, any> => {
    const parsed = { ...data };

    const parseValue = (obj: any, path: string[] = []): any => {
      if (Array.isArray(obj)) {
        return obj.map((item, index) =>
          parseValue(item, [...path, String(index)]),
        );
      }

      if (obj && typeof obj === 'object') {
        const result: Record<string, any> = {};
        Object.keys(obj).forEach((key) => {
          const currentPath = [...path, key].join('.');
          result[key] = parseValue(obj[key], [...path, key]);

          if (
            numberFields.includes(currentPath)
            && typeof result[key] === 'string'
          ) {
            const num = Number(result[key]);
            if (!isNaN(num)) {
              result[key] = num;
            }
          }
        });
        return result;
      }

      return obj;
    };

    return parseValue(parsed);
  },

  // Convert dates to ISO strings
  formatDates: (
    data: Record<string, any>,
    dateFields: string[],
  ): Record<string, any> => {
    const formatted = { ...data };

    const formatValue = (obj: any, path: string[] = []): any => {
      if (Array.isArray(obj)) {
        return obj.map((item, index) =>
          formatValue(item, [...path, String(index)]),
        );
      }

      if (obj && typeof obj === 'object') {
        const result: Record<string, any> = {};
        Object.keys(obj).forEach((key) => {
          const currentPath = [...path, key].join('.');
          result[key] = formatValue(obj[key], [...path, key]);

          if (dateFields.includes(currentPath) && result[key] instanceof Date) {
            result[key] = result[key].toISOString();
          }
        });
        return result;
      }

      return obj;
    };

    return formatValue(formatted);
  },
};
