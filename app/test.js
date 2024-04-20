import { DefaultTheme, PaperProvider, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
//This is for the list of drills
export default function Test() {
  return (
    <PaperProvider theme={DefaultTheme}>
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Test Screen!</Text>
      </SafeAreaView>
    </PaperProvider>
  );
}
