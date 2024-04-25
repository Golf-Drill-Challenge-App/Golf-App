import { useLocalSearchParams, useNavigation } from "expo-router";
import React from "react";
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
    <PaperWrapper>
      <SafeAreaView style={{ flex: 1 }} edges={["right", "top", "left"]}>
        <Header
          title={drillInfo.drillType}
          subTitle={drillInfo.subType}
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
            borderRadius: "50%"
            , paddingBottom: 10
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
        {tabComponent()}
      </SafeAreaView>
    </PaperWrapper>
  );
}
