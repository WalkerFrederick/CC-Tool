import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components/Header';
import * as yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { usePrinterConnections } from '../contexts/PrinterConnectionsContext';

interface FormData {
  printerName: string;
  ipAddress: string;
}

interface FormErrors {
  printerName?: string;
  ipAddress?: string;
}

const validationSchema = yup.object().shape({
  printerName: yup
    .string()
    .required('Printer name is required')
    .min(2, 'Printer name must be at least 2 characters')
    .max(50, 'Printer name must be less than 50 characters'),
  ipAddress: yup
    .string()
    .required('IP address is required')
    .matches(
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      'Please enter a valid IP address'
    ),
});

export const AddEditPrinterScreen = () => {
  const navigation = useNavigation();
  const { addPrinter } = usePrinterConnections();
  const [formData, setFormData] = useState<FormData>({
    printerName: '',
    ipAddress: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    console.log('handleSubmit', formData);
    setIsSubmitting(true);
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      addPrinter(formData.printerName, formData.ipAddress);
      navigation.goBack();
    } catch (validationErrors: any) {
      const newErrors: FormErrors = {};
      validationErrors.inner.forEach((error: any) => {
        newErrors[error.path as keyof FormErrors] = error.message;
      });
      setErrors(newErrors);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView
      edges={['top']}
      className="flex-1 bg-slate-100 dark:bg-gray-900"
    >
      <Header title="Add/Edit Printer" subtitle="Add or edit a printer" />
      <ScrollView className="flex-1 bg-slate-200 dark:bg-gray-800">
        <View className="p-2">
          {/* Back Button */}
          <TouchableOpacity
            className="flex-row items-center mb-2 p-2"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
            <Text className="ml-2 text-gray-700 dark:text-gray-200 font-medium">
              BACK
            </Text>
          </TouchableOpacity>

          {/* Form Container */}
          <View className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-300 dark:border-gray-700">
            <Text className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">
              Printer Information
            </Text>

            {/* Printer Name Input */}
            <View className="mb-4">
              <Text className="text-gray-700 dark:text-gray-200 font-medium mb-2 text-lg">
                Printer Name
              </Text>
              <TextInput
                className={`border rounded-lg px-4 py-4 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 ${
                  errors.printerName
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter printer name"
                placeholderTextColor="#9CA3AF"
                value={formData.printerName}
                onChangeText={value => handleInputChange('printerName', value)}
                autoCapitalize="words"
              />
              {errors.printerName && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.printerName}
                </Text>
              )}
            </View>

            {/* IP Address Input */}
            <View className="mb-6">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-700 dark:text-gray-200 font-medium text-lg">
                  IP Address
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('WhereIsIp' as never)}
                >
                  <Text className="text-blue-500 text-sm">Where is this?</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                className={`border rounded-lg px-4 py-4 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 ${
                  errors.ipAddress
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="192.168.1.100"
                placeholderTextColor="#9CA3AF"
                value={formData.ipAddress}
                onChangeText={value => handleInputChange('ipAddress', value)}
                keyboardType="numeric"
                autoCapitalize="none"
              />
              {errors.ipAddress && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.ipAddress}
                </Text>
              )}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              className={`rounded-lg py-4 px-4 ${
                isSubmitting ? 'bg-gray-400' : 'bg-blue-500'
              }`}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text className="text-white text-center font-bold text-lg">
                {isSubmitting ? 'Saving...' : 'SAVE'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
