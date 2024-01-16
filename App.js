import React from 'react';
import { GluestackUIProvider, Text, Box } from "@gluestack-ui/themed"
import { config } from "@gluestack-ui/config"
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Box>
          <Text>Open up App.js to start working on your app!</Text>
        </Box>
      </SafeAreaView>
    </GluestackUIProvider>
  );
}