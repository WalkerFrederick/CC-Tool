import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';

interface PrinterCardProps {
  onPress?: () => void;
  showTemps?: boolean;
  lastUpdate?: string;
  printStatus?: 'printing' | 'paused';
  onPrintControl?: () => void;
  onStopPrint?: () => void;
  showPrintControls?: boolean;
}

export const PrinterCard = ({ 
  onPress, 
  showTemps = true, 
  lastUpdate, 
  printStatus,
  onPrintControl,
  onStopPrint,
  showPrintControls = false 
}: PrinterCardProps) => (
  <TouchableOpacity
    className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 pb-0"
    onPress={onPress}
    activeOpacity={onPress ? 0.7 : 1}
  >
    <View className="flex-row justify-between gap-4">
      <View className="flex flex-1 justify-between">
        <View className="mt-1 w-full flex-row items-center justify-between">
          <Text className="text-xl font-bold text-gray-800 dark:text-gray-200">RED</Text>
          {onPress ? (
            <View className="flex-row items-center">
              <Text className="text-sm font-light text-gray-600 dark:text-gray-400 mr-1">View Printer</Text>
              <Ionicons name="chevron-forward" size={16} color="#4b5563" />
            </View>
          ) : lastUpdate ? (
            <Text className="text-sm text-gray-500 dark:text-gray-400">Last update: {lastUpdate}</Text>
          ) : null}
        </View>
        <View className="mt-1 w-full flex-row items-center">
          <Text className="text-md flex-1 text-gray-600 dark:text-gray-400">192.168.1.100</Text>
          <Text className="text-md ml-2 text-right font-semibold text-emerald-500">CONNECTED</Text>
        </View>
      </View>
    </View>
    
    {showTemps && (
      <View className="mt-4 flex-row justify-between">
        <View className="flex-1 items-center py-4 border-l border-gray-200 dark:border-gray-700">
          <Ionicons name="thermometer" size={24} color="#4b5563" className="mb-2" />
          <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200">30°C</Text>
          <Text className="text-sm font-light text-gray-600 dark:text-gray-400">BED</Text>
        </View>
        <View className="flex-1 items-center border-l border-r border-gray-200 dark:border-gray-700 py-4">
          <Ionicons name="thermometer" size={24} color="#4b5563" className="mb-2" />
          <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200">30°C</Text>
          <Text className="text-sm font-light text-gray-600 dark:text-gray-400">BED</Text>
        </View>
        <View className="flex-1 items-center py-4 border-r border-gray-200 dark:border-gray-700">
          <Ionicons name="thermometer" size={24} color="#4b5563" className="mb-2" />
          <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200">30°C</Text>
          <Text className="text-sm font-light text-gray-600 dark:text-gray-400">BED</Text>
        </View>
      </View>
    )}
    
    {/* Print Status Section */}
    <View className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 mt-4">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-gray-800 dark:text-gray-200">Printing</Text>
        {showPrintControls && onPrintControl && (
          <View className="flex-row gap-2">
            {printStatus === 'paused' && onStopPrint && (
              <TouchableOpacity 
                onPress={onStopPrint}
                className="p-2 rounded-full bg-red-100 dark:bg-red-900/50"
                activeOpacity={0.7}
              >
                <Ionicons 
                  name="stop" 
                  size={20} 
                  color="#EF4444" 
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              onPress={onPrintControl}
              className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50"
              activeOpacity={0.7}
            >
              <Ionicons 
                name={
                  printStatus === 'printing' ? 'pause' : 
                  printStatus === 'paused' ? 'play' : 
                  'play'
                } 
                size={20} 
                color="#3B82F6" 
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Text className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Printing layer 45/120</Text>
      <Progress.Bar
        progress={0.375}
        width={null}
        height={8}
        color="#3B82F6"
        unfilledColor="#E5E7EB"
        borderWidth={0}
        borderRadius={4}
      />
      <Text className="text-sm text-gray-600 dark:text-gray-400 mt-2">37.5% Complete</Text>
    </View>
  </TouchableOpacity>
); 