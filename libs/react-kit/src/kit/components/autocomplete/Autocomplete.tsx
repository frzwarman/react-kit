import type React from "react";
import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	useId,
} from "react";
import { cn } from "../../../shadcn/lib/utils";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "../../../shadcn/ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "../../../shadcn/ui/command";
import { ChevronsUpDown, Check, Loader2, X } from "lucide-react";
import { Badge } from "../../../shadcn/ui/badge";
import type {
	AutocompleteFetcher,
	AutocompleteMode,
	AutocompleteOption,
	AutocompleteFetchResult,
} from "./types";
import { useDebounce } from "use-debounce";

export type AutocompleteProps<T = unknown> = {
	mode: AutocompleteMode;
	options?: AutocompleteOption<T>[];
	fetcher?: AutocompleteFetcher<T>;
	fetcherFilter?: Record<string, string | number | boolean>,
	pageSize?: number;
	/**
	 * Value can be a single primitive or an array when `multiple` is true
	 */
	value?: string | number | null | Array<string | number>;
	/**
	 * onChange returns a single value + option in single mode, or an array of values + options in multiple mode
	 */
	onChange?: (
		value: string | number | null | Array<string | number>,
		option: AutocompleteOption<T> | AutocompleteOption<T>[] | null,
		raw?: T | T[] | null,
	) => void;
	/** Enable selecting multiple values (shows chips) */
	multiple?: boolean;
	/** Placeholder shown when nothing is selected */
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	emptyText?: string;
	renderOption?: (
		option: AutocompleteOption<T>,
		selected: boolean,
	) => React.ReactNode;
	searchPlaceholder?: string;
	/** Controls initial open state; component is uncontrolled otherwise */
	defaultOpen?: boolean;
	/** Initial value when component is uncontrolled */
	defaultValue?: string | number | null | Array<string | number>;
	/** Allow entering custom values not present in options (useful for tagging) */
	allowCustomValue?: boolean;
	/**
	 * Chip visual style for multiple selection. Uses shadcn Badge variants.
	 * default | secondary | destructive | outline
	 */
	chipVariant?: "default" | "secondary" | "destructive" | "outline";
	/** Additional className for each chip */
	chipClassName?: string;
	/** Show a clear button when a selection exists */
	clearable?: boolean;
	/**
	 * Optional: seed selected labels for edit pages. These options are only used to populate the
	 * internal label map so labels render correctly when values are prefilled.
	 */
	initialSelectedOptions?: AutocompleteOption<T> | AutocompleteOption<T>[] | null;
	/**
	 * Optional: load labels/options for a list of values whose labels are unknown.
	 * Useful for edit pages in server mode when only values are available.
	 */
	loadSelected?: (values: Array<string | number>) => Promise<AutocompleteOption<T>[]>;
};

const DEFAULT_PAGE_SIZE = 20;

const EMPTY_OPTIONS: AutocompleteOption[] = [];

