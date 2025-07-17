import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components/Header';
import { Ionicons } from '@expo/vector-icons';

export const SettingsScreen = () => {
  const [currentTheme, setCurrentTheme] = useState('Light');

  const handleThemePress = () => {
    Alert.alert(
      'Select Theme',
      'Choose your preferred theme',
      [
        {
          text: 'Light',
          onPress: () => setCurrentTheme('Light'),
        },
        {
          text: 'Dark',
          onPress: () => setCurrentTheme('Dark'),
        },
        {
          text: 'Auto',
          onPress: () => setCurrentTheme('Auto'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-slate-100">
      <Header title="Settings" subtitle="Manage your preferences" />
      <ScrollView
        className="flex-1 bg-slate-200"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}>
        <View className="px-2 py-2">
          <View className="space-y-2">
            <TouchableOpacity
              className="flex-row items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
              onPress={handleThemePress}
            >
              <View className="flex-row items-center">
                <Ionicons name="moon" size={24} color="#6B7280" />
                <View className="ml-3">
                  <Text className="font-medium text-gray-800">Theme</Text>
                  <Text className="text-sm text-gray-500">Light mode / Dark mode</Text>
                </View>
              </View>
              <View className="flex-row items-center">
                <Text className="text-gray-500 mr-2">{currentTheme}</Text>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
              <View className="flex-row items-center">
                <Ionicons name="logo-github" size={24} color="#6B7280" />
                <View className="ml-3">
                  <Text className="font-medium text-gray-800">Github</Text>
                  <Text className="text-sm text-gray-500">View Source and Contribute</Text>
                </View>
              </View>
              <Ionicons name="link" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
              <View className="flex-row items-center">
                <Ionicons name="document-text" size={24} color="#6B7280" />
                <View className="ml-3">
                  <Text className="font-medium text-gray-800">License</Text>
                  <Text className="text-sm text-gray-500">MIT License</Text>
                </View>
              </View>
              <Ionicons name="link" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <View className="flex-row items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
              <View className="flex-row items-center">
                <Ionicons name="information-circle" size={24} color="#6B7280" />
                <View className="ml-3">
                  <Text className="font-medium text-gray-800">App Version</Text>
                  <Text className="text-sm text-gray-500">V1.0.0</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
