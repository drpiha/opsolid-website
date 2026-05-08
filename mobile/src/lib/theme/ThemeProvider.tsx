import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { getTheme } from './tokens';
import type { ThemeTokens } from './tokens';
import { useThemeStore } from './themeStore';

const ThemeContext = createContext<ThemeTokens | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const mode = useThemeStore((s) => s.mode);
  // useColorScheme must always be called (rules of hooks); we only consult
  // its return value when the user picked 'system'.
  const osScheme = useColorScheme();

  const resolved: 'light' | 'dark' =
    mode === 'system' ? (osScheme === 'dark' ? 'dark' : 'light') : mode;

  const theme = getTheme(resolved);
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeTokens {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
