import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { PaperProvider, Text } from "react-native-paper";
//This is for the list of drills
export default function Test() {
  return (
    <PaperProvider>
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Test Screen!</Text>
      </SafeAreaView>
    </PaperProvider>
  );
}
