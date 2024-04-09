import { useLocalSearchParams, useNavigation } from "expo-router";
import React from "react";
import { View } from "react-native";
import {
  Appbar,
  PaperProvider,
  SegmentedButtons,
  Text,
} from "react-native-paper";

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
  const { id: drillId, assignedTime: assignedTime } = useLocalSearchParams();

  console.log("WAS IT ASSIGNED", assignedTime);
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
        <Appbar.Header
          statusBarHeight={0}
          style={{ padding: 0, backgroundColor: "FFF" }}
        >
          <Appbar.BackAction
            onPress={() => {
              navigation.goBack();
            }}
            color={"#F24E1E"}
          />
          <Appbar.Content
            title={
              <View>
                <Text
                  styles={{ fontSize: 20, fontWeight: "bold" }}
                  variant="titleLarge"
                >
                  {drillInfo.prettyDrillType}
                </Text>
                <Text
                  styles={{ fontSize: 20, fontWeight: "bold" }}
                  variant="titleLarge"
                >
                  {drillInfo.subType}
                </Text>
              </View>
            }
          />
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
