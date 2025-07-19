import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import '../../global.css';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
  leftAction?: {
    icon: string;
    onPress: () => void;
  };
  rightAction?: {
    icon: string;
    onPress: () => void;
  };
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  rightAction,
  className = '',
}) => {
  const { colorScheme } = useTheme();
  return (
    <View className={`${className}`}>
      <View className="flex-row items-center justify-between bg-slate-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <Image
          source={require('../../assets/CC.png')}
          className="w-12 h-12"
          resizeMode="contain"
        />
        {/* Title Section with Logo - Centered */}

        <View className="flex-1 items-center">
          <Text className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            CC Tool
          </Text>
          {subtitle && (
            <Text className="text-md text-gray-600 dark:text-gray-400">
              {title}
            </Text>
          )}
        </View>

        {/* Right Action */}
        <View className="w-12 h-12 items-center justify-center">
          {rightAction ? (
            <TouchableOpacity
              onPress={rightAction.onPress}
              className="h-12 w-12 items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600"
            >
              <Ionicons
                name={rightAction.icon as any}
                size={24}
                color={colorScheme === 'dark' ? '#D1D5DB' : '#374151'}
              />
            </TouchableOpacity>
          ) : (
            <View className="h-12 w-12" />
          )}
        </View>
      </View>
    </View>
  );
};
