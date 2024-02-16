//assumed to be statistics
import React from "react";
import { useLocalSearchParams } from "expo-router";
import drillData from "~/drill_data.json";
import BarChartScreen from "~/components/barChart";

export default function Stat() {
  const { user: user_id, id: drill_id } = useLocalSearchParams();
  console.log(drillData.users[user_id]);
  console.log(drillData.drills[drill_id]);
  return (
    <>
      <BarChartScreen
        drillData={drillData["users"][user_id]["history"][drill_id]}
        mainOutputAttempt={drillData["drills"][drill_id]["mainOutputAttempt"]}
      />
    </>
  );
}
