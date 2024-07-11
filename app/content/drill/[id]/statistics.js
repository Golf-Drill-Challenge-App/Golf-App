import { useLocalSearchParams } from "expo-router";
import BarChartScreen from "~/components/barChart";
import ErrorComponent from "~/components/errorComponent";
import Loading from "~/components/loading";
import { useAuthContext } from "~/context/Auth";
import { useAttempts } from "~/dbOperations/hooks/useAttempts";
import { useDrillInfo } from "~/dbOperations/hooks/useDrillInfo";

export default function Stat() {
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
    <BarChartScreen
      drillAttempts={drillAttempts}
      drillInfo={drillInfo}
      invalidateKeys={invalidateKeys}
    />
  );
}
