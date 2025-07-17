import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation/AppNavigator';
import * as NavigationBar from 'expo-navigation-bar';

import './global.css';

export default function App() {
  useEffect(() => {
    // Set Android navigation bar color to match app background
    NavigationBar.setBackgroundColorAsync('#f1f5f9');
    NavigationBar.setButtonStyleAsync('dark');
  }, []);

  return (
    <>
      <AppNavigator />
      <StatusBar style="dark" />
    </>
  );
}
