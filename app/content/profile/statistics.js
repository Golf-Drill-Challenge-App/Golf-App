import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import PaperWrapper from "~/components/paperWrapper";
//This is for the list of drills
export default function Statistics() {
  return (
    <PaperWrapper>
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Statistics Screen!</Text>
      </SafeAreaView>
    </PaperWrapper>
  );
}
