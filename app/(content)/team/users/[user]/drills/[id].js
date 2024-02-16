//assumed to be statistics
import React, { useMemo, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import { useLocalSearchParams, Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { BarChart, Grid, YAxis } from "react-native-svg-charts";
import { Path } from "react-native-svg";
import * as scale from "d3-scale";
import * as shape from "d3-shape";
import { clampNumber, formatDate, numTrunc } from "~/Utility";
import DropDownPicker from "react-native-dropdown-picker";
import teamData from "~/team_data.json";
import ShotAccordion from "~/components/shotAccordion";
import BarChartScreen from "~/components/barChart";

export default function Stat() {
  const { user: user_id, id: drill_id } = useLocalSearchParams();
  const drillData = teamData["teams"]["1"];
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
