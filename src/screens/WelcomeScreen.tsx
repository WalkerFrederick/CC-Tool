import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, Linking, Alert } from 'react-native';
import PagerView from 'react-native-pager-view';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { StatusBar } from 'expo-status-bar';

const WelcomeScreen = ({ onComplete }: { onComplete: () => void }) => {
  const { colorScheme } = useTheme();
  const isDarkMode = colorScheme === 'dark';
  const styles = getStyles(isDarkMode);

  const pagerRef = React.useRef<PagerView>(null);
  const [page, setPage] = React.useState(0);

  const handleNext = () => {
    if (page < 2) {
      pagerRef.current?.setPage(page + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (page > 0) {
      pagerRef.current?.setPage(page - 1);
    }
  };

  const handleGitHubPress = async () => {
    const url = 'https://github.com/WalkerFrederick/CC-Tool';
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open GitHub link');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open GitHub link');
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <PagerView 
        style={styles.pagerView} 
        initialPage={0} 
        ref={pagerRef}
        onPageSelected={(e) => setPage(e.nativeEvent.position)}
        scrollEnabled={true}
      >
        <View style={styles.page} key="1">
          <Image
            source={require('../../assets/CC.png')}
            style={{
              width: 120,
              height: 120,
              marginLeft: 5,
              resizeMode: 'contain',
              marginBottom: 24,
            }}
          />
          <Text className="text-gray-500 dark:text-white text-4xl text-center font-bold mb-6">Welcome to CC Tool</Text>
          <Text className="text-gray-500 dark:text-gray-400 text-4xl text-center mb-2">The Open Source</Text>
          <Text className="text-gray-500 dark:text-gray-400 text-4xl text-center">Companion app for the CC</Text>
        </View>
        <View style={styles.page} key="2">
          <Ionicons className='pl-2 pb-8' name="alert-circle" size={120} color="#3B82F6" />
          <Text className="text-gray-500 dark:text-white text-4xl text-center font-bold mb-6">Quick Disclaimer</Text>
          <Text className="text-gray-500 dark:text-gray-400 text-4xl text-center mb-2">We are not</Text>
          <Text className="text-gray-500 dark:text-gray-400 text-4xl text-center mb-2">associated with</Text>
          <Text className="text-gray-500 dark:text-gray-400 text-4xl text-center mb-12">any manufacturer.</Text>
          <Text className="text-gray-500 dark:text-gray-400 text-4xl text-center font-black">This is a community project.</Text>

        </View>
        <View style={styles.page} key="3">
          <Ionicons className='pl-2 pb-8' name="logo-github" size={120} color="#3B82F6" />
          <Text className="text-gray-500 dark:text-white text-4xl text-center font-bold mb-4">Show Support,</Text>
          <Text className="text-gray-500 dark:text-white text-4xl text-center font-bold mb-4">Get Help,</Text>
          <Text className="text-gray-500 dark:text-white text-4xl text-center font-bold mb-6">Request Features,</Text>
          <Text className="text-gray-500 dark:text-white text-4xl text-center font-bold mb-6">Contribute</Text>

          <TouchableOpacity
            className="bg-gray-800 dark:bg-white rounded-lg py-4 px-6 mt-4 flex-row items-center"
            onPress={handleGitHubPress}
          >
            <Ionicons name="logo-github" size={20} color={isDarkMode ? '#000' : '#FFF'} />
            <Text className="text-white dark:text-black font-bold ml-2">Visit on GitHub</Text>
          </TouchableOpacity>
        </View>
      </PagerView>
      <View style={styles.indicatorContainer}>
        {[...Array(3).keys()].map((i) => (
          <View
            key={i}
            style={[
              styles.indicator,
              { backgroundColor: i === page ? '#3B82F6' : (isDarkMode ? '#4B5563' : '#D1D5DB') },
            ]}
          />
        ))}
      </View>
      <View style={styles.buttonContainer}>
        {page > 0 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.buttonText}>{page === 2 ? "Finish" : "Next"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#1F2937' : '#F3F4F6',
  },
  pagerView: {
    flex: 1,
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: isDarkMode ? '#F9FAFB' : '#1F2937',
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: isDarkMode ? '#D1D5DB' : '#4B5563',
    marginTop: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: isDarkMode ? '#9CA3AF' : '#6B7280',
    marginTop: 20,
    textAlign: 'center',
    lineHeight: 24,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  indicator: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  nextButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginLeft: 5
  },
  backButton: {
    backgroundColor: '#6B7280',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen; 