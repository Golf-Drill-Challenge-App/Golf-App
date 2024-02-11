import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { PaperProvider, Text } from "react-native-paper";
import { Link } from "expo-router";

export default function Index() {
  return (
    <PaperProvider>
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Link
          href={{
            pathname: "/",
          }}
        >
          Go back to Index
        </Link>
        <Text>Submission</Text>
      </SafeAreaView>
    </PaperProvider>
  );
}
