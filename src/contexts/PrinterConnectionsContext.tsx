import React, { createContext, useState, useEffect, useContext, ReactNode, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Printer, ConnectionStatus, PrinterStatus } from '../types';

interface PrinterConnectionsContextType {
  printers: Printer[];
  addPrinter: (printerName: string, ipAddress: string) => void;
  removePrinter: (id: string) => void;
  reconnectAll: () => void;
  sendCommand: (printerId: string, command: any) => void;
}

const PrinterConnectionsContext = createContext<PrinterConnectionsContextType | undefined>(undefined);

// A simple ID generator to avoid external dependencies.
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const CONNECTION_TIMEOUT = 3000; // 3 seconds
const STATUS_UPDATE_INTERVAL = 31000; // 30 seconds

export const PrinterConnectionsProvider = ({ children }: { children: ReactNode }) => {
  const [printers, setPrinters] = useState<Printer[]>([]);
  const webSocketsRef = useRef<{ [key: string]: WebSocket }>({});
  const statusTimersRef = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const printersRef = useRef<Printer[]>([]);

  useEffect(() => {
    const loadPrinters = async () => {
      try {
        const savedPrintersJSON = await AsyncStorage.getItem('printers');
        console.log('savedPrintersJSON', savedPrintersJSON)
        if (savedPrintersJSON) {
          const savedPrinters = JSON.parse(savedPrintersJSON);
          const loadedPrinters = savedPrinters.map((p: Omit<Printer, 'connectionStatus'>) => ({
            ...p,
            connectionStatus: 'disconnected' as ConnectionStatus,
          }));
          setPrinters(loadedPrinters);
          printersRef.current = loadedPrinters;
          console.log('loadedPrinters', loadedPrinters)
          loadedPrinters.forEach((p: Printer) => connectToPrinter(p));
        }
      } catch (e) {
        console.error('Failed to load printers from storage', e);
      }
    };

    loadPrinters();

    return () => {
      Object.values(webSocketsRef.current).forEach((ws) => ws.close());
      Object.values(statusTimersRef.current).forEach(timer => clearInterval(timer));
    };
  }, []);

  useEffect(() => {
    const savePrinters = async () => {
      try {
        const printersToSave = printers.map(({ id, printerName, ipAddress }) => ({
          id,
          printerName,
          ipAddress,
        }));
        await AsyncStorage.setItem('printers', JSON.stringify(printersToSave));
      } catch (e) {
        console.error('Failed to save printers to storage', e);
      }
    };
    
    // Only save if printers state has been initialized from storage
    if (printers.length > 0) {
      savePrinters();
    }
  }, [printers]);

  const updatePrinterStatus = (id: string, connectionStatus: ConnectionStatus) => {
    setPrinters((prevPrinters) => {
      const updatedPrinters = prevPrinters.map((p) => (p.id === id ? { ...p, connectionStatus } : p));
      printersRef.current = updatedPrinters;
      return updatedPrinters;
    });
  };

  const updatePrinterData = (id: string, status: PrinterStatus) => {
    setPrinters((prevPrinters) => {
      const updatedPrinters = prevPrinters.map((p) => 
        p.id === id ? { ...p, status, lastUpdate: Date.now() } : p
      );
      printersRef.current = updatedPrinters;
      return updatedPrinters;
    });
  };

  const updatePrinterVideoUrl = (id: string, videoUrl: string) => {
    setPrinters((prevPrinters) => {
      const updatedPrinters = prevPrinters.map((p) => 
        p.id === id ? { ...p, videoUrl } : p
      );
      printersRef.current = updatedPrinters;
      return updatedPrinters;
    });
  };

  const sendStatusRequest = (printer: Printer, ws?: WebSocket) => {
    console.log('Sending status request to printer', printer.printerName);
    const websocket = ws || webSocketsRef.current[printer.id];
    console.log('websocket', websocket);
    
    if (!websocket) {
      console.log(`No WebSocket found for ${printer.printerName}, stopping timer`);
      stopStatusTimer(printer.id);
      return;
    }
    
    if (websocket.readyState === WebSocket.OPEN) {
      const statusRequest = {
        Id: `${printer.printerName}-id-${Date.now()}`,
        Data: {
          Cmd: 0,
          Data: {},
          RequestID: `STATUS_REQUEST`,
          TimeStamp: Date.now(),
          MainboardID: '',
          From: 1,
        },
      };
      console.log(`Sending status request to ${printer.printerName}`);
      websocket.send(JSON.stringify(statusRequest));
    } else {
      console.log(`WebSocket not open for ${printer.printerName}, state: ${websocket.readyState}`);
      if (websocket.readyState === WebSocket.CLOSED || websocket.readyState === WebSocket.CLOSING) {
        console.log(`WebSocket closed for ${printer.printerName}, stopping timer`);
        stopStatusTimer(printer.id);
        updatePrinterStatus(printer.id, 'disconnected');
      }
    }
  };

  const startStatusTimer = (printer: Printer) => {
    console.log(`Starting status timer for ${printer.printerName} (${printer.id})`);
    
    // Clear any existing timer for this printer
    if (statusTimersRef.current[printer.id]) {
      console.log(`Clearing existing timer for ${printer.id}`);
      clearInterval(statusTimersRef.current[printer.id]);
    }

    // Start a new timer
    const timer = setInterval(() => {
      console.log(`Timer tick for ${printer.printerName}`);
      // Check if printer is still connected before sending - use ref to get current state
      const currentPrinter = printersRef.current.find(p => p.id === printer.id);
      console.log('Current printers from ref:', printersRef.current)
      if (currentPrinter && currentPrinter.connectionStatus === 'connected') {
        sendStatusRequest(printer);
      } else {
        console.log(`Printer ${printer.printerName} is not connected, stopping timer`);
        stopStatusTimer(printer.id);
      }
    }, STATUS_UPDATE_INTERVAL);

    console.log(`Created timer ${timer} for ${printer.id}`);
    statusTimersRef.current[printer.id] = timer;
    console.log(`Updated timers:`, Object.keys(statusTimersRef.current));
  };

  const stopStatusTimer = (printerId: string) => {
    console.log(`Attempting to stop status timer for printer ${printerId}`);
    console.log(`Current status timers:`, Object.keys(statusTimersRef.current));
    
    if (statusTimersRef.current[printerId]) {
      console.log(`Found timer for ${printerId}, clearing it`);
      clearInterval(statusTimersRef.current[printerId]);
      delete statusTimersRef.current[printerId];
      console.log(`Updated timers after removal:`, Object.keys(statusTimersRef.current));
    } else {
      console.log(`No timer found for ${printerId}`);
    }
  };

  const connectToPrinter = (printer: Printer) => {
    // If a websocket for this printer already exists, close it before creating a new one.
    if (webSocketsRef.current[printer.id]) {
      webSocketsRef.current[printer.id].close();
    }

    updatePrinterStatus(printer.id, 'connecting');
    const ws = new WebSocket(`ws://${printer.ipAddress}/websocket`);

    const timeout = setTimeout(() => {
      console.log(`Connection to ${printer.printerName} timed out.`);
      updatePrinterStatus(printer.id, 'timeout');
      ws.close();
    }, CONNECTION_TIMEOUT);

    ws.onopen = () => {
      clearTimeout(timeout);
      console.log(`Connected to printer: ${printer.printerName}`);
      updatePrinterStatus(printer.id, 'connected');
      
      // Set initial lastUpdate when connected
      setPrinters((prevPrinters) => {
        const updatedPrinters = prevPrinters.map((p) => 
          p.id === printer.id ? { ...p, lastUpdate: Date.now() } : p
        );
        printersRef.current = updatedPrinters;
        return updatedPrinters;
      });
      
      // Send enable command
      const enableCommand = {
        "Id": "",
        "Data": {
          "Cmd": 386,
          "Data": {
            "Enable": 1
          },
          "RequestID": "ENABLE_VIDEO",
          "MainboardID": "",
          "TimeStamp": Date.now(),
          "From": 1
        }
      };
      console.log(`Sending enable command to ${printer.printerName}:`, enableCommand);
      ws.send(JSON.stringify(enableCommand));
      
      // Send initial status request using the ws instance directly
      sendStatusRequest(printer, ws);
      
      // Start periodic status updates
      startStatusTimer(printer);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        console.log('data', data)
        
        if (data.Status) {
          console.log(`Status update from ${printer.printerName}:`, data.Status);
          updatePrinterData(printer.id, data.Status);
        }
        
                  // Check for ACK response
          if (data.Data && data.Data.Data && data.Data.Data.Ack === 0 && data.Data.RequestID !== 'STATUS_REQUEST') {
            if (data.Data.Data.VideoUrl) {
              console.log('VideoUrl', data.Data.Data.VideoUrl)
              updatePrinterVideoUrl(printer.id, data.Data.Data.VideoUrl);
            }
            console.log(`ACK received from ${printer.printerName}`);
            // Send status request using the ws instance directly
            sendStatusRequest(printer, ws);
          }
      } catch (error) {
        console.log(`Error parsing message from ${printer.printerName}:`, error);
        console.log(`Raw message:`, event.data);
      }
    };

    ws.onerror = (error) => {
      clearTimeout(timeout);
      console.error(`WebSocket error for ${printer.printerName}:`, error);
      updatePrinterStatus(printer.id, 'error');
      stopStatusTimer(printer.id);
    };

    ws.onclose = (event) => {
      clearTimeout(timeout);
      console.log(`Disconnected from printer: ${printer.printerName}, code: ${event.code}, reason: ${event.reason}`);
      stopStatusTimer(printer.id);
      setPrinters((prev) => {
        const printerToUpdate = prev.find((p) => p.id === printer.id);
        if (
          printerToUpdate &&
          (printerToUpdate.connectionStatus === 'connected' ||
            printerToUpdate.connectionStatus === 'connecting')
        ) {
          const updatedPrinters = prev.map((p) =>
            p.id === printer.id ? { ...p, connectionStatus: 'disconnected' as ConnectionStatus } : p
          );
          printersRef.current = updatedPrinters;
          return updatedPrinters;
        }
        return prev;
      });
    };

    webSocketsRef.current[printer.id] = ws;
  };

  const addPrinter = (printerName: string, ipAddress: string) => {
    const newPrinter: Printer = {
      id: generateId(),
      printerName,
      ipAddress,
      connectionStatus: 'connecting',
    };

    setPrinters((prevPrinters) => {
      const existingPrinter = prevPrinters.find((p) => p.ipAddress === ipAddress);
      if (existingPrinter) {
        // Maybe alert the user that the printer already exists
        console.log('printer already exists', existingPrinter)
        return prevPrinters;
      }
      const updatedPrinters = [...prevPrinters, newPrinter];
      printersRef.current = updatedPrinters;
      return updatedPrinters;
    });

    connectToPrinter(newPrinter);
  };

  const removePrinter = (id: string) => {
    const ws = webSocketsRef.current[id];
    if (ws) {
      ws.close();
      delete webSocketsRef.current[id];
    }
    stopStatusTimer(id);
    console.log('remove printer', id)
    setPrinters((prevPrinters) => {
      const updatedPrinters = prevPrinters.filter((p) => p.id !== id);
      printersRef.current = updatedPrinters;
      return updatedPrinters;
    });
    // Also remove from AsyncStorage
    AsyncStorage.getItem('printers').then((printersJSON) => {
      if (printersJSON) {
        const printers = JSON.parse(printersJSON);
        const filteredPrinters = printers.filter((p: Printer) => p.id !== id);
        AsyncStorage.setItem('printers', JSON.stringify(filteredPrinters));
      }
    });
  };

  const sendCommand = (printerId: string, command: any) => {
    const ws = webSocketsRef.current[printerId];
    if (ws && ws.readyState === WebSocket.OPEN) {
      console.log(`Sending command to printer ${printerId}:`, command);
      ws.send(JSON.stringify(command));
    } else {
      console.error(`Cannot send command: WebSocket not connected for printer ${printerId}`);
    }
  };

  const reconnectAll = () => {
    console.log('Reconnecting to all printers...');
    printers.forEach(connectToPrinter);
  };

  return (
    <PrinterConnectionsContext.Provider
      value={{ printers, addPrinter, removePrinter, reconnectAll, sendCommand }}>
      {children}
    </PrinterConnectionsContext.Provider>
  );
};

export const usePrinterConnections = () => {
  const context = useContext(PrinterConnectionsContext);
  if (context === undefined) {
    throw new Error('usePrinterConnections must be used within a PrinterConnectionsProvider');
  }
  return context;
};
