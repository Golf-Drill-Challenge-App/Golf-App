import React from "react";
import { PaperProvider, Text, MD3LightTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from 'expo-router';

export default function Drills() {
  return (
    <PaperProvider theme={MD3LightTheme}>
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Open up App.js to start working on your app!</Text>
        <Link href = "/">Go back to Index</Link>
      </SafeAreaView>
    </PaperProvider>
  );
}
