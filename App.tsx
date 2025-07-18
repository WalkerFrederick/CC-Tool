import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation/AppNavigator';
import * as NavigationBar from 'expo-navigation-bar';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { PrinterConnectionsProvider } from './src/contexts/PrinterConnectionsContext';
import { Platform } from 'react-native';

import './global.css';

function AppContent() {
  const { colorScheme } = useTheme();
  
  const MyDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#111827',
      card: '#1f2937',
      text: '#f9fafb',
      border: '#374151',
    },
  };

  const MyLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#f1f5f9',
      card: '#ffffff',
      text: '#111827',
      border: '#e5e7eb',
    },
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      // Set Android navigation bar color to match app background
      const barColor = colorScheme === 'dark' ? '#111827' : '#f1f5f9';
      NavigationBar.setBackgroundColorAsync(barColor);
      NavigationBar.setButtonStyleAsync(colorScheme === 'dark' ? 'light' : 'dark');
    }
  }, [colorScheme]);

  return (
    <>
      <NavigationContainer theme={colorScheme === 'dark' ? MyDarkTheme : MyLightTheme}>
        <AppNavigator />
      </NavigationContainer>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PrinterConnectionsProvider>
        <AppContent />
      </PrinterConnectionsProvider>
    </ThemeProvider>
  );
}
