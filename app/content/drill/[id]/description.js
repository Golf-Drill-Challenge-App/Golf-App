import { Link, useLocalSearchParams } from "expo-router";
import { Button } from "react-native-paper";

import DrillDescription from "~/components/drillDescription";
import ErrorComponent from "~/components/errorComponent";
import Loading from "~/components/loading";
import { useDrillInfo } from "~/hooks/useDrillInfo";

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

  return (
    <>
      <DrillDescription drillData={drillInfo} />
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
          buttonColor="#F24E1E"
          textColor="white"
        >
          Start Drill
        </Button>
      </Link>
    </>
  );
}
