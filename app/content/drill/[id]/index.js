import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useMemo } from "react";
import { Appbar, SegmentedButtons } from "react-native-paper";

import Description from "./description";
import Leaderboard from "./leaderboard";
import Stat from "./statistics";

import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "~/Constants";
import ErrorComponent from "~/components/errorComponent";
import Header from "~/components/header";
import Loading from "~/components/loading";
import PaperWrapper from "~/components/paperWrapper";
import { useDrillInfo } from "~/hooks/useDrillInfo";

export default function Index() {
  const [value, setValue] = React.useState("description");
  const navigation = useNavigation();
  const { id: drillId } = useLocalSearchParams();

  const tabComponent = useMemo(
    () => ({
      leaderboard: <Leaderboard />,
      description: <Description />,
      stats: <Stat />,
    }),
    [drillId],
  ); // Recreate pages only if drillId changes

  const {
    data: drillInfo,
    error: drillInfoError,
    isLoading: drillInfoIsLoading,
  } = useDrillInfo({ drillId });

  if (drillInfoIsLoading) return <Loading />;

  if (drillInfoError) return <ErrorComponent errorList={[drillInfoError]} />;

  return (
    <PaperWrapper>
      <SafeAreaView style={{ flex: 1 }} edges={["right", "top", "left"]}>
        <Header
          title={drillInfo.subType}
          subTitle={drillInfo.drillType}
          preChildren={
            <Appbar.BackAction
              onPress={() => {
                navigation.goBack();
              }}
              color={themeColors.accent}
            />
          }
        />
        {/* Tab system */}
        <SegmentedButtons
          value={value}
          onValueChange={setValue}
          style={{
            marginLeft: 10,
            marginRight: 10,
            backgroundColor: themeColors.highlight,
            borderRadius: 20,
          }}
          theme={{
            colors: {
              secondaryContainer: themeColors.overlay,
            },
          }}
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
        {tabComponent[value]}
      </SafeAreaView>
    </PaperWrapper>
  );
}
