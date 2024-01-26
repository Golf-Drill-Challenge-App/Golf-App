import React from "react";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable } from "react-native";
import { signOut as signoutFireBase } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useAuth } from "../../context/Auth";
import { Link } from "expo-router";

export default function Index() {
  const { signOut } = useAuth();
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Home Page</Text>
      <Link
        href="/drills"
        style={{ marginTop: 20, fontSize: 20, color: "#0000FF" }}
      >
        Drills
      </Link>
      <Pressable
        style={{ marginTop: 20 }}
        onPress={() => {
          signoutFireBase(auth);
          signOut();
        }}
      >
        <Text style={{ fontSize: 20 }}> Sign Out </Text>
      </Pressable>
    </SafeAreaView>
  );
}
