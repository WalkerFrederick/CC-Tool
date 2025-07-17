import React, { useState, useCallback } from 'react';
import { View, ScrollView, RefreshControl, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components/Header';
import { PrinterCard } from '../components/PrinterCard';

export const HomeScreen = ({ navigation }: any) => {
  const [refreshing, setRefreshing] = useState(false);
  const [printerCount, setPrinterCount] = useState(2);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPrinterCount(prev => (prev < 5 ? prev + 1 : prev));
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handlePrinterPress = () => {
    navigation.navigate('PrinterDetails');
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-slate-100">
      <Header
        title="Printers"
        subtitle="Manage your printers"
        rightAction={{
          icon: 'add',
          onPress: () => navigation.navigate('AddEditPrinter'),
        }}
      />
      <ScrollView
        className="flex-1 bg-slate-200"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {printerCount === 0 ? (
          // Getting Started Card
          <View className="flex-1 items-center justify-center p-6">
            <View className="bg-white rounded-lg p-8 border border-gray-300 max-w-sm w-full">
              <View className="items-center mb-6">
                <View className="w-32 h-32 bg-blue-100 rounded-full items-center justify-center mb-12 mt-6">
                  <Image 
                    source={require('../../assets/CC.png')} 
                    className="w-20 h-20"
                    resizeMode="contain"
                  />
                </View>
                <Text className="text-4xl font-bold text-gray-800 mb-4 text-center">Getting Started</Text>
                <Text className="text-gray-600 text-center leading-6">
                  Get started by adding your first printer to monitor your prints.
                </Text>
              </View>
              
              <TouchableOpacity
                className="bg-blue-500 rounded-lg py-4 px-6 items-center mt-4"
                onPress={() => navigation.navigate('AddEditPrinter')}
              >
                <Text className="text-white font-bold text-lg">ADD PRINTER</Text>
              </TouchableOpacity>
              
            </View>
          </View>
        ) : (
          // Printer Cards
          <>
            {Array.from({ length: printerCount }).map((_, idx) => (
              <View className="w-full p-2" key={idx}>
                <PrinterCard 
                  onPress={handlePrinterPress}
                />
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
