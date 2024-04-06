import { useLocalSearchParams, useNavigation } from "expo-router";
import React from "react";
import { Appbar, PaperProvider, SegmentedButtons } from "react-native-paper";

import Description from "./description";
import Leaderboard from "./leaderboard";
import Stat from "./statistics";

import { SafeAreaView } from "react-native-safe-area-context";
import ErrorComponent from "~/components/errorComponent";
import Loading from "~/components/loading";
import { useDrillInfo } from "~/hooks/useDrillInfo";

export default function Index() {
  const [value, setValue] = React.useState("description");
  const navigation = useNavigation();
  const drillId = useLocalSearchParams()["id"];

  const assigned_time = useLocalSearchParams()["assigned_time"];

  console.log("WAS IT ASSIGNED", assigned_time)
  const {
    data: drillInfo,
    error: drillInfoError,
    isLoading: drillInfoIsLoading,
  } = useDrillInfo(drillId);

  if (drillInfoIsLoading) return <Loading />;

  if (drillInfoError) return <ErrorComponent error={drillInfoError.message} />;

  const tabComponent = () => {
    switch (value) {
      case "leaderboard":
        return <Leaderboard />;
      case "description":
        return <Description />;
      case "stats":
        return <Stat />;
    }
  };

  return (
    <PaperProvider>
      <SafeAreaView style={{ flex: 1 }} edges={["right", "top", "left"]}>
        <Appbar.Header statusBarHeight={0} style={{ backgroundColor: "FFF" }}>
          <Appbar.BackAction
            onPress={() => {
              navigation.goBack();
            }}
            color={"#F24E1E"}
          />
          <Appbar.Content title={drillInfo["drillType"]} />
        </Appbar.Header>

        {/* Tab system */}

        <SegmentedButtons
          value={value}
          onValueChange={setValue}
          buttons={[
            {
              value: "description",
              label: "Description",
            },
            {
              value: "leaderboard",
              label: "Leaderboard",
            },
            {
              value: "stats",
              label: "Stats",
            },
          ]}
        />

        {tabComponent()}
      </SafeAreaView>
    </PaperProvider>
  );
}
