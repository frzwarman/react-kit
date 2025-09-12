import type { FieldRenderProps } from './types'
import { FileUploader } from '../../../../components/fileuploader/FileUploader'

export function FileField({ field, value, onChange, className }: FieldRenderProps) {
  const files = Array.isArray(value) ? value : []
  return (
    <FileUploader
      className={className}
      disabled={field.disabled}
      placeholder={field.placeholder}
      value={files}
      onChange={(files) => onChange(files)}
      multiple={field.fileMultiple ?? true}
      maxFiles={field.fileMaxFiles}
      accept={field.fileAccept}
      layout={field.fileLayout ?? 'grid'}
      withDownload={field.fileWithDownload ?? true}
      uploader={field.fileUploader}
      onUploadSuccess={field.fileOnUploadSuccess}
      onUploadError={field.fileOnUploadError}
      onRemove={field.fileOnRemove}
      onRetry={field.fileOnRetry}
      onRetryAll={field.fileOnRetryAll}
    />
  )
}
