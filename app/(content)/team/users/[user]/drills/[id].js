//assumed to be statistics
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import { useLocalSearchParams, Link, router } from "expo-router";
import {Text} from "react-native";
import drillData from "~/team_data.json";
import BarChartScreen from "~/components/barChart";

export default function Stat() {
  const { user: user_id, id: drill_id } = useLocalSearchParams();
  console.log(drillData.users[user_id]);
  console.log(drillData.drills[drill_id]);
  return (
    <PaperProvider>
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Link
          href={{
            pathname: "/",
          }}
          style={{ marginBottom: 10 }}
        >
          Go back to Index
        </Link>
        <Text>
          User ID: {user_id}, Drill ID: {drill_id}
        </Text>
        <BarChartScreen
          drillData={drillData["users"]["1"]["history"][drill_id]}
          mainOutputAttempt={drillData["drills"][drill_id]["mainOutputAttempt"]}
        />
      </SafeAreaView>
    </PaperProvider>
  );
}
