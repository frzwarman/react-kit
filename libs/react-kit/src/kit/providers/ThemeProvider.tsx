import { createContext, use, useEffect } from 'react';
import {
  ThemeProvider as NextThemesProvider,
  useTheme as useNextThemes,
} from 'next-themes';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme; // maps to next-themes defaultTheme
  storageKey?: string; // maps to next-themes storageKey
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
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme}
      storageKey={storageKey}
      enableSystem
      disableTransitionOnChange
    >
      <ThemeBridge {...props}>{children}</ThemeBridge>
    </NextThemesProvider>
  );
}

function ThemeBridge({ children, ...props }: { children: React.ReactNode }) {
  const { theme, resolvedTheme, setTheme } = useNextThemes();

  // Mirror resolved theme to data-theme and color-scheme for CSS/Tailwind consumers
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const body = document.body;
    const app = document.getElementById('app');
    const resolved = (resolvedTheme as 'light' | 'dark') ?? 'light';

    // data-theme + color-scheme for CSS variables and form controls
    root.setAttribute('data-theme', resolved);
    root.style.colorScheme = resolved;

    // Ensure class-based dark mode works across html, body, and #app
    const opposite = resolved === 'dark' ? 'light' : 'dark';
    root.classList.remove(opposite);
    body.classList.remove(opposite);
    app?.classList.remove(opposite);
    root.classList.add(resolved);
    body.classList.add(resolved);
    app?.classList.add(resolved);
  }, [resolvedTheme]);

  const value: ThemeProviderState = {
    theme: (theme as Theme) ?? 'system',
    setTheme: (t: Theme) => setTheme(t),
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
