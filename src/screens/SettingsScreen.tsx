import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components/Header';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

export const SettingsScreen = () => {
  const { theme, setTheme } = useTheme();

  const handleThemePress = () => {
    Alert.alert('Select Theme', 'Choose your preferred theme', [
      {
        text: 'Light',
        onPress: () => setTheme('light'),
      },
      {
        text: 'Dark',
        onPress: () => setTheme('dark'),
      },
      {
        text: 'System',
        onPress: () => setTheme('system'),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const handleGitHubPress = async () => {
    const url = 'https://github.com/WalkerFrederick/CC-Tool';
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open GitHub link');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open GitHub link');
    }
  };

  const handleReportIssuesPress = async () => {
    const url = 'https://github.com/WalkerFrederick/CC-Tool/issues';
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open GitHub Issues link');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open GitHub Issues link');
    }
  };

  const handleResetWelcomeFlow = () => {
    Alert.alert(
      'Reset Welcome Flow',
      'Are you sure you want to reset the welcome flow? You will see it again the next time you open the app.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('hasLaunched');
              Alert.alert('Success', 'The welcome flow has been reset.');
            } catch (error) {
              Alert.alert('Error', 'Failed to reset the welcome flow.');
            }
          },
        },
      ]
    );
  };

  const handleLicensePress = async () => {
    const url = 'https://github.com/WalkerFrederick/CC-Tool/blob/main/LICENSE';
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open license link');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open license link');
    }
  };

  return (
    <SafeAreaView
      edges={['top']}
      className="flex-1 bg-slate-100 dark:bg-gray-900"
    >
      <Header title="Settings" subtitle="Manage your preferences" />
      <ScrollView
        className="flex-1 bg-slate-200 dark:bg-gray-800"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="px-2 py-2">
          <View className="space-y-2">
            <TouchableOpacity
              className="flex-row items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4"
              onPress={handleThemePress}
            >
              <View className="flex-row items-center">
                <Ionicons name="moon" size={24} color="#6B7280" />
                <View className="ml-3">
                  <Text className="font-medium text-gray-800 dark:text-gray-200">
                    Theme
                  </Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400">
                    Light mode / Dark mode
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center">
                <Text className="text-gray-500 dark:text-gray-400 mr-2 capitalize">
                  {theme}
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4"
              onPress={handleResetWelcomeFlow}
            >
              <View className="flex-row items-center">
                <Ionicons name="refresh-outline" size={24} color="#6B7280" />
                <View className="ml-3">
                  <Text className="font-medium text-gray-800 dark:text-gray-200">
                    Reset Welcome Flow
                  </Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400">
                    Show the welcome screen on next launch
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4"
              onPress={handleGitHubPress}
            >
              <View className="flex-row items-center">
                <Ionicons name="logo-github" size={24} color="#6B7280" />
                <View className="ml-3">
                  <Text className="font-medium text-gray-800 dark:text-gray-200">
                    Github
                  </Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400">
                    View Source and Contribute
                  </Text>
                </View>
              </View>
              <Ionicons name="link" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4"
              onPress={handleReportIssuesPress}
            >
              <View className="flex-row items-center">
                <Ionicons name="bug-outline" size={24} color="#6B7280" />
                <View className="ml-3">
                  <Text className="font-medium text-gray-800 dark:text-gray-200">
                    Report Issues
                  </Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400">
                    Report bugs and request features
                  </Text>
                </View>
              </View>
              <Ionicons name="link" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4"
              onPress={handleLicensePress}
            >
              <View className="flex-row items-center">
                <Ionicons name="document-text" size={24} color="#6B7280" />
                <View className="ml-3">
                  <Text className="font-medium text-gray-800 dark:text-gray-200">
                    License
                  </Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400">
                    MIT License
                  </Text>
                </View>
              </View>
              <Ionicons name="link" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <View className="flex-row items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
              <View className="flex-row items-center">
                <Ionicons name="information-circle" size={24} color="#6B7280" />
                <View className="ml-3">
                  <Text className="font-medium text-gray-800 dark:text-gray-200">
                    App Version
                  </Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400">
                    V{Constants.expoConfig?.version || '1.0.1'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Disclaimer */}
            <View className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <View className="flex-row items-start">
                <Ionicons
                  name="warning-outline"
                  size={20}
                  color="#D97706"
                  className="mt-0.5"
                />
                <Text className="ml-2 text-sm text-yellow-800 dark:text-yellow-200 leading-5">
                  This is an unofficial companion app for some SDCP-based
                  printers. We are not associated with any manufacturers.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
