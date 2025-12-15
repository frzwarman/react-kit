import type React from 'react';
import type {
  Control,
  DeepPartial,
  FieldValues,
  Path,
  UseFormGetValues,
  UseFormReturn,
  UseFormSetValue,
  DefaultValues,
} from 'react-hook-form';
import type { z } from 'zod';
import type { Accept } from 'react-dropzone';
import type {
  SectionFlexOptions,
  SectionGridOptions,
  SectionLayout,
} from '../section/types';
import type {
  AutocompleteFetcher,
  AutocompleteOption,
} from '../../components/autocomplete/types';
import type {
  FileRecord,
  FileUploaderLayout,
} from '../../components/fileuploader/types';
import type { ReactNode } from 'react';

export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'textarea'
  | 'select'
  | 'autocomplete'
  | 'checkbox'
  | 'switch'
  | 'radio'
  | 'date'
  | 'date_picker'
  | 'date_range'
  | 'month'
  | 'month_range'
  | 'time'
  | 'time_range'
  | 'date_time'
  | 'date_time_range'
  | 'file'
  | 'hidden'
  | 'object'
  | 'array'
  | 'custom_field';

export interface Dependency<TFieldValues extends FieldValues> {
  field: Path<TFieldValues>;
  condition: (value: unknown) => boolean;
  action: 'show' | 'hide' | 'enable' | 'disable' | 'required' | 'optional' | 'setValue';
  value?: unknown;
}

export interface FormBuilderFieldConfig<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> | string = Path<TFieldValues>,
> {
  id?: string;
  name: TName;
  label: string;
  type: FieldType;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  options?: { label: string; value: string | number | boolean | null }[];
  autocompleteMode?: 'client' | 'server';
  fetcher?: AutocompleteFetcher;
  fetcherFilter?: () => Record<string, string | number | boolean | null>;
  pageSize?: number;
  renderOption?: (
    option: AutocompleteOption,
    selected: boolean,
  ) => React.ReactNode;
  multiple?: boolean;
  allowCustomValue?: boolean;
  chipVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  chipClassName?: string;
  clearable?: boolean;
  initialSelectedOptions?: AutocompleteOption | AutocompleteOption[] | null;
  loadSelected?: (
    values: Array<string | number>,
  ) => Promise<AutocompleteOption[]>;
  validation?:
    | z.ZodType<unknown>
    | {
        pattern?: { value: RegExp; message: string };
        min?: { value: number; message: string };
        max?: { value: number; message: string };
        minLength?: { value: number; message: string };
        maxLength?: { value: number; message: string };
        minItems?: { value: number; message: string };
        maxItems?: { value: number; message: string };
      };
  // Accept any for defaultValue to support relative string names for nested fields
  defaultValue?: unknown;
  // For nested object/array fields, use relative names (eg. 'uomName')
  fields?: Array<FormBuilderFieldConfig<TFieldValues, string>>;
  dependencies?: Array<Dependency<TFieldValues>>;
  onChange?: (
    value: unknown,
    extras: unknown,
    setValue: UseFormSetValue<TFieldValues>,
    getValues: UseFormGetValues<TFieldValues>,
  ) => void;
  className?: string;
  gridCols?: number;
  rows?: number;
  itemType?: string;
  arrayLayout?: 'card' | 'table' | 'custom';
  arrayRender?: (params: {
    field: FormBuilderFieldConfig<TFieldValues>;
    control: Control<TFieldValues>;
    fieldPath: string;
    value: unknown;
    onChange: (value: unknown) => void;
    addItem: () => void;
    removeItem: (index: number) => void;
    disabled?: boolean;
    rows?: { id: string }[];
  }) => React.ReactNode;
  arrayColors?: {
    headerBgClass?: string;
    headerTextClass?: string;
    rowAltBgClass?: string;
  };
  conditional?: {
    field: Path<TFieldValues>;
    value: unknown;
  };
  hidden?: boolean;
  labelPlacement?: 'stacked' | 'inline' | 'hidden';
  wrapperClassName?: string;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Array<Date | { from: Date; to: Date }>;
  numberOfMonths?: number;
  popoverSide?: 'top' | 'right' | 'bottom' | 'left';
  showFooter?: boolean;
  cancelLabel?: string;
  applyLabel?: string;
  timePrecision?: 'hour' | 'minute' | 'second';
  hourCycle?: 12 | 24;
  minuteStep?: number;
  secondStep?: number;
  fileMultiple?: boolean;
  fileMaxFiles?: number;
  fileAccept?: Accept;
  fileLayout?: FileUploaderLayout;
  fileWithDownload?: boolean;
  fileUploader?: (
    file: File,
    onProgress: (pct: number) => void,
  ) => Promise<Partial<FileRecord>>;
  fileOnUploadSuccess?: (file: FileRecord) => void;
  fileOnUploadError?: (file: FileRecord, error: unknown) => void;
  fileOnRemove?: (file: FileRecord) => void | Promise<void>;
  fileOnRetry?: (file: FileRecord) => void;
  fileOnRetryAll?: (files: FileRecord[]) => void;
  customRender?: (fieldControl: {
    field: FormBuilderFieldConfig<TFieldValues, string>;
    fieldPath: string;
    control: Control<TFieldValues>;
    value: TFieldValues;
    handleChange: (value: unknown, ...extras: unknown[]) => void;
  }) => React.ReactNode;
}

export interface FormBuilderSectionConfig<
  TFieldValues extends FieldValues = FieldValues,
> {
  id?: string;
  title?: string;
  description?: string;
  fields?: Array<FormBuilderFieldConfig<TFieldValues>>;
  variant?: 'card' | 'separator' | 'plain';
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  layout?: SectionLayout;
  grid?: SectionGridOptions;
  flex?: SectionFlexOptions;
  hidden?: boolean;
  tabs?: Array<{
    id: string;
    label: ReactNode;
    sections: Array<FormBuilderSectionConfig<TFieldValues>>;
    className?: string;
    contentClassName?: string;
  }>;
  defaultTabId?: string;
  tabsListClassName?: string;
  tabsContentClassName?: string;
}

export interface FormBuilderProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  // Accept form from useFormBuilder hook
  form?: UseFormReturn<TFieldValues>;
  sections: Array<FormBuilderSectionConfig<TFieldValues>>;

  // Optional overrides (for backward compatibility)
  schema?: z.ZodType<TFieldValues>;
  defaultValues?:
    | DeepPartial<TFieldValues>
    | DefaultValues<TFieldValues>
    | null;

  // Handlers
  onSubmit: (data: TFieldValues) => void | Promise<void>;
  onCancel?: () => void;
  onReset?: () => void;
  onFieldChange?: (
    name: Path<TFieldValues> | string,
    value: unknown,
    allValues: TFieldValues,
  ) => void;

  // UI customization
  submitLabel?: string;
  cancelLabel?: string;
  resetLabel?: string;
  isSubmitting?: boolean;
  className?: string;
  formClassName?: string;
  actionsClassName?: string;
  showActions?: boolean;
  customActions?: React.ReactNode;
  showActionsSeparator?: boolean;
}

// Re-export for external consumers that build custom section nodes
export type { SectionNode } from '../section/types';
