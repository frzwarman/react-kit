/// <reference types="vite/client" />
import React from 'react';
import type { Preview, Decorator } from '@storybook/react';
import '../src/index.css';

declare global {
  interface Window {
    __sbThemeListener?: (e: MediaQueryListEvent) => void;
    __sbThemeMql?: MediaQueryList;
  }
}

function applyThemeMode(useDark: boolean) {
  const html = document.documentElement;
  const body = document.body;
  html.classList.toggle('dark', useDark);
  body.classList.toggle('dark', useDark);
  const mode = useDark ? 'dark' : 'light';
  html.setAttribute('data-theme', mode);
  body.setAttribute('data-theme', mode);
}

// Dynamically import source theme CSS so Vite + @tailwindcss/vite process it
const themeModules = (
  import.meta as unknown as { glob: (p: string) => Record<string, () => Promise<unknown>> }
).glob('../src/kit/themes/*.css');

function findThemeNode(name: string): HTMLStyleElement | HTMLLinkElement | null {
  const suffix = `/src/kit/themes/${name}.css`;
  // Vite dev: <style data-vite-dev-id=".../src/kit/themes/<name>.css">
  const styles = document.querySelectorAll<HTMLStyleElement>('style[data-vite-dev-id]');
  for (const s of Array.from(styles)) {
    const id = s.getAttribute('data-vite-dev-id') || '';
    if (id.endsWith(suffix)) return s;
  }
  // Vite prod (or CSS extracted): <link rel="stylesheet" href="...<name>.css">
  const links = document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"][href]');
  for (const l of Array.from(links)) {
    const href = l.getAttribute('href') || '';
    if (href.includes(`${name}.css`)) return l;
  }
  return null;
}

function bumpToTop(node: Element | null) {
  if (!node) return;
  // Move to the end of head so its declarations win the cascade
  document.head.appendChild(node);
}

function applyThemeStyle(themeStyle: string) {
  const name = themeStyle;
  const key = `../src/kit/themes/${name}.css` as const;
  const loader = (themeModules as Record<string, () => Promise<unknown>>)[key];
  if (loader) {
    // Fire-and-forget to keep decorator synchronous; then reorder once present
    void loader();
    // Reorder after the style/link has been injected by Vite
    setTimeout(() => {
      bumpToTop(findThemeNode(name));
    }, 0);
  } else {
    // If not in the glob (e.g., typo), try to reorder any existing node anyway
    setTimeout(() => {
      bumpToTop(findThemeNode(name));
    }, 0);
  }
}

// Bootstrap: apply stored theme stylesheet as early as possible
let __initialThemeStyle = 'default';
try {
  __initialThemeStyle = localStorage.getItem('sb-theme-style') || 'default';
  applyThemeStyle(__initialThemeStyle);
} catch (_e) {
  // ignore localStorage access errors (e.g., sandboxed iframes)
}

const preview: Preview = {
  initialGlobals: {
    // Keep the toolbar in sync with the stored selection on load
    themeStyle: __initialThemeStyle,
  },
  globalTypes: {
    theme: {
      name: 'Theme Mode',
      description: 'Global theme mode for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'sun',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'system', title: 'System' },
        ],
        dynamicTitle: true,
      },
    },
    themeStyle: {
      name: 'Theme Style',
      description: 'Global theme style for components',
      defaultValue: 'default',
      toolbar: {
        icon: 'starhollow',
        items: [
          { value: 'default', title: 'Default' },
          { value: 'minimal-modern', title: 'Minimal Modern' },
          { value: 'spotify', title: 'Spotify'},
          { value: 'clean-slate', title: 'Clean Slate'},
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    layout: 'fullscreen',
    docs: {
      autodocs: true,
      codePanel: true,
      source: {
        codePanel: true,
      }
    },
    // Let our CSS variables control the canvas background
    backgrounds: { disable: true },
  },
  decorators: [
    ((Story, context) => {
      const theme =
        (context.globals.theme as 'light' | 'dark' | 'system') ?? 'system';
      const themeStyle = (context.globals.themeStyle as string) ?? 'default';
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      // Remove any previous listener if it exists when switching away from system
      const g = window;
      if (g.__sbThemeListener && g.__sbThemeMql && theme !== 'system') {
        g.__sbThemeMql.removeEventListener('change', g.__sbThemeListener);
        g.__sbThemeListener = undefined;
        g.__sbThemeMql = undefined;
      }

      const prefersDark = mql.matches;
      const shouldUseDark =
        theme === 'dark' || (theme === 'system' && prefersDark);
      applyThemeMode(shouldUseDark);
      // If user changed toolbar, persist and ensure CSS is queued to load
      try {
        const stored = localStorage.getItem('sb-theme-style') || 'default';
        if (stored !== themeStyle) {
          localStorage.setItem('sb-theme-style', themeStyle);
          applyThemeStyle(themeStyle);
        }
      } catch (_e) {
        // ignore localStorage access errors (e.g., sandboxed iframes)
      }

      // When on system, react to OS theme changes once per session
      if (theme === 'system' && !g.__sbThemeListener) {
        const onChange = (e: MediaQueryListEvent) => {
          applyThemeMode(e.matches);
        };
        mql.addEventListener('change', onChange);
        g.__sbThemeListener = onChange;
        g.__sbThemeMql = mql;
      }
      // Ensure preview area always uses our theme background/text
      // Center by default in story mode, but allow stories to opt-out with parameters.centered === false
      const isDocs = context.viewMode === 'docs';
      const shouldCenter = !isDocs && context.parameters?.centered !== false;
      const wrapperClass = isDocs
        ? 'bg-background text-foreground w-full'
        : shouldCenter
        ? 'bg-background text-foreground min-h-screen flex items-center justify-center overflow-y-auto'
        : 'bg-background text-foreground min-h-screen overflow-y-auto';
      const StoryComponent = Story as unknown as React.ComponentType;
      return React.createElement(
        'div',
        { className: wrapperClass },
        React.createElement(StoryComponent)
      );
    }) as Decorator,
  ],
};

export default preview;
