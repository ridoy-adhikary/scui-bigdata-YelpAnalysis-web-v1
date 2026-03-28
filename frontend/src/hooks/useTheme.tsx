import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'yelp-analysis-theme';

const getSystemTheme = (): ResolvedTheme =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const resolveTheme = (mode: ThemeMode): ResolvedTheme => {
  if (mode === 'system') return getSystemTheme();
  return mode;
};

const applyDocumentTheme = (theme: ResolvedTheme) => {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.setAttribute('data-theme', theme);
};

const getInitialMode = (): ThemeMode => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark' || saved === 'system') {
    return saved;
  }
  return 'system';
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => getInitialMode());
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => resolveTheme(getInitialMode()));

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const update = () => {
      const nextTheme = resolveTheme(mode);
      setResolvedTheme(nextTheme);
      applyDocumentTheme(nextTheme);
    };

    update();
    media.addEventListener('change', update);

    return () => {
      media.removeEventListener('change', update);
    };
  }, [mode]);

  const setMode = (nextMode: ThemeMode) => {
    setModeState(nextMode);
    localStorage.setItem(STORAGE_KEY, nextMode);
  };

  const toggleTheme = () => {
    setMode(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const value = useMemo(
    () => ({
      mode,
      resolvedTheme,
      setMode,
      toggleTheme,
    }),
    [mode, resolvedTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

