import { Link, useLocalSearchParams, usePathname } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Avatar, Icon, List, Text } from "react-native-paper";
import { numTrunc } from "~/Utility";
import Error from "../../../../components/error";
import Loading from "../../../../components/loading";
import { useAttempts } from "../../../../hooks/useAttempts";
import { useDrillInfo } from "../../../../hooks/useDrillInfo";
import { useUsers } from "../../../../hooks/useUsers";

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
  } = useUsers();

  const {
    data: drillInfo,
    isLoading: drillIsLoading,
    error: drillError,
  } = useDrillInfo(drillId);

  const {
    data: attempts,
    isLoading: attemptIsLoading,
    error: attemptError,
  } = useAttempts(drillId);

  console.log("userInfo: ", userInfo);
  console.log("drillInfo: ", drillInfo);
  console.log("attempts: ", attempts);

  if (userIsLoading || drillIsLoading || attemptIsLoading) {
    return <Loading />;
  }

  if (userError || drillError || attemptError) {
    let errorMessage = ", ".join([userError, drillError, attemptError]);
    return <Error message={errorMessage} />;
  }

  const mainOutputAttempt = defaultMainOutputAttempt
    ? drillInfo["mainOutputAttempt"]
    : customMainOutputAttempt;

  const drillLeaderboardAttempts = {};
  for (const id in attempts) {
    const entry = attempts[id];
    // If this uid has not been seen before or the current score is higher, store it
    if (
      !drillLeaderboardAttempts[entry.uid] ||
      drillLeaderboardAttempts[entry.uid][mainOutputAttempt] <
        entry[mainOutputAttempt]
    ) {
      drillLeaderboardAttempts[entry.uid] = { ...entry, id: id };
    }
  }

  const orderedLeaderboard = Object.values(drillLeaderboardAttempts).sort(
    (a, b) => a[mainOutputAttempt] - b[mainOutputAttempt],
  );

  return (
    <ScrollView>
      <List.Section style={{ marginLeft: 20 }}>
        {orderedLeaderboard.map((attempt) => (
          <Link
            key={attempt["uid"]}
            href={{
              pathname: `${currentPath}/attempts/${attempt["id"]}`,
            }}
            asChild
          >
            <List.Item
              title={userInfo[attempt["uid"]]["name"]}
              left={() => <Avatar.Text size={24} label="XD" />}
              right={() => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text>{numTrunc(attempt[mainOutputAttempt])} ft</Text>
                  <Icon source="chevron-right" />
                </View>
              )}
            />
          </Link>
        ))}
      </List.Section>
    </ScrollView>
  );
}
