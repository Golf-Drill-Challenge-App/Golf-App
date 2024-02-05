import { DefaultTheme } from "react-native-paper";

const testTheme = {
  ...DefaultTheme,
  fonts: {
    ...DefaultTheme.fonts,
    interRegular: require("./assets/fonts/Inter-Regular.ttf"),
    interBold: require("./assets/fonts/Inter-Bold.ttf"),
    interSemiBold: require("./assets/fonts/Inter-SemiBold.ttf"),
    ibmPlexMonoRegular: require("./assets/fonts/IBMPlexMono-Regular.ttf"),
  },
};

export default testTheme;
