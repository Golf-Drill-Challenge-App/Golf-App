import { Link, useLocalSearchParams } from "expo-router";
import { Image, View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function Description({ descData }) {
  const drillId = useLocalSearchParams()["id"];
  return (
    <View style={{ margin: 10 }}>
      <Text style={{ paddingBottom: 10 }} variant="headlineLarge">
        Description
      </Text>
      <Text variant="bodySmall">{descData.description}</Text>
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
    </View>
  );
}
