import { PaperProvider, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

function ErrorComponent({ message }) {
  const displayMessage =
    message.constructor === Array ? message.join(", ") : message;
  return (
    <PaperProvider>
      <SafeAreaView>
        <Text>An error has occurred: {displayMessage}</Text>
      </SafeAreaView>
    </PaperProvider>
  );
}

export default ErrorComponent;
