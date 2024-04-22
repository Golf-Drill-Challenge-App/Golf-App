import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import PaperWrapper from "./paperWrapper";

function ErrorComponent({ message }) {
  const displayMessage =
    message.constructor === Array ? message.join(", ") : message;
  return (
    <PaperWrapper>
      <SafeAreaView>
        <Text>An error has occurred: {displayMessage}</Text>
      </SafeAreaView>
    </PaperWrapper>
  );
}

export default ErrorComponent;
