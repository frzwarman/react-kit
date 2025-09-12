import type { Meta, StoryObj } from '@storybook/react'
import { FormBuilder, type FormBuilderProps } from '../../../kit/builder/form/components/FormBuilder'
import type { FileRecord } from '../../../kit/components/fileuploader/types'

// Simple mocked uploader with progress + optional failure
function mockUploader(options?: { minMs?: number; maxMs?: number; failRate?: number }) {
  const minMs = options?.minMs ?? 700
  const maxMs = options?.maxMs ?? 1600
  const failRate = options?.failRate ?? 0.15
  return async (file: File, onProgress: (pct: number) => void): Promise<Partial<FileRecord>> => {
    const willFail = Math.random() < failRate
    const total = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs
    const start = Date.now()
    return new Promise((resolve, reject) => {
      const iv = setInterval(() => {
        const elapsed = Date.now() - start
        const pct = Math.min(100, Math.round((elapsed / total) * 100))
        onProgress(pct)
        if (pct >= 100) {
          clearInterval(iv)
          if (willFail) {
            reject(new Error('Simulated upload error'))
          } else {
            resolve({ id: `${file.name}-${Date.now()}` })
          }
        }
      }, 150)
    })
  }
}

const meta: Meta<typeof FormBuilder> = {
  title: 'Kit/Builder/Form',
  component: FormBuilder,
  parameters: {
    controls: { expanded: true },
    backgrounds: { disable: true },
  },
}

export default meta

type Story = StoryObj<typeof FormBuilder>

export const FileUploaderForm: Story = {
  name: 'File Uploader',
  args: {
    sections: [
      {
        title: 'Attachments',
        description: 'Demonstrates the FileUploader field integrated with FormBuilder',
        variant: 'card',
        layout: 'grid',
        grid: { cols: 1, mdCols: 2, gap: 'gap-4' },
        fields: [
          {
            name: 'images',
            label: 'Product Images',
            type: 'file',
            gridCols: 2,
            required: true,
            // FileUploader pass-through
            fileMultiple: true,
            fileMaxFiles: 6,
            fileAccept: { 'image/*': [] },
            fileLayout: 'grid',
            fileWithDownload: true,
            fileUploader: mockUploader({ failRate: 0.1 }),
            validation: {
              minItems: { value: 1, message: 'Please upload at least 1 image' },
              maxItems: { value: 6, message: 'Maximum 6 images allowed' },
            },
          },
          {
            name: 'docs',
            label: 'Documents',
            type: 'file',
            gridCols: 2,
            fileMultiple: true,
            fileMaxFiles: 4,
            fileAccept: { 'application/pdf': ['.pdf'], 'text/plain': ['.txt'] },
            fileLayout: 'list',
            fileWithDownload: false,
            fileUploader: mockUploader({ failRate: 0.25 }),
            validation: {
              maxItems: { value: 4, message: 'Up to 4 documents' },
            },
          },
        ],
      },
    ],
    defaultValues: {
      images: [
        {
          id: 'img-1',
          name: 'existing-1.jpg',
          url: 'https://picsum.photos/seed/fb-uploader-1/600/400',
          type: 'image/jpeg',
          size: 200000,
          status: 'success',
          progress: 100,
        },
        {
          id: 'img-2',
          name: 'existing-2.jpg',
          url: 'https://picsum.photos/seed/fb-uploader-2/600/400',
          type: 'image/jpeg',
          size: 180000,
          status: 'success',
          progress: 100,
        },
      ] satisfies FileRecord[],
      docs: [] as FileRecord[],
    },
    onSubmit: (data: unknown) => {
      console.log('Submit (FileUploader form):', data)
    },
    showActions: true,
  } satisfies Partial<FormBuilderProps>,
  render: (args) => (
    <div className="max-w-5xl mx-auto p-6">
      <FormBuilder {...(args as FormBuilderProps)} />
    </div>
  ),
}
