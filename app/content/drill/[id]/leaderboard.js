import { Link, useLocalSearchParams, usePathname } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Avatar, Divider, Icon, List, Text } from "react-native-paper";
import { prettyTitle, themeColors } from "~/Constants";
import { formatDate, numTrunc } from "~/Utility";
import EmptyScreen from "~/components/emptyScreen";
import ErrorComponent from "~/components/errorComponent";
import Loading from "~/components/loading";
import RefreshInvalidate from "~/components/refreshInvalidate";
import { useAllTimeRecords } from "~/hooks/useAllTimeRecords";
import { useAttempts } from "~/hooks/useAttempts";
import { useDrillInfo } from "~/hooks/useDrillInfo";
import { useLeaderboard } from "~/hooks/useLeaderboard";
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
    userIsLoading: userIsLoading,
    userError: userError,
  } = useUserInfo();

  const {
    data: drillInfo,
    isLoading: drillIsLoading,
    error: drillError,
  } = useDrillInfo(drillId);

  const {
    data: allTimeInfo,
    allTimeRecordIsLoading: allTimeRecordIsLoading,
    allTimeRecordError: allTimeRecordError,
  } = useAllTimeRecords(drillId);

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

  const {
    data: attempts,
    isLoading: attemptIsLoading,
    error: attemptError,
  } = useAttempts({
    drillId,
  });

  if (
    userIsLoading ||
    drillIsLoading ||
    attemptIsLoading ||
    leaderboardIsLoading ||
    allTimeRecordIsLoading
  ) {
    return <Loading />;
  }

  if (
    userError ||
    drillError ||
    attemptError ||
    leaderboardError ||
    allTimeRecordError
  ) {
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

  // console.log("drillLeaderboardAttempts: ", leaderboardAttempts);
  const sortByLower = drillInfo["aggOutputs"][mainOutputAttempt][
    "lowerIsBetter"
  ]
    ? 1
    : -1;
  const orderedLeaderboard = Object.keys(leaderboardAttempts).sort(
    //only sort the userId
    (a, b) =>
      sortByLower *
      (leaderboardAttempts[a][mainOutputAttempt]["value"] -
        leaderboardAttempts[b][mainOutputAttempt]["value"]),
  );
  console.log("orderedLeaderboard", orderedLeaderboard);
  console.log("sortByLower", sortByLower);

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
    leaderboardAttempts,
    mainOutputAttempt,
  );

  console.log("All Time Record: ", allTimeInfo);

  return (
    <ScrollView
      refreshControl={<RefreshInvalidate invalidateKeys={invalidateKeys} />}
    >
      <Text style={{ fontSize: 18, alignSelf: "center", paddingTop: 15 }}>
        {prettyTitle[drillInfo.mainOutputAttempt]}
      </Text>
      <View
        style={{
          backgroundColor: themeColors.highlight,
          borderRadius: 8,
          padding: 16,
          margin: 5,
          width: 200,
          justifyContent: "center",
          alignSelf: "center",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 12,
            marginBottom: 8,
          }}
        >
          All Time Record
        </Text>
        <Icon source="trophy-variant-outline" size={40} />

        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 4,
          }}
        >
          {allTimeInfo.name}
        </Text>
        <Text style={{ fontSize: 16 }}>
          {numTrunc(allTimeInfo.value, true)} {allTimeInfo.distanceMeasure}
        </Text>
        <Text style={{ fontSize: 12 }}>{formatDate(allTimeInfo.time)}</Text>
      </View>
      <List.Section
        style={{
          backgroundColor: themeColors.highlight,
          margin: 5,
          borderRadius: 5,
        }}
      >
        {orderedLeaderboard.map((userId, idx) => {
          const attempt = leaderboardAttempts[userId][mainOutputAttempt];
          return (
            <View>
              <Link
                key={userId}
                href={{
                  pathname: `${currentPath}/attempts/${attempt["id"]}`,
                }}
                asChild
                style={{ paddingLeft: 20 }}
              >
                <List.Item
                  title={
                    userInfo[userId] ? userInfo[userId]["name"] : "Unknown"
                  }
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
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text>
                        {numTrunc(attempt["value"], true)}{" "}
                        {
                          drillInfo.aggOutputs[mainOutputAttempt]
                            .distanceMeasure
                        }
                      </Text>
                      <Icon source="chevron-right" />
                    </View>
                  )}
                />
              </Link>
              <Divider />
            </View>
          );
        })}
      </List.Section>
    </ScrollView>
  );
}
