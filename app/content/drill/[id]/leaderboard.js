import { Link, useLocalSearchParams, usePathname } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Image } from "react-native-expo-image-cache";
import { Divider, Icon, List, Text } from "react-native-paper";
import { prettyTitle, themeColors } from "~/Constants";
import { formatDate, numTrunc } from "~/Utility";
import EmptyScreen from "~/components/emptyScreen";
import ErrorComponent from "~/components/errorComponent";
import Loading from "~/components/loading";
import RefreshInvalidate from "~/components/refreshInvalidate";
import { useAllTimeRecords } from "~/hooks/useAllTimeRecords";
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
    data: allTimeInfo,
    allTimeRecordIsLoading: allTimeRecordIsLoading,
    allTimeRecordError: allTimeRecordError,
  } = useAllTimeRecords(drillId);

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

  if (
    userIsLoading ||
    drillIsLoading ||
    attemptIsLoading ||
    leaderboardIsLoading ||
    allTimeRecordIsLoading
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
  if (
    userError ||
    drillError ||
    attemptError ||
    leaderboardError ||
    allTimeRecordError
  ) {
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
      <View
        style={{
          backgroundColor: themeColors.highlight,
          borderRadius: 8,
          padding: 16,
          margin: 5,
          width: "90%",
          justifyContent: "space-between",
          alignSelf: "center",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View style={{ width: "15%" }}>
          <Icon source="trophy-variant-outline" size={40} />
        </View>
        <View style={{ width: "60%" }}>
          <Text
            style={{
              fontSize: 12,
            }}
          >
            All Time Record
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            {allTimeInfo.name}
          </Text>
          <Text style={{ fontSize: 12 }}>{formatDate(allTimeInfo.time)}</Text>
        </View>

        <View style={{ width: "25%" }}>
          <Text style={{ fontSize: 16 }}>
            {numTrunc(allTimeInfo.value, true)} {allTimeInfo.distanceMeasure}
          </Text>
        </View>
      </View>

      <List.Section
        style={{
          backgroundColor: themeColors.highlight,
          margin: 5,
          borderRadius: 5,
        }}
      >
      <View
        style={{
          backgroundColor: themeColors.highlight,
          borderRadius: 8,
          padding: 16,
          margin: 5,
          width: "90%",
          justifyContent: "space-between",
          alignSelf: "center",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View style={{ width: "15%" }}>
          <Icon source="trophy-variant-outline" size={40} />
        </View>
        <View style={{ width: "60%" }}>
          <Text
            style={{
              fontSize: 12,
            }}
          >
            All Time Record
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            {allTimeInfo.name}
          </Text>
          <Text style={{ fontSize: 12 }}>{formatDate(allTimeInfo.time)}</Text>
        </View>

        <View style={{ width: "25%" }}>
          <Text style={{ fontSize: 16 }}>
            {numTrunc(allTimeInfo.value, true)} {allTimeInfo.distanceMeasure}
          </Text>
        </View>
      </View>

      <List.Section
        style={{
          backgroundColor: themeColors.highlight,
          margin: 5,
          borderRadius: 5,
        }}
      >
        {orderedLeaderboard.map((userId, idx) => {
          const attempt = leaderboard[userId][mainOutputAttempt];
          return (
            <View key={userId}>
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
                      <Image
                        style={{
                          height: 24,
                          width: 24,
                          borderRadius: 12,
                        }}
                        uri={userInfo[userId]["pfp"]}
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
