import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

interface Theme {
  background: string;
  surface: string;
  primary: string;
  primaryDark: string;
  text: string;
  textSecondary: string;
  border: string;
  overlay: string;
  scoreboardBg: string;
  headerBg: string;
  headerTint: string;
}

const lightTheme: Theme = {
  background: '#F8F9FA',
  surface: '#FFF',
  primary: '#4A90D9',
  primaryDark: '#357ABD',
  text: '#333',
  textSecondary: '#666',
  border: '#DDD',
  overlay: 'rgba(0,0,0,0.5)',
  scoreboardBg: '#F5F5F5',
  headerBg: '#4A90D9',
  headerTint: '#FFF',
};

const darkTheme: Theme = {
  background: '#1A1A2E',
  surface: '#16213E',
  primary: '#4A90D9',
  primaryDark: '#357ABD',
  text: '#E0E0E0',
  textSecondary: '#A0A0A0',
  border: '#333',
  overlay: 'rgba(0,0,0,0.7)',
  scoreboardBg: '#1F1F3A',
  headerBg: '#0F3460',
  headerTint: '#FFF',
};

interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: lightTheme,
  isDark: false,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  const value = useMemo(() => ({ theme, isDark }), [isDark]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
