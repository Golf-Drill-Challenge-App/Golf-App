import { useQuery } from "@tanstack/react-query";
import { Link, useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { Image, ScrollView } from "react-native";
import { Button, Text } from "react-native-paper";
import db from "~/firebaseConfig";
import Error from "../../../../components/error";
import Loading from "../../../../components/loading";

export default function Description() {
  const drillId = useLocalSearchParams()["id"];

  const { isPending, error, data } = useQuery({
    queryKey: ["drillInfo", drillId],
    queryFn: ({ queryKey }) => {
      const [_key, id] = queryKey;
      return getDoc(doc(db, "teams", "1", "drills", id));
    },
  });

  if (isPending) return <Loading />;

  if (error) return <Error error={error.message} />;

  const drillData = data?.data();

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
      <Text variant="bodySmall">{drillData.description}</Text>
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
