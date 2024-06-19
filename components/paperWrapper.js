import { StatusBar } from "expo-status-bar";
import { DefaultTheme, PaperProvider } from "react-native-paper";

function PaperWrapper({ children }) {
  return (
    <PaperProvider theme={DefaultTheme}>
      <StatusBar style={"dark"} />
      {children}
    </PaperProvider>
  );
}

export default PaperWrapper;
