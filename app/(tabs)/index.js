import React from "react";
import { GluestackUIProvider, Text, Box } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable } from "react-native";
import { signOut as signoutFireBase } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useAuth } from "../../context/Auth";

export default function Index() {
  const { signOut } = useAuth();
  return (
    <GluestackUIProvider config={config}>
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Box>
          <Text>Open up App.js to start working on your app!</Text>
        </Box>
        <Box>
          <Pressable
            onPress={() => {
              signoutFireBase(auth);
              signOut();
            }}
          >
            <Text> Sign Out </Text>
          </Pressable>
        </Box>
      </SafeAreaView>
    </GluestackUIProvider>
  );
}
