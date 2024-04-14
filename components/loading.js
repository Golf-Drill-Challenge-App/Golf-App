import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { themeColors } from "../Constants";

const Loading = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator
        animating={true}
        size="large"
        color={themeColors.accent}
      />
    </View>
  );
};

export default Loading;
