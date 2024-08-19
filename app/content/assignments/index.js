import { LogBox } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AssignmentsList from "~/components/assignmentList";
import EmptyScreen from "~/components/emptyScreen";
import ErrorComponent from "~/components/errorComponent";
import Header from "~/components/header";
import Loading from "~/components/loading";
import { useAuthContext } from "~/context/Auth";
import { useDrillInfo } from "~/dbOperations/hooks/useDrillInfo";
import { useUserInfo } from "~/dbOperations/hooks/useUserInfo";

export default function Index() {
  const { currentUserId } = useAuthContext();

  const {
    data: drillInfo,
    error: drillInfoError,
    isLoading: drillInfoIsLoading,
  } = useDrillInfo();

  const {
    data: userInfo,
    error: userInfoError,
    isLoading: userIsLoading,
  } = useUserInfo({ userId: currentUserId });

  const {
    data: playerInfo,
    error: playerInfoError,
    isLoading: playerInfoIsLoading,
  } = useUserInfo({
    role: "player",
    enabled: !userIsLoading && userInfo && userInfo["role"] !== "player",
  });

  const invalidateKeys = [
    ["userInfo", { userId: currentUserId }],
    ["userInfo", { role: "player" }],
    ["drillInfo"],
  ];

  // Handle both errors of 'cannot read property "reduce" of undefined' and
  // 'data is undefined' / 'Query data cannot be undefined' (useUserInfo hook error)
  if (
    !currentUserId ||
    (userInfoError && String(userInfoError).includes("data is undefined"))
  ) {
    // The logs still show up on the console (which is probably good), just hidden from phone screen
    LogBox.ignoreLogs(["Query data cannot be undefined"]);
    return (
      <EmptyScreen
        invalidateKeys={invalidateKeys}
        text={"No drills assigned"}
      />
    );
  }

  if (userIsLoading || drillInfoIsLoading || playerInfoIsLoading) {
    return <Loading />;
  }

  if (userInfoError || drillInfoError || playerInfoError) {
    return (
      <ErrorComponent
        errorList={[userInfoError, drillInfoError, playerInfoError]}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["right", "top", "left"]}>
      <Header title="Assigned Drills" />
      <AssignmentsList
        role={userInfo["role"]}
        singleUser={userInfo["role"] === "player"}
        playerInfo={userInfo["role"] === "player" ? [userInfo] : playerInfo}
        invalidateKeys={invalidateKeys}
        drillInfo={drillInfo}
        disableCriteria={({ completed, hasStats }) => completed && !hasStats}
      />
    </SafeAreaView>
  );
}
