import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components/Header';
import { PrinterCard } from '../components/PrinterCard';
import { usePrinterConnections } from '../contexts/PrinterConnectionsContext';
import { Ionicons } from '@expo/vector-icons';
import { checkLocalNetworkAccess } from '@generac/react-native-local-network-permission';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const HomeScreen = ({ navigation }: any) => {
  const [refreshing, setRefreshing] = useState(false);
  const [hasNetworkAccess, setHasNetworkAccess] = useState(true);
  const [showSurvey, setShowSurvey] = useState(true);
  const { printers, reconnectAll, removePrinter } = usePrinterConnections();

  // Check local network access when component mounts
  const checkNetworkAccess = async () => {
    const hasAccess = await checkLocalNetworkAccess();
    setHasNetworkAccess(hasAccess);
  };

  const handleSurveyPress = async () => {
    const url =
      'https://docs.google.com/forms/d/e/1FAIpQLSfGm5E6OpePT1nECJaQ_uffvfMTWsw4JDxzsDC6T8nNyjVoww/viewform?usp=header';
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open survey link');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open survey link');
    }
  };

  const handleDismissSurvey = async () => {
    try {
      await AsyncStorage.setItem('surveyDismissed', 'true');
      setShowSurvey(false);
    } catch (error) {
      console.error('Failed to save survey dismissal state:', error);
      // Still hide the survey even if saving fails
      setShowSurvey(false);
    }
  };
  useEffect(() => {
    const loadSurveyState = async () => {
      try {
        const surveyDismissed = await AsyncStorage.getItem('surveyDismissed');
        if (surveyDismissed === 'true') {
          setShowSurvey(false);
        }
      } catch (error) {
        console.error('Failed to load survey state:', error);
      }
    };

    checkNetworkAccess();
    loadSurveyState();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    reconnectAll();
    checkNetworkAccess();
    // Keep the timeout to give visual feedback on the refresh control
    setTimeout(() => setRefreshing(false), 1000);
  }, [reconnectAll]);

  const handlePrinterPress = (printerId: string) => {
    const printer = printers.find(p => p.id === printerId);
    if (printer?.connectionStatus === 'connected') {
      navigation.navigate('PrinterDetails', { printerId });
    } else {
      Alert.alert(
        'Printer Offline',
        `${printer?.printerName} is not connected. What would you like to do?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete Printer',
            style: 'destructive',
            onPress: () => {
              Alert.alert(
                'Delete Printer',
                `Are you sure you want to delete ${printer?.printerName}? This action cannot be undone.`,
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                      if (printer) {
                        removePrinter(printer.id);
                      }
                    },
                  },
                ]
              );
            },
          },
        ]
      );
    }
  };

  return (
    <SafeAreaView
      edges={['top']}
      className="flex-1 bg-slate-100 dark:bg-gray-900"
    >
      <Header
        title="Printers"
        subtitle="Manage your printers"
        rightAction={{
          icon: 'add',
          onPress: () => navigation.navigate('AddEditPrinter'),
        }}
      />

      {/* Local Network Access Disclaimer */}

      <ScrollView
        className="flex-1 bg-slate-200 dark:bg-gray-800"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {printers.length > 0 && !hasNetworkAccess && (
          <View className="mx-2 mt-2 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <View className="flex-row items-start">
              <Ionicons
                name="warning-outline"
                size={20}
                color="#D97706"
                className="mt-0.5"
              />
              <View className="ml-2 flex-1">
                <Text className="text-sm text-yellow-800 dark:text-yellow-200 leading-5">
                  We need access to local networking to connect to your
                  printers. Please enable local network access in{' '}
                  <Text
                    className="underline font-semibold"
                    onPress={() => Linking.openSettings()}
                  >
                    Settings
                  </Text>
                  .
                </Text>
              </View>
            </View>
          </View>
        )}

        {printers.length === 0 ? (
          // Getting Started Card
          <View className="flex-1 items-center justify-center p-6">
            <View className="bg-white dark:bg-gray-900 rounded-lg p-8 border border-gray-300 dark:border-gray-700 max-w-sm w-full">
              <View className="items-center mb-6">
                <View className="w-32 h-32 bg-blue-100 dark:bg-blue-900/50 rounded-full items-center justify-center mb-12 mt-6">
                  <Image
                    source={require('../../assets/CC.png')}
                    className="w-20 h-20"
                    resizeMode="contain"
                  />
                </View>
                <Text className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">
                  Getting Started
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-center leading-6">
                  Get started by adding your first printer to monitor your
                  prints.
                </Text>
              </View>

              <TouchableOpacity
                className="bg-blue-500 rounded-lg py-4 px-6 items-center mt-4"
                onPress={() => navigation.navigate('AddEditPrinter')}
              >
                <Text className="text-white font-bold text-lg">
                  ADD PRINTER
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // Printer Cards
          <>
            {printers.map(printer => (
              <View className="w-full p-2 pb-0" key={printer.id}>
                <PrinterCard
                  showTemps={false}
                  key={printer.id}
                  printer={printer}
                  onPress={() => handlePrinterPress(printer.id)}
                />
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
