import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCombobox } from 'downshift';
import { useDebounce } from 'use-debounce';
import { cn } from '../../../shadcn/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../shadcn/ui/popover';
import { Badge } from '../../../shadcn/ui/badge';
import { ChevronsUpDown, X, Check, Loader2 } from 'lucide-react';
import type {
  AutocompleteFetcher,
  AutocompleteMode,
  AutocompleteOption,
  AutocompleteFetchResult,
} from './types';

export type AutocompleteProps<T = unknown> = {
  mode: AutocompleteMode;
  options?: AutocompleteOption<T>[];
  fetcher?: AutocompleteFetcher<T>;
  fetcherFilter?: () => Record<string, string | number | boolean | null>;
  pageSize?: number;
  value?: string | number | null | Array<string | number>;
  onChange?: (
    value: string | number | null | Array<string | number>,
    selected: AutocompleteOption<T> | AutocompleteOption<T>[] | null,
    raw?: T | T[] | null,
  ) => void;
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
  className?: string;
  chipVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  chipClassName?: string;
  emptyText?: string;
  renderOption?: (
    option: AutocompleteOption<T>,
    selected: boolean,
  ) => React.ReactNode;
  defaultOpen?: boolean;
  defaultValue?: string | number | null | Array<string | number>;
  allowCustomValue?: boolean;
  clearable?: boolean;
  initialSelectedOptions?: AutocompleteOption<T> | AutocompleteOption<T>[];
  loadSelected?: (
    values: Array<string | number>,
  ) => Promise<AutocompleteOption<T>[]>;
};

const DEFAULT_PAGE_SIZE = 50;

