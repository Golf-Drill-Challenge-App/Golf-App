import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import PaperWrapper from "./paperWrapper";

function ErrorComponent({ errorList }) {
  const displayMessage = errorList.map((error) => {
    var errorMessage = "No error message found.";
    if (error && error.message) {
      errorMessage = error.message;
    }
    return errorMessage;
  });

  return (
    <PaperWrapper>
      <SafeAreaView>
        <Text>An error has occurred: {displayMessage}</Text>
      </SafeAreaView>
    </PaperWrapper>
  );
}

export default ErrorComponent;
