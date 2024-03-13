import { PaperProvider, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
//This is for the list of drills
export default function Statistics() {
  /*React.useEffect(() => {
        navigation.getParent()?.setOptions({
            tabBarStyle: { display: 'none' },
        });
    })*/
  return (
    <PaperProvider>
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Statistics Screen!</Text>
      </SafeAreaView>
    </PaperProvider>
  );
}
