import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation/AppNavigator';
import * as NavigationBar from 'expo-navigation-bar';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { NavigationContainer } from '@react-navigation/native';

import './global.css';

function AppContent() {
  const { colorScheme } = useTheme();

  useEffect(() => {
    // Set Android navigation bar color to match app background
    const barColor = colorScheme === 'dark' ? '#111827' : '#f1f5f9';
    NavigationBar.setBackgroundColorAsync(barColor);
    NavigationBar.setButtonStyleAsync(colorScheme === 'dark' ? 'light' : 'dark');
  }, [colorScheme]);

  return (
    <>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
