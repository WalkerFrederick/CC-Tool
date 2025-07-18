import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WhereIsIpScreen = () => {
    const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-gray-100 dark:bg-gray-900">
        <View className="flex-1 justify-center items-center p-8">
            <Text className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center mt-5">How to Find Your Printer&apos;s IP Address</Text>
            <Text className="text-base text-gray-600 dark:text-gray-300 text-center mt-4 leading-6">
                 On the CC, you can find your printer&apos;s IP address by clicking the &quot;Settings&quot; button. and pressing &quot;Network&quot; at the top.
            </Text>
            <Text className="text-base text-gray-600 dark:text-gray-300 text-center mt-4 leading-6">
                Ensure your phone is connected to the same Wi-Fi network as your printer!
            </Text>
        </View>
        <View className="p-4">
            <TouchableOpacity onPress={() => navigation.goBack()} className="bg-blue-500 rounded-lg py-4">
                <Text className="text-white text-center font-bold text-lg">Add Printer</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
};

export default WhereIsIpScreen; 