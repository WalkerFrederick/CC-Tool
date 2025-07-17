import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import '../../global.css';

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
  return (
    <View className={`${className}`}>
      <View className="flex-row items-center justify-between bg-slate-100 border-b border-gray-200 px-4 py-4">
      <Image 
            source={require('../../assets/CC.png')} 
            className="w-12 h-12"
            resizeMode="contain"
          />
        {/* Title Section with Logo - Centered */}
          
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold text-gray-800">CC Tool</Text>
            {subtitle && <Text className="text-md text-gray-600">{title}</Text>}
          </View>

        {/* Right Action */}
        <View className="w-12 h-12 items-center justify-center">
          {rightAction ? (
            <TouchableOpacity
              onPress={rightAction.onPress}
              className="h-12 w-12 items-center justify-center bg-gray-200 rounded-lg border border-gray-300">
              <Ionicons name={rightAction.icon as any} size={24} color="#374151" />
            </TouchableOpacity>
          ) : (
            <View className="h-12 w-12" />
          )}
        </View>
      </View>
    </View>
  );
};
