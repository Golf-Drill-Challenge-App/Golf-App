import { useLocalSearchParams } from "expo-router";
import React from "react";

import drillData from "~/drill_data.json";
import BarChartScreen from "~/components/barChart";

export default function Stat() {
  const slug = useLocalSearchParams()["id"];
  return (
    <>
      <BarChartScreen
        drillData={drillData["teams"]["1"]["users"]["1"]["history"][slug]}
        mainOutputAttempt={
          drillData["teams"]["1"]["drills"][slug]["mainOutputAttempt"]
        }
      />
    </>
  );
}
