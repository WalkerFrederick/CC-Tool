import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components/Header';
import { Ionicons } from '@expo/vector-icons';
import { PrinterCard } from '~/components/PrinterCard';
import { useState } from 'react';
import { WebView } from 'react-native-webview';

export const PrinterDetailsScreen = ({ navigation }: any) => {
  const [isLightOn, setIsLightOn] = useState(false);
  const [printStatus, setPrintStatus] = useState<'printing' | 'paused'>('printing');

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handlePrintControl = () => {
    setPrintStatus(prev => prev === 'printing' ? 'paused' : 'printing');
  };

  const handleStopPrint = () => {
    setPrintStatus('printing'); // Reset to printing state when stopped
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-slate-100">
      <Header title="Printer Details" subtitle="View printer information" />
      <ScrollView className="flex-1 bg-slate-200">
        <View className="p-2">
          {/* Back Button */}
          <TouchableOpacity 
            className="flex-row items-center mb-2 p-2"
            onPress={handleBackPress}
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
            <Text className="ml-2 text-gray-700 font-medium">BACK</Text>
          </TouchableOpacity>

          {/* Video Stream WebView */}
          <View className="bg-gray-800 rounded-lg mb-2 w-full overflow-hidden" style={{ aspectRatio:16/9}}>
            <WebView
              source={{ uri: '' }}
              style={{ 
                flex: 1, 
                backgroundColor: 'transparent',
                margin: 0,
                padding: 0
              }}
              javaScriptEnabled={false}
              domStorageEnabled={false}
              scalesPageToFit={true}
              allowsInlineMediaPlayback={true}
              mediaPlaybackRequiresUserAction={false}
              onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.warn('WebView error: ', nativeEvent);
              }}
              onHttpError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.warn('WebView HTTP error: ', nativeEvent);
              }}
            />
          </View>

          {/* Main Printer Card */}
          <PrinterCard 
            showTemps={false} 
            lastUpdate='3s ago'
            showPrintControls={true}
            printStatus={printStatus}
            onPrintControl={handlePrintControl}
            onStopPrint={handleStopPrint}
          />
        {/* Printer Controls Card */}
        <View className="bg-white rounded-lg border border-gray-300 p-4 mb-4 mt-2">
            <Text className="text-xl font-bold text-gray-800 mb-4">CONTROLS</Text>
          {/* Light Toggle */}
          <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <View className="flex-row items-center">
              <Ionicons 
                name={isLightOn ? "bulb" : "bulb-outline"} 
                size={24} 
                color={isLightOn ? "#3B82F6" : "#6B7280"} 
              />
              <Text className="ml-3 text-gray-800 font-semibold text-lg">Printer Light</Text>
            </View>
            <Switch
              value={isLightOn}
              onValueChange={setIsLightOn}
              trackColor={{ false: "#D1D5DB", true: "#DBEAFE" }}
              thumbColor={isLightOn ? "#3B82F6" : "#9CA3AF"}
            />
          </View>
        </View>

 

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}; 