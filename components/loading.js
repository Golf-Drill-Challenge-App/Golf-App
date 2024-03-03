import { PaperProvider, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

function Loading() {
  return (
    <PaperProvider>
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    </PaperProvider>
  );
}

export default Loading;
