import type { Accept } from 'react-dropzone';

export type FileUploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export type FileRecord = {
  id?: string | number;
  /** Server URL to access the uploaded file */
  url?: string;
  /** Optional dedicated thumbnail URL */
  thumbnailUrl?: string;
  /** Original File object (when chosen locally) */
  file?: File | null;
  name: string;
  size?: number;
  type?: string;
  /** Upload status */
  status?: FileUploadStatus;
  /** 0-100 */
  progress?: number;
  errorMessage?: string;
  /** Any server metadata you want to keep */
  meta?: Record<string, unknown>;
};

export type FileUploaderLayout = 'grid' | 'list';

export type FileUploaderProps = {
  /** Controlled value of files */
  value?: FileRecord[];
  /** Initial files (e.g., from server on edit forms) */
  defaultValue?: FileRecord[];
  /** Called whenever internal files list changes */
  onChange?: (files: FileRecord[]) => void;

  /**
   * Uploader function invoked for each dropped/selected file.
   * Use the provided onProgress callback to report upload progress (0-100).
   * Resolve with server info like id/url/meta.
   */
  uploader?: (
    file: File,
    onProgress: (pct: number) => void,
  ) => Promise<Partial<FileRecord>>;

  /** Called after a single file successfully uploaded */
  onUploadSuccess?: (file: FileRecord) => void;
  /** Called after a single file failed to upload */
  onUploadError?: (file: FileRecord, error: unknown) => void;
  /** Called when a file is removed (useful to delete from server) */
  onRemove?: (file: FileRecord) => void | Promise<void>;

  /** Allow retrying errored uploads */
  withRetry?: boolean;
  /** Called when user retries an errored file upload */
  onRetry?: (file: FileRecord) => void;
  /** Called when user retries all failed uploads at once */
  onRetryAll?: (files: FileRecord[]) => void;

  /** Allow selecting multiple files */
  multiple?: boolean;
  /** Max number of files allowed in the list */
  maxFiles?: number;
  /** Accept file types (react-dropzone Accept map) */
  accept?: Accept;

  /** Layout variant */
  layout?: FileUploaderLayout;
  /** Disable interactions */
  disabled?: boolean;
  /** Show a download action for successfully uploaded files with url */
  withDownload?: boolean;
  /** Optional label or placeholder for the dropzone */
  placeholder?: string;
  /** Additional className */
  className?: string;
};
