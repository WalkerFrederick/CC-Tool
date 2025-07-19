import { View, Text, ScrollView, TouchableOpacity, Switch, RefreshControl, Alert, AppState, AppStateStatus } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components/Header';
import { Ionicons } from '@expo/vector-icons';
import { PrinterCard } from '../components/PrinterCard';
import { useState, useCallback, useRef, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { useRoute } from '@react-navigation/native';
import { usePrinterConnections } from '../contexts/PrinterConnectionsContext';

export const PrinterDetailsScreen = ({ navigation }: any) => {
  const route = useRoute();
  const { printerId } = route.params as { printerId: string };
  const { printers, sendCommand, reconnectAll, removePrinter } = usePrinterConnections();
  const printer = printers.find(p => p.id === printerId);

  const [refreshing, setRefreshing] = useState(false);
  const [webViewKey, setWebViewKey] = useState(0);
  const appState = useRef(AppState.currentState);

  // Handle app state changes to remount WebView when app comes back from background
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App has come to the foreground, remount the WebView
        console.log('App has come to the foreground, remounting WebView');
        setWebViewKey(prevKey => prevKey + 1);
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, []);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handlePrintControl = () => {
    if (!printer) return;
    
    const printStatusFromPrinter = printer.status?.PrintInfo?.Status || 0;
    const canPause = printStatusFromPrinter === 13; // printing
    const canResume = printStatusFromPrinter === 6; // paused
    
    if (canPause) {
      // Send pause command
      const pauseCommand = {
        "Id": "",
        "Data": {
          "Cmd": 129,
          "Data": {},
          "RequestID": `pause-${Date.now()}`,
          "MainboardID": "",
          "TimeStamp": Date.now(),
          "From": 1
        }
      };
      console.log('Sending pause command:', pauseCommand);
      sendCommand(printer.id, pauseCommand);
    } else if (canResume) {
      // Send resume command
      const resumeCommand = {
        "Id": "",
        "Data": {
          "Cmd": 131,
          "Data": {},
          "RequestID": `resume-${Date.now()}`,
          "MainboardID": "",
          "TimeStamp": Date.now(),
          "From": 1
        }
      };
      console.log('Sending resume command:', resumeCommand);
      sendCommand(printer.id, resumeCommand);
    }
  };

  const handleStopPrint = () => {
    if (!printer) return;
    
    Alert.alert(
      "Cancel Print",
      `Are you sure you want to cancel the print? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Stop Print",
          style: "destructive",
          onPress: () => {
            // Send cancel command
            const cancelCommand = {
              "Id": "",
              "Data": {
                "Cmd": 130,
                "Data": {},
                "RequestID": `cancel-${Date.now()}`,
                "MainboardID": "",
                "TimeStamp": Date.now(),
                "From": 1
              }
            };
            console.log('Sending cancel command:', cancelCommand);
            sendCommand(printer.id, cancelCommand);
          }
        }
      ]
    );
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    reconnectAll();
    // Keep the timeout to give visual feedback on the refresh control
    setTimeout(() => setRefreshing(false), 1000);
  }, [reconnectAll]);

  const handleLightToggle = (isOn: boolean) => {
    if (!printer) return;
    
    const command = {
      "Id": `${printer.printerName}-id-${Date.now()}`,
      "Data": {
        "Cmd": 403,
        "Data": {
          "LightStatus": {
            "SecondLight": isOn
          }
        },
        "RequestID": `light-toggle-${Date.now()}`,
        "MainboardID": "",
        "TimeStamp": 0,
        "From": 1
      }
    };
    
    sendCommand(printer.id, command);
  };

  const handleDeletePrinter = () => {
    if (!printer) return;
    
    Alert.alert(
      "Delete Printer",
      `Are you sure you want to delete ${printer.printerName}? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            removePrinter(printer.id);
            navigation.goBack();
          }
        }
      ]
    );
  };

  if (!printer) {
    return (
      <SafeAreaView edges={['top']} className="flex-1 bg-slate-100 dark:bg-gray-900">
        <Header title="Error" subtitle="Printer not found" />
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-500">Could not find the specified printer.</Text>
          <TouchableOpacity onPress={handleBackPress} className="mt-4 p-2 bg-blue-500 rounded">
            <Text className="text-white">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Get light status from printer data
  const isLightOn = printer.status?.LightStatus?.SecondLight === 1;

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-slate-100 dark:bg-gray-900">
      <Header title="Printer Details" subtitle="View printer information" />
      <ScrollView 
        className="flex-1 bg-slate-200 dark:bg-gray-800"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="p-2">
          {/* Back Button */}
          <TouchableOpacity 
            className="flex-row items-center mb-2 p-2"
            onPress={handleBackPress}
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
            <Text className="ml-2 text-gray-700 dark:text-gray-200 font-medium">BACK</Text>
          </TouchableOpacity>

          {/* Video Stream WebView */}
          <View className="bg-gray-800 dark:bg-gray-600 rounded-lg mb-2 w-full overflow-hidden" style={{ aspectRatio:16/9}}>
            {printer.videoUrl ? (
              <WebView
                key={webViewKey}
                source={{ uri: "http://" + printer.videoUrl }}
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
            ) : (
              <View className="flex-1 justify-center items-center bg-gray-700">
                <Ionicons name="videocam-off" size={48} color="#9CA3AF" />
                <Text className="text-gray-400 mt-2 text-center">Video feed not available</Text>
                <Text className="text-gray-500 mt-1 text-sm text-center">Waiting for video stream...</Text>
              </View>
            )}
          </View>

          {/* Main Printer Card */}
          <PrinterCard
            printer={printer}
            lastUpdate='3s ago'
            showPrintControls={true}
            onPrintControl={handlePrintControl}
            onStopPrint={handleStopPrint}
          />
        {/* Printer Controls Card */}
        <View className="bg-white dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-700 p-4 mb-4 mt-2">
            <Text className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">CONTROLS</Text>
          {/* Light Toggle */}
          <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <View className="flex-row items-center">
              <Ionicons 
                name={isLightOn ? "bulb" : "bulb-outline"} 
                size={24} 
                color={isLightOn ? "#3B82F6" : "#6B7280"} 
              />
              <Text className="ml-3 text-gray-800 dark:text-gray-200 font-semibold text-lg">Printer Light</Text>
            </View>
            <Switch
              value={isLightOn}
              onValueChange={handleLightToggle}
              trackColor={{ false: "#D1D5DB", true: "#DBEAFE" }}
              thumbColor={isLightOn ? "#3B82F6" : "#9CA3AF"}
            />
          </View>

          {/* Delete Printer */}
          <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <View className="flex-row items-center">
              <Ionicons 
                name="trash-outline" 
                size={24} 
                color="#EF4444" 
              />
              <Text className="ml-3 text-gray-800 dark:text-gray-200 font-semibold text-lg">Unlink Printer</Text>
            </View>
            <TouchableOpacity
              onPress={handleDeletePrinter}
              className="bg-red-500 px-4 py-2 rounded-lg"
              activeOpacity={0.7}
            >
              <Text className="text-white font-semibold">UNLINK</Text>
            </TouchableOpacity>
          </View>
        </View>

 

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}; 