export function Autocomplete<T = unknown>({
	mode,
	options = EMPTY_OPTIONS as AutocompleteOption<T>[],
	fetcher,
	fetcherFilter,
	pageSize = DEFAULT_PAGE_SIZE,
	value: controlledValue,
	onChange,
	multiple = false,
	placeholder = "Select...",
	disabled,
	className,
	emptyText = "No results found",
	renderOption,
	searchPlaceholder = "Search...",
	defaultOpen,
	defaultValue,
	allowCustomValue = false,
	chipVariant = "secondary",
	chipClassName,
	clearable = true,
	initialSelectedOptions,
	loadSelected,
}: AutocompleteProps<T>) {
	const [open, setOpen] = useState<boolean>(!!defaultOpen);
	const [search, setSearch] = useState("");
	const [debouncedSearch] = useDebounce(search, 250);
	const listId = useId();

	// Selection
	const isMultiple = !!multiple;
	const [value, setValue] = useState<
		string | number | null | Array<string | number>
	>(() => {
		if (controlledValue !== undefined) return controlledValue;
		if (defaultValue !== undefined) return defaultValue;
		return isMultiple ? [] : null;
	});
	useEffect(() => {
		if (controlledValue !== undefined) setValue(controlledValue);
	}, [controlledValue]);

	// Keep a map of value -> label to ensure we can render chips/labels even if the option
	// is not present in the current page (especially in server mode or for custom values)
	const labelMapRef = useRef<Map<string | number, string>>(new Map());
	const rawMapRef = useRef<Map<string | number, T>>(new Map());
	const addToLabelMap = useCallback((opt: AutocompleteOption<T>) => {
		labelMapRef.current.set(opt.value, opt.label);
		if (Object.prototype.hasOwnProperty.call(opt, "raw") && (opt as AutocompleteOption<T>).raw !== undefined) {
			rawMapRef.current.set(opt.value, (opt as AutocompleteOption<T>).raw as T);
		}
	}, []);
	// Tick to force re-render when labels hydrate via async
	const [labelTick, setLabelTick] = useState(0);
	const getLabel = useCallback(
		(v: string | number) =>
			labelMapRef.current.get(v) ??
			options.find((o) => o.value === v)?.label ??
			(loadSelected ? "Loading..." : String(v)),
		[options, loadSelected],
	);

	const handleSelect = useCallback(
		(next: AutocompleteOption<T>) => {
			addToLabelMap(next);
			if (isMultiple) {
				const prevValues = Array.isArray(value) ? value : [];
				const exists = prevValues.some((v) => v === next.value);
				const newValues = exists
					? prevValues.filter((v) => v !== next.value)
					: [...prevValues, next.value];

				if (controlledValue === undefined) setValue(newValues);
				const selectedOptions: AutocompleteOption<T>[] = newValues.map((v) => ({
					value: v,
					label: getLabel(v),
					raw: rawMapRef.current.get(v),
				}));
				const raws = selectedOptions.map((o) => o.raw as T);
				onChange?.(newValues, selectedOptions, raws);
				// Keep open for multi-select
			} else {
				const newValue = next.value;
				if (controlledValue === undefined) setValue(newValue);
				onChange?.(newValue, next, (next as AutocompleteOption<T>).raw as T | undefined ?? null);
				setOpen(false);
			}
		},
		[addToLabelMap, controlledValue, getLabel, isMultiple, onChange, value],
	);

	// Data state (shared for both modes)
	const [items, setItems] = useState<AutocompleteOption<T>[]>([]);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(false);
	const [nextCursor, setNextCursor] = useState<
		string | number | null | undefined
	>(undefined);
	const [page, setPage] = useState(1);

	const resetData = useCallback(() => {
		setItems([]);
		setHasMore(false);
		setNextCursor(undefined);
		setPage(1);
	}, []);

	// Load data
	const load = useCallback(async () => {
		if (mode === "server") {
			if (!fetcher) return;
			setLoading(true);
			try {
				const res: AutocompleteFetchResult<T> = await fetcher({
					search: debouncedSearch,
					moreFilter: fetcherFilter,
					cursor: nextCursor ?? null,
					page,
					pageSize,
				});
				setItems((prev) => (page === 1 ? res.items : [...prev, ...res.items]));
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
					? options.filter((o) =>
						o.label.toLowerCase().includes(debouncedSearch.toLowerCase()),
					)
					: options;
				const start = (page - 1) * pageSize;
				const slice = filtered.slice(start, start + pageSize);
				setItems((prev) => (page === 1 ? slice : [...prev, ...slice]));
				setHasMore(start + pageSize < filtered.length);
				setNextCursor(undefined);
			} finally {
				setLoading(false);
			}
		}
	}, [mode, fetcher, fetcherFilter, debouncedSearch, nextCursor, page, pageSize, options]);

	// Keep a ref to latest load() to avoid stale closures
	const loadRef = useRef(load);
	useEffect(() => {
		loadRef.current = load;
	}, [load]);

	// Reset and load on open/search change (do NOT depend on load to avoid resets during pagination)
	useEffect(() => {
		if (!open) return;
		// Reference debouncedSearch to intentionally re-run on search changes
		void debouncedSearch;
		resetData();
		const t = window.setTimeout(() => {
			void loadRef.current();
		}, 0);
		return () => window.clearTimeout(t);
	}, [open, debouncedSearch, resetData]);

	// Load subsequent pages when page changes (>1)
	useEffect(() => {
		if (!open) return;
		if (page <= 1) return;
		void loadRef.current();
	}, [open, page]);

	// Infinite scroll
	const listRef = useRef<HTMLDivElement | null>(null);
	const onListScroll = useCallback(() => {
		const el = listRef.current;
		if (!el || loading) return;
		const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 24;
		if (nearBottom && hasMore) {
			setPage((p) => p + 1);
		}
	}, [loading, hasMore]);

	// Prime label map from loaded items and static options
	useEffect(() => {
		items.forEach(addToLabelMap);
	}, [items, addToLabelMap]);
	useEffect(() => {
		options.forEach(addToLabelMap);
	}, [options, addToLabelMap]);
	// Seed label map from explicitly provided initialSelectedOptions
	useEffect(() => {
		if (!initialSelectedOptions) return;
		const arr = Array.isArray(initialSelectedOptions)
			? initialSelectedOptions
			: [initialSelectedOptions];
		arr.forEach(addToLabelMap);
		setLabelTick((t) => t + 1);
	}, [initialSelectedOptions, addToLabelMap]);

	// Resolve labels for current values if missing and a resolver is provided
	useEffect(() => {
		if (!loadSelected) return;
		const curValues: Array<string | number> = Array.isArray(value)
			? (isMultiple ? (value as Array<string | number>) : [])
			: value !== null && value !== undefined
				? [value as string | number]
				: [];
		if (curValues.length === 0) return;
		const missing = curValues.filter(
			(v) => !labelMapRef.current.has(v) && !options.some((o) => o.value === v),
		);
		if (missing.length === 0) return;
		let cancelled = false;
		loadSelected(missing)
			.then((opts) => {
				if (cancelled) return;
				opts.forEach(addToLabelMap);
				setLabelTick((t) => t + 1);
			})
			.catch(() => {
				/* swallow resolver errors */
			});
		return () => {
			cancelled = true;
		};
		// include options so we don't resolve when already present
	}, [value, isMultiple, loadSelected, options, addToLabelMap]);

	// Selected label
	const selectedOption = useMemo(() => {
		if (isMultiple || Array.isArray(value)) return undefined;
		return items.find((i) => i.value === value);
	}, [isMultiple, items, value]);

	// Ensure selected label when item not in current page (server mode)
	// biome-ignore lint/correctness/useExhaustiveDependencies: labelTick intentionally triggers recompute when labelMap hydrates
	const displayedLabel = useMemo(() => {
		if (isMultiple || Array.isArray(value)) return placeholder;
		if (selectedOption) return selectedOption.label;
		const v = value;
		if (v !== null && v !== undefined && !Array.isArray(v)) {
			const mapped = labelMapRef.current.get(v);
			if (mapped) return mapped;
			if (mode === "client") {
				const found = options.find((i) => i.value === v);
				return found?.label ?? placeholder;
			}
		}
		return placeholder;
	}, [isMultiple, mode, options, selectedOption, value, placeholder, labelTick]);

	const selectedValues: Array<string | number> = useMemo(
		() => (isMultiple && Array.isArray(value) ? value : []),
		[isMultiple, value],
	);
	// biome-ignore lint/correctness/useExhaustiveDependencies: labelTick intentionally triggers recompute when labelMap hydrates
	const selectedOptionsMulti: AutocompleteOption<T>[] = useMemo(
		() => selectedValues.map((v) => ({ value: v, label: getLabel(v), raw: rawMapRef.current.get(v) })),
		[getLabel, selectedValues, labelTick],
	);

	const handleClear = useCallback(() => {
		if (isMultiple) {
			if (controlledValue === undefined) setValue([]);
			onChange?.([], [], []);
		} else {
			if (controlledValue === undefined) setValue(null);
			onChange?.(null, null, null);
		}
	}, [controlledValue, isMultiple, onChange]);

	// Helper: add custom value from current search
	const addCustomValue = useCallback(
		(text: string) => {
			const t = text.trim();
			if (!t) return;
			const created: AutocompleteOption<T> = { value: t, label: t };
			addToLabelMap(created);
			if (isMultiple) {
				const prevValues = Array.isArray(value) ? value : [];
				const exists = prevValues.some((v) => v === created.value);
				const newValues = exists ? prevValues : [...prevValues, created.value];
				if (controlledValue === undefined) setValue(newValues);
				const newOptions = newValues.map((v) => ({
					value: v,
					label: getLabel(v),
					raw: rawMapRef.current.get(v),
				}));
				const raws = newOptions.map((o) => o.raw as T);
				onChange?.(newValues, newOptions, raws);
				setSearch("");
			} else {
				if (controlledValue === undefined) setValue(created.value);
				onChange?.(created.value, created, (created.raw as T | undefined) ?? null);
				setSearch("");
				setOpen(false);
			}
		},
		[addToLabelMap, controlledValue, getLabel, isMultiple, onChange, value],
	);

	const inlineInputRef = useRef<HTMLInputElement | null>(null);
	const canOpen = useMemo(() => {
		// When purely tagging (no static options and no fetcher) in client mode with multi+allowCustomValue,
		// we do not show the dropdown; user types inline.
		const pureTagging =
			isMultiple &&
			allowCustomValue &&
			mode === "client" &&
			options.length === 0 &&
			!fetcher;
		return !pureTagging;
	}, [allowCustomValue, fetcher, isMultiple, mode, options.length]);
	useEffect(() => {
		if (!canOpen && open) setOpen(false);
	}, [canOpen, open]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			{canOpen ? (
				<PopoverTrigger asChild>
					<div
						// biome-ignore lint/a11y/useSemanticElements: <explanation>
						role="combobox"
						aria-expanded={open}
						aria-controls={listId}
						tabIndex={disabled ? -1 : 0}
						aria-disabled={disabled || undefined}
						className={cn(
							"w-full inline-flex items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm transition-colors",
							"hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
							disabled && "opacity-50 pointer-events-none",
							className,
						)}
						onKeyDown={(e) => {
							if (disabled || !canOpen) return;
							if (e.target instanceof HTMLInputElement) return; // let input handle keys
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								setOpen((v) => !v);
							}
						}}
					>
						{isMultiple ? (
							<div
								className={cn(
									"flex min-w-0 flex-1 flex-wrap items-center gap-1 text-left",
								)}
							>
								{selectedOptionsMulti.length > 0
									? selectedOptionsMulti.map((opt) => (
										<Badge
											key={`${opt.value}`}
											variant={chipVariant}
											className={cn("pr-1", chipClassName)}
										>
											<span className="truncate max-w-[10rem]">
												{opt.label}
											</span>
											<button
												type="button"
												aria-label={`Remove ${opt.label}`}
												className="ml-1 inline-flex items-center rounded-sm hover:bg-black/5 dark:hover:bg-white/10"
												onMouseDown={(e) => {
													e.preventDefault();
													e.stopPropagation();
												}}
												onClick={(e) => {
													e.preventDefault();
													e.stopPropagation();
													const prevValues = Array.isArray(value)
														? value
														: [];
													const newValues = prevValues.filter(
														(v) => v !== opt.value,
													);
													if (controlledValue === undefined)
														setValue(newValues);
													const newOptions = newValues.map((v) => ({
														value: v,
														label: getLabel(v),
													}));
													onChange?.(newValues, newOptions);
												}}
											>
												<X className="h-3 w-3" />
											</button>
										</Badge>
									))
									: null}
								{allowCustomValue ? (
									<input
										ref={inlineInputRef}
										value={search}
										onChange={(e) => setSearch(e.target.value)}
										placeholder={
											selectedOptionsMulti.length === 0
												? placeholder
												: undefined
										}
										className="flex-1 min-w-[8ch] bg-transparent outline-none text-sm placeholder:text-muted-foreground"
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === ",") {
												e.preventDefault();
												addCustomValue(search);
											} else if (
												e.key === "Backspace" &&
												search === "" &&
												selectedOptionsMulti.length > 0
											) {
												// Remove last chip when input is empty
												const prevValues = Array.isArray(value) ? value : [];
												const newValues = prevValues.slice(0, -1);
												if (controlledValue === undefined) setValue(newValues);
												const newOptions = newValues.map((v) => ({
													value: v,
													label: getLabel(v),
												}));
												onChange?.(newValues, newOptions);
											}
										}}
									/>
								) : null}
								{selectedOptionsMulti.length === 0 && !allowCustomValue ? (
									<span className="truncate text-muted-foreground">
										{placeholder}
									</span>
								) : null}
							</div>
						) : (
							<span
								className={cn(
									"truncate",
									(!value || Array.isArray(value)) && "text-muted-foreground",
								)}
							>
								{displayedLabel}
							</span>
						)}
						{clearable &&
							((isMultiple && selectedOptionsMulti.length > 0) ||
								(!isMultiple &&
									value !== null &&
									value !== undefined &&
									!Array.isArray(value))) ? (
							<button
								type="button"
								aria-label="Clear selection"
								className="ml-2 inline-flex items-center rounded-sm p-1 hover:bg-black/5 dark:hover:bg-white/10"
								onMouseDown={(e) => {
									e.preventDefault();
									e.stopPropagation();
								}}
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									handleClear();
								}}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										e.stopPropagation();
										handleClear();
									}
								}}
							>
								<X className="h-4 w-4 opacity-60" />
							</button>
						) : null}
						<ChevronsUpDown
							className={cn(
								"ml-2 h-4 w-4 shrink-0 opacity-50",
								!canOpen && "hidden",
							)}
						/>
					</div>
				</PopoverTrigger>
			) : (
				<div
					// biome-ignore lint/a11y/useSemanticElements: <explanation>
					role="combobox"
					aria-expanded={open}
					aria-controls={listId}
					tabIndex={disabled ? -1 : 0}
					aria-disabled={disabled || undefined}
					className={cn(
						"w-full inline-flex items-center justify-between rounded-md border bg-background px-3 py-2 text-sm shadow-sm transition-colors",
						"hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
						disabled && "opacity-50 pointer-events-none",
						className,
					)}
					onKeyDown={(_e) => {
						if (disabled || canOpen) return;
						// Do not toggle popover; handle inline input only
					}}
				>
					{isMultiple ? (
						<div
							className={cn(
								"flex min-w-0 flex-1 flex-wrap items-center gap-1 text-left",
							)}
						>
							{selectedOptionsMulti.length > 0
								? selectedOptionsMulti.map((opt) => (
									<Badge
										key={`${opt.value}`}
										variant={chipVariant}
										className={cn("pr-1", chipClassName)}
									>
										<span className="truncate max-w-[10rem]">
											{opt.label}
										</span>
										<button
											type="button"
											aria-label={`Remove ${opt.label}`}
											className="ml-1 inline-flex items-center rounded-sm hover:bg-black/5 dark:hover:bg-white/10"
											onMouseDown={(e) => {
												e.preventDefault();
												e.stopPropagation();
											}}
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												const prevValues = Array.isArray(value) ? value : [];
												const newValues = prevValues.filter(
													(v) => v !== opt.value,
												);
												if (controlledValue === undefined)
													setValue(newValues);
												const newOptions = newValues.map((v) => ({
													value: v,
													label: getLabel(v),
												}));
												onChange?.(newValues, newOptions);
											}}
										>
											<X className="h-3 w-3" />
										</button>
									</Badge>
								))
								: null}
							{allowCustomValue ? (
								<input
									ref={inlineInputRef}
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									placeholder={
										selectedOptionsMulti.length === 0 ? placeholder : undefined
									}
									className="flex-1 min-w-[8ch] bg-transparent outline-none text-sm placeholder:text-muted-foreground"
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === ",") {
											e.preventDefault();
											addCustomValue(search);
										} else if (
											e.key === "Backspace" &&
											search === "" &&
											selectedOptionsMulti.length > 0
										) {
											const prevValues = Array.isArray(value) ? value : [];
											const newValues = prevValues.slice(0, -1);
											if (controlledValue === undefined) setValue(newValues);
											const newOptions = newValues.map((v) => ({
												value: v,
												label: getLabel(v),
											}));
											onChange?.(newValues, newOptions);
										}
									}}
								/>
							) : null}
							{selectedOptionsMulti.length === 0 && !allowCustomValue ? (
								<span className="truncate text-muted-foreground">
									{placeholder}
								</span>
							) : null}
						</div>
					) : (
						<span
							className={cn(
								"truncate",
								(!value || Array.isArray(value)) && "text-muted-foreground",
							)}
						>
							{displayedLabel}
						</span>
					)}
					{clearable &&
						((isMultiple && selectedOptionsMulti.length > 0) ||
							(!isMultiple &&
								value !== null &&
								value !== undefined &&
								!Array.isArray(value))) ? (
						<button
							type="button"
							aria-label="Clear selection"
							className="ml-2 inline-flex items-center rounded-sm p-1 hover:bg-black/5 dark:hover:bg-white/10"
							onMouseDown={(e) => {
								e.preventDefault();
								e.stopPropagation();
							}}
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								handleClear();
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									e.stopPropagation();
									handleClear();
								}
							}}
						>
							<X className="h-4 w-4 opacity-60" />
						</button>
					) : null}
					<ChevronsUpDown
						className={cn(
							"ml-2 h-4 w-4 shrink-0 opacity-50",
							!canOpen && "hidden",
						)}
					/>
				</div>
			)}
			{canOpen ? (
				<PopoverContent
					className="w-[--radix-popover-trigger-width] p-0"
					align="start"
				>
					<Command shouldFilter={false} className="w-full">
						<div className="p-2">
							<CommandInput
								value={search}
								onValueChange={setSearch}
								placeholder={searchPlaceholder}
								autoFocus
								onKeyDown={(e) => {
									if (e.key === "Enter" && allowCustomValue && search.trim()) {
										e.preventDefault();
										addCustomValue(search);
									}
								}}
							/>
						</div>
						<CommandList
							id={listId}
							className="max-h-56 overflow-auto"
							ref={listRef}
							onScroll={onListScroll}
						>
							{loading && items.length === 0 ? (
								<div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
									<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading
								</div>
							) : null}
							<CommandEmpty>
								{allowCustomValue && search.trim() ? (
									<span>Press Enter to add "{search.trim()}"</span>
								) : (
									emptyText
								)}
							</CommandEmpty>
							{items.length > 0 ? (
								<CommandGroup>
									{items.map((item) => {
										const selected = isMultiple
											? Array.isArray(value)
												? value.includes(item.value)
												: false
											: item.value === value;
										return (
											<CommandItem
												key={`${item.value}`}
												value={`${item.label}`}
												onSelect={() => handleSelect(item)}
												className="flex items-center justify-between"
											>
												<div className="min-w-0 truncate">
													{renderOption
														? renderOption(item, selected)
														: item.label}
												</div>
												{selected ? <Check className="h-4 w-4" /> : null}
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
												<Loader2 className="mr-1 h-3 w-3 animate-spin" />{" "}
												Loading more
											</>
										) : (
											"Scroll to load more"
										)}
									</div>
								</>
							) : null}
						</CommandList>
					</Command>
				</PopoverContent>
			) : null}
		</Popover>
	);
}

export default Autocomplete;
