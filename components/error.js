import { PaperProvider, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

function Error({ message }) {
  return (
    <PaperProvider>
      <SafeAreaView>
        <Text>An error has occurred: {message}</Text>
      </SafeAreaView>
    </PaperProvider>
  );
}

export default Error;
