import { useQueryClient } from "@tanstack/react-query";
import { Link, useLocalSearchParams, usePathname } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { Avatar, Icon, List, Text } from "react-native-paper";
import { numTrunc } from "~/Utility";
import ErrorComponent from "~/components/errorComponent";
import Loading from "~/components/loading";
import { currentAuthContext } from "~/context/Auth";
import { updateLeaderboard } from "~/hooks/updateLeaderboard";
import { useAttempts } from "~/hooks/useAttempts";
import { useDrillInfo } from "~/hooks/useDrillInfo";
import { useLeaderboard } from "~/hooks/useLeaderboard";
import { useUserInfo } from "~/hooks/useUserInfo";

function RefreshInvalidate(currentTeamId, drillId) {
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    const refresh = async () => {
      await queryClient.invalidateQueries({
        // used predicate as it seemed to be the best method to invalidate multiple query keys
        predicate: (query) =>
          query.queryKey[0] === "user" ||
          (query.queryKey[0] === "drillInfo" &&
            query.queryKey[1] === drillId) ||
          (query.queryKey[0] === "best_attempts" &&
            query.queryKey[1] === currentTeamId &&
            query.queryKey[2].drillId === drillId) ||
          (query.queryKey[0] === "attempts" &&
            query.queryKey[1] === currentTeamId &&
            query.queryKey[2].drillId === drillId),
      });
      setRefreshing(false);
    };
    refresh();
  }, [queryClient, currentTeamId, drillId]);
  return <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />;
}

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
  );

  if (orderedLeaderboard.length < 1) {
    return <Text>No attempts have been made yet.</Text>;
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshInvalidate currentTeamId={currentTeamId} drillId={drillId} />
      }
    >
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
