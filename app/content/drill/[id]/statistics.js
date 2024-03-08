import { useLocalSearchParams } from "expo-router";

import { useContext } from "react";
import BarChartScreen from "~/components/barChart";
import ErrorComponent from "~/components/errorComponent";
import Loading from "~/components/loading";
import { CurrentUserContext } from "~/contexts/CurrentUserContext";
import { useAttempts } from "~/hooks/useAttempts";
import { useDrillInfo } from "~/hooks/useDrillInfo";

export default function Stat() {
  const drillId = useLocalSearchParams()["id"];
  const userId = useContext(CurrentUserContext)["currentUser"];

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
