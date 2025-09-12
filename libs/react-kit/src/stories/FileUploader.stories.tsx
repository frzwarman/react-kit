import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FileUploader } from '../index';
import type { FileRecord } from '../kit/components/fileuploader/types';

// ---- helpers
function isImage(name?: string, type?: string) {
  const t = (type || '').toLowerCase();
  const ext = (name?.split('.')?.pop() || '').toLowerCase();
  return t.startsWith('image/') || ['png','jpg','jpeg','webp','gif','bmp','svg','heic','heif'].includes(ext);
}

function mockUploaderFactory(options?: { minMs?: number; maxMs?: number; failRate?: number }) {
  const minMs = options?.minMs ?? 800;
  const maxMs = options?.maxMs ?? 1800;
  const failRate = options?.failRate ?? 0;
  return async (file: File, onProgress: (p: number) => void): Promise<Partial<FileRecord>> => {
    const willFail = Math.random() < failRate;
    const total = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    const start = Date.now();
    return new Promise((resolve, reject) => {
      const iv = window.setInterval(() => {
        const elapsed = Date.now() - start;
        const pct = Math.min(100, Math.round((elapsed / total) * 100));
        onProgress(pct);
        if (pct >= 100) {
          window.clearInterval(iv);
          if (willFail) {
            reject(new Error('Simulated upload error'));
          } else {
            // Simulate server response: echo a URL
            const url = isImage(file.name, file.type)
              ? URL.createObjectURL(file)
              : undefined;
            resolve({ url, id: `${file.name}-${Date.now()}` });
          }
        }
      }, 150);
    });
  };
}

const meta: Meta<typeof FileUploader> = {
  title: 'Kit/Components/FileUploader',
  component: FileUploader,
  parameters: {
    centered: false,
    docs: {
      description: {
        component:
          'Upload files with drag-and-drop, thumbnails, progress, success/error indicators, download and remove actions. Uses react-dropzone and shadcn/ui.',
      },
    },
  },
  argTypes: {
    onRetry: { action: 'onRetry' },
    onRetryAll: { action: 'onRetryAll' },
  },
  args: {
    multiple: true,
    withDownload: true,
    layout: 'grid',
    placeholder: 'Drag and drop files here, or click Select files',
  },
};
export default meta;

type Story = StoryObj<typeof FileUploader>;

export const ImagesGrid: Story = {
  name: 'Images • Grid layout',
  args: {
    accept: { 'image/*': [] },
    maxFiles: 8,
    uploader: mockUploaderFactory({ minMs: 700, maxMs: 1600, failRate: 0 }),
    defaultValue: [
      {
        id: 'p1',
        name: 'mountain.jpg',
        url: 'https://picsum.photos/seed/mountain/600/400',
        size: 123456,
        type: 'image/jpeg',
        status: 'success',
        progress: 100,
      },
      {
        id: 'p2',
        name: 'forest.jpg',
        url: 'https://picsum.photos/seed/forest/600/400',
        size: 234567,
        type: 'image/jpeg',
        status: 'success',
        progress: 100,
      },
    ] satisfies FileRecord[],
  },
};

export const MixedList: Story = {
  name: 'Mixed files • List layout',
  args: {
    layout: 'list',
    multiple: true,
    maxFiles: 5,
    uploader: mockUploaderFactory({ minMs: 900, maxMs: 2000, failRate: 0.1 }),
  },
};

export const SingleFile: Story = {
  name: 'Single file',
  args: {
    multiple: false,
    maxFiles: 1,
    accept: undefined,
    uploader: mockUploaderFactory({ failRate: 0 }),
    layout: 'grid',
  },
};

export const ErrorSimulation: Story = {
  name: 'Error simulation (50% fail)',
  args: {
    multiple: true,
    uploader: mockUploaderFactory({ minMs: 600, maxMs: 1200, failRate: 0.5 }),
    maxFiles: 6,
  },
};

export const RetryAllDemo: Story = {
  name: 'Retry all failed (demo)',
  args: {
    multiple: true,
    uploader: mockUploaderFactory({ minMs: 600, maxMs: 1200, failRate: 0.5 }),
    maxFiles: 6,
    layout: 'list',
  },
};

export const WithDefaultServerFiles: Story = {
  name: 'Edit mode with default server files',
  args: {
    multiple: true,
    layout: 'list',
    uploader: mockUploaderFactory({ failRate: 0 }),
    defaultValue: [
      {
        id: 'doc-1',
        name: 'contract.pdf',
        size: 987654,
        type: 'application/pdf',
        // no url -> will render as icon
        status: 'success',
        progress: 100,
      },
      {
        id: 'img-1',
        name: 'avatar.png',
        url: 'https://picsum.photos/seed/avatar/300/300',
        size: 54321,
        type: 'image/png',
        status: 'success',
        progress: 100,
      },
    ] satisfies FileRecord[],
  },
};
