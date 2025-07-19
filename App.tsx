import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { PrinterConnectionsProvider } from './src/contexts/PrinterConnectionsContext';
import WelcomeScreen from './src/screens/WelcomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';

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
      const barColor = colorScheme === 'dark' ? '#111827' : '#f1f5f9';
      NavigationBar.setBackgroundColorAsync(barColor);
      NavigationBar.setButtonStyleAsync(
        colorScheme === 'dark' ? 'light' : 'dark'
      );
    }
  }, [colorScheme]);

  return (
    <NavigationContainer
      theme={colorScheme === 'dark' ? MyDarkTheme : MyLightTheme}
    >
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <AppNavigator />
    </NavigationContainer>
  );
}

function AppLogic() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        if (hasLaunched === null) {
          setShowWelcome(true);
        }
      } catch (error) {
        console.error('Failed to load launch status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkFirstLaunch();
  }, []);

  const handleWelcomeComplete = async () => {
    try {
      await AsyncStorage.setItem('hasLaunched', 'true');
      setShowWelcome(false);
    } catch (error) {
      console.error('Failed to save launch status:', error);
    }
  };

  if (isLoading) {
    return null; // or a loading spinner
  }

  if (showWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }

  return (
    <PrinterConnectionsProvider>
      <AppContent />
    </PrinterConnectionsProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppLogic />
    </ThemeProvider>
  );
}
