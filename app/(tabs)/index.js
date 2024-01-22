import React from "react";
import { PaperProvider, Text, MD3LightTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable } from "react-native";
import { signOut as signoutFireBase } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useAuth } from "../../context/Auth";
import { Link } from 'expo-router';

export default function Index() {
  const { signOut } = useAuth();
  return (
    <PaperProvider theme={MD3LightTheme}>
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Open up App.js to start working on your app!</Text>
        <Pressable
          onPress={() => {
            signoutFireBase(auth);
            signOut();
          }}
        >
          <Text> Sign Out </Text>
        </Pressable>
        <Link href = "/drills">Drills</Link>
      </SafeAreaView>
    </PaperProvider>
  );
}
