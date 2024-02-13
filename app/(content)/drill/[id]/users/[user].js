//i think users users should be their own path. This is used for leaderboard

// "Leaderboard Drill Results" on the Figma, I think
import { useLocalSearchParams } from "expo-router";

import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { PaperProvider, Text } from "react-native-paper";
import { Link } from "expo-router";

export default function Index() {
  const uid = useLocalSearchParams()["user"];
  // console.log(uid);
  return (
    <PaperProvider>
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Link
          href={{
            pathname: "/drill",
          }}
        >
          Go back to Drill Index
        </Link>
        <Text>"Leaderboard Drill Results" on the Figma, I think</Text>
        <Text>user id: {uid}</Text>
      </SafeAreaView>
    </PaperProvider>
  );
}
