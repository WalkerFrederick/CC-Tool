import { ScreenContent } from 'components/ScreenContent';
import { StatusBar } from 'expo-status-bar';

import './global.css';
import { View, Text } from 'react-native';

export default function App() {
  return (
    <>
      <ScreenContent title="Home" path="App.tsx"></ScreenContent>
      <StatusBar style="auto" />
    </>
  );
}
