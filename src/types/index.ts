// Common types used throughout the app

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface NavigationProps {
  navigation: any;
  route: any;
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

// Printer types
export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error' | 'timeout';

export interface CurrentFanSpeed {
  ModelFan: number;
  AuxiliaryFan: number;
  BoxFan: number;
}

export interface LightStatus {
  SecondLight: number;
  RgbLight: [number, number, number];
}

export interface PrintInfo {
  Status: number;
  CurrentLayer: number;
  TotalLayer: number;
  CurrentTicks: number;
  TotalTicks: number;
  Filename: string;
  TaskId: string;
  PrintSpeedPct: number;
  Progress: number;
}

export interface PrinterStatus {
  CurrentStatus: number[];
  TimeLapseStatus: number;
  PlatFormType: number;
  TempOfHotbed: number;
  TempOfNozzle: number;
  TempOfBox: number;
  TempTargetHotbed: number;
  TempTargetNozzle: number;
  TempTargetBox: number;
  CurrenCoord: string;
  CurrentFanSpeed: CurrentFanSpeed;
  ZOffset: number;
  LightStatus: LightStatus;
  PrintInfo: PrintInfo;
}

export interface Printer {
  id: string;
  printerName: string;
  ipAddress: string;
  connectionStatus: ConnectionStatus;
  status?: PrinterStatus;
  lastUpdate?: number; // Timestamp of last status update
  videoUrl?: string; // Video stream URL
}
