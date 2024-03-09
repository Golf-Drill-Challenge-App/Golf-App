import { PaperProvider, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

//This is for the list of drills
export default function Index() {
  return (
    <PaperProvider>
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Plan Index</Text>
      </SafeAreaView>
    </PaperProvider>
  );
}