export function Autocomplete<T = unknown>({
  mode = 'client',
  options = [],
  fetcher,
  fetcherFilter,
  pageSize = DEFAULT_PAGE_SIZE,
  value: controlledValue,
  onChange,
  placeholder = 'Search or select...',
  disabled = false,
  multiple = false,
  className,
  chipVariant = 'secondary',
  chipClassName,
  emptyText = 'No results found',
  renderOption,
  defaultOpen,
  defaultValue,
  allowCustomValue = false,
  clearable = true,
  initialSelectedOptions,
  loadSelected,
}: AutocompleteProps<T>) {
  const isMultiple = !!multiple;
  const isControlled = controlledValue !== undefined;

  // Internal value state
  const [internalValue, setInternalValue] = useState<
    string | number | null | Array<string | number>
  >(() => {
    if (defaultValue !== undefined) return defaultValue;
    return isMultiple ? [] : null;
  });

  const currentValue = isControlled ? controlledValue : internalValue;

  // Label and raw data maps
  const labelMapRef = useRef<Map<string | number, string>>(new Map());
  const rawMapRef = useRef<Map<string | number, T>>(new Map());

  const storeOption = useCallback((opt: AutocompleteOption<T>) => {
    labelMapRef.current.set(opt.value, opt.label);
    if (opt.raw !== undefined) {
      rawMapRef.current.set(opt.value, opt.raw);
    }
  }, []);

  // Immediately populate labels for initial values (runs once on mount)
  if (labelMapRef.current.size === 0 && currentValue) {
    const values = Array.isArray(currentValue) ? currentValue : [currentValue];
    // First, store initialSelectedOptions if provided
    if (initialSelectedOptions) {
      const arr = Array.isArray(initialSelectedOptions)
        ? initialSelectedOptions
        : [initialSelectedOptions];
      arr.forEach((opt) => {
        labelMapRef.current.set(opt.value, opt.label);
        if (opt.raw !== undefined) {
          rawMapRef.current.set(opt.value, opt.raw);
        }
      });
    }
    // Then look up missing values in options array
    values.forEach((val) => {
      if (!labelMapRef.current.has(val)) {
        const option = options.find((opt) => opt.value === val);
        if (option) {
          labelMapRef.current.set(option.value, option.label);
          if (option.raw !== undefined) {
            rawMapRef.current.set(option.value, option.raw);
          }
        }
      }
    });
  }

  // Data state
  const [items, setItems] = useState<AutocompleteOption<T>[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch] = useDebounce(searchInput, 300);
  const [clearCounter, setClearCounter] = useState(0);

  // Popover state
  const [isOpen, setIsOpen] = useState(!!defaultOpen);

  // Clear input in multiple mode after selection
  useEffect(() => {
    if (clearCounter > 0) {
      setSearchInput('');
    }
  }, [clearCounter]);

  // Load data
  const loadData = useCallback(
    async (pageNum: number, search: string) => {
      if (mode === 'server') {
        if (!fetcher) return;
        setLoading(true);
        try {
          const res: AutocompleteFetchResult<T> = await fetcher({
            search,
            moreFilter: fetcherFilter,
            cursor: null,
            page: pageNum,
            pageSize,
          });
          res.items.forEach(storeOption);
          setItems((prev) =>
            pageNum === 1 ? res.items : [...prev, ...res.items],
          );
          setHasMore(!!res.hasMore);
        } catch (_error) {
          if (pageNum === 1) setItems([]);
          setHasMore(false);
        } finally {
          setLoading(false);
        }
      } else {
        // Client mode
        const filtered = search
          ? options.filter((o) =>
              o.label.toLowerCase().includes(search.toLowerCase()),
            )
          : options;
        options.forEach(storeOption);
        const start = (pageNum - 1) * pageSize;
        const slice = filtered.slice(start, start + pageSize);
        setItems((prev) => (pageNum === 1 ? slice : [...prev, ...slice]));
        setHasMore(start + pageSize < filtered.length);
      }
    },
    [mode, fetcher, fetcherFilter, options, pageSize, storeOption],
  );

  // Reset and load on search change
  useEffect(() => {
    if (!isOpen) return;
    setPage(1);
    loadData(1, debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, debouncedSearch, loadData]);

  // Load more pages
  useEffect(() => {
    if (!isOpen || page <= 1) return;
    loadData(page, debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, page, loadData, debouncedSearch]);

  // Store initial/selected options (takes precedence)
  useEffect(() => {
    if (initialSelectedOptions) {
      const arr = Array.isArray(initialSelectedOptions)
        ? initialSelectedOptions
        : [initialSelectedOptions];
      arr.forEach(storeOption);
    }
  }, [initialSelectedOptions, storeOption]);

  // Auto-populate missing initial options from provided options array
  useEffect(() => {
    if (
      !currentValue ||
      (Array.isArray(currentValue) && currentValue.length === 0)
    )
      return;

    const values = Array.isArray(currentValue) ? currentValue : [currentValue];

    // Only look up values that are missing (not in label map)
    const missingValues = values.filter((v) => !labelMapRef.current.has(v));

    if (missingValues.length === 0) return;

    // Look up missing values in the options array
    missingValues.forEach((val) => {
      const option = options.find((opt) => opt.value === val);
      if (option) {
        storeOption(option);
      }
    });
  }, [currentValue, options, storeOption]);

  // Load selected labels on mount for initial values
  const hasLoadedInitial = useRef(false);
  const [, setLabelsLoadedCounter] = useState(0);

  useEffect(() => {
    // Only run once on mount
    if (!loadSelected || hasLoadedInitial.current) return;
    if (!currentValue) return;

    const values = Array.isArray(currentValue) ? currentValue : [currentValue];
    if (values.length === 0) return;

    // Check if any values are missing labels
    const missing = values.filter((v) => !labelMapRef.current.has(v));
    if (missing.length === 0) {
      hasLoadedInitial.current = true;
      return;
    }

    hasLoadedInitial.current = true;
    let cancelled = false;
    loadSelected(missing)
      .then((opts) => {
        if (!cancelled && opts.length > 0) {
          opts.forEach(storeOption);
          // Only trigger re-render if we actually stored something
          setLabelsLoadedCounter((c) => c + 1);
        }
        // eslint-disable-next-line @typescript-eslint/no-empty-function
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadSelected, storeOption, currentValue]); // Only run once on mount - uses closure values

  // Load selected labels if missing when dropdown opens
  useEffect(() => {
    if (!loadSelected || !isOpen) return;
    const values = Array.isArray(currentValue)
      ? currentValue
      : currentValue
        ? [currentValue]
        : [];
    const missing = values.filter((v) => !labelMapRef.current.has(v));
    if (missing.length === 0) return;

    let cancelled = false;
    loadSelected(missing)
      .then((opts) => {
        if (!cancelled) opts.forEach(storeOption);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [currentValue, loadSelected, isOpen, storeOption]);

  // Get label helper
  const getLabel = useCallback((v: string | number) => {
    return labelMapRef.current.get(v) ?? String(v);
  }, []);

  // Selected items for display
  const selectedItems = useMemo(() => {
    if (!isMultiple) {
      if (
        currentValue === null ||
        currentValue === undefined ||
        Array.isArray(currentValue)
      )
        return [];
      return [
        {
          value: currentValue,
          label: getLabel(currentValue),
          raw: rawMapRef.current.get(currentValue),
        },
      ];
    }
    const values = Array.isArray(currentValue) ? currentValue : [];
    return values.map((v) => ({
      value: v,
      label: getLabel(v),
      raw: rawMapRef.current.get(v),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentValue, isMultiple, getLabel]); // labelsLoadedCounter triggers re-compute when loadSelected completes

  // Handle selection
  const handleSelect = useCallback(
    (item: AutocompleteOption<T> | null) => {
      if (!item) return;
      storeOption(item);

      if (isMultiple) {
        const values = Array.isArray(currentValue) ? currentValue : [];
        const exists = values.includes(item.value);

        // Skip if already selected (don't toggle), but still clear the search
        if (exists) {
          setClearCounter((c) => c + 1);
          return;
        }

        const newValues = [...values, item.value];

        if (!isControlled) setInternalValue(newValues);
        const newOptions = newValues.map((v) => ({
          value: v,
          label: getLabel(v),
          raw: rawMapRef.current.get(v),
        }));
        const raws = newOptions
          .map((o) => o.raw)
          .filter((r): r is T => r !== undefined);
        onChange?.(newValues, newOptions, raws);

        // Trigger input clear
        setClearCounter((c) => c + 1);
      } else {
        if (!isControlled) setInternalValue(item.value);
        onChange?.(item.value, item, item.raw ?? null);
        setIsOpen(false);
      }
    },
    [isMultiple, currentValue, isControlled, onChange, getLabel, storeOption],
  );

  // Handle remove chip
  const handleRemove = useCallback(
    (valueToRemove: string | number) => {
      const values = Array.isArray(currentValue) ? currentValue : [];
      const newValues = values.filter((v) => v !== valueToRemove);
      if (!isControlled) setInternalValue(newValues);
      const newOptions = newValues.map((v) => ({
        value: v,
        label: getLabel(v),
        raw: rawMapRef.current.get(v),
      }));
      const raws = newOptions
        .map((o) => o.raw)
        .filter((r): r is T => r !== undefined);
      onChange?.(newValues, newOptions, raws);
    },
    [currentValue, isControlled, onChange, getLabel],
  );

  // Handle clear
  const handleClear = useCallback(() => {
    const newValue = isMultiple ? [] : null;
    if (!isControlled) setInternalValue(newValue);
    onChange?.(newValue, isMultiple ? [] : null, isMultiple ? [] : null);
  }, [isMultiple, isControlled, onChange]);

  // Handle custom value creation
  const handleCreateCustom = useCallback(() => {
    const trimmed = searchInput.trim();
    if (!trimmed || !allowCustomValue) return;

    const newOption: AutocompleteOption<T> = { value: trimmed, label: trimmed };
    storeOption(newOption);

    if (isMultiple) {
      const values = Array.isArray(currentValue) ? currentValue : [];
      if (values.includes(trimmed)) return;
      const newValues = [...values, trimmed];
      if (!isControlled) setInternalValue(newValues);
      const newOptions = newValues.map((v) => ({
        value: v,
        label: getLabel(v),
        raw: rawMapRef.current.get(v),
      }));
      onChange?.(newValues, newOptions, []);
      setSearchInput('');
    } else {
      if (!isControlled) setInternalValue(trimmed);
      onChange?.(trimmed, newOption, null);
      setSearchInput('');
      setIsOpen(false);
    }
  }, [
    searchInput,
    allowCustomValue,
    isMultiple,
    currentValue,
    isControlled,
    onChange,
    getLabel,
    storeOption,
  ]);

  // Compute input value based on mode and state
  const computedInputValue = useMemo(() => {
    // In multiple mode or when dropdown is open, show search input
    if (isMultiple || isOpen) {
      return searchInput;
    }
    // In single mode when closed, show selected item label
    if (selectedItems.length > 0) {
      return selectedItems[0].label;
    }
    return '';
  }, [isMultiple, isOpen, searchInput, selectedItems]);

  // Downshift
  const { getInputProps, getItemProps, getMenuProps, highlightedIndex } =
    useCombobox({
      items,
      itemToString: (item) => item?.label ?? '',
      selectedItem: isMultiple ? null : (selectedItems[0] ?? null),
      onSelectedItemChange: ({ selectedItem }) => handleSelect(selectedItem),
      isOpen,
      onIsOpenChange: ({ isOpen: newIsOpen }) => setIsOpen(newIsOpen ?? false),
      inputValue: computedInputValue,
      onInputValueChange: ({ inputValue }) => setSearchInput(inputValue ?? ''),
    });

  // Refs
  const parentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Stable ref callback for merging Downshift's ref with our parentRef
  const menuRefCallback = useCallback((node: HTMLDivElement | null) => {
    parentRef.current = node;
  }, []);

  const handleScroll = useCallback(() => {
    if (!parentRef.current || !hasMore || loading) return;

    const { scrollTop, scrollHeight, clientHeight } = parentRef.current;
    const scrolledToBottom = scrollHeight - scrollTop - clientHeight < 50;

    if (scrolledToBottom) {
      setPage((p) => p + 1);
    }
  }, [hasMore, loading]);

  useEffect(() => {
    const element = parentRef.current;
    if (!element) return;

    element.addEventListener('scroll', handleScroll);
    return () => element.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const showClearButton =
    clearable &&
    ((isMultiple && selectedItems.length > 0) ||
      (!isMultiple &&
        currentValue !== null &&
        currentValue !== undefined &&
        !Array.isArray(currentValue)));

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            'flex min-h-10 w-full items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm',
            'ring-offset-background',
            'focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
            disabled && 'cursor-not-allowed opacity-50',
            className,
          )}
        >
          {isMultiple && (
            <div className="flex flex-wrap gap-1">
              {selectedItems.map((item) => (
                <Badge
                  key={item.value}
                  variant={chipVariant}
                  className={cn('gap-1', chipClassName)}
                >
                  <span className="max-w-[150px] truncate">{item.label}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(item.value);
                    }}
                    className="rounded-sm opacity-70 hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          <input
            {...getInputProps({
              ref: inputRef,
              placeholder,
              disabled,
              onClick: () => {
                if (!isOpen) setIsOpen(true);
              },
              onKeyDown: (e) => {
                if (
                  e.key === 'Enter' &&
                  allowCustomValue &&
                  searchInput.trim() &&
                  items.length === 0
                ) {
                  e.preventDefault();
                  handleCreateCustom();
                }
              },
            })}
            className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-[120px]"
          />
          <div className="flex items-center gap-2 shrink-0">
            {showClearButton && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="rounded-sm opacity-70 hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        style={{ width: 'var(--radix-popover-trigger-width)' }}
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div
          {...getMenuProps({
            ref: menuRefCallback,
          })}
          className="max-h-[300px] overflow-auto"
        >
          {loading && items.length === 0 ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          ) : items.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              {allowCustomValue && searchInput.trim() ? (
                <>Press Enter to add &quot;{searchInput.trim()}&quot;</>
              ) : (
                emptyText
              )}
            </div>
          ) : (
            items.map((item, index) => {
              const isSelected = isMultiple
                ? Array.isArray(currentValue) &&
                  currentValue.includes(item.value)
                : currentValue === item.value;
              const isHighlighted = highlightedIndex === index;

              return (
                <div
                  key={item.value}
                  {...getItemProps({ item, index })}
                  className={cn(
                    'flex cursor-pointer items-center justify-between px-2 py-2 text-sm outline-none transition-colors',
                    isHighlighted && 'bg-accent text-accent-foreground',
                    isSelected && 'font-medium',
                  )}
                >
                  <div className="flex-1 truncate">
                    {renderOption ? renderOption(item, isSelected) : item.label}
                  </div>
                  {isSelected && <Check className="h-4 w-4 shrink-0" />}
                </div>
              );
            })
          )}
          {hasMore && items.length > 0 && (
            <div className="flex items-center justify-center border-t py-2">
              {loading ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  <span className="text-xs text-muted-foreground">
                    Loading more...
                  </span>
                </>
              ) : (
                <span className="text-xs text-muted-foreground">
                  Scroll for more
                </span>
              )}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default Autocomplete;
