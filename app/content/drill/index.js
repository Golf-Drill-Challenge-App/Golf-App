import { SafeAreaView } from "react-native-safe-area-context";

import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import DrillList from "~/components/drillList";
import ErrorComponent from "~/components/errorComponent";
import Header from "~/components/header";
import Loading from "~/components/loading";
import PaperWrapper from "~/components/paperWrapper";
import { useDrillInfo } from "~/hooks/useDrillInfo";

export default function Index() {
  const { assignedTime, id: drillId, currentTime } = useLocalSearchParams();
  const invalidationKeys = [["drillInfo"]];
  const {
    data: drillInfo,
    error: drillInfoError,
    isLoading: drillInfoIsLoading,
  } = useDrillInfo();
  const [lastRedirect, setLastRedirect] = useState("0");

  if (drillInfoIsLoading) {
    return <Loading />;
  }

  if (drillInfoError) {
    return <ErrorComponent message={drillInfoError} />;
  }
  useEffect(() => {
    if (lastRedirect !== currentTime && assignedTime) {
      setLastRedirect(currentTime);
      router.push({
        pathname: `content/drill/${drillId}`,
        params: {
          id: `${drillId}`,
          assignedTime: assignedTime,
        },
      });
    }
  }, [currentTime]);

  return (
    <PaperWrapper>
      <SafeAreaView style={{ flex: 1 }} edges={["right", "top", "left"]}>
        <Header title={"Drills"} />

        <DrillList
          drillData={Object.values(drillInfo)}
          href={"content/drill/"}
          invalidateKeys={invalidationKeys}
        />
      </SafeAreaView>
    </PaperWrapper>
  );
}
