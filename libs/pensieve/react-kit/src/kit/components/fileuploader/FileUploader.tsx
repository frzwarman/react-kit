import { useCallback, useEffect, useRef, useState, memo } from 'react';
import { useDropzone, type Accept } from 'react-dropzone';
import { cn } from '../../../shadcn/lib/utils';
import { Button } from '../../../shadcn/ui/button';
import { Progress } from '../../../shadcn/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../shadcn/ui/tooltip';
import {
  Loader2,
  UploadCloud,
  Image as ImageIcon,
  File as FileIcon,
  FileText,
  FileCode,
  Video,
  Music,
  Archive,
  CheckCircle2,
  XCircle,
  Download,
  Trash2,
  RotateCcw,
} from 'lucide-react';
import type { FileRecord, FileUploaderProps } from './types';

// Cache preview URLs per File instance without mutating the File object
const previewUrlMap: WeakMap<File, string> = new WeakMap();

function formatBytes(bytes?: number) {
  if (!bytes && bytes !== 0) return '';
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
}

function isImageType(type?: string, name?: string) {
  if (!type && name) {
    const ext = name.toLowerCase().split('.').pop();
    if (!ext) return false;
    return [
      'png',
      'jpg',
      'jpeg',
      'webp',
      'gif',
      'bmp',
      'svg',
      'heic',
      'heif',
    ].includes(ext);
  }
  return !!type?.startsWith('image/');
}

function pickIconByType(type?: string, name?: string) {
  const t = (type || '').toLowerCase();
  const ext = (name?.split('.').pop() || '').toLowerCase();
  if (
    t.startsWith('image/') ||
    [
      'png',
      'jpg',
      'jpeg',
      'webp',
      'gif',
      'bmp',
      'svg',
      'heic',
      'heif',
    ].includes(ext)
  )
    return <ImageIcon className="h-8 w-8" />;
  if (t.startsWith('video/') || ['mp4', 'mov', 'webm', 'mkv'].includes(ext))
    return <Video className="h-8 w-8" />;
  if (t.startsWith('audio/') || ['mp3', 'wav', 'aac', 'flac'].includes(ext))
    return <Music className="h-8 w-8" />;
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext))
    return <Archive className="h-8 w-8" />;
  if (['txt', 'md', 'rtf'].includes(ext))
    return <FileText className="h-8 w-8" />;
  if (
    ['js', 'ts', 'tsx', 'json', 'yml', 'yaml', 'xml', 'html', 'css'].includes(
      ext,
    )
  )
    return <FileCode className="h-8 w-8" />;
  return <FileIcon className="h-8 w-8" />;
}

function getPreviewUrl(file: FileRecord) {
  if (file.thumbnailUrl) return file.thumbnailUrl;
  if (file.url && isImageType(file.type, file.name)) return file.url;
  if (file.file && isImageType(file.file.type, file.file.name)) {
    const cached = previewUrlMap.get(file.file);
    if (cached) return cached;
    const created = URL.createObjectURL(file.file);
    previewUrlMap.set(file.file, created);
    return created;
  }
  return undefined;
}

