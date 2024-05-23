import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useMemo } from "react";
import { LogBox } from "react-native";
import { Appbar, SegmentedButtons } from "react-native-paper";

import Description from "./description";
import Leaderboard from "./leaderboard";
import Stat from "./statistics";

import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "~/Constants";
import EmptyScreen from "~/components/emptyScreen";
import ErrorComponent from "~/components/errorComponent";
import Header from "~/components/header";
import Loading from "~/components/loading";
import PaperWrapper from "~/components/paperWrapper";
import { currentAuthContext } from "~/context/Auth";
import { useDrillInfo } from "~/hooks/useDrillInfo";
import { useUserInfo } from "~/hooks/useUserInfo";

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
  const { currentUserId } = currentAuthContext();
  const {
    data: userInfo,
    error: userInfoError,
    isLoading: userIsLoading,
  } = useUserInfo({ userId: currentUserId });

  if (drillInfoIsLoading || userIsLoading) return <Loading />;

  if (
    userInfoError && // do we need a check for `!currentUserId` here as well?
    String(userInfoError).includes(
      "TypeError: Cannot read property 'assigned_data' of undefined", // handle error from remove user's pov (after being removed by admin user)
    )
  ) {
    // The logs still show up on the console (which is probably good), just hidden from phone screen
    LogBox.ignoreLogs(["Query data cannot be undefined"]);
    return (
      <EmptyScreen
        text={"Unknown account error, go to Profile Tab to signout"}
      />
    );
  }

  if (drillInfoError || userInfoError)
    return <ErrorComponent errorList={[drillInfoError, userInfoError]} />;

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
          buttons={
            userInfo.role === "player"
              ? [
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
                ]
              : [
                  {
                    value: "description",
                    label: "Description",
                  },
                  {
                    value: "leaderboard",
                    label: "Leaderboard",
                  },
                ]
          }
        />
        {tabComponent[value]}
      </SafeAreaView>
    </PaperWrapper>
  );
}
