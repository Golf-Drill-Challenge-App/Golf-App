import { Link, useLocalSearchParams, usePathname } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Avatar, Icon, List, Text } from "react-native-paper";
import { prettyTitle } from "~/Constants";
import { numTrunc } from "~/Utility";
import EmptyScreen from "~/components/emptyScreen";
import ErrorComponent from "~/components/errorComponent";
import Loading from "~/components/loading";
import RefreshInvalidate from "~/components/refreshInvalidate";
import { useBestAttempts } from "~/hooks/useBestAttempts";
import { useDrillInfo } from "~/hooks/useDrillInfo";
import { useUserInfo } from "~/hooks/useUserInfo";

function getLeaderboardRanks(
  orderedLeaderboard,
  leaderboardAttempts,
  mainOutputAttempt,
) {
  let leaderboardRanks = [];
  let currentRank = 1;
  let prevAttemptValue = 0;

  for (let i = 0; i < orderedLeaderboard.length; i++) {
    const userId = orderedLeaderboard[i];

    const attemptValue = numTrunc(
      leaderboardAttempts[userId][mainOutputAttempt].value,
    );

    if (i !== 0 && attemptValue !== prevAttemptValue) {
      //if not first player and not a tie

      currentRank = i + 1;
    }
    leaderboardRanks.push(currentRank);

    prevAttemptValue = attemptValue;
  }

  return leaderboardRanks;
}

export default function Leaderboard() {
  const drillId = useLocalSearchParams()["id"];
  const currentPath = usePathname();
  const [defaultMainOutputAttempt, setDefaultMainOutputAttempt] =
    useState(true); //whether mainOutputAttempt is the default set on drills or has been changed by user
  const [customMainOutputAttempt, setCustomMainOutputAttempt] = useState("did"); //What is the custom mainOutputAttempt in case defaultMainOutputAttempt is false

  const {
    data: userInfo,
    isLoading: userIsLoading,
    error: userError,
  } = useUserInfo();

  const {
    data: drillInfo,
    isLoading: drillIsLoading,
    error: drillError,
  } = useDrillInfo({ drillId });

  const {
    data: leaderboard,
    isLoading: leaderboardIsLoading,
    error: leaderboardError,
  } = useBestAttempts({ drillId });

  const invalidateKeys = [
    ["userInfo"],
    ["drillInfo", { drillId }],
    ["best_attempts", { drillId }],
  ];

  if (userIsLoading || drillIsLoading || leaderboardIsLoading) {
    return <Loading />;
  }

  if (userError || drillError || leaderboardError) {
    return (
      <ErrorComponent errorList={[userError, drillError, leaderboardError]} />
    );
  }

  const mainOutputAttempt = defaultMainOutputAttempt
    ? drillInfo["mainOutputAttempt"]
    : customMainOutputAttempt;

  const sortByLower = drillInfo["aggOutputs"][mainOutputAttempt][
    "lowerIsBetter"
  ]
    ? 1
    : -1;
  const orderedLeaderboard = Object.keys(leaderboard)
    .filter((a) => leaderboard[a] !== null)
    .sort(
      //only sort the userId
      (a, b) =>
        sortByLower *
        (leaderboard[a][mainOutputAttempt]["value"] -
          leaderboard[b][mainOutputAttempt]["value"]),
    );

  if (orderedLeaderboard.length < 1) {
    return (
      <EmptyScreen
        invalidateKeys={invalidateKeys}
        text={"No attempts have been made yet."}
      />
    );
  }

  let leaderboardRanks = getLeaderboardRanks(
    orderedLeaderboard,
    leaderboard,
    mainOutputAttempt,
  );

  return (
    <ScrollView
      refreshControl={<RefreshInvalidate invalidateKeys={invalidateKeys} />}
    >
      <Text style={{ fontSize: 18, alignSelf: "center", paddingTop: 15 }}>
        {prettyTitle[drillInfo.mainOutputAttempt]}
      </Text>
      <List.Section>
        {orderedLeaderboard.map((userId, idx) => {
          const attempt = leaderboard[userId][mainOutputAttempt];
          return (
            <Link
              key={userId}
              href={{
                pathname: `${currentPath}/attempts/${attempt["id"]}`,
              }}
              asChild
              style={{ paddingLeft: 20 }}
            >
              <List.Item
                title={userInfo[userId] ? userInfo[userId]["name"] : "Unknown"}
                left={() => (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ width: 30 }}>
                      {leaderboardRanks[idx].toString()}.
                    </Text>
                    <Avatar.Image
                      size={24}
                      source={{ uri: userInfo[userId]["pfp"] }}
                    />
                  </View>
                )}
                right={() => (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text>
                      {numTrunc(attempt["value"], true)}{" "}
                      {drillInfo.aggOutputs[mainOutputAttempt].distanceMeasure}
                    </Text>
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
