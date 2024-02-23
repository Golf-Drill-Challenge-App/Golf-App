import { useNavigation, useLocalSearchParams } from "expo-router";
import React from "react";

import { SafeAreaView } from "react-native-safe-area-context";
import { PaperProvider, Appbar } from "react-native-paper";

import drillData from "~/drill_data.json";
import BarChartScreen from "~/components/barChart";

export default function Stat() {
  const navigation = useNavigation();
  const slug = useLocalSearchParams()["id"];
  return (
    <PaperProvider>
      <SafeAreaView>
        <Appbar.Header statusBarHeight={0} style={{ backgroundColor: "FFF" }}>
          <Appbar.BackAction
            onPress={() => {
              navigation.goBack();
            }}
            color={"#F24E1E"}
          />
          <Appbar.Content title={"Statistics"} />
        </Appbar.Header>

        <BarChartScreen
          drillData={drillData["teams"]["1"]["users"]["1"]["history"][slug]}
          mainOutputAttempt={
            drillData["teams"]["1"]["drills"][slug]["mainOutputAttempt"]
          }
        />
      </SafeAreaView>
    </PaperProvider>
  );
}
