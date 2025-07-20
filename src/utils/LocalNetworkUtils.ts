import { Platform, Alert, Linking } from 'react-native';
import {
  checkLocalNetworkAccess,
  requestLocalNetworkAccess,
} from '@generac/react-native-local-network-permission';

export const checkLocalNetworkPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'ios') {
    return true; // No permission needed on Android
  }

  try {
    // First, request local network access to ensure the dialog appears
    await requestLocalNetworkAccess();

    // Then check if we have access
    const hasAccess = await checkLocalNetworkAccess();

    if (!hasAccess) {
      Alert.alert(
        'Local Network Access Required',
        'This app needs access to your local network to connect to printers. Please enable local network access in Settings to continue.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Open Settings',
            onPress: () => {
              Linking.openSettings();
            },
          },
        ]
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking local network access:', error);
    Alert.alert(
      'Network Access Error',
      'Unable to verify local network access. Please ensure you have granted the necessary permissions.',
      [{ text: 'OK' }]
    );
    return false;
  }
};
