import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen, SettingsScreen } from '../screens';
import { PrinterDetailsScreen } from '../screens/PrinterDetailsScreen';
import { AddEditPrinterScreen } from '../screens/AddEditPrinterScreen';
import WhereIsIpScreen from '../screens/WhereIsIpScreen';
import PrinterIcon from '../components/icons/PrinterIcon';
import { useTheme } from '../contexts/ThemeContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const PrintersStackNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: 'none',
    }}
  >
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="PrinterDetails" component={PrinterDetailsScreen} />
    <Stack.Screen name="AddEditPrinter" component={AddEditPrinterScreen} />
    <Stack.Screen name="WhereIsIp" component={WhereIsIpScreen} />
  </Stack.Navigator>
);

export const AppNavigator = () => {
  const { colorScheme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Printers') {
            return (
              <PrinterIcon
                variant={focused ? 'filled' : 'outline'}
                size={size}
                color={color}
              />
            );
          } else if (route.name === 'Settings') {
            return (
              <Ionicons
                name={focused ? 'settings' : 'settings-outline'}
                size={size}
                color={color}
              />
            );
          } else {
            return <Ionicons name="help-outline" size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#111827' : '#f1f5f9',
          paddingBottom: 5,
          paddingTop: 5,
          height: 80,
        },
      })}
    >
      <Tab.Screen
        name="Printers"
        component={PrintersStackNavigator}
        options={{
          title: 'Printers',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
};
