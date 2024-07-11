import { useLocalSearchParams, useNavigation } from "expo-router";
import { Appbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "~/Constants";
import BarChartScreen from "~/components/barChart";
import ErrorComponent from "~/components/errorComponent";
import Header from "~/components/header";
import Loading from "~/components/loading";
import { useAuthContext } from "~/context/Auth";
import { useAttempts } from "~/dbOperations/hooks/useAttempts";
import { useDrillInfo } from "~/dbOperations/hooks/useDrillInfo";

export default function Stat() {
  const navigation = useNavigation();
  const drillId = useLocalSearchParams()["id"];
  const { currentUserId: userId } = useAuthContext();

  const {
    data: drillInfo,
    isLoading: drillInfoIsLoading,
    error: drillInfoError,
  } = useDrillInfo({ drillId });

  const {
    data: drillAttempts,
    isLoading: drillAttemptsIsLoading,
    error: drillAttemptsError,
  } = useAttempts({ drillId, userId });

  const invalidateKeys = [
    ["drillInfo", { drillId }],
    ["attempts", { userId, drillId }],
  ];

  if (drillInfoIsLoading || drillAttemptsIsLoading) {
    return <Loading />;
  }

  if (drillInfoError || drillAttemptsError) {
    return <ErrorComponent errorList={[drillInfoError, drillAttemptsError]} />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["right", "top", "left"]}>
      <Header
        title={"Statistics"}
        preChildren={
          <Appbar.BackAction
            onPressIn={() => {
              navigation.goBack();
            }}
            color={themeColors.accent}
          />
        }
      />
      <BarChartScreen
        drillAttempts={drillAttempts}
        drillInfo={drillInfo}
        invalidateKeys={invalidateKeys}
      />
    </SafeAreaView>
  );
}
