import { Link, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";
import { Button } from "react-native-paper";
import DrillDescription from "~/components/drillDescription";
import ErrorComponent from "~/components/errorComponent";
import Loading from "~/components/loading";
import RefreshInvalidate from "~/components/refreshInvalidate";

import { useDrillInfo } from "~/hooks/useDrillInfo";
import { themeColors } from "../../../../Constants";

export default function Description() {
  const drillId = useLocalSearchParams()["id"];
  const assignedTime = useLocalSearchParams()["assignedTime"];

  const {
    data: drillInfo,
    error: drillInfoError,
    isLoading: drillInfoIsLoading,
  } = useDrillInfo(drillId);

  if (drillInfoIsLoading) return <Loading />;

  if (drillInfoError) return <ErrorComponent error={error.message} />;

  const invalidateKeys = [["drillInfo", { drillId }]];

  return (
    <>
      <ScrollView
        refreshControl={<RefreshInvalidate invalidateKeys={invalidateKeys} />}
      >
        <DrillDescription drillData={drillInfo} />
      </ScrollView>
      <Link
        href={{
          pathname: `/segments/drill/${drillId}/submission`,
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
          mode="contained"
          buttonColor={themeColors.accent}
          textColor="white"
        >
          Start Drill
        </Button>
      </Link>
    </>
  );
}
