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
        <Text>Submission</Text>
        <Link
          href={{
            pathname: "/drill",
          }}
        >
          Go back to Drill Index
        </Link>
      </SafeAreaView>
    </PaperProvider>
  );
}
