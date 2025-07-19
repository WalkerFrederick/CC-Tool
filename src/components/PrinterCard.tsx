import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';
import { Printer, ConnectionStatus, getPrintStatus, PrintStatus, isPausable, isResumable, isStoppable } from '../types';

const formatTimeAgo = (timestamp: number, currentTime: number): string => {
  const diff = currentTime - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  const seconds = Math.floor(diff / 1000);

  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s ago`;
  } else if (seconds > 5) {
    return `${seconds}s ago`;
  } else {
    return 'Just now';
  }
};

interface PrinterCardProps {
  printer: Printer;
  onPress?: () => void;
  showTemps?: boolean;
  lastUpdate?: string;
  printStatus?: 'printing' | 'paused';
  onPrintControl?: () => void;
  onStopPrint?: () => void;
  showPrintControls?: boolean;
}

export const PrinterCard = ({
  printer,
  onPress,
  showTemps = true,
  lastUpdate,
  printStatus,
  onPrintControl,
  onStopPrint,
  showPrintControls = false,
}: PrinterCardProps) => {
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update time every second to refresh the "time ago" display
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const statusColors: { [key in ConnectionStatus]: string } = {
    connected: 'text-emerald-500',
    connecting: 'text-yellow-500',
    disconnected: 'text-gray-500',
    error: 'text-red-500',
    timeout: 'text-red-500',
  };

  // Get real status data
  const status = printer.status;
  const bedTemp = status?.TempOfHotbed || 0;
  const nozzleTemp = status?.TempOfNozzle || 0;
  const boxTemp = status?.TempOfBox || 0;
  const printInfo = status?.PrintInfo;
  const currentLayer = printInfo?.CurrentLayer || 0;
  const totalLayer = printInfo?.TotalLayer || 0;
  const progress = printInfo?.Progress || 0;
  const printStatusFromPrinter = printInfo?.Status || 0;
  const filename = printInfo?.Filename || '';

  // Get human-readable print status
  const readablePrintStatus = getPrintStatus(printStatusFromPrinter);
  
  // Determine action availability based on print status
  const canPause = isPausable(printStatusFromPrinter);
  const canResume = isResumable(printStatusFromPrinter);
  const canStop = isStoppable(printStatusFromPrinter);
  
  // Determine if printer is actually printing based on status
  const isPrinting = readablePrintStatus === 'printing';
  const layerProgress = totalLayer > 0 ? currentLayer / totalLayer : 0;
  const isConnected = printer.connectionStatus === 'connected';

  return (
    <TouchableOpacity
      className="rounded-lg border border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}>
      <View className="flex-row justify-between gap-4">
        <View className="flex flex-1 justify-between">
          <View className="mt-1 w-full flex-row items-center justify-between">
            <Text className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {printer.printerName}
            </Text>
            {onPress && isConnected ? (
              <View className="flex-row items-center">
                {printer.lastUpdate && (
                  <Text className="text-sm text-gray-500 dark:text-gray-400">
                    {formatTimeAgo(printer.lastUpdate, currentTime)}
                  </Text>
                )}
                <Ionicons name="chevron-forward" size={16} color="#4b5563" />
              </View>
            ) : (
              printer.lastUpdate && (
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  Last update: {formatTimeAgo(printer.lastUpdate, currentTime)}
                </Text>
              )
            )}
          </View>
          <View className="mt-1 w-full flex-row items-center">
            <Text className="text-md flex-1 text-gray-600 dark:text-gray-400">
              {printer.ipAddress}
            </Text>
            <Text
              className={`text-md ml-2 text-right font-semibold ${statusColors[printer.connectionStatus]}`}>
              {printer.connectionStatus.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      {isConnected && (
        <>
          {showTemps && (
            <View className="mt-4 flex-row justify-between">
              <View className="flex-1 items-center border-l border-gray-200 py-4 dark:border-gray-700">
                <Ionicons name="thermometer" size={24} color="#4b5563" className="mb-2" />
                <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {bedTemp.toFixed(1)}°C
                </Text>
                <Text className="text-sm font-light text-gray-600 dark:text-gray-400">BED</Text>
              </View>
              <View className="flex-1 items-center border-l border-r border-gray-200 py-4 dark:border-gray-700">
                <Ionicons name="thermometer" size={24} color="#4b5563" className="mb-2" />
                <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {nozzleTemp.toFixed(1)}°C
                </Text>
                <Text className="text-sm font-light text-gray-600 dark:text-gray-400">NOZZLE</Text>
              </View>
              <View className="flex-1 items-center border-r border-gray-200 py-4 dark:border-gray-700">
                <Ionicons name="thermometer" size={24} color="#4b5563" className="mb-2" />
                <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {boxTemp.toFixed(1)}°C
                </Text> 
                <Text className="text-sm font-light text-gray-600 dark:text-gray-400">CHAMBER</Text>
              </View>
            </View>
          )}
        {readablePrintStatus === "idle" ?
         <></> : (
          <View className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-gray-800 dark:text-gray-200">Print Status</Text>
              {showPrintControls && onPrintControl && (
                <View className="flex-row gap-2">
                  {canStop && onStopPrint && (
                    <TouchableOpacity
                      onPress={onStopPrint}
                      className="rounded-full bg-red-100 p-2 dark:bg-red-900/50"
                      activeOpacity={0.7}>
                      <Ionicons name="stop" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  )}
                  {(canPause || canResume) && (
                    <TouchableOpacity
                      onPress={onPrintControl}
                      className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/50"
                      activeOpacity={0.7}>
                      <Ionicons
                        name={canResume ? 'play' : 'pause'} 
                        size={20}
                        color="#3B82F6"
                      />
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
            {isPrinting ? (
              <>
                {filename && (
                  <Text className="mb-2 font-semibold text-gray-800 dark:text-gray-200">
                    {filename}
                  </Text>
                )}
                {totalLayer > 0 && (
                  <Text className="mb-2 font-semibold text-gray-800 dark:text-gray-200">
                    Layer {currentLayer}/{totalLayer}
                  </Text>
                )}
                <Progress.Bar
                  progress={progress/100}
                  width={null}
                  height={8}
                  color="#3B82F6"
                  unfilledColor="#E5E7EB"
                  borderWidth={0}
                  borderRadius={4}
                />
                <Text className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {progress}% Complete
                </Text>
              </>
            ) : (
              <>
                <Text className="mb-2 font-semibold text-gray-800 dark:text-gray-200">
                  {readablePrintStatus === 'completed' ? 'Print Completed' :
                   readablePrintStatus === 'preparing' ? 'Preparing Print' :
                   readablePrintStatus === 'paused' ? 'Print Paused' :
                   readablePrintStatus === 'stopped' ? 'Print Stopped' :
                   readablePrintStatus === 'unknown' ? 'Unknown Status' : 'No active print'}
                </Text>
                <Progress.Bar
                  progress={readablePrintStatus === 'completed' ? 1 : progress/100}
                  width={null}
                  height={8}
                  color="#3B82F6"
                  unfilledColor="#E5E7EB"
                  borderWidth={0}
                  borderRadius={4}
                />
                <Text className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {readablePrintStatus === 'completed' ? '100% Complete' : '0% Complete'}
                </Text>
              </>
            )}
          </View>)}
        </>
      )}
    </TouchableOpacity>
  );
};
