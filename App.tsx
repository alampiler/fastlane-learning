/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

//import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View, Text, Button } from 'react-native';
import { useState } from 'react';
import {
  SafeAreaProvider,
  // useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Config from 'react-native-config';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}



function AppContent() {
    // const safeAreaInsets = useSafeAreaInsets();
    const [pressed, setPressed] = useState(false);

    return (
      <View style={styles.container}>
        {/* <NewAppScreen
          templateFileName="App.tsx"
          safeAreaInsets={safeAreaInsets}
        /> */}
        <Text style={{ textAlign: 'center', marginBottom: 20 }}>
          Edit <Text style={{ fontWeight: 'bold' }}>App.tsx</Text> to change this
          screen and then come back to see your edits. 2
        </Text>
        <Text>
          Config.API_URL: {Config.API_URL}
        </Text>
        <Button title="Press me" onPress={() => setPressed(true)} />
        {pressed && <Text>Button pressed!</Text>}
      </View>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
