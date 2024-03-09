import { useLocalSearchParams } from "expo-router";

import BarChartScreen from "~/components/barChart";
import ErrorComponent from "~/components/errorComponent";
import Loading from "~/components/loading";
import { currentAuthContext } from "~/context/Auth";
import { useAttempts } from "~/hooks/useAttempts";
import { useDrillInfo } from "~/hooks/useDrillInfo";

export default function Stat() {
  const drillId = useLocalSearchParams()["id"];
  const { userId } = currentAuthContext().currentUser;

  const {
    data: drillInfo,
    isLoading: drillInfoIsLoading,
    drillInfoError,
  } = useDrillInfo(drillId);

  const {
    data: drillAttempts,
    isLoading: drillAttemptsIsLoading,
    error: drillAttemptsError,
  } = useAttempts({ drillId, userId });

  if (drillInfoIsLoading || drillAttemptsIsLoading) {
    return <Loading />;
  }

  if (drillInfoError || drillAttemptsError) {
    return <ErrorComponent message={[drillInfoError, drillAttemptsError]} />;
  }
  // console.log(drillAttempts);

  return <BarChartScreen drillData={drillAttempts} drillInfo={drillInfo} />;
}
