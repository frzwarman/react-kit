import type { FormBuilderSectionConfig } from '../form/components/FormBuilder';

export type DataTableFiltersProp = FormBuilderSectionConfig[];

export type IconPosition = 'left' | 'right';

export interface DataTableAction {
  key: string;
  label?: React.ReactNode; // string or component
  icon?: React.ReactNode;
  iconPosition?: IconPosition;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  disabled?: boolean;
  onClick?: () => void | Promise<void>;
  // If provided, this element will be rendered directly instead of constructing a Button
  element?: React.ReactNode;
}

export interface DataTableBatchAction<TData = unknown> {
  key: string;
  label?: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: IconPosition;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  disabled?: boolean;
  // Receives selected rows and helpers
  onClick?: (args: { selectedRows: TData[]; clearSelection: () => void }) => void | Promise<void>;
  element?: React.ReactNode;
}
