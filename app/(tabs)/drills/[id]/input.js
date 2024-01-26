import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

import { Text } from "react-native-paper";

export default function Input() {
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text
        style={{
          marginHorizontal: 40,
          marginTop: 20,
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        Input Page for Drill ID: {id}
      </Text>
      <Link
        href={"drills/" + id}
        style={{
          marginHorizontal: 40,
          marginTop: 20,
          fontSize: 20,
          color: "#0000FF",
        }}
      >
        Go back to Drill {id} Main Page
      </Link>
    </SafeAreaView>
  );
}
