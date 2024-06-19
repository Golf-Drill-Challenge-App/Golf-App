import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import PaperWrapper from "./paperWrapper";

function ErrorComponent({ errorList }) {
  const displayMessage = errorList
    .map((error) => (error && error.message ? error.message : "Unknown error"))
    .join("\n");
  return (
    <PaperWrapper>
      <SafeAreaView>
        <Text>An error has occurred: {displayMessage}</Text>
      </SafeAreaView>
    </PaperWrapper>
  );
}

export default ErrorComponent;
