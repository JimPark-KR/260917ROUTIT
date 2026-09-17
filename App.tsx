import 'react-native-gesture-handler'; // 제스처 핸들러 초기화를 위해 반드시 최상단에서 import
import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { CharacterProvider } from './src/character/CharacterContext';
import { HomeScreen } from './src/screens/HomeScreen';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <CharacterProvider>
        <HomeScreen />
        <StatusBar style="auto" />
      </CharacterProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
