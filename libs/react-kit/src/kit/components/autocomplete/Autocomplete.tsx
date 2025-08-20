import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '../../../shadcn/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '../../../shadcn/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '../../../shadcn/ui/command';
import { ChevronsUpDown, Check, Loader2 } from 'lucide-react';
import { Button } from '../../../shadcn/ui/button';
import type {
  AutocompleteFetcher,
  AutocompleteMode,
  AutocompleteOption,
  AutocompleteFetchResult,
} from './types';
import { useDebounce } from 'use-debounce';

export type AutocompleteProps = {
  mode: AutocompleteMode
  options?: AutocompleteOption[]
  fetcher?: AutocompleteFetcher
  pageSize?: number
  value?: string | number | null
  onChange?: (value: string | number | null, option: AutocompleteOption | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  emptyText?: string
  renderOption?: (option: AutocompleteOption, selected: boolean) => React.ReactNode
  searchPlaceholder?: string
  /** Controls initial open state; component is uncontrolled otherwise */
  defaultOpen?: boolean
}

const DEFAULT_PAGE_SIZE = 20;

const EMPTY_OPTIONS: AutocompleteOption[] = [];

export function Autocomplete({
  mode,
  options = EMPTY_OPTIONS,
  fetcher,
  pageSize = DEFAULT_PAGE_SIZE,
  value: controlledValue,
  onChange,
  placeholder = 'Select...',
  disabled,
  className,
  emptyText = 'No results found',
  renderOption,
  searchPlaceholder = 'Search...',
  defaultOpen,
}: AutocompleteProps) {
  const [open, setOpen] = useState<boolean>(!!defaultOpen);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 250);

  // Selection
  const [value, setValue] = useState<string | number | null>(controlledValue ?? null);
  useEffect(() => {
    if (controlledValue !== undefined) setValue(controlledValue);
  }, [controlledValue]);

  const handleSelect = useCallback(
    (next: AutocompleteOption) => {
      const newValue = next.value;
      if (controlledValue === undefined) setValue(newValue);
      onChange?.(newValue, next);
      setOpen(false);
    },
    [controlledValue, onChange],
  );

  // Data state (shared for both modes)
  const [items, setItems] = useState<AutocompleteOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | number | null | undefined>(undefined);
  const [page, setPage] = useState(1);

  const resetData = useCallback(() => {
    setItems([]);
    setHasMore(false);
    setNextCursor(undefined);
    setPage(1);
  }, []);

  // Load data
  const load = useCallback(async () => {
    if (mode === 'server') {
      if (!fetcher) return;
      setLoading(true);
      try {
        const res: AutocompleteFetchResult = await fetcher({
          search: debouncedSearch,
          cursor: nextCursor ?? null,
          page,
          pageSize,
        });
        setItems(prev => (page === 1 ? res.items : [...prev, ...res.items]));
        setHasMore(!!res.hasMore);
        setNextCursor(res.nextCursor);
      } finally {
        setLoading(false);
      }
    } else {
      // client mode: filter and paginate locally
      setLoading(true);
      try {
        const filtered = debouncedSearch
          ? options.filter(o =>
            o.label.toLowerCase().includes(debouncedSearch.toLowerCase()),
          )
          : options;
        const start = (page - 1) * pageSize;
        const slice = filtered.slice(start, start + pageSize);
        setItems(prev => (page === 1 ? slice : [...prev, ...slice]));
        setHasMore(start + pageSize < filtered.length);
        setNextCursor(undefined);
      } finally {
        setLoading(false);
      }
    }
  }, [mode, fetcher, debouncedSearch, nextCursor, page, pageSize, options]);

  // Reset and load on open/search change
  useEffect(() => {
    if (!open) return;
    resetData();
    // Load first page
    const t = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(t);
  }, [open, debouncedSearch, mode]);

  // Infinite scroll
  const listRef = useRef<HTMLDivElement | null>(null);
  const onListScroll = useCallback(() => {
    const el = listRef.current;
    if (!el || loading) return;
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 24;
    if (nearBottom && hasMore) {
      setPage(p => p + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    if (!open) return;

    load();
  }, [page]);

  // Selected label
  const selectedOption = useMemo(() => items.find(i => i.value === value), [items, value]);

  // Ensure selected label when item not in current page (server mode)
  const displayedLabel = useMemo(() => {
    if (selectedOption) return selectedOption.label;
    if (mode === 'client') {
      const found = options.find(i => i.value === value);
      return found?.label ?? placeholder;
    }
    return placeholder;
  }, [mode, options, selectedOption, value, placeholder]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
          disabled={disabled}
        >
          <span className={cn('truncate', !value && 'text-muted-foreground')}>{displayedLabel}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command shouldFilter={false} className="w-full">
          <div className="p-2">
            <CommandInput
              value={search}
              onValueChange={setSearch}
              placeholder={searchPlaceholder}
              autoFocus
            />
          </div>
          <CommandList className="max-h-56 overflow-auto" ref={listRef} onScroll={onListScroll}>
            {loading && items.length === 0 ? (
              <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading
              </div>
            ) : null}
            <CommandEmpty>{emptyText}</CommandEmpty>
            {items.length > 0 ? (
              <CommandGroup>
                {items.map((item) => {
                  const selected = item.value === value;
                  return (
                    <CommandItem
                      key={`${item.value}`}
                      value={`${item.label}`}
                      onSelect={() => handleSelect(item)}
                      className="flex items-center justify-between"
                    >
                      <div className="min-w-0 truncate">
                        {renderOption ? renderOption(item, selected) : item.label}
                      </div>
                      {selected ? (
                        <Check className="h-4 w-4" />
                      ) : null}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ) : null}
            {hasMore ? (
              <>
                <CommandSeparator />
                <div className="flex items-center justify-center py-2 text-xs text-muted-foreground">
                  {loading ? (
                    <>
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" /> Loading more
                    </>
                  ) : (
                    'Scroll to load more'
                  )}
                </div>
              </>
            ) : null}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default Autocomplete;
