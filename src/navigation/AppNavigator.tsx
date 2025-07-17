import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen, SettingsScreen } from '../screens';
import { PrinterDetailsScreen } from '../screens/PrinterDetailsScreen';
import { AddEditPrinterScreen } from '../screens/AddEditPrinterScreen';
import PrinterIcon from '../components/icons/PrinterIcon';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const PrintersStackNavigator = () => (
  <Stack.Navigator 
    screenOptions={{ 
      headerShown: false, 
      animation: 'none'
    }}
  >
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="PrinterDetails" component={PrinterDetailsScreen} />
    <Stack.Screen name="AddEditPrinter" component={AddEditPrinterScreen} />
  </Stack.Navigator>
);

export const AppNavigator = () => {
  return (
    <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              if (route.name === 'Printers') {
                return <PrinterIcon variant={focused ? 'filled' : 'outline'} size={size} color={color} />;
              } else if (route.name === 'Settings') {
                return <Ionicons name={focused ? 'settings' : 'settings-outline'} size={size} color={color} />;
              } else {
                return <Ionicons name="help-outline" size={size} color={color} />;
              }
            },
            tabBarActiveTintColor: '#3B82F6',
            tabBarInactiveTintColor: '#9CA3AF',
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#f1f5f9',
              borderTopColor: '#E5E7EB',
              borderTopWidth: 1,
              paddingBottom: 5,
              paddingTop: 5,
              height: 80,
            },
          })}>
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
    </NavigationContainer>
  );
};
