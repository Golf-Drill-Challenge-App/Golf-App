import { Link, useLocalSearchParams } from "expo-router";
import { Image, ScrollView } from "react-native";
import { Button, Text } from "react-native-paper";
import Loading from "~/components/loading";
import ErrorComponent from "../../../../components/errorComponent";
import { useDrillInfo } from "../../../../hooks/useDrillInfo";

export default function Description() {
  const drillId = useLocalSearchParams()["id"];

  const {
    data: drillInfo,
    error: drillInfoError,
    isLoading: drillInfoIsLoading,
  } = useDrillInfo(drillId);

  if (drillInfoIsLoading) return <Loading />;

  if (drillInfoError) return <ErrorComponent error={error.message} />;

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 10,
        flex: 1,
      }}
    >
      <Text style={{ paddingBottom: 10 }} variant="headlineLarge">
        Description
      </Text>
      <Text variant="bodySmall">{drillInfo["description"]}</Text>
      <Image
        source={require("~/assets/drill-description-image.jpg")}
        style={{ width: "100%", maxHeight: 200, marginTop: 50 }}
      />
      <Link
        href={{
          pathname: `/segments/drill/${drillId}/submission`,
        }}
        asChild
      >
        <Button
          style={{ margin: 10 }}
          mode="contained"
          buttonColor="#F24E1E"
          textColor="white"
        >
          Start Drill
        </Button>
      </Link>
    </ScrollView>
  );
}
