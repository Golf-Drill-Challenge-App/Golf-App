import { Link, useLocalSearchParams, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Avatar, Icon, List, Text } from "react-native-paper";
import { numTrunc } from "~/Utility";
import EmptyScreen from "~/components/emptyScreen";
import ErrorComponent from "~/components/errorComponent";
import Loading from "~/components/loading";
import RefreshInvalidate from "~/components/refreshInvalidate";
import { currentAuthContext } from "~/context/Auth";
import { updateLeaderboard } from "~/hooks/updateLeaderboard";
import { useAttempts } from "~/hooks/useAttempts";
import { useDrillInfo } from "~/hooks/useDrillInfo";
import { useLeaderboard } from "~/hooks/useLeaderboard";
import { useUserInfo } from "~/hooks/useUserInfo";

export default function Leaderboard() {
  const { currentTeamId } = currentAuthContext();
  const drillId = useLocalSearchParams()["id"];
  const currentPath = usePathname();
  const [defaultMainOutputAttempt, setDefaultMainOutputAttempt] =
    useState(true); //whether mainOutputAttempt is the default set on drills or has been changed by user
  const [customMainOutputAttempt, setCustomMainOutputAttempt] = useState("did"); //What is the custom mainOutputAttempt in case defaultMainOutputAttempt is false
  const [manualAttemptCalc, setManualAttemptCalc] = useState(false); //whether the attempt is manually calculated or grabbed from precalculated leaderboard

  const {
    data: userInfo,
    userIsLoading: userIsLoading,
    userError: userError,
  } = useUserInfo();

  const {
    data: drillInfo,
    isLoading: drillIsLoading,
    error: drillError,
  } = useDrillInfo(drillId);

  const {
    data: preCalcLeaderboard,
    isLoading: leaderboardIsLoading,
    error: leaderboardError,
  } = useLeaderboard({ drillId });

  const invalidateKeys = [
    ["userInfo"],
    ["drillInfo", { drillId }],
    ["best_attempts", drillId],
  ];

  const preCalcLeaderboardExists =
    preCalcLeaderboard && Object.keys(preCalcLeaderboard).length > 0;

  useEffect(() => {
    setManualAttemptCalc(
      !drillIsLoading && // so that mainOutputAttempt is calculated
        !leaderboardIsLoading && //leaderboard must've finished loading
        (!preCalcLeaderboardExists || //and not exist
          preCalcLeaderboard[Object.keys(preCalcLeaderboard)[0]][
            mainOutputAttempt
          ] === undefined), //or exist but does not have the required field
    );
    console.log("WE ARE USING MANUAL ATTEMPT LEADERBOARD!", manualAttemptCalc);
  }, [drillIsLoading, leaderboardIsLoading, preCalcLeaderboard]);

  // console.log("enabled: ", manualAttempt);

  const {
    data: attempts,
    isLoading: attemptIsLoading,
    error: attemptError,
  } = useAttempts({
    drillId,
    enabled: manualAttemptCalc,
  });

  if (
    userIsLoading ||
    drillIsLoading ||
    attemptIsLoading ||
    leaderboardIsLoading
  ) {
    return <Loading />;
  }

  if (userError || drillError || attemptError || leaderboardError) {
    return (
      <ErrorComponent
        message={[userError, drillError, attemptError, leaderboardError]}
      />
    );
  }

  const mainOutputAttempt = defaultMainOutputAttempt
    ? drillInfo["mainOutputAttempt"]
    : customMainOutputAttempt;

  const leaderboardAttempts = preCalcLeaderboard || {};
  if (!preCalcLeaderboardExists && attempts) {
    //just in case...
    for (const id in attempts) {
      const entry = attempts[id];

      console.log("ENTRYID", entry.id);

      const lowerIsBetter =
        drillInfo["aggOutputs"][mainOutputAttempt]["lowerIsBetter"];
      // If this uid has not been seen before or the current score is higher, store it
      if (
        !leaderboardAttempts[entry.uid] ||
        (lowerIsBetter &&
          leaderboardAttempts[entry.uid][mainOutputAttempt]["value"] <
            entry[mainOutputAttempt]) ||
        (!lowerIsBetter &&
          leaderboardAttempts[entry.uid][mainOutputAttempt]["value"] >
            entry[mainOutputAttempt])
      ) {
        leaderboardAttempts[entry.uid] = {
          [mainOutputAttempt]: {
            value: entry[mainOutputAttempt],
            id: entry.id,
          },
        };
      }
    }

    updateLeaderboard({
      currentTeamId,
      drillId,
      value: leaderboardAttempts,
    });
  }

  // console.log("drillLeaderboardAttempts: ", leaderboardAttempts);

  const orderedLeaderboard = Object.keys(leaderboardAttempts).sort(
    //only sort the userId
    (a, b) =>
      leaderboardAttempts[a][mainOutputAttempt]["value"] -
      leaderboardAttempts[b][mainOutputAttempt]["value"],
    // console.log("test"),
    // console.log(leaderboardAttempts)
  );
  // console.log("\nordered")
  // console.log(orderedLeaderboard)

  if (orderedLeaderboard.length < 1) {
    return (
      <EmptyScreen
        invalidateKeys={invalidateKeys}
        text={"No attempts have been made yet."}
      />
    );
  }

  let title = {
    proxHoleAverage: "Closest to the Hole",
    sideLandingAverage: "Side Landing Average",
    sideLandingTotal: "Side Landing",
    carryDiffAverage: "Carry Difference Average",
    strokesGained: "Total Strokes Gained",
    strokesGainedAverage: "Average Strokes Gained",
  };

  return (
    <ScrollView
      refreshControl={<RefreshInvalidate invalidateKeys={invalidateKeys} />}
    >
      <Text style={{ fontSize: 18, alignSelf: "center", paddingTop: 15 }}>
        {title[drillInfo.mainOutputAttempt]}
      </Text>
      <List.Section style={{ marginLeft: 20 }}>
        {orderedLeaderboard.map((userId) => {
          const attempt = leaderboardAttempts[userId][mainOutputAttempt];
          return (
            <Link
              key={userId}
              href={{
                pathname: `${currentPath}/attempts/${attempt["id"]}`,
              }}
              asChild
            >
              <List.Item
                title={userInfo[userId] ? userInfo[userId]["name"] : "Unknown"}
                left={() => <Avatar.Text size={24} label="XD" />}
                right={() => (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text>{numTrunc(attempt["value"], true)} ft</Text>
                    <Icon source="chevron-right" />
                  </View>
                )}
              />
            </Link>
          );
        })}
      </List.Section>
    </ScrollView>
  );
}
