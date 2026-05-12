/// <reference types='vitest' />
import { defineConfig, LibraryFormats } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import tailwindcss from "@tailwindcss/vite"
import * as fs from 'fs';

export default defineConfig(() => {
  // Prepare entry map for library index and each CSS theme
  const themesDir = path.resolve(__dirname, 'src/kit/themes');
  const input: Record<string, string> = {
    index: path.resolve(__dirname, 'src/index.ts'),
  };
  try {
    const files = fs.readdirSync(themesDir);
    for (const f of files) {
      if (f.endsWith('.css')) {
        const name = path.basename(f, '.css');
        // Name entries under kit/themes/<name> so outputs are grouped nicely
        input[`kit/themes/${name}`] = path.resolve(themesDir, f);
      }
    }
  } catch (_e) {
    // ignore
  }

  return {
    root: __dirname,
    cacheDir: '../../../node_modules/.vite/libs/universe/react-kit',
    plugins: [
      react(),
      tailwindcss() as never,
      dts({
        entryRoot: 'src',
        tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },
    // Configuration for building your library.
    // See: https://vitejs.dev/guide/build.html#library-mode
    build: {
      outDir: './dist',
      emptyOutDir: true,
      minify: false,
      lib: {
        entry: 'src/index.ts',
        formats: ['es'] as LibraryFormats[],
        fileName: () => 'index.js'
      },
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      // Use Rollup multi-entry: library index + each theme CSS
      rollupOptions: {
        // External packages that should not be bundled into your library.
        external: (id: string) => {
          // Externalize all dependencies and peer dependencies
          return !id.startsWith('.') && !id.startsWith('/') && !id.startsWith('\0');
        },
        input,
        output: {
          // Preserve entry-relative paths; our CSS entries are named 'kit/themes/<name>'
          // so this will emit CSS to 'dist/kit/themes/<name>.css'
          assetFileNames: '[name][extname]',
          // Ensure index builds to dist/index.js; theme JS stubs placed next to CSS
          entryFileNames: (chunkInfo: { name: string }) =>
            chunkInfo.name === 'index' ? 'index.js' : '[name].js',
          chunkFileNames: 'chunks/[name].js',
        },
      },
      cssCodeSplit: true,
    },
    test: {
      name: 'universe-react-kit',
      watch: false,
      globals: true,
      environment: 'jsdom',
      include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      reporters: ['default'],
      coverage: {
        reportsDirectory: './test-output/vitest/coverage',
        provider: 'v8' as const,
      },
    },
  };
});
