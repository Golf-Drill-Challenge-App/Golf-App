//i think users users should be their own path. This is used for leaderboard
import { useLocalSearchParams } from "expo-router";

import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { PaperProvider, Text } from "react-native-paper";
import { Link } from "expo-router";

export default function Index() {
  const uid = useLocalSearchParams()["user"];
  console.log(uid);
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
        <Text>user id: {uid}</Text>
      </SafeAreaView>
    </PaperProvider>
  );
}
