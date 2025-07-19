import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colorScheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [theme, _setTheme] = useState<Theme>('system');

  useEffect(() => {
    const getTheme = async () => {
      try {
        const savedTheme = (await AsyncStorage.getItem(
          'theme'
        )) as Theme | null;
        if (savedTheme) {
          _setTheme(savedTheme);
        }
      } catch (e) {
        console.error('Failed to load theme from storage', e);
      }
    };

    getTheme();
  }, []);

  useEffect(() => {
    if (theme === 'system') {
      setColorScheme(Appearance.getColorScheme() ?? 'light');
    } else {
      setColorScheme(theme);
    }
  }, [theme, setColorScheme]);

  const setTheme = async (newTheme: Theme) => {
    try {
      await AsyncStorage.setItem('theme', newTheme);
      _setTheme(newTheme);
    } catch (e) {
      console.error('Failed to save theme to storage', e);
    }
  };

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, colorScheme: colorScheme as 'light' | 'dark' }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
