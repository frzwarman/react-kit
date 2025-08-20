import { createContext, use, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );

  // On first mount, if there is no saved preference or it's 'system' and
  // the app provides a concrete default (e.g., 'light'), apply it.
  useEffect(() => {
    const stored = localStorage.getItem(storageKey) as Theme | null;
    if ((!stored || stored === 'system') && defaultTheme !== 'system') {
      localStorage.setItem(storageKey, defaultTheme);
      setTheme(defaultTheme);
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;
    const app = window.document.getElementById('app');
    root.classList.remove('light', 'dark');
    body.classList.remove('light', 'dark');
    app?.classList.remove('light', 'dark');

    const resolved = (() => {
      if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
      }
      return theme;
    })();

    root.classList.add(resolved);
    body.classList.add(resolved);
    app?.classList.add(resolved);
    root.style.colorScheme = resolved;
    // Important for Tailwind v4 @theme dark support
    root.setAttribute('data-theme', resolved);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext {...props} value={value}>
      {children}
    </ThemeProviderContext>
  );
}

export const useTheme = () => {
  const context = use(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
