//assumed to be statistics
import React from "react";
import { useLocalSearchParams } from "expo-router";

 // At some point migrate this to team_data.json after adding enough fake data
 // Also, maybe move pass drill data as prop
import drillData from "~/drill_data.json";
import BarChartScreen from "~/components/barChart";

export default function Stat() {
  const { user: user_id, id: drill_id } = useLocalSearchParams();
  console.log(drillData.users[user_id]);
  console.log(drillData.drills[drill_id]);
  return (
    <>
      <BarChartScreen
        drillData={drillData["users"]["1"]["history"][drill_id]}
        mainOutputAttempt={drillData["drills"][drill_id]["mainOutputAttempt"]}
      />
    </>
  );
}
