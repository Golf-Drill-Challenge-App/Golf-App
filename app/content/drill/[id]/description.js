import { Link, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";
import { Button } from "react-native-paper";

import { themeColors } from "~/Constants";
import DrillDescription from "~/components/drillDescription";
import ErrorComponent from "~/components/errorComponent";
import Loading from "~/components/loading";
import RefreshInvalidate from "~/components/refreshInvalidate";

import { useAuthContext } from "~/context/Auth";
import { useDrillInfo } from "~/hooks/useDrillInfo";
import { useUserInfo } from "~/hooks/useUserInfo";

export default function Description() {
  const drillId = useLocalSearchParams()["id"];
  const assignedTime = useLocalSearchParams()["assignedTime"];

  const { currentUserId } = useAuthContext();
  const {
    data: userInfo,
    error: userInfoError,
    isLoading: userIsLoading,
  } = useUserInfo({ userId: currentUserId });

  const {
    data: drillInfo,
    error: drillInfoError,
    isLoading: drillInfoIsLoading,
  } = useDrillInfo({ drillId });

  const invalidateKeys = [
    ["drillInfo", { drillId }],
    ["userInfo", { userId: currentUserId }],
  ];

  if (drillInfoIsLoading || userIsLoading) return <Loading />;

  if (drillInfoError || userInfoError)
    return <ErrorComponent errorList={[drillInfoError, userInfoError]} />;

  return (
    <>
      <ScrollView
        refreshControl={<RefreshInvalidate invalidateKeys={invalidateKeys} />}
        style={{ paddingTop: 10 }}
      >
        <DrillDescription drillInfo={drillInfo} />
      </ScrollView>
      <Link
        href={{
          pathname: `/segments/drill/${drillId}/${userInfo.role == "player" ? "submission" : "assignment"}`,
          params: { assignedTime: assignedTime },
        }}
        asChild
      >
        <Button
          style={{
            margin: 10,
            position: "absolute",
            bottom: 10,
            left: 0,
            right: 0,
          }}
          labelStyle={{
            fontSize: 20,
            fontWeight: "bold",
            padding: 5,
          }}
          mode="contained"
          buttonColor={themeColors.accent}
          textColor="white"
        >
          {userInfo.role == "player" ? "Start Drill" : "Assign Drill"}
        </Button>
      </Link>
    </>
  );
}