export function FileUploader({
  value,
  defaultValue,
  onChange,
  uploader,
  onUploadSuccess,
  onUploadError,
  onRemove,
  withRetry = true,
  onRetry,
  onRetryAll,
  multiple = true,
  maxFiles,
  accept,
  layout = 'grid',
  disabled,
  withDownload = true,
  placeholder = 'Drag and drop files here, or click to select',
  className,
}: FileUploaderProps) {
  const isControlled = value !== undefined;
  const [files, setFiles] = useState<FileRecord[]>(() => defaultValue ?? []);

  const prevUrlsRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    return () => {
      prevUrlsRef.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });
      prevUrlsRef.current.clear();
    };
  }, []);

  const setFilesAndEmit = useCallback(
    (updater: FileRecord[] | ((prev: FileRecord[]) => FileRecord[])) => {
      setFiles((prev) => {
        let next: FileRecord[];
        if (typeof updater === 'function') {
          const fn = updater as (p: FileRecord[]) => FileRecord[];
          next = fn(prev);
        } else {
          next = updater;
        }
        onChange?.(next);
        return next;
      });
    },
    [onChange],
  );

  useEffect(() => {
    if (isControlled && value) setFiles(value);
    if (isControlled && !value) setFiles([]);
  }, [isControlled, value]);

  // Normalize incoming items (default/controlled): if a file has a URL but no status, mark as success
  useEffect(() => {
    setFiles((prev) => {
      let changed = false;
      const next = prev.map((f) => {
        if ((f.url || f.thumbnailUrl) && !f.status) {
          changed = true;
          return { ...f, status: 'success' as const, progress: 100 };
        }
        return f;
      });
      return changed ? next : prev;
    });
  }, []);

  const handleRemove = useCallback(
    async (idx: number) => {
      const target = files[idx];
      try {
        await onRemove?.(target);
      } catch {
        // ignore removal error UX for now
      }
      setFilesAndEmit((prev) => prev.filter((_, i) => i !== idx));
    },
    [files, onRemove, setFilesAndEmit],
  );

  const startUpload = useCallback(
    async (index: number, f: File) => {
      if (!uploader) return;
      try {
        setFilesAndEmit((prev) => {
          const n = [...prev];
          n[index] = {
            ...n[index],
            status: 'uploading',
            progress: 0,
            errorMessage: undefined,
          };
          return n;
        });
        const result = await uploader(f, (pct) => {
          setFilesAndEmit((prev) => {
            const n = [...prev];
            if (!n[index]) return prev;
            n[index] = {
              ...n[index],
              progress: Math.min(100, Math.max(0, Math.round(pct))),
              status: 'uploading',
            };
            return n;
          });
        });
        setFilesAndEmit((prev) => {
          const n = [...prev];
          if (!n[index]) return prev;
          n[index] = {
            ...n[index],
            ...result,
            status: 'success',
            progress: 100,
          };
          return n;
        });
        const uploaded = (isControlled ? value : files)[index] ?? undefined;
        if (uploaded) onUploadSuccess?.(uploaded);
      } catch (err) {
        setFilesAndEmit((prev) => {
          const n = [...prev];
          if (!n[index]) return prev;
          const msg =
            err &&
            typeof err === 'object' &&
            'message' in (err as Record<string, unknown>)
              ? String((err as { message?: unknown }).message)
              : 'Upload failed';
          n[index] = { ...n[index], status: 'error', errorMessage: msg };
          return n;
        });
        const failed = (isControlled ? value : files)[index] ?? undefined;
        if (failed) onUploadError?.(failed, err);
      }
    },
    [
      files,
      isControlled,
      onUploadError,
      onUploadSuccess,
      setFilesAndEmit,
      uploader,
      value,
    ],
  );

  const handleRetry = useCallback(
    (idx: number) => {
      const fr = files[idx];
      if (!uploader || !fr?.file) return;
      onRetry?.(fr);
      void startUpload(idx, fr.file);
    },
    [files, onRetry, startUpload, uploader],
  );

  const handleRetryAll = useCallback(() => {
    if (!uploader) return;
    const failedFiles = files.filter((f) => f.status === 'error' && !!f.file);
    if (failedFiles.length === 0) return;
    onRetryAll?.(failedFiles);
    failedFiles.forEach((fr) => {
      const idx = files.indexOf(fr);
      if (idx >= 0 && fr.file) {
        onRetry?.(fr);
        void startUpload(idx, fr.file);
      }
    });
  }, [files, onRetry, onRetryAll, startUpload, uploader]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles?.length) return;
      setFilesAndEmit((prev) => {
        const existing = [...prev];
        const capacity =
          typeof maxFiles === 'number'
            ? Math.max(0, maxFiles - existing.length)
            : acceptedFiles.length;
        const incoming = acceptedFiles
          .slice(0, capacity)
          .map<FileRecord>((f) => ({
            id: undefined,
            url: undefined,
            thumbnailUrl: undefined,
            file: f,
            name: f.name,
            size: f.size,
            type: f.type,
            status: uploader ? 'uploading' : 'idle',
            progress: uploader ? 0 : undefined,
          }));
        const next = multiple
          ? [...existing, ...incoming]
          : ([incoming[0]].filter(Boolean) as FileRecord[]);
        return next;
      });

      if (uploader) {
        const baseIndex = (isControlled ? value : files)?.length ?? 0;
        const capacity =
          typeof maxFiles === 'number'
            ? Math.max(
                0,
                maxFiles - ((isControlled ? value : files)?.length ?? 0),
              )
            : acceptedFiles.length;
        acceptedFiles.slice(0, capacity).forEach((f, i) => {
          const index = multiple ? baseIndex + i : 0;
          void startUpload(index, f);
        });
      }
    },
    [
      files,
      isControlled,
      maxFiles,
      multiple,
      startUpload,
      uploader,
      value,
      setFilesAndEmit,
    ],
  );

  const disabledBecauseFull = !!maxFiles && files.length >= maxFiles;

  const { getRootProps, getInputProps, isDragActive, isDragReject, open } =
    useDropzone({
      onDrop,
      multiple,
      maxFiles: multiple ? maxFiles : 1,
      accept: accept as Accept | undefined,
      noClick: true,
      noKeyboard: true,
      disabled: disabled || disabledBecauseFull,
    });

  useEffect(() => {
    const urls = new Set<string>();
    files.forEach((fr) => {
      const preview = getPreviewUrl(fr);
      if (preview) urls.add(preview);
    });
    prevUrlsRef.current.forEach((prev) => {
      if (!urls.has(prev)) URL.revokeObjectURL(prev);
    });
    prevUrlsRef.current = urls;
  }, [files]);

  const rootClasses = cn(
    'w-full border border-dashed rounded-md p-4 text-sm transition-colors bg-background',
    'hover:border-foreground/50',
    isDragActive && 'border-primary',
    isDragReject && 'border-destructive',
    (disabled || disabledBecauseFull) && 'opacity-50 pointer-events-none',
  );

  // (renderThumb removed; inlined into FileItem for better memoization)

  // Stable handler refs so children don't see new function identities each render
  const removeRef = useRef(handleRemove);
  useEffect(() => {
    removeRef.current = handleRemove;
  }, [handleRemove]);
  const retryRef = useRef(handleRetry);
  useEffect(() => {
    retryRef.current = handleRetry;
  }, [handleRetry]);
  const onRemoveAt = useCallback((i: number) => {
    removeRef.current(i);
  }, []);
  const onRetryAt = useCallback((i: number) => {
    retryRef.current(i);
  }, []);

  type FileItemProps = {
    fr: FileRecord;
    idx: number;
    layout: 'grid' | 'list';
    withDownload: boolean;
    uploaderPresent: boolean;
    onRemove: (idx: number) => void;
    onRetry: (idx: number) => void;
  };

  const FileItem = memo(
    function FileItem({
      fr,
      idx,
      layout,
      withDownload,
      uploaderPresent,
      onRemove,
      onRetry,
    }: FileItemProps) {
      const name = fr.name;
      const size = formatBytes(fr.size);
      const error = fr.status === 'error' ? fr.errorMessage : undefined;
      const preview = getPreviewUrl(fr);
      return (
        <div
          className={cn(
            'flex items-center gap-3 border rounded-md p-2 bg-card',
            layout === 'grid' ? 'flex-col items-stretch' : 'flex-row',
          )}
        >
          <div className={cn(layout === 'grid' ? 'self-center' : '')}>
            {
              <div
                className={cn(
                  'relative overflow-hidden bg-muted/40 border rounded-md flex items-center justify-center',
                  layout === 'grid' ? 'h-28 w-28' : 'h-16 w-16',
                )}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt={fr.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center text-muted-foreground">
                    {pickIconByType(fr.type, fr.name)}
                  </div>
                )}
                {fr.status === 'uploading' ? (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                  </div>
                ) : null}
                {fr.status === 'success' ? (
                  <div className="absolute top-1 right-1 text-green-500">
                    <CheckCircle2 className="h-5 w-5 drop-shadow" />
                  </div>
                ) : null}
                {fr.status === 'error' ? (
                  <div className="absolute top-1 right-1 text-red-500">
                    <XCircle className="h-5 w-5 drop-shadow" />
                  </div>
                ) : null}
              </div>
            }
          </div>
          <div
            className={cn('min-w-0 flex-1', layout === 'grid' ? 'mt-2' : '')}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="truncate font-medium" title={name}>
                  {name}
                </div>
                <div className="text-xs text-muted-foreground">{size}</div>
              </div>
              <div className="flex items-center gap-1">
                {fr.status === 'error' ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onRetry(idx)}
                        aria-label="Retry upload"
                        disabled={!uploaderPresent || !fr.file}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Retry</TooltipContent>
                  </Tooltip>
                ) : null}
                {withDownload && (fr.url || fr.thumbnailUrl) ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          const url = fr.url ?? fr.thumbnailUrl;
                          if (url) {
                            window.open(url, '_blank', 'noopener,noreferrer');
                          }
                        }}
                        aria-label="Download"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Download</TooltipContent>
                  </Tooltip>
                ) : null}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onRemove(idx)}
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Remove</TooltipContent>
                </Tooltip>
              </div>
            </div>
            {fr.status === 'uploading' ? (
              <div className="mt-2">
                <Progress value={fr.progress ?? 0} />
              </div>
            ) : null}
            {error ? (
              <div className="mt-2 text-xs text-destructive">{error}</div>
            ) : null}
          </div>
        </div>
      );
    },
    (prev, next) =>
      prev.fr === next.fr &&
      prev.layout === next.layout &&
      prev.withDownload === next.withDownload &&
      prev.uploaderPresent === next.uploaderPresent &&
      prev.idx === next.idx,
  );

  return (
    <div className={cn('space-y-3', className)}>
      <div {...getRootProps({ className: rootClasses })}>
        <input
          {...getInputProps({
            onClick: (e) => {
              (e.target as HTMLInputElement).value = '';
            },
          })}
        />
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Button
              size="sm"
              variant="secondary"
              disabled={disabled || disabledBecauseFull}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                open();
              }}
            >
              Select files
            </Button>
            <UploadCloud className="h-5 w-5" />
            <div>
              <div className="font-medium">
                {disabledBecauseFull
                  ? 'File limit reached'
                  : isDragActive
                    ? 'Drop the files here'
                    : placeholder}
              </div>
              <div className="text-xs">
                {accept ? 'Specific file types only' : 'Any file type'}
                {typeof maxFiles === 'number'
                  ? ` • Up to ${maxFiles} file${maxFiles > 1 ? 's' : ''}`
                  : ''}
              </div>
            </div>
          </div>
          {withRetry && (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleRetryAll}
                disabled={
                  !!disabled ||
                  !uploader ||
                  files.every((f) => f.status !== 'error' || !f.file)
                }
              >
                <RotateCcw className="mr-1 h-4 w-4" /> Retry failed
              </Button>
            </div>
          )}
        </div>
      </div>

      <TooltipProvider>
        <div
          className={cn(
            layout === 'grid' ? 'flex flex-wrap gap-3' : 'flex flex-col gap-2',
          )}
        >
          {files.length === 0 ? (
            <div className="text-sm text-muted-foreground">No files</div>
          ) : (
            files.map((fr, i) => (
              <FileItem
                key={`${fr.name}-${i}`}
                fr={fr}
                idx={i}
                layout={layout}
                withDownload={withDownload}
                uploaderPresent={!!uploader}
                onRemove={onRemoveAt}
                onRetry={onRetryAt}
              />
            ))
          )}
        </div>
      </TooltipProvider>
    </div>
  );
}

export default FileUploader;
